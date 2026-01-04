import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DraggableImageProps {
    src: string;
    alt: string;
    initialX?: number;
    initialY?: number;
    width?: number;
    height?: number;
    rotation?: number;
    scale?: number;
    zIndex?: number;
    className?: string;
    onPositionChange?: (x: number, y: number) => void;
    shadow?: boolean;
}

export default function DraggableImage({
    src,
    alt,
    initialX = 100,
    initialY = 100,
    width = 200,
    height,
    rotation = 0,
    scale = 1,
    zIndex = 10,
    className = '',
    onPositionChange,
    shadow = false
}: DraggableImageProps) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

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
    };

    return (
        <motion.div
            ref={imageRef}
            className={`absolute cursor-grab active:cursor-grabbing ${className}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: width ? `${width}px` : 'auto',
                height: height ? `${height}px` : 'auto',
                userSelect: 'none',
                zIndex: isDragging ? 500 : zIndex,
                rotate: `${rotation}deg`,
                pointerEvents: zIndex < 0 && !isHovered ? 'none' : 'auto'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: (isHovered && !isDragging ? 1.1 : 1) * scale,
                y: isHovered && !isDragging ? -10 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            whileHover={{
                boxShadow: shadow ? "0 20px 40px rgba(0,0,0,0.3)" : "none"
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.img
                src={src}
                alt={alt}
                className="w-full h-full object-contain pointer-events-none"
                style={{
                    filter: shadow ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' : 'none'
                }}
                draggable={false}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}
