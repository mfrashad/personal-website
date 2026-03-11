import { useState, useRef, useCallback, useEffect } from 'react';
import PhoneMockup from './PhoneMockup';

interface SerializedContentPiece {
    id: string;
    title: string;
    location?: string;
    date: string;
    type: string;
    platform: string;
    url?: string;
    metrics: {
        views: number;
        likes: number;
        comments: number;
        saves?: number;
        shares?: number;
        newFollowers?: number;
    };
    description?: string;
    brand?: string;
}

interface ContentSectionProps {
    pieces: SerializedContentPiece[];
    imageManifest: Record<string, { content: string; analytics: string }>;
    categoryLabel: string;
    categoryDescription: string;
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'K';
    return n.toLocaleString();
}

export default function ContentSection({ pieces, imageManifest, categoryLabel, categoryDescription, reverse = false }: ContentSectionProps & { reverse?: boolean }) {
    const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, scrollLeft: 0 });
    const hasDragged = useRef(false);
    const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

    const duplicated = [...pieces, ...pieces];

    const pauseAutoScroll = useCallback(() => {
        setIsUserInteracting(true);
        clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => setIsUserInteracting(false), 3000);
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        hasDragged.current = false;
        dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current.scrollLeft };
        pauseAutoScroll();
    }, [pauseAutoScroll]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        const dx = e.clientX - dragStart.current.x;
        if (Math.abs(dx) > 3) hasDragged.current = true;
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback(() => {
        pauseAutoScroll();
    }, [pauseAutoScroll]);

    // Auto-scroll animation
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || isUserInteracting) return;

        const speed = reverse ? -0.5 : 0.5;
        let animId: number;

        const step = () => {
            el.scrollLeft += speed;
            // Loop: if scrolled past half, reset
            const halfWidth = el.scrollWidth / 2;
            if (!reverse && el.scrollLeft >= halfWidth) {
                el.scrollLeft -= halfWidth;
            } else if (reverse && el.scrollLeft <= 0) {
                el.scrollLeft += halfWidth;
            }
            animId = requestAnimationFrame(step);
        };

        // Start reverse sections from the middle
        if (reverse && el.scrollLeft === 0) {
            el.scrollLeft = el.scrollWidth / 2;
        }

        animId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animId);
    }, [isUserInteracting, reverse]);

    return (
        <section className="mb-12">
            <div className="mb-3 sm:mb-4">
                <h2 className="text-base sm:text-xl font-bold text-neutral-800">{categoryLabel}</h2>
                <p className="text-xs sm:text-sm text-neutral-500">{categoryDescription}</p>
            </div>

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
                    onWheel={handleWheel}
                >
                    {duplicated.map((piece, i) => {
                        const images = imageManifest[piece.id];
                        const key = `${piece.id}-${i}`;
                        const isShowingAnalytics = showAnalytics === key;

                        return (
                            <div
                                key={key}
                                className="flex-shrink-0 mx-4 w-[230px] group"
                            >
                                <div
                                    className="cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
                                    onClick={() => {
                                        if (hasDragged.current) return;
                                        setShowAnalytics(isShowingAnalytics ? null : key);
                                    }}
                                >
                                    {images ? (
                                        <PhoneMockup
                                            src={isShowingAnalytics ? images.analytics : images.content}
                                            alt={piece.title}
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className="aspect-[9/16] bg-neutral-100 rounded-[1.5rem] border-[4px] border-neutral-800 flex items-center justify-center">
                                            <span className="text-neutral-400 text-[10px]">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2.5 px-0.5">
                                    <h3 className="font-semibold text-sm text-neutral-900 truncate">
                                        {piece.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                                        <span>{formatNumber(piece.metrics.views)} views</span>
                                        <span>{formatNumber(piece.metrics.likes)} likes</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
