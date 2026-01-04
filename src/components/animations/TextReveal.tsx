import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    highlightWords?: string[];
    highlightColor?: string;
}

export default function TextReveal({
    children,
    className = '',
    delay = 0,
    highlightWords = [],
    highlightColor = 'from-purple-500 to-pink-500'
}: TextRevealProps) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    const words = children.split(' ');

    return (
        <span ref={ref} className={`inline ${className}`}>
            {words.map((word, i) => {
                const isHighlighted = highlightWords.some(hw =>
                    word.toLowerCase().includes(hw.toLowerCase())
                );

                return (
                    <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
                        <motion.span
                            className={`inline-block ${isHighlighted ? `bg-gradient-to-r ${highlightColor} bg-clip-text text-transparent font-semibold` : ''}`}
                            initial={{ y: '100%' }}
                            animate={inView ? { y: 0 } : {}}
                            transition={{
                                delay: delay + i * 0.03,
                                duration: 0.5,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                        >
                            {word}
                        </motion.span>
                    </span>
                );
            })}
        </span>
    );
}

// Highlight text that animates on scroll
export function HighlightOnScroll({
    children,
    className = '',
    color = '#FEF08A'
}: {
    children: string;
    className?: string;
    color?: string;
}) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
        <span ref={ref} className={`relative inline ${className}`}>
            <motion.span
                className="absolute inset-0 -z-10"
                style={{ backgroundColor: color }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                transformOrigin="left"
            />
            {children}
        </span>
    );
}
