import { motion } from 'framer-motion';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    animated?: boolean;
}

export default function GradientText({ children, className = '', animated = true }: GradientTextProps) {
    return (
        <motion.span
            className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}
            style={{
                backgroundSize: animated ? '200% auto' : '100% auto',
            }}
            animate={animated ? {
                backgroundPosition: ['0% center', '200% center', '0% center']
            } : {}}
            transition={animated ? {
                duration: 5,
                repeat: Infinity,
                ease: "linear"
            } : {}}
        >
            {children}
        </motion.span>
    );
}
