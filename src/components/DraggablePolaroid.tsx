import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { soundManager } from '@utils/soundManager';

interface DraggablePolaroidProps {
    src: string;
    alt: string;
    caption?: string;
    initialX?: number;
    initialY?: number;
    rotation?: number;
    zIndex?: number;
    onPositionChange?: (x: number, y: number) => void;
}

export default function DraggablePolaroid({
    src,
    alt,
    caption,
    initialX = 100,
    initialY = 100,
    rotation = 0,
    zIndex = 100,
    onPositionChange
}: DraggablePolaroidProps) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const polaroidRef = useRef<HTMLDivElement>(null);
    const prevInitialY = useRef(initialY);

    // Update position when initialY changes (e.g., from bio slider offset)
    useEffect(() => {
        if (prevInitialY.current !== initialY) {
            const delta = initialY - prevInitialY.current;
            setPosition(prev => ({ ...prev, y: prev.y + delta }));
            prevInitialY.current = initialY;
        }
    }, [initialY]);

    // Mouse position for tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), {
        stiffness: 300,
        damping: 20
    });
    const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), {
        stiffness: 300,
        damping: 20
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            const newX = position.x + deltaX;
            const newY = position.y + deltaY;

            setPosition({ x: newX, y: newY });
            setDragStart({ x: e.clientX, y: e.clientY });

            // Notify parent of position change
            if (onPositionChange) {
                onPositionChange(newX, newY);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart, position, onPositionChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        soundManager.play('click');
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!polaroidRef.current || isDragging) return;

        const rect = polaroidRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    return (
        <motion.div
            ref={polaroidRef}
            className={`absolute cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl' : 'shadow-lg'}`}
            style={{
                userSelect: 'none',
                zIndex: isDragging ? 500 : zIndex,
            }}
            initial={{
                opacity: 0,
                scale: 0,
                rotate: rotation,
                x: position.x,
                y: position.y
            }}
            animate={{
                opacity: 1,
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? rotation + 2 : rotation,
                x: position.x,
                y: position.y + (isHovered ? -10 : 0),
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onHoverStart={() => {
                setIsHovered(true);
                soundManager.play('hover');
            }}
            onHoverEnd={() => {
                setIsHovered(false);
                mouseX.set(0);
                mouseY.set(0);
            }}
        >
            {/* Polaroid Frame */}
            <motion.div
                className="bg-white p-3 rounded-lg relative overflow-visible"
                style={{
                    width: '200px',
                    rotateX: isHovered && !isDragging ? rotateX : 0,
                    rotateY: isHovered && !isDragging ? rotateY : 0,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Glow effect on hover */}
                {isHovered && (
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur-md opacity-75 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                {/* Image */}
                <div className="bg-neutral-200 rounded overflow-hidden mb-3 aspect-square">
                    <motion.img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Caption */}
                {caption && (
                    <div className="text-center text-xs font-mono text-neutral-700 px-1">
                        {caption}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
