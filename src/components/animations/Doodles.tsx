import { motion } from 'framer-motion';

interface DoodleProps {
    className?: string;
    color?: string;
    strokeWidth?: number;
    animated?: boolean;
}

// Hand-drawn arrow
export function DoodleArrow({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true }: DoodleProps) {
    return (
        <motion.svg
            viewBox="0 0 100 50"
            className={`w-24 h-12 ${className}`}
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            whileInView={animated ? { pathLength: 1, opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d="M5 25 Q25 20, 45 25 T85 25 M75 15 L85 25 L75 35"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Hand-drawn circle
export function DoodleCircle({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true }: DoodleProps) {
    return (
        <motion.svg
            viewBox="0 0 60 60"
            className={`w-16 h-16 ${className}`}
            initial={animated ? { opacity: 0 } : undefined}
            whileInView={animated ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d="M30 5 Q55 5, 55 30 Q55 55, 30 55 Q5 55, 5 30 Q5 5, 30 5"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 1.2, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Hand-drawn underline
export function DoodleUnderline({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true }: DoodleProps) {
    return (
        <motion.svg
            viewBox="0 0 200 20"
            className={`w-full h-3 ${className}`}
            preserveAspectRatio="none"
            initial={animated ? { opacity: 0 } : undefined}
            whileInView={animated ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d="M0 10 Q50 5, 100 12 T200 10"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Hand-drawn star
export function DoodleStar({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true }: DoodleProps) {
    return (
        <motion.svg
            viewBox="0 0 50 50"
            className={`w-12 h-12 ${className}`}
            initial={animated ? { opacity: 0, rotate: -20 } : undefined}
            whileInView={animated ? { opacity: 1, rotate: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <motion.path
                d="M25 5 L30 20 L45 20 L33 30 L38 45 L25 35 L12 45 L17 30 L5 20 L20 20 Z"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Hand-drawn squiggle/wave
export function DoodleSquiggle({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true }: DoodleProps) {
    return (
        <motion.svg
            viewBox="0 0 100 30"
            className={`w-24 h-8 ${className}`}
            initial={animated ? { opacity: 0 } : undefined}
            whileInView={animated ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d="M5 15 Q15 5, 25 15 T45 15 T65 15 T85 15 T95 15"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Hand-drawn highlight box
export function DoodleHighlight({ className = '', color = '#fef08a', animated = true }: DoodleProps & { children?: React.ReactNode }) {
    return (
        <span className={`relative inline-block ${className}`}>
            <motion.span
                className="absolute inset-0 -z-10"
                style={{ backgroundColor: color }}
                initial={animated ? { scaleX: 0, transformOrigin: 'left' } : undefined}
                whileInView={animated ? { scaleX: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
        </span>
    );
}

// Hand-drawn bracket
export function DoodleBracket({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true, side = 'left' }: DoodleProps & { side?: 'left' | 'right' }) {
    const path = side === 'left'
        ? "M30 5 Q10 5, 10 25 Q10 45, 30 45"
        : "M10 5 Q30 5, 30 25 Q30 45, 10 45";

    return (
        <motion.svg
            viewBox="0 0 40 50"
            className={`w-8 h-12 ${className}`}
            initial={animated ? { opacity: 0 } : undefined}
            whileInView={animated ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Hand-drawn scribble/cross-out
export function DoodleScribble({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true }: DoodleProps) {
    return (
        <motion.svg
            viewBox="0 0 100 40"
            className={`w-24 h-10 ${className}`}
            initial={animated ? { opacity: 0 } : undefined}
            whileInView={animated ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d="M5 20 Q25 10, 50 25 T95 15 M5 25 Q30 35, 55 18 T95 22"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </motion.svg>
    );
}

// Decorative corner doodle
export function DoodleCorner({ className = '', color = '#94a3b8', strokeWidth = 2, animated = true, position = 'top-left' }: DoodleProps & { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
    const transforms: Record<string, string> = {
        'top-left': '',
        'top-right': 'scaleX(-1)',
        'bottom-left': 'scaleY(-1)',
        'bottom-right': 'scale(-1, -1)'
    };

    return (
        <motion.svg
            viewBox="0 0 60 60"
            className={`w-16 h-16 ${className}`}
            style={{ transform: transforms[position] }}
            initial={animated ? { opacity: 0 } : undefined}
            whileInView={animated ? { opacity: 1 } : undefined}
            viewport={{ once: true }}
        >
            <motion.path
                d="M5 55 L5 25 Q5 5, 25 5 L55 5"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : undefined}
                whileInView={animated ? { pathLength: 1 } : undefined}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.circle
                cx="55"
                cy="5"
                r="3"
                fill={color}
                initial={animated ? { scale: 0 } : undefined}
                whileInView={animated ? { scale: 1 } : undefined}
                transition={{ delay: 0.6, duration: 0.3 }}
            />
        </motion.svg>
    );
}

// Floating doodle decorations for sections
export function SectionDoodles({ variant = 'default' }: { variant?: 'default' | 'minimal' | 'playful' }) {
    if (variant === 'minimal') {
        return (
            <>
                <DoodleSquiggle className="absolute -left-8 top-1/4 opacity-30" color="#cbd5e1" />
                <DoodleSquiggle className="absolute -right-8 bottom-1/4 opacity-30 rotate-180" color="#cbd5e1" />
            </>
        );
    }

    if (variant === 'playful') {
        return (
            <>
                <DoodleStar className="absolute -left-4 top-0 opacity-40" color="#fbbf24" />
                <DoodleCircle className="absolute -right-6 top-1/3 opacity-30" color="#a78bfa" />
                <DoodleArrow className="absolute left-1/4 -bottom-4 opacity-30 rotate-12" color="#94a3b8" />
            </>
        );
    }

    return (
        <>
            <DoodleCorner className="absolute -left-4 -top-4 opacity-20" position="top-left" color="#94a3b8" />
            <DoodleCorner className="absolute -right-4 -top-4 opacity-20" position="top-right" color="#94a3b8" />
        </>
    );
}
