import { useState, useRef, useCallback, useEffect } from 'react';
import PhoneMockup from '../content/PhoneMockup';

interface SerializedContentPiece {
    id: string;
    title: string;
    type: string;
    metrics: { views: number; likes: number; comments: number };
}

interface ContentPreviewProps {
    piecesByCategory: Record<string, SerializedContentPiece[]>;
    categoryLabels: Record<string, string>;
    imageManifest: Record<string, { content: string; analytics: string }>;
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'K';
    return n.toLocaleString();
}

export default function ContentPreview({ piecesByCategory, categoryLabels, imageManifest }: ContentPreviewProps) {
    const categoryOrder = ['personal-brand', 'cafe-hopping', 'experience', 'educational', 'products'];
    const availableCategories = categoryOrder.filter(c => piecesByCategory[c]?.length > 0);
    const [activeTab, setActiveTab] = useState('personal-brand');
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

    const pieces = piecesByCategory[activeTab] || [];
    const duplicated = [...pieces, ...pieces];

    const pauseAutoScroll = useCallback(() => {
        setIsUserInteracting(true);
        clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => setIsUserInteracting(false), 3000);
    }, []);

    // Reset scroll when tab changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
            setIsUserInteracting(false);
        }
    }, [activeTab]);

    // Auto-scroll
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || isUserInteracting || pieces.length < 3) return;

        let animId: number;
        const step = () => {
            el.scrollLeft += 0.5;
            const halfWidth = el.scrollWidth / 2;
            if (el.scrollLeft >= halfWidth) el.scrollLeft -= halfWidth;
            animId = requestAnimationFrame(step);
        };
        animId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animId);
    }, [isUserInteracting, activeTab, pieces.length]);

    // Drag to scroll
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, scrollLeft: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
        pauseAutoScroll();
    }, [pauseAutoScroll]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        const dx = e.clientX - dragStart.current.x;
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    return (
        <div>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
                {availableCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                            activeTab === cat
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                    >
                        {categoryLabels[cat]}
                    </button>
                ))}
            </div>

            {/* Phone mockup carousel */}
            <div className="relative">
                <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={pauseAutoScroll}
                    onTouchStart={pauseAutoScroll}
                >
                    {duplicated.map((piece, i) => {
                        const images = imageManifest[piece.id];
                        const key = `${piece.id}-${i}`;

                        return (
                            <div key={key} className="flex-shrink-0 mx-3 w-[180px] sm:w-[200px]">
                                <div className="transition-transform duration-300 hover:scale-[1.03]">
                                    {images ? (
                                        <PhoneMockup
                                            src={images.content}
                                            alt={piece.title}
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className="aspect-[9/16] bg-neutral-100 rounded-[1.5rem] border-[3px] border-neutral-800 flex items-center justify-center">
                                            <span className="text-neutral-400 text-[10px]">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 px-0.5">
                                    <h3 className="font-semibold text-xs text-neutral-900 truncate">{piece.title}</h3>
                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                                        <span>{formatNumber(piece.metrics.views)} views</span>
                                        <span>{formatNumber(piece.metrics.likes)} likes</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
