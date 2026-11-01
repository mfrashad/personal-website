import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PhoneMockup from './PhoneMockup';

type Platform = 'tiktok' | 'instagram' | 'youtube';

// Narrow by design — see the note on the matching interface in ContentPage.tsx.
interface SerializedPost {
    platform: Platform;
    url?: string;
    metrics: {
        views: number;
        likes: number;
    };
}

export interface SerializedContentPiece extends SerializedPost {
    id: string;
    title: string;
    brand?: string;
    /** One badge per collaborating brand; src is absent when we have no logo. */
    brands?: { name: string; src?: string; scale?: number }[];
    tags?: string[];
    crossPosts?: SerializedPost[];
}

type ImageManifest = Record<string, { content: string; analytics: string }>;

interface ContentSectionProps {
    pieces: SerializedContentPiece[];
    imageManifest: ImageManifest;
    categoryLabel: string;
    categoryDescription: string;
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'K';
    return n.toLocaleString();
}

const PLATFORM_LABEL: Record<Platform, string> = { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube' };

function PlatformIcon({ platform, className = '' }: { platform: Platform; className?: string }) {
    if (platform === 'instagram') {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
            </svg>
        );
    }
    if (platform === 'tiktok') {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
            </svg>
        );
    }
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.1V8.9L15.5 12z" />
        </svg>
    );
}

function ViewsIcon({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4.8v14.4a1 1 0 001.5.86l11.6-7.2a1 1 0 000-1.72L8.5 3.94A1 1 0 007 4.8z" />
        </svg>
    );
}

function LikesIcon({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3 1.7-1.8 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
        </svg>
    );
}

// Topic tag colours (light chips). Inline styles: this site's Tailwind theme replaces the default palette.
const TAG_STYLE: Record<string, { bg: string; fg: string; ring: string }> = {
    Environmental: { bg: '#ecfdf5', fg: '#047857', ring: '#a7f3d0' },
    'AI Safety': { bg: '#f5f3ff', fg: '#6d28d9', ring: '#ddd6fe' },
    'Online Safety': { bg: '#f0f9ff', fg: '#0369a1', ring: '#bae6fd' },
    Feminism: { bg: '#fdf2f8', fg: '#be185d', ring: '#fbcfe8' },
    'Human Rights': { bg: '#fffbeb', fg: '#92400e', ring: '#fde68a' },
};
const DEFAULT_TAG = { bg: '#f8fafc', fg: '#475569', ring: '#e2e8f0' };

/** Brand logos and topic tags, shown as small chips under the phone (and in the modal). */
function Badges({
    piece,
    size = 'sm',
    showBrands = true,
}: {
    piece: SerializedContentPiece;
    size?: 'sm' | 'lg';
    showBrands?: boolean;
}) {
    const brands = showBrands ? piece.brands ?? [] : [];
    const tags = piece.tags ?? [];
    if (!brands.length && !tags.length) return null;
    const lg = size === 'lg';
    return (
        <div className={`flex flex-wrap items-center gap-1.5 ${lg ? 'justify-center' : ''}`}>
            {brands.map((b) =>
                b.src ? (
                    <span
                        key={b.name}
                        title={`with ${b.name}`}
                        className={`inline-flex items-center rounded-full bg-white ring-1 ring-neutral-200 ${lg ? 'h-8 px-3' : 'h-6 px-2'}`}
                    >
                        <img src={b.src} alt={b.name} loading="lazy" className={`w-auto object-contain ${lg ? 'h-4 max-w-[96px]' : 'h-3.5 max-w-[64px]'}`} />
                    </span>
                ) : (
                    <span
                        key={b.name}
                        title={`with ${b.name}`}
                        className={`inline-flex items-center rounded-full bg-white font-semibold text-neutral-700 ring-1 ring-neutral-200 ${lg ? 'h-8 px-3 text-xs' : 'h-6 px-2 text-[10px]'}`}
                    >
                        {b.name}
                    </span>
                )
            )}
            {tags.map((t) => (
                <span
                    key={t}
                    className={`inline-flex items-center rounded-full font-medium ${lg ? 'h-8 px-3 text-xs' : 'h-6 px-2 text-[10px]'}`}
                    style={{
                        backgroundColor: (TAG_STYLE[t] ?? DEFAULT_TAG).bg,
                        color: (TAG_STYLE[t] ?? DEFAULT_TAG).fg,
                        boxShadow: `inset 0 0 0 1px ${(TAG_STYLE[t] ?? DEFAULT_TAG).ring}`,
                    }}
                >
                    {t}
                </span>
            ))}
        </div>
    );
}

/**
 * Collaborating brands' logos, sized like the "Brands I've partnered with" grid,
 * sitting right on top of the phone. Brands without a logo fall back to their name.
 */
