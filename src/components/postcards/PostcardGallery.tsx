import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PostOfficeStamp from './PostOfficeStamp';

interface Postcard {
    id: string;
    author: string;
    body: string;
    drawingDataUrl: string;
    country?: string;
    websiteUrl?: string;
    createdAt: number;
    paperColor: string;
    penColor: string;
    notecardId?: number;
    stampX?: number;
    stampY?: number;
}

interface PostcardGalleryProps {
    initialPostcards?: Postcard[];
}

const NOTECARD_IDS = [1, 6, 8, 10, 11, 12, 13, 16, 18, 26, 29, 31];

function getNotecardBg(postcard: Postcard) {
    if (postcard.notecardId) return `/images/notecards/notecard${postcard.notecardId}.webp`;
    const hash = postcard.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `/images/notecards/notecard${NOTECARD_IDS[hash % NOTECARD_IDS.length]}.webp`;
}

function getRotation(id: string) {
    const hash = id.charCodeAt(0) + (id.charCodeAt(1) || 0) + (id.charCodeAt(2) || 0);
    return (((hash % 5) - 2) * 1.2).toFixed(1);
}

function getTranslateX(id: string) {
    const hash = (id.charCodeAt(3) || 0) + (id.charCodeAt(4) || 0);
    return (((hash % 7) - 3) * 1.5).toFixed(1);
}

function formatDate(ts: number) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STAMP_BORDER = {
    background: 'radial-gradient(transparent 0px, transparent 4px, white 4px, white)',
    backgroundSize: '10px 10px',
    backgroundPosition: '-5px -5px',
};

function getCardFontSize(len: number) {
    if (len < 80) return 'text-sm sm:text-base';
    if (len < 150) return 'text-xs sm:text-sm';
    if (len < 250) return 'text-[11px] sm:text-xs';
    return 'text-[10px] sm:text-[11px]';
}

