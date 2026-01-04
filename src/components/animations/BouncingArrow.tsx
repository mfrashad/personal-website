import { motion } from 'framer-motion';

interface BouncingArrowProps {
    className?: string;
    direction?: 'down' | 'right';
    color?: string;
}

export default function BouncingArrow({
    className = '',
    direction = 'down',
    color = 'currentColor'
}: BouncingArrowProps) {
    const isDown = direction === 'down';

    return (
        <motion.div
            className={`inline-flex ${className}`}
            animate={{
                y: isDown ? [0, 10, 0] : 0,
                x: !isDown ? [0, 10, 0] : 0,
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: isDown ? 'rotate(90deg)' : 'none' }}
            >
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </motion.div>
    );
}

// Scroll down indicator
export function ScrollDownIndicator({ className = '' }: { className?: string }) {
    return (
        <motion.div
            className={`flex flex-col items-center gap-2 ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <span className="text-sm text-neutral-500 font-medium">Scroll</span>
            <motion.div
                className="w-6 h-10 rounded-full border-2 border-neutral-300 flex justify-center pt-2"
                animate={{
                    borderColor: ['#d1d5db', '#8B5CF6', '#d1d5db'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                    animate={{
                        y: [0, 12, 0],
                        opacity: [1, 0.5, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
