import { useState, useRef, useMemo } from 'react';
import ImageLightbox from './ImageLightbox';

interface SerializedEngagement {
    id: string;
    date: string; // ISO string
    title: string;
    event: string;
    organizer: string;
    description?: string;
    location?: string;
    audience?: string;
    type: string;
    topics?: string[];
    images?: string[];
    logos?: string[];
}

interface YearGroup {
    year: number;
    engagements: SerializedEngagement[];
}

interface SpeakingGalleryListProps {
    yearGroups: YearGroup[];
    imageManifest: Record<string, string[]>;
}

export default function SpeakingGalleryList({ yearGroups, imageManifest }: SpeakingGalleryListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Collect unique logos for the marquee banner
    const allLogos = useMemo(() => {
        const seen = new Set<string>();
        const logos: { src: string; name: string }[] = [];
        for (const { engagements } of yearGroups) {
            for (const eng of engagements) {
                if (eng.logos) {
                    for (const logo of eng.logos) {
                        if (!seen.has(logo)) {
                            seen.add(logo);
                            logos.push({ src: logo, name: eng.organizer });
                        }
                    }
                }
            }
        }
        return logos;
    }, [yearGroups]);

    const duplicatedLogos = [...allLogos, ...allLogos];

    const getImages = (id: string) => imageManifest[id] || [];
    const getThumbs = (id: string) =>
        getImages(id).map(img => img.replace(`/${id}/`, `/${id}/thumbs/`));

    const handleMouseEnter = (id: string, e: React.MouseEvent) => {
        if (getImages(id).length === 0) return;
        setHoveredId(id);
        updateMousePos(e);
    };

    const updateMousePos = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX + 16, y: e.clientY - 100 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (hoveredId) updateMousePos(e);
    };

    const handleRowClick = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const openLightbox = (id: string, index: number) => {
        setLightboxState({ images: getImages(id), index });
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Logo marquee banner */}
            {allLogos.length > 0 && (
                <div className="relative overflow-hidden py-6 mb-8 border-b border-neutral-200">
                    <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10" />
                    <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                        {duplicatedLogos.map((logo, i) => (
                            <div
                                key={`${logo.src}-${i}`}
                                className="flex-shrink-0 mx-6 flex items-center justify-center w-[100px]"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.name}
                                    className="h-8 md:h-10 w-auto max-w-[80px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invite CTA */}
            <div className="mb-10 p-5 sm:p-6 bg-neutral-900 text-white rounded-xl">
                <h2 className="text-base sm:text-lg font-bold mb-2">Invite me to speak at your event</h2>
                <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
                    I speak about AI, career development, entrepreneurship & startups, hackathons, and tech. Available for keynotes, panels, workshops, and fireside chats at conferences, universities, and corporate events.
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                    <a
                        href="mailto:m.fathyrashad@gmail.com"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-900 text-xs sm:text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                        Get in touch
                    </a>
                    <a
                        href="/media"
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-600 text-neutral-300 text-xs sm:text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                        Speaker kit & media assets →
                    </a>
                </div>
            </div>

            {yearGroups.map(({ year, engagements }) => (
                <div key={year} className="mb-12">
                    <h3 className="text-base font-bold mb-3 text-neutral-700 border-b border-neutral-200 pb-2">
                        {year}
                    </h3>
                    <div className="space-y-0">
                        {engagements.map((engagement) => {
                            const images = getImages(engagement.id);
                            const thumbs = getThumbs(engagement.id);
                            const isExpanded = expandedId === engagement.id;
                            const hasImages = images.length > 0;
                            const logos = engagement.logos || [];

                            return (
                                <div key={engagement.id}>
                                    <article
                                        className={`border-b border-neutral-100 pb-3 pt-3 px-2 -mx-2 rounded transition-colors ${
                                            hasImages ? 'cursor-pointer hover:bg-neutral-50' : ''
                                        } ${isExpanded ? 'bg-neutral-50' : ''}`}
                                        onClick={() => hasImages && handleRowClick(engagement.id)}
                                        onMouseEnter={(e) => !isExpanded && handleMouseEnter(engagement.id, e)}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="shrink-0 w-20 flex flex-col items-center gap-1.5">
                                                    <div className="text-xs font-mono text-neutral-500">
                                                        {formatDate(engagement.date)}
                                                    </div>
                                                    {logos.length > 0 && (
                                                        <div className="flex items-center gap-1.5">
                                                            {logos.slice(0, 2).map((logo, i) => (
                                                                <img
                                                                    key={i}
                                                                    src={logo}
                                                                    alt=""
                                                                    className="h-5 max-w-[28px] object-contain"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-semibold text-neutral-900 mb-1">
                                                        {engagement.title}
                                                        {hasImages && (
                                                            <span className="ml-2 text-xs text-neutral-400 font-normal">
                                                                {images.length} photo{images.length !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-neutral-600 mb-1">
                                                        {engagement.event}
                                                        {engagement.organizer && (
                                                            <span className="text-neutral-500"> &middot; {engagement.organizer}</span>
                                                        )}
                                                        {engagement.location && (
                                                            <span className="text-neutral-500"> &middot; {engagement.location}</span>
                                                        )}
                                                    </p>
                                                    {engagement.audience && (
                                                        <p className="text-xs text-neutral-500">{engagement.audience}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {/* Mini image previews */}
                                                {hasImages && (
                                                    <div className="hidden sm:flex items-center -space-x-2">
                                                        {thumbs.slice(0, 3).map((thumb, i) => (
                                                            <img
                                                                key={i}
                                                                src={thumb}
                                                                alt=""
                                                                className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                                                loading="lazy"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full capitalize">
                                                    {engagement.type}
                                                </span>
                                                {hasImages && (
                                                    <svg
                                                        className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </article>

                                    {/* Expanded gallery */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isExpanded ? 'max-h-[300px] opacity-100 py-4' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-hide">
                                            {thumbs.map((thumb, i) => (
                                                <img
                                                    key={i}
                                                    src={thumb}
                                                    alt={`${engagement.title} photo ${i + 1}`}
                                                    className="h-40 w-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity shrink-0 object-cover"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openLightbox(engagement.id, i);
                                                    }}
                                                    loading="lazy"
                                                />
                                            ))}
                                        </div>
                                        <div className="px-2 mt-2">
                                            <a
                                                href={`/speaking/${engagement.id}`}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Details &rarr;
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Hover preview */}
            {hoveredId && !expandedId && (
                <div
                    className="fixed z-40 pointer-events-none"
                    style={{ left: mousePos.x, top: mousePos.y }}
                >
                    <img
                        src={getThumbs(hoveredId)[0]}
                        alt=""
                        className="w-48 h-auto rounded-lg shadow-2xl border-2 border-white"
                    />
                </div>
            )}

            {/* Lightbox */}
            {lightboxState && (
                <ImageLightbox
                    images={lightboxState.images}
                    currentIndex={lightboxState.index}
                    onClose={() => setLightboxState(null)}
                    onNavigate={(index) => setLightboxState({ ...lightboxState, index })}
                />
            )}
        </div>
    );
}