function PostcardCard({ postcard, onClick }: { postcard: Postcard; onClick: () => void }) {
    const rotation = getRotation(postcard.id);
    const translateX = getTranslateX(postcard.id);
    const bg = getNotecardBg(postcard);
    const stampRotation = (postcard.id.charCodeAt(0) % 30) - 15;

    return (
        <button
            onClick={onClick}
            className="group text-left focus:outline-none transition-transform duration-200 hover:-translate-y-2 hover:scale-[1.02]"
            style={{ transform: `rotate(${rotation}deg) translateX(${translateX}px)` }}
        >
            <div
                className="relative w-[280px] sm:w-[340px] text-[#2c3e6b]"
                style={{
                    aspectRatio: '4 / 3',
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    padding: 'clamp(20px, 4vw, 36px)',
                }}
            >
                {/* Top-right: drawn stamp */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                    <div className="inline-block p-[4px] shrink-0" style={STAMP_BORDER}>
                        <img
                            src={postcard.drawingDataUrl}
                            alt=""
                            className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                </div>

                {/* Post office stamp at user's position */}
                <div
                    className="absolute z-10"
                    style={postcard.stampX != null && postcard.stampY != null
                        ? { left: `${postcard.stampX}%`, top: `${postcard.stampY}%`, transform: 'translate(-50%, -50%) scale(0.7)' }
                        : { top: '35%', right: '4%', transform: 'scale(0.7)', transformOrigin: 'top right' }
                    }
                >
                    <PostOfficeStamp
                        country={postcard.country}
                        date={postcard.createdAt}
                        rotation={stampRotation}
                    />
                </div>

                {/* Message — left side, doesn't overlap stamp */}
                <pre className={`${getCardFontSize(postcard.body.length)} leading-relaxed whitespace-pre-wrap font-script line-clamp-5 pr-[80px] sm:pr-[90px]`}>
                    {postcard.body}
                </pre>

                {/* Bottom-right: author + date */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 text-right">
                    <p className="text-xs sm:text-sm font-semibold font-script">
                        {postcard.author}
                    </p>
                    <p className="text-[9px] text-black/40 font-mono">{formatDate(postcard.createdAt)}</p>
                </div>
            </div>
        </button>
    );
}

export default function PostcardGallery({ initialPostcards }: PostcardGalleryProps) {
    const [postcards, setPostcards] = useState<Postcard[]>(initialPostcards || []);
    const [selected, setSelected] = useState<Postcard | null>(null);
    const [loading, setLoading] = useState(!initialPostcards);
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this postcard?')) return;
        await fetch(`/api/postcards?id=${id}`, { method: 'DELETE' });
        setSelected(null);
        refresh();
    };

    const refresh = () => {
        fetch('/api/postcards?limit=100')
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setPostcards(data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { if (!initialPostcards) refresh(); }, []);
    useEffect(() => {
        const handler = () => refresh();
        window.addEventListener('postcards-refresh', handler);
        return () => window.removeEventListener('postcards-refresh', handler);
    }, []);
    useEffect(() => {
        if (!selected) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
    }, [selected]);

    if (loading) return <div className="text-center py-12 text-neutral-500 font-mono text-sm">Loading postcards...</div>;
    if (postcards.length === 0) return <div className="text-center py-12 text-neutral-500 font-mono text-sm">No postcards yet. Be the first to send one!</div>;

    return (
        <>
            <p className="text-center font-mono text-xs text-neutral-400 mb-6">
                {postcards.length} postcard{postcards.length !== 1 ? 's' : ''} received
            </p>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 overflow-hidden px-2">
                {postcards.map((postcard) => (
                    <PostcardCard key={postcard.id} postcard={postcard} onClick={() => setSelected(postcard)} />
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            className="relative w-full max-w-[520px] text-[#2c3e6b]"
                            style={{
                                aspectRatio: '4 / 3',
                                backgroundImage: `url(${getNotecardBg(selected)})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                padding: 'clamp(28px, 5vw, 48px)',
                            }}
                            initial={{ scale: 0.9, opacity: 0, rotate: Number(getRotation(selected.id)) }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                                {isDev && (
                                    <button
                                        onClick={() => handleDelete(selected.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-mono text-xs transition-colors"
                                        title="Delete (dev only)"
                                    >
                                        &times;
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelected(null)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-black/50 font-mono text-sm"
                                >
                                    x
                                </button>
                            </div>

                            {/* Top-right: drawn stamp */}
                            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
                                <div className="inline-block p-[5px] shrink-0" style={STAMP_BORDER}>
                                    <img
                                        src={selected.drawingDataUrl}
                                        alt={`Stamp by ${selected.author}`}
                                        className="w-[66px] h-[66px] object-cover"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                            </div>

                            {/* Post office stamp at user's position */}
                            <div
                                className="absolute z-10"
                                style={selected.stampX != null && selected.stampY != null
                                    ? { left: `${selected.stampX}%`, top: `${selected.stampY}%`, transform: 'translate(-50%, -50%)' }
                                    : { top: '35%', right: '6%', transformOrigin: 'top right' }
                                }
                            >
                                <PostOfficeStamp
                                    country={selected.country}
                                    date={selected.createdAt}
                                    rotation={((selected.id.charCodeAt(0) % 30) - 15)}
                                />
                            </div>

                            {/* Message — left side */}
                            <pre className="text-lg leading-relaxed whitespace-pre-wrap font-script pr-[110px] overflow-y-auto max-h-[70%]">
                                {selected.body}
                            </pre>

                            {/* Bottom-right: author details */}
                            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-right">
                                <div className="font-mono text-[10px] text-black/40 mb-0.5">From:</div>
                                <p className="text-lg font-semibold font-script">
                                    {selected.websiteUrl ? (
                                        <a href={selected.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {selected.author} &#x2197;
                                        </a>
                                    ) : selected.author}
                                </p>
                                {selected.country && (
                                    <p className="text-[10px] text-black/40 font-mono mt-0.5">{selected.country}</p>
                                )}
                                <div className="font-mono text-[10px] text-black/40 mt-2 mb-0.5">Date:</div>
                                <p className="text-sm font-script">
                                    {new Date(selected.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
