import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { marineAnimals, sizeConfig, type MarineAnimal, type SizeCategory } from '@data/diving';

const sizeOrder: SizeCategory[] = ['mini', 'small', 'mid', 'big', 'giant'];

function AnimalCard({ animal, onClick }: { animal: MarineAnimal; onClick: () => void }) {
  const { px } = sizeConfig[animal.size];
  const rotation = ((animal.name.charCodeAt(0) + animal.name.charCodeAt(1)) % 9) - 4;

  return (
    <div
      className="flex flex-col items-center group cursor-pointer"
      style={{ width: px + 24 }}
      onClick={onClick}
    >
      <div
        className="transition-all duration-200 group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-[0_0_12px_rgba(100,200,255,0.6)]"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <img
          src={`/dive-animals/diveanimals_${animal.slug}.png`}
          alt={animal.name}
          width={px}
          height={px}
          style={{ imageRendering: 'pixelated' }}
          className="drop-shadow-[0_2px_8px_rgba(0,180,255,0.3)] transition-all duration-200 group-hover:drop-shadow-[0_0_16px_rgba(100,200,255,0.5)]"
          loading="lazy"
        />
      </div>
      <span
        className="mt-1 text-center font-mono leading-tight text-white/70 transition-colors duration-200 group-hover:text-white"
        style={{ fontSize: Math.max(9, Math.min(12, px / 7)) }}
      >
        {animal.name}
      </span>
    </div>
  );
}

function AnimalModal({ animal, onClose }: { animal: MarineAnimal; onClose: () => void }) {
  const { px } = sizeConfig[animal.size];
  const displaySize = Math.min(Math.max(px * 2, 120), 220);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl shadow-2xl"
        style={{ background: '#0b1130' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          {/* Left column: Image, name, badge */}
          <div className="flex flex-col items-center justify-center border-b border-white-50 bg-white-50 p-8 sm:border-b-0 sm:border-r">
            <div className="drop-shadow-[0_0_24px_rgba(100,200,255,0.3)]">
              <img
                src={`/dive-animals/diveanimals_${animal.slug}.png`}
                alt={animal.name}
                width={Math.min(displaySize, 180)}
                height={Math.min(displaySize, 180)}
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            <h3 className="mt-5 text-center text-2xl font-bold text-white">
              {animal.name}
            </h3>
            {animal.scientificName && (
              <p className="mt-1 text-center font-mono text-xs italic text-white-500">
                {animal.scientificName}
              </p>
            )}

            <span className="mt-3 rounded-full bg-white-100 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white-500">
              {animal.size}
            </span>
          </div>

          {/* Right column: Description, fun fact, note */}
          <div className="flex flex-col gap-5 p-8">
            {animal.description && (
              <p className="text-sm leading-[1.8] text-white-900">
                {animal.description}
              </p>
            )}

            {animal.funFact && (
              <div>
                <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>
                  Fun Fact
                </p>
                <p className="text-sm leading-[1.8] text-white-800">
                  {animal.funFact}
                </p>
              </div>
            )}

            {animal.note && (
              <div>
                <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#22d3ee' }}>
                  My Encounter
                </p>
                <p className="text-sm leading-[1.8] text-white-800">
                  {animal.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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
        x: e.clientX - rect.left - 32,
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

      let tgt: Waypoint;
      if (mouseRef.current && timeSinceMove < IDLE_TIMEOUT) {
        tgt = mouseRef.current;
        isWandering.current = false;
      } else {
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
        const lagSpeed = isWandering.current ? speed * 0.5 : speed;
        const step = lagSpeed * (delta / 16);
        const moveStep = Math.min(step, dist);
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
  const [selectedAnimal, setSelectedAnimal] = useState<MarineAnimal | null>(null);

  const grouped = useMemo(() => {
    return sizeOrder.map((size) => ({
      size,
      config: sizeConfig[size],
      animals: marineAnimals.filter((a) => a.size === size),
    }));
  }, []);

  const closeModal = useCallback(() => setSelectedAnimal(null), []);

  return (
    <>
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
          <p className="mb-1 text-center font-mono text-sm text-white/50">
            {marineAnimals.length} species I've seen in my dives
          </p>
          <p className="mb-8 text-center font-mono text-[11px] text-white/30">
            Click on a species to learn more
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
                    <AnimalCard
                      key={animal.slug}
                      animal={animal}
                      onClick={() => setSelectedAnimal(animal)}
                    />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Encyclopedia Modal */}
      {selectedAnimal && (
        <AnimalModal animal={selectedAnimal} onClose={closeModal} />
      )}
    </>
  );
}
