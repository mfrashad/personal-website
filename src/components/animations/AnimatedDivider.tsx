import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedDividerProps {
    className?: string;
    variant?: 'gradient' | 'dots' | 'wave' | 'sketch';
}

export default function AnimatedDivider({ className = '', variant = 'gradient' }: AnimatedDividerProps) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    if (variant === 'dots') {
        return (
            <div ref={ref} className={`flex justify-center gap-3 py-8 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-neutral-300"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'wave') {
        return (
            <div ref={ref} className={`py-8 overflow-hidden ${className}`}>
                <motion.svg
                    viewBox="0 0 1200 40"
                    className="w-full h-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 0.4 } : {}}
                >
                    <motion.path
                        d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                </motion.svg>
            </div>
        );
    }

    if (variant === 'sketch') {
        // Hand-drawn style divider
        return (
            <div ref={ref} className={`py-8 overflow-hidden ${className}`}>
                <motion.svg
                    viewBox="0 0 400 20"
                    className="w-full h-5 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 0.3 } : {}}
                >
                    <motion.path
                        d="M20,10 Q60,8 100,11 T180,9 T260,12 T340,10 T380,10"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </motion.svg>
            </div>
        );
    }

    // Default gradient variant
    return (
        <div ref={ref} className={`relative py-8 ${className}`}>
            <motion.div
                className="h-px mx-auto"
                style={{
                    background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
                    maxWidth: '60%',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </div>
    );
}
