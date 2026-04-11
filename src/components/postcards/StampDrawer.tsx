import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StampDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onDone: (dataUrl: string) => void;
    initialDataUrl?: string;
}

function hexToGlow(hex: string, alpha = 0.8) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const COLORS = [
    { fill: '#f9a8d4', glow: 'rgba(249, 168, 212, 0.8)' },  // pink
    { fill: '#f87171', glow: 'rgba(248, 113, 113, 0.8)' },   // red
    { fill: '#fb923c', glow: 'rgba(251, 146, 60, 0.8)' },    // orange
    { fill: '#fde047', glow: 'rgba(253, 224, 71, 0.7)' },    // yellow
    { fill: '#86efac', glow: 'rgba(134, 239, 172, 0.8)' },   // green
    { fill: '#22d3ee', glow: 'rgba(34, 211, 238, 0.8)' },    // cyan
    { fill: '#93c5fd', glow: 'rgba(147, 197, 253, 0.8)' },   // blue
    { fill: '#a78bfa', glow: 'rgba(167, 139, 250, 0.8)' },   // purple
    { fill: '#d4d4d8', glow: 'rgba(212, 212, 216, 0.6)' },   // silver
    { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)' },   // white
];

const STAMP_STYLES = [
    { name: 'Dark', bg: '#111111', grid: 'rgba(255,255,255,0.05)' },
    { name: 'White', bg: '#ffffff', grid: 'rgba(0,0,0,0.06)' },
    { name: 'Cream', bg: '#FEFCF3', grid: 'rgba(0,0,0,0.04)' },
    { name: 'Navy', bg: '#0f172a', grid: 'rgba(255,255,255,0.05)' },
    { name: 'Wine', bg: '#4a1942', grid: 'rgba(255,255,255,0.05)' },
    { name: 'Forest', bg: '#14532d', grid: 'rgba(255,255,255,0.05)' },
];

const CANVAS_SIZE = 300;
const MIN_SIZE = 3;
const MAX_SIZE = 16;

interface Point { x: number; y: number }

