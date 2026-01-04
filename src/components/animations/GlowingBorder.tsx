import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface GlowingBorderProps {
    children: React.ReactNode;
    className?: string;
    borderRadius?: number;
    glowColor?: string;
    borderWidth?: number;
}

export default function GlowingBorder({
    children,
    className = '',
    borderRadius = 16,
    glowColor = 'rgba(139, 92, 246, 0.5)',
    borderWidth = 2
}: GlowingBorderProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const glowX = useSpring(mouseX, springConfig);
    const glowY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ borderRadius }}
        >
            {/* Animated gradient border */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    padding: borderWidth,
                    background: isHovered
                        ? `radial-gradient(200px circle at ${glowX.get()}px ${glowY.get()}px, ${glowColor}, transparent 70%)`
                        : 'transparent',
                }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                }}
            />

            {/* Glow effect */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 pointer-events-none blur-xl -z-10"
                    style={{
                        borderRadius,
                        background: `radial-gradient(300px circle at ${glowX.get()}px ${glowY.get()}px, ${glowColor}, transparent 60%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
