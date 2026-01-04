import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
    x: number;
    y: number;
    id: number;
}

export default function MouseTrail() {
    const [trail, setTrail] = useState<TrailPoint[]>([]);
    const [isActive, setIsActive] = useState(false);
    const idRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isActive) return;

            const newPoint: TrailPoint = {
                x: e.clientX,
                y: e.clientY,
                id: idRef.current++
            };

            setTrail(prev => [...prev.slice(-15), newPoint]);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle trail with 'T' key
            if (e.key.toLowerCase() === 't' && e.ctrlKey) {
                setIsActive(prev => !prev);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isActive]);

    // Cleanup old trail points
    useEffect(() => {
        if (trail.length === 0) return;

        const timeout = setTimeout(() => {
            setTrail(prev => prev.slice(1));
        }, 100);

        return () => clearTimeout(timeout);
    }, [trail]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
            <AnimatePresence>
                {trail.map((point, index) => {
                    const size = 8 + (index / trail.length) * 20;
                    const opacity = 0.2 + (index / trail.length) * 0.6;

                    return (
                        <motion.div
                            key={point.id}
                            className="absolute rounded-full"
                            style={{
                                left: point.x - size / 2,
                                top: point.y - size / 2,
                                width: size,
                                height: size,
                                background: `linear-gradient(135deg,
                                    hsl(${(index * 20) % 360}, 80%, 60%),
                                    hsl(${(index * 20 + 60) % 360}, 80%, 60%)
                                )`,
                                opacity
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

// Sparkle trail that creates stars
export function SparkleTrail() {
    const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number; emoji: string }[]>([]);
    const [isActive, setIsActive] = useState(true);
    const idRef = useRef(0);
    const lastPos = useRef({ x: 0, y: 0 });

    const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '✧', '★'];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isActive) return;

            // Only create sparkle if moved enough
            const distance = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
            if (distance < 30) return;

            lastPos.current = { x: e.clientX, y: e.clientY };

            const newSparkle = {
                x: e.clientX + (Math.random() - 0.5) * 30,
                y: e.clientY + (Math.random() - 0.5) * 30,
                id: idRef.current++,
                emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)]
            };

            setSparkles(prev => [...prev.slice(-10), newSparkle]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isActive]);

    // Cleanup old sparkles
    useEffect(() => {
        if (sparkles.length === 0) return;

        const timeout = setTimeout(() => {
            setSparkles(prev => prev.slice(1));
        }, 500);

        return () => clearTimeout(timeout);
    }, [sparkles]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9997]">
            <AnimatePresence>
                {sparkles.map((sparkle) => (
                    <motion.div
                        key={sparkle.id}
                        className="absolute text-2xl"
                        style={{
                            left: sparkle.x,
                            top: sparkle.y,
                        }}
                        initial={{ scale: 0, opacity: 0, rotate: 0 }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180],
                            y: [0, -30]
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        {sparkle.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