export default function StampDrawer({ isOpen, onClose, onDone, initialDataUrl }: StampDrawerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glowCanvasRef = useRef<HTMLCanvasElement>(null);
    const [colorIndex, setColorIndex] = useState(0);
    const [stampStyleIndex, setStampStyleIndex] = useState(1);
    const [lineWidth, setLineWidth] = useState(10);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPoint = useRef<Point | null>(null);
    const [history, setHistory] = useState<ImageData[]>([]);
    const [glowHistory, setGlowHistory] = useState<ImageData[]>([]);
    const [customColor, setCustomColor] = useState<string | null>(null);

    const color = customColor
        ? { fill: customColor, glow: hexToGlow(customColor) }
        : COLORS[colorIndex];

    const getCtx = () => canvasRef.current?.getContext('2d');
    const getGlowCtx = () => glowCanvasRef.current?.getContext('2d');

    // Init canvas
    useEffect(() => {
        if (!isOpen) return;
        const ctx = getCtx();
        const gCtx = getGlowCtx();
        if (!ctx || !gCtx) return;

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        gCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        if (initialDataUrl) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
                saveHistory();
            };
            img.src = initialDataUrl;
        } else {
            saveHistory();
        }
    }, [isOpen]);

    const saveHistory = useCallback(() => {
        const ctx = getCtx();
        const gCtx = getGlowCtx();
        if (!ctx || !gCtx) return;
        setHistory(prev => [...prev.slice(-20), ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)]);
        setGlowHistory(prev => [...prev.slice(-20), gCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)]);
    }, []);

    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const scale = CANVAS_SIZE / rect.width;
        if ('touches' in e) {
            const t = e.touches[0] || e.changedTouches[0];
            return { x: (t.clientX - rect.left) * scale, y: (t.clientY - rect.top) * scale };
        }
        return { x: (e.clientX - rect.left) * scale, y: (e.clientY - rect.top) * scale };
    }, []);

    const drawLine = (from: Point, to: Point) => {
        const ctx = getCtx();
        const gCtx = getGlowCtx();
        if (!ctx || !gCtx) return;

        // Main stroke
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color.fill;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Glow layer (wider, blurred)
        gCtx.beginPath();
        gCtx.moveTo(from.x, from.y);
        gCtx.lineTo(to.x, to.y);
        gCtx.strokeStyle = color.glow;
        gCtx.lineWidth = lineWidth + 8;
        gCtx.lineCap = 'round';
        gCtx.lineJoin = 'round';
        gCtx.globalAlpha = 0.4;
        gCtx.stroke();
        gCtx.globalAlpha = 1;
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e);
        lastPoint.current = pos;
        setIsDrawing(true);

        // Dot
        const ctx = getCtx();
        const gCtx = getGlowCtx();
        if (ctx) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
            ctx.fillStyle = color.fill;
            ctx.fill();
        }
        if (gCtx) {
            gCtx.beginPath();
            gCtx.arc(pos.x, pos.y, (lineWidth + 8) / 2, 0, Math.PI * 2);
            gCtx.fillStyle = color.glow;
            gCtx.globalAlpha = 0.4;
            gCtx.fill();
            gCtx.globalAlpha = 1;
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing || !lastPoint.current) return;
        const pos = getPos(e);
        drawLine(lastPoint.current, pos);
        lastPoint.current = pos;
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            lastPoint.current = null;
            saveHistory();
        }
    };

    const undo = () => {
        const ctx = getCtx();
        const gCtx = getGlowCtx();
        if (!ctx || !gCtx || history.length <= 1) return;

        const newHistory = [...history];
        newHistory.pop();
        const newGlowHistory = [...glowHistory];
        newGlowHistory.pop();

        ctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
        gCtx.putImageData(newGlowHistory[newGlowHistory.length - 1], 0, 0);
        setHistory(newHistory);
        setGlowHistory(newGlowHistory);
    };

    const stampStyle = STAMP_STYLES[stampStyleIndex];

    const handleDone = () => {
        const canvas = canvasRef.current;
        const glowCanvas = glowCanvasRef.current;
        if (!canvas || !glowCanvas) return;

        // Composite: bg + glow + main
        const out = document.createElement('canvas');
        out.width = CANVAS_SIZE;
        out.height = CANVAS_SIZE;
        const outCtx = out.getContext('2d')!;
        outCtx.fillStyle = stampStyle.bg;
        outCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        outCtx.drawImage(glowCanvas, 0, 0);
        outCtx.drawImage(canvas, 0, 0);
        onDone(out.toDataURL('image/png'));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

                    <motion.div
                        className="relative w-full max-w-[440px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <h3 className="text-white font-semibold">Draw Your Stamp</h3>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 text-sm transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Canvas with stamp border */}
                        <div className="px-5 pb-4 flex justify-center">
                            <div
                                className="inline-block p-[8px]"
                                style={{
                                    background: 'radial-gradient(transparent 0px, transparent 5px, #171717 5px, #171717)',
                                    backgroundSize: '12px 12px',
                                    backgroundPosition: '-6px -6px',
                                }}
                            >
                            <div className="relative overflow-hidden">
                                {/* Grid background */}
                                <div
                                    className="absolute inset-0 transition-colors duration-200"
                                    style={{
                                        backgroundColor: stampStyle.bg,
                                        backgroundImage: `linear-gradient(${stampStyle.grid} 1px, transparent 1px), linear-gradient(90deg, ${stampStyle.grid} 1px, transparent 1px)`,
                                        backgroundSize: '20px 20px',
                                    }}
                                />

                                {/* Glow layer (behind) */}
                                <canvas
                                    ref={glowCanvasRef}
                                    width={CANVAS_SIZE}
                                    height={CANVAS_SIZE}
                                    className="absolute inset-0 w-full h-full"
                                    style={{ filter: 'blur(4px)' }}
                                />

                                {/* Main canvas */}
                                <canvas
                                    ref={canvasRef}
                                    width={CANVAS_SIZE}
                                    height={CANVAS_SIZE}
                                    className="relative w-full cursor-crosshair touch-none"
                                    style={{ aspectRatio: '1', imageRendering: 'auto' }}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                            </div>
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="flex flex-wrap justify-center gap-2 px-5 pb-3">
                            {COLORS.map((c, i) => (
                                <button
                                    key={c.fill}
                                    type="button"
                                    onClick={() => { setColorIndex(i); setCustomColor(null); }}
                                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                                        !customColor && colorIndex === i
                                            ? 'border-white scale-110'
                                            : 'border-white/20 hover:border-white/40'
                                    }`}
                                    style={{
                                        backgroundColor: c.fill,
                                        boxShadow: !customColor && colorIndex === i ? `0 0 12px ${c.glow}` : 'none',
                                    }}
                                />
                            ))}
                            {/* Custom color picker */}
                            <label
                                className={`relative w-7 h-7 rounded-full border-2 cursor-pointer overflow-hidden transition-all ${
                                    customColor ? 'border-white scale-110' : 'border-white/20 hover:border-white/40'
                                }`}
                                style={{
                                    background: customColor || 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                                    boxShadow: customColor ? `0 0 12px ${hexToGlow(customColor)}` : 'none',
                                }}
                            >
                                <input
                                    type="color"
                                    value={customColor || '#ff0000'}
                                    onChange={(e) => setCustomColor(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </label>
                        </div>

                        {/* Stamp background style */}
                        <div className="flex items-center justify-center gap-2 px-5 pb-3">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-1">BG</span>
                            {STAMP_STYLES.map((s, i) => (
                                <button
                                    key={s.name}
                                    type="button"
                                    onClick={() => setStampStyleIndex(i)}
                                    className={`w-7 h-7 rounded-md border-2 transition-all ${
                                        stampStyleIndex === i
                                            ? 'border-white scale-110'
                                            : 'border-white/20 hover:border-white/40'
                                    }`}
                                    style={{ backgroundColor: s.bg }}
                                    title={s.name}
                                />
                            ))}
                        </div>

                        {/* Size slider */}
                        <div className="flex items-center gap-3 px-5 pb-4">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Size</span>
                            <div className="flex-1 relative">
                                <input
                                    type="range"
                                    min={MIN_SIZE}
                                    max={MAX_SIZE}
                                    value={lineWidth}
                                    onChange={(e) => setLineWidth(Number(e.target.value))}
                                    className="w-full accent-white/60 stamp-slider"
                                />
                            </div>
                            <div
                                className="rounded-full shrink-0"
                                style={{
                                    width: lineWidth + 4,
                                    height: lineWidth + 4,
                                    backgroundColor: color.fill,
                                    boxShadow: `0 0 6px ${color.glow}`,
                                }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between px-5 pb-5">
                            <button
                                type="button"
                                onClick={undo}
                                disabled={history.length <= 1}
                                className="flex items-center gap-1.5 text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-mono"
                            >
                                &#x21A9; Undo
                            </button>
                            <button
                                type="button"
                                onClick={handleDone}
                                className="flex items-center gap-1.5 px-5 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
                            >
                                Continue &rsaquo;
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
