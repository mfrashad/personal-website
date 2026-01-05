import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveCardProps {
    children: React.ReactNode;
    className?: string;
    glowOnHover?: boolean;
    tiltIntensity?: number;
    scaleOnHover?: number;
}

export default function InteractiveCard({
    children,
    className = '',
    glowOnHover = true,
    tiltIntensity = 10,
    scaleOnHover = 1.02
}: InteractiveCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };

    const rotateX = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]),
        springConfig
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]),
        springConfig
    );

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            whileHover={{ scale: scaleOnHover }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {/* Glow effect */}
            {glowOnHover && isHovered && (
                <motion.div
                    className="absolute -inset-2 rounded-2xl opacity-50 blur-xl -z-10"
                    style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                />
            )}

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(
                            ${105 + rotateY.get() * 2}deg,
                            transparent 40%,
                            rgba(255,255,255,0.1) 45%,
                            rgba(255,255,255,0.2) 50%,
                            rgba(255,255,255,0.1) 55%,
                            transparent 60%
                        )`,
                    }}
                />
            </motion.div>

            {children}
        </motion.div>
    );
}