function BrandLogoRow({ brands }: { brands: NonNullable<SerializedContentPiece['brands']> }) {
    const pair = brands.length > 1;
    return (
        <div className="flex h-10 md:h-12 items-center justify-center gap-2 px-6">
            {brands.map((b, i) => (
                <span key={b.name} className="flex h-full min-w-0 items-center gap-2">
                    {i > 0 && <span className="text-xs text-neutral-300" aria-hidden="true">×</span>}
                    {b.src ? (
                        <img
                            src={b.src}
                            alt={b.name}
                            title={`with ${b.name}`}
                            loading="lazy"
                            className="h-full w-auto object-contain"
                            style={{ maxWidth: `min(${(pair ? 80 : 100) * (b.scale ?? 1)}px, 100%)` }}
                        />
                    ) : (
                        <span title={`with ${b.name}`} className="whitespace-nowrap text-sm font-bold text-neutral-700">
                            {b.name}
                        </span>
                    )}
                </span>
            ))}
        </div>
    );
}

function PlatformSwitch({
    posts,
    active,
    onChange,
    size = 'sm',
}: {
    posts: SerializedPost[];
    active: Platform;
    onChange: (p: Platform) => void;
    size?: 'sm' | 'lg';
}) {
    const interactive = posts.length > 1;
    const lg = size === 'lg';
    return (
        <div
            className={`flex items-center gap-0.5 rounded-full bg-white p-0.5 shadow-md ring-1 ring-neutral-200`}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {posts.map((p) => {
                const isActive = p.platform === active;
                return (
                    <button
                        key={p.platform}
                        type="button"
                        disabled={!interactive}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(p.platform);
                        }}
                        aria-pressed={isActive}
                        aria-label={`Show ${PLATFORM_LABEL[p.platform]} post`}
                        title={interactive ? `Show the ${PLATFORM_LABEL[p.platform]} post` : `Posted on ${PLATFORM_LABEL[p.platform]}`}
                        className={`flex items-center justify-center gap-1.5 rounded-full transition-colors ${
                            lg ? 'h-8 px-3 text-xs font-medium' : 'h-6 w-6'
                        } ${isActive ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-800'} ${
                            interactive ? 'cursor-pointer' : 'cursor-default'
                        }`}
                    >
                        <PlatformIcon platform={p.platform} className={lg ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                        {lg && <span>{PLATFORM_LABEL[p.platform]}</span>}
                    </button>
                );
            })}
        </div>
    );
}

