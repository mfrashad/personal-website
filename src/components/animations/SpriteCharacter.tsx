import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { SpriteConfig } from '../../data/sprites';

function playPokeSfx() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
    osc.onended = () => ctx.close();
  } catch {}
}

const THREAT_MESSAGES = [
  "You'll regret that.",
  "Last warning.",
  "Don't test me.",
  "I know where you scroll.",
  "Try me one more time.",
];

interface SpriteCharacterProps {
  config: SpriteConfig;
  scale?: number;
  flipX?: boolean;
  zIndex?: number;
  className?: string;
  interval?: number;
  /** Enable the annoy-to-stack easter egg: 3 clicks → threat, next click → toggle spread */
  canToggleSpread?: boolean;
}

export default function SpriteCharacter({
  config,
  scale = 1,
  flipX = false,
  zIndex = 50,
  className = '',
  interval = 3000,
  canToggleSpread = false,
}: SpriteCharacterProps) {
  const uid = useId().replace(/:/g, '');
  const cls = `sprite-${config.id}-${uid}`;
  const [playing, setPlaying] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [squished, setSquished] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgIndexRef = useRef(0);

  const displayWidth = config.frameWidth * scale;
  const displayHeight = config.frameHeight * scale;
  const sheetWidth = config.frameWidth * config.frameCount * scale;
  const totalDuration = config.frameDurationMs * config.frameCount;
  const endX = -(config.frameWidth * config.frameCount) * scale;

  const playOnce = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    timeoutRef.current = setTimeout(() => {
      setPlaying(false);
    }, totalDuration);
  }, [playing, totalDuration]);

  // Easter egg state: track rapid clicks for the spread toggle
  const clickCountRef = useRef(0);
  const clickResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const threatShownRef = useRef(false);
  const spreadStateRef = useRef(true); // tracks current spread state

  const triggerSquish = useCallback(() => {
    setSquished(true);
    setTimeout(() => setSquished(false), 300);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);

  const showBubble = useCallback(() => {
    playOnce();
    triggerSquish();
    playPokeSfx();

    if (canToggleSpread) {
      // Reset click count if user pauses too long
      if (clickResetRef.current) clearTimeout(clickResetRef.current);
      clickResetRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        threatShownRef.current = false;
      }, 3000);

      clickCountRef.current++;

      // After 3 clicks: show threat
      if (clickCountRef.current >= 3 && !threatShownRef.current) {
        threatShownRef.current = true;
        const threat = THREAT_MESSAGES[Math.floor(Math.random() * THREAT_MESSAGES.length)];
        setBubble(threat);
        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
        bubbleTimeoutRef.current = setTimeout(() => setBubble(null), 1500);
        return;
      }

      // Click after threat: toggle spread
      if (threatShownRef.current && clickCountRef.current > 3) {
        spreadStateRef.current = !spreadStateRef.current;
        window.dispatchEvent(new CustomEvent('toggle-spread', { detail: { spread: spreadStateRef.current } }));
        const msg = spreadStateRef.current ? 'Fine, have it back.' : "That's it!";
        setBubble(msg);
        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
        bubbleTimeoutRef.current = setTimeout(() => setBubble(null), 1500);
        // Reset for next cycle
        clickCountRef.current = 0;
        threatShownRef.current = false;
        return;
      }
    }

    const messages = config.messages;
    const msg = messages[msgIndexRef.current % messages.length];
    msgIndexRef.current++;
    setBubble(msg);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => setBubble(null), 1500);
  }, [playOnce, canToggleSpread, triggerSquish]);

  // Auto-play on interval
  useEffect(() => {
    const id = setInterval(playOnce, interval);
    return () => clearInterval(id);
  }, [playOnce, interval]);

  // Play once on mount
  useEffect(() => {
    playOnce();
  }, []);

  // Listen for hover messages from decorations/polaroids
  useEffect(() => {
    if (!canToggleSpread) return;
    const handler = (e: CustomEvent) => {
      const msg = e.detail?.message;
      if (msg) {
        playOnce();
        setBubble(msg);
        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      } else {
        bubbleTimeoutRef.current = setTimeout(() => setBubble(null), 500);
      }
    };
    window.addEventListener('sprite-speak', handler as EventListener);
    return () => window.removeEventListener('sprite-speak', handler as EventListener);
  }, [playOnce]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      if (clickResetRef.current) clearTimeout(clickResetRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes ${cls}-play {
          from { background-position-x: 0; }
          to { background-position-x: ${endX}px; }
        }
        .${cls} {
          width: ${displayWidth}px;
          height: ${displayHeight}px;
          background-image: url('${config.src}');
          background-size: ${sheetWidth}px ${displayHeight}px;
          background-repeat: no-repeat;
          background-position-x: 0;
          image-rendering: pixelated;
        }
        .${cls}.is-playing {
          animation: ${cls}-play ${totalDuration}ms steps(${config.frameCount}) forwards;
        }
        @keyframes ${cls}-squish {
          0% { transform: scale(1, 1)${flipX ? ' scaleX(-1)' : ''}; }
          30% { transform: scale(1.06, 0.94)${flipX ? ' scaleX(-1)' : ''}; }
          60% { transform: scale(0.97, 1.03)${flipX ? ' scaleX(-1)' : ''}; }
          100% { transform: scale(1, 1)${flipX ? ' scaleX(-1)' : ''}; }
        }
        .${cls}.is-squished {
          animation: ${cls}-squish 300ms ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .${cls}.is-playing {
            animation: none;
            background-position-x: 0;
          }
          .${cls}.is-squished {
            animation: none;
          }
        }
      `}</style>
      <motion.div
        className={`${className} cursor-grab active:cursor-grabbing select-none`}
        style={{ zIndex, position: 'relative', display: 'block', lineHeight: 0 }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onHoverStart={playOnce}
        onTap={showBubble}
        role="img"
        aria-label={config.label}
      >
        <AnimatePresence>
          {bubble && (
            <motion.div
              key={bubble + msgIndexRef.current}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: displayHeight + 4,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
              className="text-2xs font-medium text-content-body bg-surface-secondary border border-border-subtle rounded-md px-2 py-1 shadow-sm"
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={`${cls} ${playing ? 'is-playing' : ''} ${squished ? 'is-squished' : ''}`}
          style={{ transform: flipX ? 'scaleX(-1)' : undefined, transformOrigin: 'bottom center' }}
        />
      </motion.div>
    </>
  );
}
