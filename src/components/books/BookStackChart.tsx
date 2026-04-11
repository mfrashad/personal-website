import { useState, useMemo, useRef } from 'react';
import type { Shelf } from './BookSection.astro';

interface BookStackChartProps {
    shelves: Shelf[];
}

// Strip marketing subtitles: split on ': ' or ' - ' and keep just the main title
function cleanTitle(title: string): string {
    return title.split(/:\s| - /)[0];
}

function hashColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const palettes = [
        '#1a2a3a', '#2d3e50', '#1b3a4b', '#0d2137',
        '#2c1810', '#3d2817', '#4a3728', '#1a0f0a',
        '#1a3320', '#2d4a35', '#1b382a', '#0d2618',
        '#3a1a2a', '#4d2838', '#5a2d3d', '#2a0f1a',
        '#c4b998', '#b8a880', '#a89870', '#c0ad85',
        '#d4a574', '#c4956a', '#b4855a', '#e6b88a',
        '#e63988', '#ff1493', '#cc2277', '#dd3388',
        '#2196f3', '#1976d2', '#1565c0', '#0d47a1',
        '#ff9800', '#f57c00', '#ef6c00', '#e65100',
        '#fdd835', '#fbc02d', '#f9a825', '#f57f17',
        '#009688', '#00897b', '#00796b', '#00695c',
        '#000000', '#1a1a1a', '#0a0a0a', '#111111',
        '#b0b0b0', '#9e9e9e', '#8a8a8a', '#a0a0a0',
    ];

    const index = Math.abs(hash) % palettes.length;
    return palettes[index];
}

