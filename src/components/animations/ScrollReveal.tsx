import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'rotate' | 'flip';
    delay?: number;
    duration?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    duration = 0.6,
    once = true
}: ScrollRevealProps) {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: once
    });

    const variants = {
        up: {
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 }
        },
        down: {
            hidden: { opacity: 0, y: -60 },
            visible: { opacity: 1, y: 0 }
        },
        left: {
            hidden: { opacity: 0, x: -60 },
            visible: { opacity: 1, x: 0 }
        },
        right: {
            hidden: { opacity: 0, x: 60 },
            visible: { opacity: 1, x: 0 }
        },
        zoom: {
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1 }
        },
        rotate: {
            hidden: { opacity: 0, rotate: -15, scale: 0.9 },
            visible: { opacity: 1, rotate: 0, scale: 1 }
        },
        flip: {
            hidden: { opacity: 0, rotateX: 90 },
            visible: { opacity: 1, rotateX: 0 }
        }
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variants[direction]}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            style={{ perspective: direction === 'flip' ? 1000 : undefined }}
        >
            {children}
        </motion.div>
    );
}

// Parallax component for scroll-based movement
interface ParallaxProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
    direction?: 'vertical' | 'horizontal';
}

export function Parallax({
    children,
    className = '',
    speed = 0.5,
    direction = 'vertical'
}: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
    const x = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const ySpring = useSpring(y, springConfig);
    const xSpring = useSpring(x, springConfig);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                y: direction === 'vertical' ? ySpring : 0,
                x: direction === 'horizontal' ? xSpring : 0
            }}
        >
            {children}
        </motion.div>
    );
}

// Staggered children animation
interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1
}: StaggerContainerProps) {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.1
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 12
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
}
