import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { soundManager } from '@utils/soundManager';
import confetti from 'canvas-confetti';

interface AnimatedButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    confettiOnClick?: boolean;
}

export default function AnimatedButton({
    children,
    href,
    onClick,
    className = '',
    variant = 'primary',
    confettiOnClick = false
}: AnimatedButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const x = useSpring(useTransform(mouseX, [-50, 50], [-10, 10]), springConfig);
    const y = useSpring(useTransform(mouseY, [-50, 50], [-10, 10]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        soundManager.play('hover');
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleClick = (e: React.MouseEvent) => {
        soundManager.play('click');

        if (confettiOnClick) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            confetti({
                particleCount: 50,
                startVelocity: 30,
                spread: 60,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight
                },
                colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6']
            });
        }

        onClick?.();
    };

    const baseStyles = 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors';
    const variantStyles = {
        primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-100'
    };

    const Component = href ? motion.a : motion.button;

    return (
        <motion.div
            ref={ref}
            className="relative inline-block"
            style={{ x, y }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Component
                href={href}
                onClick={handleClick}
                className={`${baseStyles} ${variantStyles[variant]} ${className} relative overflow-hidden`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative z-10">{children}</span>

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '200%' : '-100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                {/* Glow effect */}
                {isHovered && variant === 'primary' && (
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg blur-lg -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                    />
                )}
            </Component>
        </motion.div>
    );
}
