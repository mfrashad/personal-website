import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingEmojiProps {
    emoji: string;
    className?: string;
    size?: string;
    duration?: number;
}

export default function FloatingEmoji({
    emoji,
    className = '',
    size = 'text-4xl',
    duration = 3
}: FloatingEmojiProps) {
    const [randomOffset] = useState(() => ({
        x: Math.random() * 20 - 10,
        rotate: Math.random() * 30 - 15,
    }));

    return (
        <motion.span
            className={`inline-block ${size} ${className}`}
            animate={{
                y: [0, -15, 0],
                x: [0, randomOffset.x, 0],
                rotate: [0, randomOffset.rotate, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {emoji}
        </motion.span>
    );
}

// Hover-triggered floating emoji burst
interface EmojiBurstProps {
    children: React.ReactNode;
    emojis?: string[];
    className?: string;
}

export function EmojiBurst({
    children,
    emojis = ['🎉', '✨', '🌟', '💫', '⭐'],
    className = ''
}: EmojiBurstProps) {
    const [bursts, setBursts] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);

    const handleHover = () => {
        const newBursts = emojis.map((emoji, i) => ({
            id: Date.now() + i,
            emoji,
            x: Math.random() * 100 - 50,
            y: Math.random() * -80 - 20,
        }));
        setBursts(newBursts);
        setTimeout(() => setBursts([]), 1000);
    };

    return (
        <div className={`relative inline-block ${className}`} onMouseEnter={handleHover}>
            {bursts.map(burst => (
                <motion.span
                    key={burst.id}
                    className="absolute left-1/2 top-0 text-xl pointer-events-none"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                        x: burst.x,
                        y: burst.y,
                        opacity: 0,
                        scale: 1.5,
                        rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {burst.emoji}
                </motion.span>
            ))}
            {children}
        </div>
    );
}
