import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

interface ClickRippleProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

export default function ClickRipple({
    children,
    className = '',
    color = 'rgba(139, 92, 246, 0.3)'
}: ClickRippleProps) {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { id: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
    }, []);

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onClick={handleClick}
        >
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.span
                        key={ripple.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            backgroundColor: color,
                            transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ width: 0, height: 0, opacity: 0.5 }}
                        animate={{ width: 500, height: 500, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>
            {children}
        </div>
    );
}
