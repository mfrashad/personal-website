import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { soundManager } from '@utils/soundManager';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
    strength?: number;
}

export default function MagneticButton({
    children,
    className = '',
    onClick,
    href,
    strength = 0.5
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        x.set(deltaX);
        y.set(deltaY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        soundManager.play('hover');
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleClick = () => {
        soundManager.play('click');
        onClick?.();
    };

    const Component = href ? 'a' : 'button';

    return (
        <motion.div
            ref={ref}
            className="relative inline-block"
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Component
                href={href}
                onClick={handleClick}
                className={`relative overflow-hidden ${className}`}
            >
                <motion.span
                    className="relative z-10 block"
                    animate={{
                        scale: isHovered ? 1.05 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    {children}
                </motion.span>

                {/* Ripple effect background */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: isHovered ? 1 : 0,
                        opacity: isHovered ? 0.1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0.5, originY: 0.5 }}
                />

                {/* Glow effect */}
                {isHovered && (
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-50 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </Component>
        </motion.div>
    );
}
