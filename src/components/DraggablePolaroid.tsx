import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface DraggablePolaroidProps {
    src: string;
    alt: string;
    caption?: string;
    initialX?: number;
    initialY?: number;
    rotation?: number;
    zIndex?: number;
    onPositionChange?: (x: number, y: number) => void;
    stackX?: number;
    stackY?: number;
    onStackPositionChange?: (x: number, y: number) => void;
    animationDelay?: number;
    hoverMessage?: string;
    href?: string;
}

export default function DraggablePolaroid({
    src,
    alt,
    caption,
    initialX = 100,
    initialY = 100,
    rotation = 0,
    zIndex = 100,
    onPositionChange,
    stackX,
    stackY,
    onStackPositionChange,
    animationDelay = 0,
    hoverMessage,
    href
}: DraggablePolaroidProps) {
    const hasStackMode = stackX !== undefined && stackY !== undefined;
    const [spreadPos, setSpreadPos] = useState({ x: initialX, y: initialY });
    const [stackPos, setStackPos] = useState({ x: stackX ?? initialX, y: stackY ?? initialY });
    const [isSpread, setIsSpread] = useState(!hasStackMode);
    const [hasEntered, setHasEntered] = useState(!hasStackMode);
    const [manualOverride, setManualOverride] = useState<boolean | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const polaroidRef = useRef<HTMLDivElement>(null);
    const prevInitialY = useRef(initialY);

    // Determine current mode
    const spread = manualOverride !== null ? manualOverride : hasEntered;

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
        // If page-revealed already fired (component hydrated late), spread immediately
        if ((window as any).__pageRevealed) {
            trigger();
        } else {
            window.addEventListener('page-revealed', trigger, { once: true });
        }
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

    // Update spread position when initialY changes (e.g., from bio slider offset)
    useEffect(() => {
        if (prevInitialY.current !== initialY) {
            const delta = initialY - prevInitialY.current;
            setSpreadPos(prev => ({ ...prev, y: prev.y + delta }));
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

            if (isSpread) {
                setSpreadPos(prev => {
                    const next = { x: prev.x + deltaX, y: prev.y + deltaY };
                    onPositionChange?.(next.x, next.y);
                    return next;
                });
            } else {
                setStackPos(prev => {
                    const next = { x: prev.x + deltaX, y: prev.y + deltaY };
                    onStackPositionChange?.(next.x, next.y);
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
    }, [isDragging, dragStart, isSpread, onPositionChange, onStackPositionChange]);

    const dragStartPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!href) return;
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < 5) {
            window.location.href = href;
        }
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
            initial={hasStackMode ? {
                opacity: 0.8,
                scale: 0.35,
                rotate: 0,
                x: stackPos.x,
                y: stackPos.y,
            } : {
                opacity: 1,
                scale: 1,
                rotate: rotation,
                x: spreadPos.x,
                y: spreadPos.y,
            }}
            animate={spread ? {
                opacity: 1,
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? rotation + 2 : rotation,
                x: spreadPos.x,
                y: spreadPos.y + (isHovered ? -10 : 0),
            } : {
                opacity: 0.8,
                scale: 0.35,
                rotate: 0,
                x: stackPos.x,
                y: stackPos.y,
            }}
            transition={{
                type: "spring",
                stiffness: 80,
                damping: 18,
            }}
            whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onHoverStart={() => {
                setIsHovered(true);
                if (hoverMessage) {
                    window.dispatchEvent(new CustomEvent('sprite-speak', { detail: { message: hoverMessage } }));
                }
            }}
            onHoverEnd={() => {
                setIsHovered(false);
                mouseX.set(0);
                mouseY.set(0);
                if (hoverMessage) {
                    window.dispatchEvent(new CustomEvent('sprite-speak', { detail: { message: null } }));
                }
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
                        loading="lazy"
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
