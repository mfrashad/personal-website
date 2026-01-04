import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    emoji?: string;
}

const emojis = ['✨', '🌟', '💫', '⭐', '🎯', '🚀', '💡', '🎨', '🔥', '💎', '🌈', '🎪'];

export default function FloatingParticles() {
    const particles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        emoji: Math.random() > 0.7 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        fontSize: particle.emoji ? `${particle.size}px` : undefined,
                    }}
                    animate={{
                        y: [0, -30, 0, 30, 0],
                        x: [0, 15, -15, 10, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1, 0.9, 1],
                        opacity: [0.3, 0.6, 0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {particle.emoji ? (
                        particle.emoji
                    ) : (
                        <div
                            className="rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-sm"
                            style={{
                                width: particle.size,
                                height: particle.size,
                            }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
