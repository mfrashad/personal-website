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
    stackX?: number;
    stackY?: number;
    onStackPositionChange?: (x: number, y: number) => void;
    animationDelay?: number;
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
    shadow = false,
    stackX,
    stackY,
    onStackPositionChange,
    animationDelay = 0
}: DraggableImageProps) {
    const hasStackMode = stackX !== undefined && stackY !== undefined;
    // DraggableImage uses CSS left/top for base position + motion x/y as offsets
    // stackOffset = how far to shift from CSS position to reach the stack position
    const [stackOffset, setStackOffset] = useState({
        x: hasStackMode ? stackX - initialX : 0,
        y: hasStackMode ? stackY! - initialY : 0,
    });
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isSpread, setIsSpread] = useState(!hasStackMode);
    const [hasEntered, setHasEntered] = useState(!hasStackMode);
    const [manualOverride, setManualOverride] = useState<boolean | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    // Determine current mode
    const spread = manualOverride !== null ? manualOverride : hasEntered;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            if (isSpread) {
                const newX = position.x + deltaX;
                const newY = position.y + deltaY;
                setPosition({ x: newX, y: newY });
                onPositionChange?.(newX, newY);
            } else {
                setStackOffset(prev => {
                    const next = { x: prev.x + deltaX, y: prev.y + deltaY };
                    // Report absolute stack position back to parent
                    onStackPositionChange?.(position.x + next.x, position.y + next.y);
                    return next;
                });
            }
            setDragStart({ x: e.clientX, y: e.clientY });
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
    }, [isDragging, dragStart, position, isSpread, onPositionChange, onStackPositionChange]);

    // Trigger spread animation after page overlay fades out
    useEffect(() => {
        if (!hasStackMode) return;
        let timer: ReturnType<typeof setTimeout>;
        const trigger = () => {
            timer = setTimeout(() => {
                setHasEntered(true);
                setIsSpread(true);
            }, animationDelay * 1000);
        };
        window.addEventListener('page-revealed', trigger, { once: true });
        return () => {
            window.removeEventListener('page-revealed', trigger);
            clearTimeout(timer);
        };
    }, []);

    // Listen for debug toggle
    useEffect(() => {
        if (!hasStackMode) return;
        const handler = (e: CustomEvent) => {
            setManualOverride(e.detail.spread);
            setIsSpread(e.detail.spread);
        };
        window.addEventListener('toggle-spread', handler as EventListener);
        return () => window.removeEventListener('toggle-spread', handler as EventListener);
    }, []);

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
                pointerEvents: zIndex < 0 && !isHovered ? 'none' : 'auto'
            }}
            animate={spread ? {
                opacity: 1,
                scale: (isHovered && !isDragging ? 1.1 : 1) * scale,
                rotate: rotation,
                x: 0,
                y: isHovered && !isDragging ? -10 : 0,
            } : {
                opacity: 0.8,
                scale: 0.35 * scale,
                rotate: 0,
                x: stackOffset.x,
                y: stackOffset.y,
            }}
            transition={{
                type: "spring",
                stiffness: 80,
                damping: 18,
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
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}
