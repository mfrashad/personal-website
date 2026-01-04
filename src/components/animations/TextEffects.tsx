import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Typewriter Effect
interface TypewriterProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
    cursor?: boolean;
    onComplete?: () => void;
}

export function Typewriter({
    text,
    className = '',
    speed = 50,
    delay = 0,
    cursor = true,
    onComplete
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;

        let timeout: NodeJS.Timeout;
        let currentIndex = 0;

        const startTyping = () => {
            timeout = setTimeout(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                    startTyping();
                } else {
                    setIsComplete(true);
                    onComplete?.();
                }
            }, speed);
        };

        const delayTimeout = setTimeout(startTyping, delay);

        return () => {
            clearTimeout(timeout);
            clearTimeout(delayTimeout);
        };
    }, [text, speed, delay, inView, onComplete]);

    return (
        <span ref={ref} className={className}>
            {displayedText}
            {cursor && !isComplete && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block ml-1"
                >
                    |
                </motion.span>
            )}
        </span>
    );
}

// Glitch Text Effect
interface GlitchTextProps {
    text: string;
    className?: string;
    glitchOnHover?: boolean;
}

export function GlitchText({ text, className = '', glitchOnHover = true }: GlitchTextProps) {
    const [isGlitching, setIsGlitching] = useState(!glitchOnHover);

    return (
        <span
            className={`relative inline-block ${className}`}
            onMouseEnter={() => glitchOnHover && setIsGlitching(true)}
            onMouseLeave={() => glitchOnHover && setIsGlitching(false)}
        >
            <span className="relative z-10">{text}</span>

            {isGlitching && (
                <>
                    <motion.span
                        className="absolute top-0 left-0 text-cyan-500 z-0"
                        animate={{
                            x: [0, -2, 2, -1, 1, 0],
                            opacity: [1, 0.8, 1, 0.9, 1]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                        style={{ clipPath: 'inset(0 0 50% 0)' }}
                    >
                        {text}
                    </motion.span>
                    <motion.span
                        className="absolute top-0 left-0 text-pink-500 z-0"
                        animate={{
                            x: [0, 2, -2, 1, -1, 0],
                            opacity: [1, 0.9, 1, 0.8, 1]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                        style={{ clipPath: 'inset(50% 0 0 0)' }}
                    >
                        {text}
                    </motion.span>
                </>
            )}

            <style>{`
                @keyframes glitch-skew {
                    0% { transform: skew(0deg); }
                    20% { transform: skew(-2deg); }
                    40% { transform: skew(2deg); }
                    60% { transform: skew(-1deg); }
                    80% { transform: skew(1deg); }
                    100% { transform: skew(0deg); }
                }
            `}</style>
        </span>
    );
}

// Text Scramble Effect
interface ScrambleTextProps {
    text: string;
    className?: string;
    scrambleOnHover?: boolean;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function ScrambleText({ text, className = '', scrambleOnHover = true }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        if (isScrambling) return;
        setIsScrambling(true);

        let iteration = 0;
        const maxIterations = text.length * 3;

        intervalRef.current = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration / 3) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            iteration++;

            if (iteration >= maxIterations) {
                clearInterval(intervalRef.current!);
                setDisplayText(text);
                setIsScrambling(false);
            }
        }, 30);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <span
            className={`font-mono ${className}`}
            onMouseEnter={() => scrambleOnHover && scramble()}
        >
            {displayText}
        </span>
    );
}

// Gradient Wave Text
interface WaveTextProps {
    text: string;
    className?: string;
}

export function WaveText({ text, className = '' }: WaveTextProps) {
    return (
        <span className={`inline-flex ${className}`}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    animate={{
                        y: [0, -10, 0],
                        color: [
                            'rgb(59, 130, 246)',
                            'rgb(139, 92, 246)',
                            'rgb(236, 72, 153)',
                            'rgb(139, 92, 246)',
                            'rgb(59, 130, 246)'
                        ]
                    }}
                    transition={{
                        duration: 2,
                        delay: index * 0.05,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className={char === ' ' ? 'w-2' : ''}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

// Split Text Reveal
interface SplitRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export function SplitReveal({ text, className = '', delay = 0 }: SplitRevealProps) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    const words = text.split(' ');

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="overflow-hidden mr-2">
                    <motion.span
                        className="inline-block"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={inView ? { y: 0, opacity: 1 } : {}}
                        transition={{
                            duration: 0.5,
                            delay: delay + wordIndex * 0.1,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

// Counting Text (for numbers)
interface CountingTextProps {
    from?: number;
    to: number;
    duration?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
}

export function CountingText({
    from = 0,
    to,
    duration = 2,
    className = '',
    suffix = '',
    prefix = ''
}: CountingTextProps) {
    const [count, setCount] = useState(from);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(from + (to - from) * easeOut));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [inView, from, to, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}
