import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StampDrawer from './StampDrawer';
import PostOfficeStamp from './PostOfficeStamp';
import SpriteCharacter from '../animations/SpriteCharacter';
import { SPRITES } from '../../data/sprites';

const NOTECARD_IDS = [1, 6, 8, 10, 11, 12, 13, 16, 18, 26, 29, 31];

export default function PostcardForm() {
    const [message, setMessage] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [styleIndex, setStyleIndex] = useState(0);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [stampDataUrl, setStampDataUrl] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [stampPos, setStampPos] = useState<{ x: number; y: number } | null>(null);
    const [placingStamp, setPlacingStamp] = useState(false);
    const [stamping, setStamping] = useState(false);
    const [stampVisible, setStampVisible] = useState(false);
    const [spriteMsg, setSpriteMsg] = useState('');
    const [globalMousePos, setGlobalMousePos] = useState<{ x: number; y: number } | null>(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawColor, setDrawColor] = useState('#2c3e6b');
    const [drawSize, setDrawSize] = useState(4);
    const [isCardDrawing, setIsCardDrawing] = useState(false);
    const [cardDrawHistory, setCardDrawHistory] = useState<ImageData[]>([]);
    const lastCardPoint = useRef<{ x: number; y: number } | null>(null);
    const cardCanvasRef = useRef<HTMLCanvasElement>(null);
    const spriteMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const CARD_DRAW_COLORS = ['#2c3e6b', '#1a1a1a', '#8b0000', '#006400', '#ff6347', '#4169e1', '#ff69b4', '#ffa500'];

    const notecardBg = `/images/notecards/notecard${NOTECARD_IDS[styleIndex % NOTECARD_IDS.length]}.webp`;
    const stampRotation = 12;

    const showSpriteMsg = useCallback((msg: string, duration = 3000) => {
        setSpriteMsg(msg);
        // Also dispatch to SpriteCharacter's built-in bubble (desktop)
        window.dispatchEvent(new CustomEvent('sprite-speak', { detail: { message: msg } }));
        if (spriteMsgTimer.current) clearTimeout(spriteMsgTimer.current);
        spriteMsgTimer.current = setTimeout(() => {
            setSpriteMsg('');
            window.dispatchEvent(new CustomEvent('sprite-speak', { detail: { message: null } }));
        }, duration);
    }, []);

    // Show initial hint
    useEffect(() => {
        const t = setTimeout(() => {
            if (!stampDataUrl && !stampPos) showSpriteMsg('Draw a stamp and leave a message!', 4000);
        }, 2000);
        return () => { clearTimeout(t); if (spriteMsgTimer.current) clearTimeout(spriteMsgTimer.current); };
    }, []);

    // Track mouse globally for stamp preview
    useEffect(() => {
        if (!placingStamp) { setGlobalMousePos(null); return; }
        const handleMove = (e: MouseEvent) => setGlobalMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [placingStamp]);

    // Card drawing helpers
    const getCardCanvasPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = cardCanvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            const t = e.touches[0] || e.changedTouches[0];
            return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
        }
        return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
    }, []);

    const saveCardDrawHistory = useCallback(() => {
        const canvas = cardCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setCardDrawHistory(prev => [...prev.slice(-20), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    }, []);

    // Scale brush size relative to canvas resolution (canvas is 2x display)
    const scaledDrawSize = drawSize * 2;

    const startCardDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!drawingMode) return;
        e.preventDefault();
        e.stopPropagation();
        const pos = getCardCanvasPos(e);
        if (!pos) return;
        lastCardPoint.current = pos;
        setIsCardDrawing(true);
        const ctx = cardCanvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, scaledDrawSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = drawColor;
            ctx.fill();
        }
    }, [drawingMode, drawColor, scaledDrawSize, getCardCanvasPos]);

    const doCardDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCardDrawing || !lastCardPoint.current) return;
        e.preventDefault();
        e.stopPropagation();
        const pos = getCardCanvasPos(e);
        if (!pos) return;
        const ctx = cardCanvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(lastCardPoint.current.x, lastCardPoint.current.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = scaledDrawSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
        lastCardPoint.current = pos;
    }, [isCardDrawing, drawColor, scaledDrawSize, getCardCanvasPos]);

    const stopCardDraw = useCallback(() => {
        if (isCardDrawing) {
            setIsCardDrawing(false);
            lastCardPoint.current = null;
            saveCardDrawHistory();
        }
    }, [isCardDrawing, saveCardDrawHistory]);

    const undoCardDraw = useCallback(() => {
        const canvas = cardCanvasRef.current;
        if (!canvas || cardDrawHistory.length <= 1) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const newHist = [...cardDrawHistory];
        newHist.pop();
        ctx.putImageData(newHist[newHist.length - 1], 0, 0);
        setCardDrawHistory(newHist);
    }, [cardDrawHistory]);

    const getCardDrawingDataUrl = useCallback(() => {
        const canvas = cardCanvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');
        if (!ctx) return undefined;
        // Check if canvas has any non-transparent pixels
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let hasContent = false;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) { hasContent = true; break; }
        }
        return hasContent ? canvas.toDataURL('image/png') : undefined;
    }, []);

    // Init card canvas when drawing mode is first activated
    useEffect(() => {
        if (!drawingMode) return;
        const canvas = cardCanvasRef.current;
        if (!canvas) return;
        if (cardDrawHistory.length === 0) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                saveCardDrawHistory();
            }
        }
    }, [drawingMode]);

    const getCardPercent = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current) return null;
        const rect = cardRef.current.getBoundingClientRect();
        return { x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 };
    }, []);

    const playStampAnimation = useCallback((pos: { x: number; y: number }) => {
        setStampPos(pos);
        setStampVisible(false);
        setStamping(true);
        setPlacingStamp(false);
        // Light tap when stamper starts descending
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
        setTimeout(() => {
            setStampVisible(true);
            // Strong thud at impact
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([60, 30, 40]);
            try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
                osc.onended = () => ctx.close();
            } catch {}
        }, 500);
        setTimeout(() => setStamping(false), 1400);
    }, []);

    const handleCardClick = useCallback((e: React.MouseEvent) => {
        if (!placingStamp || drawingMode) return;
        const pos = getCardPercent(e);
        if (pos) playStampAnimation(pos);
    }, [placingStamp, getCardPercent, playStampAnimation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) { showSpriteMsg('Please leave a message!'); return; }
        if (!author.trim()) { showSpriteMsg('Please write your name!'); return; }
        if (!stampDataUrl) { showSpriteMsg('Draw a stamp first!'); return; }
        if (!stampPos) { showSpriteMsg('Use the stamper to stamp your postcard!'); return; }

        setStatus('submitting');
        try {
            const res = await fetch('/api/postcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: author.trim(), body: message.trim(), drawingDataUrl: stampDataUrl,
                    cardDrawingDataUrl: getCardDrawingDataUrl(),
                    websiteUrl: url.trim() || undefined, email: email.trim() || undefined,
                    notecardId: NOTECARD_IDS[styleIndex % NOTECARD_IDS.length],
                    stampX: stampPos?.x, stampY: stampPos?.y,
                }),
            });
            if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Failed to submit'); }
            setStatus('success');
            setMessage(''); setAuthor(''); setUrl(''); setEmail(''); setStampDataUrl(''); setStampPos(null); setStampVisible(false); setDrawingMode(false); setCardDrawHistory([]);
            const ctx = cardCanvasRef.current?.getContext('2d');
            if (ctx && cardCanvasRef.current) ctx.clearRect(0, 0, cardCanvasRef.current.width, cardCanvasRef.current.height);
            showSpriteMsg('Postcard sent! Thanks for stopping by.', 4000);
            window.dispatchEvent(new Event('postcards-refresh'));
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            showSpriteMsg(err instanceof Error ? err.message : 'Something went wrong');
            setStatus('idle');
        }
    };

    const stopProp = (e: React.MouseEvent) => { if (!placingStamp) e.stopPropagation(); };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Postcard + sprite + stamper container */}
                <div className="relative mx-auto w-full max-w-[560px]">

                    {/* Sprite character — right side (desktop) */}
                    <div className="absolute -bottom-2 -right-4 sm:-right-6 z-20 hidden sm:block">
                        <SpriteCharacter config={SPRITES.waving_hello} scale={0.35} canToggleSpread />
                    </div>

                    {/* Mobile sprite + message */}
                    <div className="sm:hidden flex items-end justify-end gap-1 mb-2">
                        <AnimatePresence>
                            {spriteMsg && (
                                <motion.div
                                    key={spriteMsg + '-mobile'}
                                    initial={{ opacity: 0, x: 4 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <span className="inline-block bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 shadow-md max-w-[200px]">
                                        {spriteMsg}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="shrink-0">
                            <SpriteCharacter config={SPRITES.waving_hello} scale={0.35} />
                        </div>
                    </div>

                    {/* Stamper — top-right corner */}
                    {/* Mobile stamper — bottom-left corner */}
                    <div className="absolute -bottom-4 -left-4 z-30 sm:hidden">
                        <button
                            type="button"
                            onClick={() => { setPlacingStamp(!placingStamp); setDrawingMode(false); }}
                            className={`transition-transform ${placingStamp ? 'scale-90' : `hover:scale-110 ${!stampPos ? 'animate-stamper-bounce' : ''}`}`}
                        >
                            <img src="/images/stamper.png" alt="Stamp" className="w-16 h-auto drop-shadow-lg brightness-125" />
                        </button>
                    </div>

                    {/* Desktop stamper — right side */}
                    <div className="absolute top-[30px] -right-[122px] sm:-right-[154px] z-30 hidden sm:block">
                        <div className="relative group">
                            <button
                                type="button"
                                onClick={() => { setPlacingStamp(!placingStamp); setDrawingMode(false); }}
                                className={`transition-transform ${placingStamp ? 'scale-90' : `hover:scale-110 hover:-translate-y-1 ${!stampPos ? 'animate-stamper-bounce' : ''}`}`}
                            >
                                <img src="/images/stamper.png" alt="Stamp" className="w-24 sm:w-32 h-auto drop-shadow-xl brightness-125" />
                            </button>
                            {!stampPos && !placingStamp && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="bg-neutral-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg">Click to stamp!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notecard */}
                    <div
                        ref={cardRef}
                        className={`relative mx-auto w-full max-w-[480px] flex flex-col justify-between text-[#2c3e6b] ${placingStamp ? 'cursor-crosshair' : ''}`}
                        style={{
                            aspectRatio: '4 / 3',
                            backgroundImage: `url(${notecardBg})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            padding: 'clamp(24px, 5vw, 48px)',
                        }}
                        onClick={handleCardClick}
                    >
                        {/* Card drawing canvas overlay */}
                        <canvas
                            ref={cardCanvasRef}
                            width={960}
                            height={720}
                            className={`absolute inset-0 w-full h-full ${drawingMode ? 'z-30 cursor-crosshair touch-none' : 'z-5 pointer-events-none'}`}
                            onMouseDown={startCardDraw}
                            onMouseMove={doCardDraw}
                            onMouseUp={stopCardDraw}
                            onMouseLeave={stopCardDraw}
                            onTouchStart={startCardDraw}
                            onTouchMove={doCardDraw}
                            onTouchEnd={stopCardDraw}
                        />

                        {/* Placing stamp hint overlay */}
                        {placingStamp && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                <span className="bg-white/80 backdrop-blur-sm text-neutral-700 text-xs font-mono px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                                    Tap anywhere to stamp
                                </span>
                            </div>
                        )}

                        {/* Stamper slam animation */}
                        {stamping && stampPos && (
                            <div className="absolute z-30 pointer-events-none stamper-slam" style={{ left: `${stampPos.x}%`, top: `${stampPos.y}%` }}>
                                <img src="/images/stamper.png" alt="" className="w-20 h-auto" />
                            </div>
                        )}

                        {/* Placed post office stamp */}
                        {stampPos && stampVisible && (
                            <div className="absolute z-10 stamp-appear" style={{ left: `${stampPos.x}%`, top: `${stampPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                                <PostOfficeStamp date={Date.now()} rotation={stampRotation} />
                            </div>
                        )}

                        {/* Top-right: drawn stamp */}
                        <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-10">
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); }} className="shrink-0 group">
                                <div className="inline-block p-[5px]" style={{ background: 'radial-gradient(transparent 0px, transparent 4px, white 4px, white)', backgroundSize: '10px 10px', backgroundPosition: '-5px -5px' }}>
                                    {stampDataUrl ? (
                                        <img src={stampDataUrl} alt="Your stamp" className="w-[60px] h-[60px] object-cover" style={{ imageRendering: 'pixelated' }} />
                                    ) : (
                                        <div className="w-[60px] h-[60px] bg-white/50 flex items-center justify-center border border-dashed border-black/15 group-hover:border-black/30 transition-colors">
                                            <span className="text-[20px] text-black/20 group-hover:text-black/40 transition-colors">+</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-[8px] text-black/30 text-center mt-0.5 group-hover:text-black/50 transition-colors font-mono">
                                    {stampDataUrl ? 'edit stamp' : 'draw stamp'}
                                </div>
                            </button>
                        </div>

                        {/* Message */}
                        <div className="flex-1 flex flex-col relative z-0 pr-[90px]">
                            <textarea
                                value={message} onChange={(e) => setMessage(e.target.value)}
                                maxLength={500} rows={5} cols={28} wrap="hard"
                                placeholder="Leave a message, ask me anything, or draw me something cute in the stamp..."
                                className="w-full flex-1 bg-transparent font-script text-lg leading-relaxed placeholder:text-black/30 placeholder:font-mono placeholder:text-sm focus:outline-none resize-none"
                                onClick={stopProp}
                            />
                        </div>

                        {/* Bottom-right: name, url */}
                        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 text-right z-0 max-w-[55%]">
                            <div className="space-y-1">
                                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={100} placeholder="Your name" className="w-full bg-transparent font-script text-lg text-right focus:outline-none placeholder:text-black/30" onClick={stopProp} />
                                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} maxLength={200} placeholder="URL (optional)" className="w-full bg-transparent font-mono text-xs text-right focus:outline-none placeholder:text-black/30" onClick={stopProp} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    maxLength={200}
                                    placeholder="Email (optional)"
                                    className="w-full bg-transparent font-mono text-xs text-right focus:outline-none placeholder:text-black/30"
                                    onClick={stopProp}
                                    onFocus={() => showSpriteMsg("Leave your email so I can reply to you! It won't be public.", 5000)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                    <div className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-neutral-200 bg-white">
                        <button type="button" onClick={() => setStyleIndex((styleIndex - 1 + NOTECARD_IDS.length) % NOTECARD_IDS.length)} className="text-neutral-400 hover:text-neutral-800 text-sm">&lsaquo;</button>
                        <span className="font-mono text-xs text-neutral-500 select-none">Style</span>
                        <button type="button" onClick={() => setStyleIndex((styleIndex + 1) % NOTECARD_IDS.length)} className="text-neutral-400 hover:text-neutral-800 text-sm">&rsaquo;</button>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setDrawingMode(!drawingMode); setPlacingStamp(false); }}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 border transition-colors font-mono text-sm ${drawingMode ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}
                    >
                        &#9998; Draw
                    </button>
                    <button type="submit" disabled={status === 'submitting'} className="flex items-center gap-1.5 rounded-full px-4 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-50 transition-colors font-mono text-sm">
                        {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Sent!' : '\u25B6 Submit'}
                    </button>
                </div>

                {/* Drawing toolbar */}
                <AnimatePresence>
                    {drawingMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 px-4">
                                <div className="flex items-center gap-1.5">
                                    {CARD_DRAW_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setDrawColor(c)}
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${drawColor === c ? 'border-neutral-800 scale-110' : 'border-neutral-300 hover:border-neutral-500'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-neutral-400">Size</span>
                                    <input type="range" min={1} max={8} value={drawSize} onChange={e => setDrawSize(Number(e.target.value))} className="w-16 accent-neutral-500" />
                                </div>
                                <button type="button" onClick={undoCardDraw} disabled={cardDrawHistory.length <= 1} className="text-xs font-mono text-neutral-400 hover:text-neutral-700 disabled:opacity-30">
                                    &#x21A9; Undo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            <StampDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onDone={(dataUrl) => { setStampDataUrl(dataUrl); setDrawerOpen(false); }} initialDataUrl={stampDataUrl || undefined} />

            {/* Global stamper following mouse */}
            {placingStamp && globalMousePos && (
                <div className="fixed z-[9999] pointer-events-none" style={{ left: globalMousePos.x, top: globalMousePos.y, transform: 'translate(-50%, -80%)' }}>
                    <img src="/images/stamper.png" alt="" className="w-20 h-auto brightness-125" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }} />
                </div>
            )}

            <style>{`
                @keyframes stamper-down {
                    0% { transform: translate(-50%, -200%) scale(1.3); opacity: 1; }
                    35% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
                    40% { transform: translate(-50%, -55%) scale(0.98); opacity: 1; }
                    50% { transform: translate(-50%, -55%) scale(0.98); opacity: 1; }
                    100% { transform: translate(-50%, -300%) scale(1.5); opacity: 0; }
                }
                .stamper-slam { animation: stamper-down 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes stamp-pop {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(0.95); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                .stamp-appear { animation: stamp-pop 0.3s ease-out forwards; }
                @keyframes stamper-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .animate-stamper-bounce { animation: stamper-bounce 1.5s ease-in-out infinite; }
            `}</style>
        </>
    );
}
