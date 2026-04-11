import { useState, useRef } from 'react';
import ImageLightbox from '../speaking/ImageLightbox';

interface MediaMention {
    title: string;
    publication: string;
    date: string;
    url: string;
    excerpt?: string;
    type: 'article' | 'newspaper' | 'radio' | 'tv' | 'podcast' | 'video' | 'interview';
    image?: string;
}

interface YearGroup {
    year: number;
    mentions: MediaMention[];
}

interface MentionGalleryListProps {
    yearGroups: YearGroup[];
}

const mediaLogos = [
    { name: 'Kosmo', logo: '/media/logo/Kosmo!_logo_2020.webp' },
    { name: 'BERNAMA', logo: '/media/logo/bernama.webp' },
    { name: 'The Borneo Post', logo: '/media/logo/borneopost.webp' },
    { name: 'Era FM', logo: '/media/logo/erafm.webp' },
    { name: 'Sin Chew', logo: '/media/logo/sinchew.webp' },
    { name: 'The Star', logo: '/media/logo/thestar.webp' },
    { name: 'TV1', logo: '/media/logo/tv1.webp' },
    { name: 'UTP', logo: '/media/logo/utp.webp' },
];

const typeColors: Record<string, string> = {
    article: 'bg-blue-100 text-blue-700',
    newspaper: 'bg-neutral-100 text-neutral-700',
    radio: 'bg-purple-100 text-purple-700',
    tv: 'bg-red-100 text-red-700',
    podcast: 'bg-green-100 text-green-700',
    video: 'bg-pink-100 text-pink-700',
    interview: 'bg-amber-100 text-amber-700',
};

export default function MentionGalleryList({ yearGroups }: MentionGalleryListProps) {
    const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
    const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const duplicatedLogos = [...mediaLogos, ...mediaLogos];

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleMouseEnter = (mention: MediaMention, e: React.MouseEvent) => {
        if (!mention.image) return;
        setHoveredUrl(mention.url);
        updateMousePos(e);
    };

    const updateMousePos = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX + 16, y: e.clientY - 100 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (hoveredUrl) updateMousePos(e);
    };

    const handleRowClick = (mention: MediaMention) => {
        if (mention.image) {
            setExpandedUrl(expandedUrl === mention.url ? null : mention.url);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Logo marquee banner */}
            <div className="relative overflow-hidden py-6 mb-8 border-b border-neutral-200">
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10" />
                <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                    {duplicatedLogos.map((logo, i) => (
                        <div
                            key={`${logo.name}-${i}`}
                            className="flex-shrink-0 mx-8 flex items-center justify-center w-[140px]"
                        >
                            <img
                                src={logo.logo}
                                alt={logo.name}
                                className="max-h-12 md:max-h-14 max-w-[140px] w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {yearGroups.map(({ year, mentions }) => (
                <div key={year} className="mb-12">
                    <h3 className="text-base font-bold mb-3 text-neutral-700 border-b border-neutral-200 pb-2">
                        {year}
                    </h3>
                    <div className="space-y-0">
                        {mentions.map((mention) => {
                            const hasImage = !!mention.image;
                            const isExpanded = expandedUrl === mention.url;

                            return (
                                <div key={mention.url}>
                                    <article
                                        className={`border-b border-neutral-100 pb-3 pt-3 px-2 -mx-2 rounded transition-colors ${
                                            hasImage ? 'cursor-pointer hover:bg-neutral-50' : 'hover:bg-neutral-50'
                                        } ${isExpanded ? 'bg-neutral-50' : ''}`}
                                        onClick={() => hasImage ? handleRowClick(mention) : undefined}
                                        onMouseEnter={(e) => !isExpanded && handleMouseEnter(mention, e)}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={() => setHoveredUrl(null)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="shrink-0 w-20 text-xs font-mono text-neutral-500 pt-0.5">
                                                    {formatDate(mention.date)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-semibold text-neutral-900 mb-1">
                                                        {mention.title}
                                                        {hasImage && (
                                                            <span className="ml-2 text-xs text-neutral-400 font-normal">
                                                                1 photo
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-neutral-600">
                                                        {mention.publication}
                                                    </p>
                                                    {mention.excerpt && (
                                                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                                                            {mention.excerpt}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-xs px-2 py-1 rounded-full capitalize ${typeColors[mention.type] || 'bg-neutral-100 text-neutral-600'}`}>
                                                    {mention.type}
                                                </span>
                                                {hasImage && (
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

                                    {/* Expanded image + link */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isExpanded ? 'max-h-[400px] opacity-100 py-4' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        {mention.image && (
                                            <div className="px-2">
                                                <img
                                                    src={mention.image}
                                                    alt={mention.title}
                                                    className="max-h-64 w-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity object-contain"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLightboxImage(mention.image!);
                                                    }}
                                                />
                                                <div className="mt-3">
                                                    <a
                                                        href={mention.url}
                                                        target={mention.url.startsWith('http') ? '_blank' : undefined}
                                                        rel={mention.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Read article &rarr;
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Hover preview */}
            {hoveredUrl && !expandedUrl && (() => {
                const mention = yearGroups.flatMap(g => g.mentions).find(m => m.url === hoveredUrl);
                if (!mention?.image) return null;
                return (
                    <div
                        className="fixed z-40 pointer-events-none"
                        style={{ left: mousePos.x, top: mousePos.y }}
                    >
                        <img
                            src={mention.image}
                            alt=""
                            className="w-64 h-auto rounded-lg shadow-2xl border-2 border-white"
                        />
                    </div>
                );
            })()}

            {/* Lightbox */}
            {lightboxImage && (
                <ImageLightbox
                    images={[lightboxImage]}
                    currentIndex={0}
                    onClose={() => setLightboxImage(null)}
                    onNavigate={() => {}}
                />
            )}
        </div>
    );
}
