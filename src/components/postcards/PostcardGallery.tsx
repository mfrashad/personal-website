import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PostOfficeStamp from './PostOfficeStamp';

interface PostcardModeration {
    hidden?: boolean;
    hideMessage?: boolean;
    hideAuthor?: boolean;
    censorWords?: string[];
}

interface Postcard {
    id: string;
    author: string;
    body: string;
    drawingDataUrl: string;
    cardDrawingDataUrl?: string;
    country?: string;
    websiteUrl?: string;
    createdAt: number;
    paperColor: string;
    penColor: string;
    notecardId?: number;
    stampX?: number;
    stampY?: number;
    moderation?: PostcardModeration;
}

function censorText(text: string, words: string[]): string {
    let result = text;
    for (const word of words) {
        const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        result = result.replace(regex, (m) => '\u2588'.repeat(m.length));
    }
    return result;
}

function getDisplayBody(postcard: Postcard, isDev: boolean): string {
    if (isDev) return postcard.body; // admin sees original
    if (postcard.moderation?.hideMessage) return '';
    if (postcard.moderation?.censorWords?.length) return censorText(postcard.body, postcard.moderation.censorWords);
    return postcard.body;
}

function getDisplayAuthor(postcard: Postcard, isDev: boolean): string {
    if (isDev) return postcard.author; // admin sees original
    if (postcard.moderation?.hideAuthor) return 'Anonymous';
    return postcard.author;
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

function PostcardCard({ postcard, onClick, isDev }: { postcard: Postcard; onClick: () => void; isDev: boolean }) {
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
                {/* Card drawing overlay */}
                {postcard.cardDrawingDataUrl && (
                    <img
                        src={postcard.cardDrawingDataUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                    />
                )}

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
                <pre className={`${getCardFontSize(postcard.body.length)} leading-relaxed whitespace-pre-wrap font-script line-clamp-5 pr-[80px] sm:pr-[90px] ${postcard.moderation?.hideMessage && !isDev ? 'blur-sm select-none' : ''}`}>
                    {getDisplayBody(postcard, isDev)}
                </pre>

                {/* Bottom-right: author + date */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 text-right">
                    <p className={`text-xs sm:text-sm font-semibold font-script ${postcard.moderation?.hideAuthor && !isDev ? 'blur-sm select-none' : ''}`}>
                        {getDisplayAuthor(postcard, isDev)}
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
    const [textSelection, setTextSelection] = useState('');
    const [previewPublic, setPreviewPublic] = useState(false);
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
            {/* Stamp gallery */}
            <p className="text-center font-mono text-xs text-neutral-400 mb-4">
                {postcards.filter(p => isDev || !p.moderation?.hidden).length} stamp drawing{postcards.filter(p => isDev || !p.moderation?.hidden).length !== 1 ? 's' : ''} collected
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-10 px-4 max-w-lg mx-auto">
                {postcards.filter(p => isDev || !p.moderation?.hidden).map((p) => (
                    <button
                        key={`stamp-${p.id}`}
                        onClick={() => setSelected(p)}
                        className={`group ${p.moderation?.hidden ? 'opacity-30' : ''}`}
                        title={getDisplayAuthor(p, isDev)}
                    >
                        <div
                            className="inline-block p-[3px] transition-transform hover:scale-110"
                            style={STAMP_BORDER}
                        >
                            <img
                                src={p.drawingDataUrl}
                                alt={`Stamp by ${getDisplayAuthor(p, isDev)}`}
                                className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] object-cover"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>
                    </button>
                ))}
            </div>

            <p className="text-center font-mono text-xs text-neutral-400 mb-6">
                {postcards.filter(p => isDev || !p.moderation?.hidden).length} postcard{postcards.filter(p => isDev || !p.moderation?.hidden).length !== 1 ? 's' : ''} received
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-14 sm:gap-x-16 lg:gap-x-20 gap-y-14 sm:gap-y-16 justify-items-center -mx-4 sm:-mx-8 lg:-mx-16">
                {postcards.filter(p => isDev || !p.moderation?.hidden).map((postcard) => (
                    <PostcardCard key={postcard.id} postcard={postcard} onClick={() => setSelected(postcard)} isDev={isDev} />
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
                        onClick={() => { setSelected(null); setPreviewPublic(false); setTextSelection(''); }}
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
                            {/* Card drawing overlay */}
                            {selected.cardDrawingDataUrl && (
                                <img
                                    src={selected.cardDrawingDataUrl}
                                    alt=""
                                    className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                                />
                            )}

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
                                    onClick={() => { setSelected(null); setPreviewPublic(false); setTextSelection(''); }}
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
                            {(() => { const asAdmin = isDev && !previewPublic; return (
                            <pre
                                className={`text-lg leading-relaxed whitespace-pre-wrap font-script pr-[110px] overflow-y-auto max-h-[70%] ${selected.moderation?.hideMessage && !asAdmin ? 'blur-md select-none' : ''}`}
                                onMouseUp={() => {
                                    if (!isDev || previewPublic) return;
                                    const sel = window.getSelection()?.toString().trim();
                                    setTextSelection(sel || '');
                                }}
                            >
                                {getDisplayBody(selected, asAdmin)}
                            </pre>
                            ); })()}

                            {/* Bottom-right: author details */}
                            {(() => { const asAdmin = isDev && !previewPublic; return (
                            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-right">
                                <div className="font-mono text-[10px] text-black/40 mb-0.5">From:</div>
                                <p className={`text-lg font-semibold font-script ${selected.moderation?.hideAuthor && !asAdmin ? 'blur-md select-none' : ''}`}>
                                    {selected.websiteUrl && !(selected.moderation?.hideAuthor && !asAdmin) ? (
                                        <a href={selected.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {getDisplayAuthor(selected, asAdmin)} &#x2197;
                                        </a>
                                    ) : getDisplayAuthor(selected, asAdmin)}
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
                            ); })()}
                        </motion.div>

                        {/* Admin moderation panel (dev only) */}
                        {isDev && selected && (
                            <motion.div
                                className="relative mt-4 w-full max-w-[520px] bg-neutral-900 rounded-xl p-4 text-white"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Admin Moderation</p>
                                    <button
                                        onClick={() => setPreviewPublic(!previewPublic)}
                                        className={`px-2.5 py-1 rounded-md font-mono text-[10px] transition-colors ${previewPublic ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white/40 hover:text-white/60'}`}
                                    >
                                        {previewPublic ? '👁 Public View' : 'Preview as Public'}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={async () => {
                                            const mod = { ...selected.moderation, hidden: !selected.moderation?.hidden };
                                            await fetch('/api/postcards', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, moderation: mod }) });
                                            setSelected({ ...selected, moderation: mod });
                                            refresh();
                                        }}
                                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${selected.moderation?.hidden ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                    >
                                        {selected.moderation?.hidden ? 'Hidden' : 'Hide Card'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const mod = { ...selected.moderation, hideMessage: !selected.moderation?.hideMessage };
                                            await fetch('/api/postcards', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, moderation: mod }) });
                                            setSelected({ ...selected, moderation: mod });
                                            refresh();
                                        }}
                                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${selected.moderation?.hideMessage ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                    >
                                        {selected.moderation?.hideMessage ? 'Message Hidden' : 'Hide Message'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const mod = { ...selected.moderation, hideAuthor: !selected.moderation?.hideAuthor };
                                            await fetch('/api/postcards', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, moderation: mod }) });
                                            setSelected({ ...selected, moderation: mod });
                                            refresh();
                                        }}
                                        className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${selected.moderation?.hideAuthor ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                    >
                                        {selected.moderation?.hideAuthor ? 'Author Hidden' : 'Hide Author'}
                                    </button>
                                    {textSelection && (
                                        <button
                                            onClick={async () => {
                                                const existing = selected.moderation?.censorWords || [];
                                                if (existing.includes(textSelection)) return;
                                                const censorWords = [...existing, textSelection];
                                                const mod = { ...selected.moderation, censorWords };
                                                await fetch('/api/postcards', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, moderation: mod }) });
                                                setSelected({ ...selected, moderation: mod });
                                                setTextSelection('');
                                                window.getSelection()?.removeAllRanges();
                                                refresh();
                                            }}
                                            className="px-3 py-1.5 rounded-lg font-mono text-xs bg-orange-500/30 text-orange-300 hover:bg-orange-500/40 transition-colors"
                                        >
                                            Censor "{textSelection.length > 20 ? textSelection.slice(0, 20) + '...' : textSelection}"
                                        </button>
                                    )}
                                </div>
                                {selected.moderation?.censorWords?.length ? (
                                    <div className="mt-3">
                                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Censored phrases <span className="normal-case tracking-normal text-white/25">(click to remove)</span></p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.moderation.censorWords.map((word, i) => (
                                                <button
                                                    key={i}
                                                    onClick={async () => {
                                                        const censorWords = selected.moderation!.censorWords!.filter((_, j) => j !== i);
                                                        const mod = { ...selected.moderation, censorWords: censorWords.length ? censorWords : undefined };
                                                        await fetch('/api/postcards', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected.id, moderation: mod }) });
                                                        setSelected({ ...selected, moderation: mod });
                                                        refresh();
                                                    }}
                                                    className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-[11px] hover:bg-red-500/30 hover:text-red-300 transition-colors"
                                                >
                                                    {word} &times;
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {!textSelection && !selected.moderation?.censorWords?.length && (
                                    <p className="mt-2 font-mono text-[10px] text-white/25">Highlight text in the message above to censor it</p>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
