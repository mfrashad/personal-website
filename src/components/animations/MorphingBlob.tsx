import { motion } from 'framer-motion';

interface MorphingBlobProps {
    className?: string;
    color1?: string;
    color2?: string;
    size?: number;
}

export default function MorphingBlob({
    className = '',
    color1 = '#8B5CF6',
    color2 = '#EC4899',
    size = 400
}: MorphingBlobProps) {
    return (
        <motion.div
            className={`absolute pointer-events-none ${className}`}
            style={{
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${color1}, ${color2})`,
                filter: 'blur(60px)',
                opacity: 0.4,
            }}
            animate={{
                borderRadius: [
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                    '30% 60% 70% 40% / 50% 60% 30% 60%',
                    '40% 60% 60% 40% / 60% 30% 60% 40%',
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                ],
                x: [0, 50, -30, 0],
                y: [0, -30, 50, 0],
                scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
}

// Hero background with multiple blobs
export function HeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <MorphingBlob
                className="top-0 left-1/4"
                color1="#8B5CF6"
                color2="#3B82F6"
                size={500}
            />
            <MorphingBlob
                className="bottom-0 right-1/4"
                color1="#EC4899"
                color2="#F59E0B"
                size={400}
            />
            <MorphingBlob
                className="top-1/2 left-0 -translate-y-1/2"
                color1="#10B981"
                color2="#06B6D4"
                size={300}
            />
        </div>
    );
}
