import { useState } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@utils/soundManager';

interface HoverCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function HoverCard({ children, className = '' }: HoverCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative ${className}`}
            onHoverStart={() => {
                setIsHovered(true);
                soundManager.play('hover');
            }}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{
                scale: 1.02,
                y: -5
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {/* Gradient shadow that appears on hover */}
            <motion.div
                className="absolute inset-0 rounded-xl -z-10"
                style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                    filter: 'blur(20px)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.1 : 0.8
                }}
                transition={{ duration: 0.3 }}
            />
            {children}
        </motion.div>
    );
}
