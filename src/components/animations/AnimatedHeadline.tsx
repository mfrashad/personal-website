import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedHeadlineProps {
    text: string;
    className?: string;
    delay?: number;
}

export default function AnimatedHeadline({ text, className = '', delay = 0 }: AnimatedHeadlineProps) {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
