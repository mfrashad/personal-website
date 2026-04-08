import { useMemo, useState, useEffect, useRef } from 'react';
import { marineAnimals, sizeConfig, type MarineAnimal, type SizeCategory } from '@data/diving';

const sizeOrder: SizeCategory[] = ['mini', 'small', 'mid', 'big', 'giant'];

function AnimalCard({ animal }: { animal: MarineAnimal }) {
  const { px } = sizeConfig[animal.size];
  const rotation = ((animal.name.charCodeAt(0) + animal.name.charCodeAt(1)) % 9) - 4;

  return (
    <div
      className="flex flex-col items-center group"
      style={{ width: px + 24 }}
    >
      <div
        className="transition-transform duration-200 group-hover:scale-110"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <img
          src={`/dive-animals/diveanimals_${animal.slug}.png`}
          alt={animal.name}
          width={px}
          height={px}
          style={{ imageRendering: 'pixelated' }}
          className="drop-shadow-[0_2px_8px_rgba(0,180,255,0.3)]"
          loading="lazy"
        />
      </div>
      <span
        className="mt-1 text-center font-mono leading-tight text-white/70"
        style={{ fontSize: Math.max(9, Math.min(12, px / 7)) }}
      >
        {animal.name}
      </span>
    </div>
  );
}

interface Waypoint {
  x: number;
  y: number;
}

const IDLE_TIMEOUT = 10_000; // 10s before wandering

function ScubaDiver({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState<Waypoint>({ x: 50, y: 50 });
  const [facingRight, setFacingRight] = useState(true);
  const animRef = useRef<number>(0);
  const posRef = useRef({ x: 50, y: 50 });
  const targetRef = useRef<Waypoint>({ x: 200, y: 100 });
  const mouseRef = useRef<Waypoint | null>(null);
  const lastMouseMove = useRef<number>(Date.now());
  const isWandering = useRef(false);

  const pickNewTarget = () => {
    const el = containerRef.current;
    if (!el) return { x: 200, y: 100 };
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    return {
      x: 40 + Math.random() * (w - 120),
      y: 40 + Math.random() * (h - 120),
    };
  };

  // Track mouse position relative to container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left - 32, // offset to center on diver
        y: e.clientY - rect.top - 32,
      };
      lastMouseMove.current = Date.now();
      isWandering.current = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
      lastMouseMove.current = Date.now();
      isWandering.current = false;
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const speed = 1.2;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      const cur = posRef.current;
      const timeSinceMove = Date.now() - lastMouseMove.current;

      // Decide target: follow mouse or wander
      let tgt: Waypoint;
      if (mouseRef.current && timeSinceMove < IDLE_TIMEOUT) {
        // Follow mouse with a lag (target is mouse position)
        tgt = mouseRef.current;
        isWandering.current = false;
      } else {
        // Idle mode — wander
        if (!isWandering.current) {
          isWandering.current = true;
          targetRef.current = pickNewTarget();
        }
        tgt = targetRef.current;
      }

      const dx = tgt.x - cur.x;
      const dy = tgt.y - cur.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isWandering.current && dist < 5) {
        targetRef.current = pickNewTarget();
      } else if (dist > 1) {
        // Lag factor: slower when following mouse (feels like swimming through water)
        const lagSpeed = isWandering.current ? speed * 0.5 : speed;
        const step = lagSpeed * (delta / 16);
        const moveStep = Math.min(step, dist); // don't overshoot
        const nx = cur.x + (dx / dist) * moveStep;
        const ny = cur.y + (dy / dist) * moveStep;
        posRef.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });

        if (Math.abs(dx) > 2) {
          setFacingRight(dx > 0);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="pointer-events-none absolute z-10 transition-none"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `scaleX(${facingRight ? 1 : -1})`,
      }}
    >
      <img
        src="/dive-animals/scuba-diver.png"
        alt="Scuba diver"
        width={64}
        height={64}
        style={{ imageRendering: 'pixelated' }}
        className="drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
      />
    </div>
  );
}

export default function MarineLifeCollection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    return sizeOrder.map((size) => ({
      size,
      config: sizeConfig[size],
      animals: marineAnimals.filter((a) => a.size === size),
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(180deg, #0c1445 0%, #1a2980 40%, #0f3460 100%)',
      }}
    >
      {/* Animated scuba diver */}
      <ScubaDiver containerRef={containerRef} />

      {/* Bubbles decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: 4 + (i % 5) * 6,
              height: 4 + (i % 5) * 6,
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 23 + 10) % 90}%`,
            }}
          />
        ))}
      </div>

      <div className="relative px-4 py-8 sm:px-8 sm:py-12">
        <h3 className="mb-2 text-center text-2xl font-bold text-white sm:text-3xl">
          Marine Life Collection
        </h3>
        <p className="mb-8 text-center font-mono text-sm text-white/50">
          {marineAnimals.length} species I've seen in my dives
        </p>

        {grouped.map(({ size, config, animals }) =>
          animals.length > 0 ? (
            <div key={size} className="mb-6">
              <div className="mb-3 flex items-center gap-2 px-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                  {config.label}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
                {animals.map((animal) => (
                  <AnimalCard key={animal.slug} animal={animal} />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