function hashNum(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

const MIN_SPINE_HEIGHT = 6;

// Zoom controls the scale of books inside a fixed container.
// Zoom IN  = bigger books (wider + thicker spines), fewer pages fit, need scroll
// Zoom OUT = smaller books (narrower + thinner spines), more pages fit, overview
const ZOOM_LEVELS = [
    { width: 200, gap: 40, pxPerPage: 0.07 },
    { width: 150, gap: 30, pxPerPage: 0.045 },
    { width: 110, gap: 22, pxPerPage: 0.03 },
    { width: 80, gap: 16, pxPerPage: 0.02 },
];
const DEFAULT_ZOOM = 1;

const BookStackChart: React.FC<BookStackChartProps> = ({ shelves }) => {
    const [hoveredBook, setHoveredBook] = useState<{
        title: string;
        author: string;
        pages: number;
        x: number;
        y: number;
    } | null>(null);
    const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
    const chartRef = useRef<HTMLDivElement>(null);

    const zoom = ZOOM_LEVELS[zoomLevel];
    const BASE_WIDTH = zoom.width;
    const STACK_GAP = zoom.gap;
    const pxPerPage = zoom.pxPerPage;

    // Sort shelves: most recent year first (descending)
    const sortedShelves = useMemo(() => {
        return [...shelves]
            .filter(s => s.books && s.books.length > 0)
            .sort((a, b) => b.title.localeCompare(a.title));
    }, [shelves]);

    const maxPages = useMemo(() => {
        let max = 0;
        for (const shelf of sortedShelves) {
            const total = shelf.books.reduce((sum, book) => sum + (book.pageCount || 0), 0);
            if (total > max) max = total;
        }
        return max;
    }, [sortedShelves]);

    const guideInterval = useMemo(() => {
        if (maxPages <= 1000) return 250;
        if (maxPages <= 3000) return 500;
        if (maxPages <= 6000) return 1000;
        return 2000;
    }, [maxPages]);

    const guideLines = useMemo(() => {
        const lines: number[] = [];
        const maxGuide = Math.ceil(maxPages / guideInterval) * guideInterval;
        for (let i = 0; i <= maxGuide; i += guideInterval) {
            lines.push(i);
        }
        return lines;
    }, [maxPages, guideInterval]);

    // Real-world scale: ~1cm per 125 pages (avg book spine ≈ 2.5cm for 300 pages)
    const CM_PER_PAGE = 0.008;
    const realScaleMarkers = useMemo(() => {
        const markers: { pages: number; label: string; emoji: string }[] = [
            { pages: Math.round(18 / CM_PER_PAGE), label: '1 banana', emoji: '🍌' },
            { pages: Math.round(30 / CM_PER_PAGE), label: '1 ruler', emoji: '📏' },
            { pages: Math.round(50 / CM_PER_PAGE), label: '1 sword', emoji: '⚔️' },
            { pages: Math.round(100 / CM_PER_PAGE), label: '1 guitar', emoji: '🎸' },
            { pages: Math.round(170 / CM_PER_PAGE), label: '1 person', emoji: '🧍' },
        ];
        return markers.filter(m => m.pages <= maxPages * 1.1);
    }, [maxPages]);

    if (sortedShelves.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full" ref={chartRef}>
            {/* Zoom controls */}
            <div className="flex items-center justify-end gap-1 mb-3 mr-2">
                <span className="text-[10px] text-neutral-400 mr-1">Zoom</span>
                <button
                    onClick={() => setZoomLevel(Math.min(ZOOM_LEVELS.length - 1, zoomLevel + 1))}
                    disabled={zoomLevel === ZOOM_LEVELS.length - 1}
                    className="w-6 h-6 flex items-center justify-center rounded border border-neutral-200 text-neutral-500 text-sm hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom out"
                >
                    −
                </button>
                <button
                    onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
                    disabled={zoomLevel === 0}
                    className="w-6 h-6 flex items-center justify-center rounded border border-neutral-200 text-neutral-500 text-sm hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Zoom in"
                >
                    +
                </button>
            </div>

            {/* Chart with axes */}
            <div className="relative ml-8 sm:ml-14 mr-2 sm:mr-24 h-[280px] sm:h-[330px] md:h-[380px] lg:h-[430px]">
                {/* Left axis: page count */}
                {guideLines.map((pages) => {
                    const bottom = pages * pxPerPage;
                    return (
                        <span
                            key={`left-${pages}`}
                            className="absolute text-[10px] text-neutral-400 font-mono text-right pr-2 leading-none"
                            style={{ bottom, right: '100%', width: '3.5rem', transform: 'translateY(50%)' }}
                        >
                            {pages.toLocaleString()}
                        </span>
                    );
                })}

                {/* Right axis: cm + real-world markers (hidden on mobile) */}
                {guideLines.map((pages) => {
                    const bottom = pages * pxPerPage;
                    const cm = Math.round(pages * CM_PER_PAGE);
                    return cm > 0 ? (
                        <span
                            key={`right-${pages}`}
                            className="absolute text-[10px] text-neutral-400 font-mono pl-2 leading-none whitespace-nowrap hidden sm:block"
                            style={{ bottom, left: '100%', transform: 'translateY(50%)' }}
                        >
                            {cm}cm
                        </span>
                    ) : null;
                })}
                {realScaleMarkers.map((marker) => {
                    const bottom = marker.pages * pxPerPage;
                    return (
                        <span
                            key={`marker-${marker.label}`}
                            className="absolute text-[10px] text-neutral-400 pl-2 leading-none whitespace-nowrap hidden sm:block"
                            style={{ bottom, left: '100%', transform: 'translateY(50%)' }}
                        >
                            {marker.emoji} {marker.label}
                        </span>
                    );
                })}

                {/* Single scrollable container for chart + year labels */}
                <div className="overflow-x-auto overflow-y-hidden">
                <div className="inline-block" style={{ minWidth: sortedShelves.length * (BASE_WIDTH + STACK_GAP) + 20 }}>
                    <div className="relative overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
                        {/* Guide lines */}
                        {guideLines.map((pages) => {
                            const bottom = pages * pxPerPage;
                            return (
                                <div
                                    key={pages}
                                    className="absolute left-0 right-0"
                                    style={{ bottom }}
                                >
                                    <div className="w-full border-t border-neutral-200/70" />
                                </div>
                            );
                        })}

                        {/* Real-world scale marker lines (dashed) */}
                        {realScaleMarkers.map((marker) => {
                            const bottom = marker.pages * pxPerPage;
                            return (
                                <div
                                    key={marker.label}
                                    className="absolute left-0 right-0 pointer-events-none"
                                    style={{ bottom }}
                                >
                                    <div className="w-full border-t border-dashed border-neutral-300/50" />
                                </div>
                            );
                        })}

                        {/* Stacks container */}
                        <div
                            className="absolute inset-0 flex items-end px-2"
                            style={{ gap: STACK_GAP }}
                        >
                            {sortedShelves.map((shelf) => {
                                const totalPages = shelf.books.reduce((sum, b) => sum + (b.pageCount || 0), 0);
                                const bookCount = shelf.books.length;

                                return (
                                    <div key={shelf.title} className="flex flex-col items-center shrink-0" style={{ width: BASE_WIDTH }}>
                                        {/* Stats label above stack */}
                                        <div className="text-[10px] sm:text-xs text-neutral-500 mb-1 whitespace-nowrap text-center">
                                            <span className="font-bold">{bookCount} book{bookCount !== 1 ? 's' : ''}</span>
                                            <span className="mx-1 text-neutral-300">|</span>
                                            <span>{totalPages.toLocaleString()} pages</span>
                                        </div>

                                        {/* Book spine stack */}
                                        <div className="flex flex-col-reverse items-center w-full">
                                            {shelf.books.map((book, i) => {
                                                const spineHeight = Math.max(
                                                    MIN_SPINE_HEIGHT,
                                                    (book.pageCount || 200) * pxPerPage
                                                );
                                                const color = hashColor(book.title);
                                                const h = hashNum(book.title);

                                                const widthVariation = (h % 25) - 5;
                                                const spineWidth = BASE_WIDTH + widthVariation;
                                                const offsetX = ((h >> 4) % 5) - 2;
                                                const borderRadius = h % 4 === 0 ? '3px' : h % 4 === 1 ? '2px' : h % 4 === 2 ? '1px' : '0px';

                                                // Edge decoration pattern (deterministic per book)
                                                const edgePattern = h % 5;
                                                // How much inset space the edge decorations take
                                                const edgeInset = spineHeight >= 14 ? 10 : 4;

                                                // Clean title for display (strip subtitles)
                                                const displayTitle = cleanTitle(book.title);

                                                // Font sizing: try largest font that fits, wrap when possible
                                                const MIN_FONT = 7;
                                                const MAX_FONT = 14;
                                                const lineHeight = 1.25;
                                                const titleLen = displayTitle.length;

                                                let fontSize = 0;
                                                let maxLines = 0;

                                                if (spineHeight >= 12) {
                                                    const preferredFont = Math.min(spineHeight * 0.55, MAX_FONT);
                                                    fontSize = MIN_FONT;
                                                    maxLines = Math.max(1, Math.floor(spineHeight / (MIN_FONT * lineHeight)));

                                                    for (let trySize = Math.floor(preferredFont); trySize >= MIN_FONT; trySize--) {
                                                        const tryLines = Math.max(1, Math.floor(spineHeight / (trySize * lineHeight)));
                                                        const textAreaWidth = spineWidth - (edgeInset * 2) - 8;
                                                        const tryCharsPerLine = Math.floor(textAreaWidth / (trySize * 0.55));
                                                        if (tryLines * tryCharsPerLine >= titleLen) {
                                                            fontSize = trySize;
                                                            maxLines = tryLines;
                                                            break;
                                                        }
                                                    }
                                                }
                                                const showTitle = fontSize > 0;

                                                // Text color based on background luminance
                                                const r = parseInt(color.slice(1, 3), 16);
                                                const g = parseInt(color.slice(3, 5), 16);
                                                const b2 = parseInt(color.slice(5, 7), 16);
                                                const luminance = (0.299 * r + 0.587 * g + 0.114 * b2) / 255;
                                                const textColor = luminance > 0.5 ? '#1a1a1a' : '#ffffff';

                                                // Accent color variations
                                                const lighten = `rgba(255,255,255,`;
                                                const darken = `rgba(0,0,0,`;

                                                return (
                                                    <div
                                                        key={`${book.title}-${i}`}
                                                        className="relative cursor-pointer transition-all duration-150 hover:brightness-110 hover:z-10 overflow-hidden"
                                                        style={{
                                                            height: spineHeight,
                                                            width: spineWidth,
                                                            backgroundColor: color,
                                                            borderRadius,
                                                            transform: `translateX(${offsetX}px)`,
                                                            boxShadow: `
                                                                inset 0 1px 0 ${lighten}0.15),
                                                                inset 0 -1px 0 ${darken}0.2),
                                                                0 1px 2px ${darken}0.15)
                                                            `,
                                                            // 3D curvature gradient: lighter center, darker edges
                                                            backgroundImage: `
                                                                linear-gradient(to right,
                                                                    ${darken}0.18) 0%,
                                                                    ${darken}0.06) 6%,
                                                                    ${lighten}0.06) 15%,
                                                                    ${lighten}0.1) 45%,
                                                                    ${lighten}0.04) 55%,
                                                                    ${darken}0.04) 85%,
                                                                    ${darken}0.15) 100%
                                                                )
                                                            `,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const chartRect = chartRef.current?.getBoundingClientRect();
                                                            setHoveredBook({
                                                                title: book.title,
                                                                author: book.authors?.[0]?.name || 'Unknown',
                                                                pages: book.pageCount || 0,
                                                                x: rect.left - (chartRect?.left || 0) + rect.width / 2,
                                                                y: rect.top - (chartRect?.top || 0) - 8,
                                                            });
                                                        }}
                                                        onMouseLeave={() => setHoveredBook(null)}
                                                    >
                                                        {/* Edge decorations */}
                                                        {spineHeight >= 14 && (
                                                            <>
                                                                {/* Left edge decoration */}
                                                                <div className="absolute left-0 top-0 bottom-0 pointer-events-none" style={{ width: edgeInset }}>
                                                                    {edgePattern === 0 && (
                                                                        // Double line
                                                                        <>
                                                                            <div className="absolute top-0 bottom-0" style={{ left: 3, width: 1, backgroundColor: `${lighten}0.15)` }} />
                                                                            <div className="absolute top-0 bottom-0" style={{ left: 6, width: 1, backgroundColor: `${lighten}0.1)` }} />
                                                                        </>
                                                                    )}
                                                                    {edgePattern === 1 && (
                                                                        // Single thick line
                                                                        <div className="absolute top-1 bottom-1" style={{ left: 4, width: 2, backgroundColor: `${lighten}0.12)`, borderRadius: 1 }} />
                                                                    )}
                                                                    {edgePattern === 2 && (
                                                                        // Dashed line
                                                                        <div className="absolute top-0 bottom-0" style={{ left: 4, width: 1, borderLeft: `1px dashed ${lighten}0.18)` }} />
                                                                    )}
                                                                    {edgePattern === 3 && (
                                                                        // Triple thin lines
                                                                        <>
                                                                            <div className="absolute top-0 bottom-0" style={{ left: 2, width: 1, backgroundColor: `${lighten}0.1)` }} />
                                                                            <div className="absolute top-0 bottom-0" style={{ left: 4, width: 1, backgroundColor: `${lighten}0.15)` }} />
                                                                            <div className="absolute top-0 bottom-0" style={{ left: 6, width: 1, backgroundColor: `${lighten}0.1)` }} />
                                                                        </>
                                                                    )}
                                                                    {/* pattern 4: no decoration */}
                                                                </div>

                                                                {/* Right edge decoration (mirror) */}
                                                                <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ width: edgeInset }}>
                                                                    {edgePattern === 0 && (
                                                                        <>
                                                                            <div className="absolute top-0 bottom-0" style={{ right: 3, width: 1, backgroundColor: `${lighten}0.15)` }} />
                                                                            <div className="absolute top-0 bottom-0" style={{ right: 6, width: 1, backgroundColor: `${lighten}0.1)` }} />
                                                                        </>
                                                                    )}
                                                                    {edgePattern === 1 && (
                                                                        <div className="absolute top-1 bottom-1" style={{ right: 4, width: 2, backgroundColor: `${lighten}0.12)`, borderRadius: 1 }} />
                                                                    )}
                                                                    {edgePattern === 2 && (
                                                                        <div className="absolute top-0 bottom-0" style={{ right: 4, width: 1, borderRight: `1px dashed ${lighten}0.18)` }} />
                                                                    )}
                                                                    {edgePattern === 3 && (
                                                                        <>
                                                                            <div className="absolute top-0 bottom-0" style={{ right: 2, width: 1, backgroundColor: `${lighten}0.1)` }} />
                                                                            <div className="absolute top-0 bottom-0" style={{ right: 4, width: 1, backgroundColor: `${lighten}0.15)` }} />
                                                                            <div className="absolute top-0 bottom-0" style={{ right: 6, width: 1, backgroundColor: `${lighten}0.1)` }} />
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {/* Top/bottom highlight bands */}
                                                                <div className="absolute left-0 right-0 top-0 pointer-events-none" style={{ height: 1, backgroundColor: `${lighten}0.12)` }} />
                                                                <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ height: 1, backgroundColor: `${darken}0.12)` }} />
                                                            </>
                                                        )}

                                                        {/* Title text */}
                                                        {showTitle && (
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
                                                                style={{ left: edgeInset + 2, right: edgeInset + 2 }}
                                                            >
                                                                <span
                                                                    className="text-center"
                                                                    style={{
                                                                        fontSize,
                                                                        lineHeight: `${fontSize * lineHeight}px`,
                                                                        color: textColor,
                                                                        opacity: 0.9,
                                                                        fontWeight: 500,
                                                                        letterSpacing: '-0.01em',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: maxLines,
                                                                        WebkitBoxOrient: 'vertical' as const,
                                                                        wordBreak: 'break-word' as const,
                                                                        maxWidth: '100%',
                                                                    }}
                                                                >
                                                                    {displayTitle}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                {/* Year labels — same scrollable container */}
                <div
                    className="flex items-start px-2 mt-1 pb-1"
                    style={{ gap: STACK_GAP }}
                >
                    {sortedShelves.map((shelf) => (
                        <div key={shelf.title} className="shrink-0 text-center" style={{ width: BASE_WIDTH }}>
                            <span className="text-xs sm:text-sm font-bold text-neutral-700">
                                {shelf.title}
                            </span>
                        </div>
                    ))}
                </div>
                </div>{/* closes inline-block */}
                </div>{/* closes scrollable */}
            </div>{/* closes chart-with-axes */}

            {/* Tooltip */}
            {hoveredBook && (
                <div
                    className="absolute pointer-events-none z-50 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap"
                    style={{
                        left: hoveredBook.x,
                        top: hoveredBook.y,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    {hoveredBook.title} — {hoveredBook.author} — {hoveredBook.pages} pages
                </div>
            )}
        </div>
    );
};

export default BookStackChart;
