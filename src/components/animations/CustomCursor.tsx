import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [cursorText, setCursorText] = useState('');
    const [cursorVariant, setCursorVariant] = useState('default');

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements
            if (target.closest('a, button, [role="button"], .cursor-pointer')) {
                setIsHovering(true);
                setCursorVariant('hover');
            }

            // Check for special data attributes
            const cursorTextAttr = target.closest('[data-cursor-text]');
            if (cursorTextAttr) {
                setCursorText(cursorTextAttr.getAttribute('data-cursor-text') || '');
                setCursorVariant('text');
            }

            // Check for images
            if (target.closest('img, [data-cursor-view]')) {
                setCursorVariant('view');
                setCursorText('View');
            }

            // Check for draggable
            if (target.closest('[data-cursor-drag]')) {
                setCursorVariant('drag');
                setCursorText('Drag');
            }
        };

        const handleMouseOut = () => {
            setIsHovering(false);
            setCursorText('');
            setCursorVariant('default');
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    const variants = {
        default: {
            width: 32,
            height: 32,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            border: '2px solid rgba(0, 0, 0, 0.5)',
            mixBlendMode: 'difference' as const
        },
        hover: {
            width: 64,
            height: 64,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '2px solid rgba(59, 130, 246, 0.8)',
            mixBlendMode: 'normal' as const
        },
        text: {
            width: 100,
            height: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: 'none',
            mixBlendMode: 'normal' as const
        },
        view: {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(139, 92, 246, 0.9)',
            border: 'none',
            mixBlendMode: 'normal' as const
        },
        drag: {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(236, 72, 153, 0.9)',
            border: 'none',
            mixBlendMode: 'normal' as const
        }
    };

    // Only show on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return null;
    }

    return (
        <>
            {/* Main cursor */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    ...variants[cursorVariant],
                    scale: isClicking ? 0.8 : 1,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            >
                {cursorText && (
                    <motion.span
                        className="text-white text-xs font-bold"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                    >
                        {cursorText}
                    </motion.span>
                )}
            </motion.div>

            {/* Cursor dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: 12,
                    translateY: 12,
                }}
                animate={{
                    scale: isClicking ? 0.5 : (isHovering ? 0 : 1),
                }}
            />

            {/* Hide default cursor */}
            <style>{`
                @media (min-width: 768px) {
                    * {
                        cursor: none !important;
                    }
                }
            `}</style>
        </>
    );
}