/** Full-size view of one piece: post and insights side by side, with the platform switch. */
function ContentModal({
    piece,
    imageManifest,
    active,
    setActive,
    onClose,
}: {
    piece: SerializedContentPiece;
    imageManifest: ImageManifest;
    active: Platform;
    setActive: (p: Platform) => void;
    onClose: () => void;
}) {
    const posts: SerializedPost[] = [piece, ...(piece.crossPosts ?? [])];
    const post = posts.find((p) => p.platform === active) ?? piece;
    const images = active === piece.platform ? imageManifest[piece.id] : imageManifest[`${piece.id}@${active}`];

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6"
            onClick={onClose}
            // Portal events still bubble through the React tree: keep them away from the carousel's drag handlers
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={piece.title}
        >
            <div
                className="relative flex max-h-full w-full max-w-[860px] flex-col overflow-y-auto rounded-2xl bg-white p-4 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
                <div className="pr-10">
                    <h3 className="text-base sm:text-xl font-bold text-neutral-900">{piece.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-neutral-500">
                        <span className="inline-flex items-center gap-1" title="Views">
                            <ViewsIcon className="h-3.5 w-3.5" />
                            {post.metrics.views.toLocaleString()}
                            <span className="sr-only"> views</span>
                        </span>
                        <span className="inline-flex items-center gap-1" title="Likes">
                            <LikesIcon className="h-3.5 w-3.5" />
                            {post.metrics.likes.toLocaleString()}
                            <span className="sr-only"> likes</span>
                        </span>
                        {post.url && (
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900">
                                Open on {PLATFORM_LABEL[active]}
                            </a>
                        )}
                    </div>
                </div>
                <div className="mt-3">
                    <Badges piece={piece} size="lg" />
                </div>
                <div className="mt-3 flex justify-center">
                    <PlatformSwitch posts={posts} active={active} onChange={setActive} size="lg" />
                </div>
                {images ? (
                    <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:justify-center sm:gap-8 pb-1">
                        {[
                            ['Post', images.content],
                            ['Insights', images.analytics],
                        ].map(([label, src]) => (
                            <figure
                                key={label}
                                className="flex-shrink-0 snap-center"
                                // Fit two phones (≈ 9:19.5) inside the viewport height without scrolling
                                style={{ width: 'min(340px, 78vw, calc((100dvh - 290px) * 0.46))' }}
                            >
                                <PhoneMockup src={src} alt={`${piece.title}: ${label} on ${PLATFORM_LABEL[active]}`} className="w-full" />
                                <figcaption className="mt-2 text-center text-xs uppercase tracking-widest text-neutral-400">{label}</figcaption>
                            </figure>
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 text-center text-sm text-neutral-400">No screenshots for this post yet.</p>
                )}
            </div>
        </div>,
        document.body
    );
}

function ContentCard({
    piece,
    imageManifest,
    wasDrag,
    brandSlot,
}: {
    piece: SerializedContentPiece;
    imageManifest: ImageManifest;
    wasDrag: () => boolean;
    /** Reserve the logo row above the phone (true when any card in the row has brands), so phones stay aligned. */
    brandSlot: boolean;
}) {
    const posts: SerializedPost[] = [piece, ...(piece.crossPosts ?? [])];
    const [active, setActive] = useState<Platform>(piece.platform);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const closeZoom = useCallback(() => setZoomed(false), []);

    const post = posts.find((p) => p.platform === active) ?? piece;
    const images = active === piece.platform ? imageManifest[piece.id] : imageManifest[`${piece.id}@${active}`];

    return (
        <div className="flex-shrink-0 mx-4 w-[230px] group">
            {brandSlot && (
                <div className="mb-1">{piece.brands?.length ? <BrandLogoRow brands={piece.brands} /> : <div className="h-10 md:h-12" />}</div>
            )}
            <div className="relative">
                <div
                    className="cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
                    onClick={() => {
                        if (wasDrag()) return;
                        setShowAnalytics((v) => !v);
                    }}
                    title={showAnalytics ? 'Show the post' : 'Show insights'}
                >
                    {images ? (
                        <PhoneMockup
                            src={showAnalytics ? images.analytics : images.content}
                            alt={`${piece.title} on ${PLATFORM_LABEL[active]}${showAnalytics ? ' (insights)' : ''}`}
                            className="w-full"
                        />
                    ) : (
                        <div className="aspect-[9/16] bg-neutral-100 rounded-[1.5rem] border-[4px] border-neutral-800 flex items-center justify-center">
                            <span className="text-neutral-400 text-[10px]">No image</span>
                        </div>
                    )}
                </div>

                {/* Zoom: opens post + insights at full size */}
                {images && (
                    <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoomed(true);
                        }}
                        aria-label={`Enlarge ${piece.title}`}
                        title="View larger"
                        className="absolute -top-2 -right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md ring-1 ring-neutral-200 transition-colors hover:bg-neutral-900 hover:text-white"
                    >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                            <circle cx="10.5" cy="10.5" r="6.5" />
                            <path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" />
                        </svg>
                    </button>
                )}

                {/* Platform switch: one button per platform the piece was posted on */}
                <div className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2">
                    <PlatformSwitch posts={posts} active={active} onChange={setActive} />
                </div>
            </div>
            <div className={`${piece.tags?.length ? 'mt-3.5' : 'mt-4'} px-0.5`}>
                {piece.tags?.length ? (
                    <div className="mb-1">
                        <Badges piece={piece} showBrands={false} />
                    </div>
                ) : null}
                <h3 className="font-semibold text-sm text-neutral-900 truncate" title={piece.title}>
                    {piece.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1" title={`${post.metrics.views.toLocaleString()} views`}>
                        <ViewsIcon className="h-3 w-3" />
                        {formatNumber(post.metrics.views)}
                        <span className="sr-only"> views</span>
                    </span>
                    <span className="inline-flex items-center gap-1" title={`${post.metrics.likes.toLocaleString()} likes`}>
                        <LikesIcon className="h-3 w-3" />
                        {formatNumber(post.metrics.likes)}
                        <span className="sr-only"> likes</span>
                    </span>
                    {post.url && (
                        <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseDown={(e) => e.stopPropagation()}
                            className="ml-auto text-neutral-400 hover:text-neutral-800 transition-colors"
                            aria-label={`Open on ${PLATFORM_LABEL[active]}`}
                            title={`Open on ${PLATFORM_LABEL[active]}`}
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
            {zoomed && (
                <ContentModal piece={piece} imageManifest={imageManifest} active={active} setActive={setActive} onClose={closeZoom} />
            )}
        </div>
    );
}

export default function ContentSection({ pieces, imageManifest, categoryLabel, categoryDescription, reverse = false }: ContentSectionProps & { reverse?: boolean }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, scrollLeft: 0 });
    const hasDragged = useRef(false);
    const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

    const duplicated = [...pieces, ...pieces];
    const brandSlot = pieces.some((p) => p.brands?.length);

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

    const wasDrag = useCallback(() => hasDragged.current, []);

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
                <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-white to-transparent z-30 pointer-events-none" />
                <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white to-transparent z-30 pointer-events-none" />
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none pt-3"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={pauseAutoScroll}
                    onTouchStart={pauseAutoScroll}
                >
                    {duplicated.map((piece, i) => (
                        <ContentCard key={`${piece.id}-${i}`} piece={piece} imageManifest={imageManifest} wasDrag={wasDrag} brandSlot={brandSlot} />
                    ))}
                </div>
            </div>
        </section>
    );
}
