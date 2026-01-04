import { useState } from 'react';

interface MediaMention {
    title: string;
    publication: string;
    date: string;
    url: string;
    type: 'article'| 'newspaper'| 'radio' | 'tv' |'podcast' | 'video' | 'interview';
    image?: string;
}

interface MediaMentionListProps {
    mentions: MediaMention[];
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

export default function MediaMentionList({ mentions }: MediaMentionListProps) {
    const [hoveredMention, setHoveredMention] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Duplicate logos for seamless infinite scroll
    const duplicatedLogos = [...mediaLogos, ...mediaLogos];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleMouseEnter = (mentionUrl: string) => {
        const mention = mentions.find(m => m.url === mentionUrl);
        if (!mention?.image) return;
        setHoveredMention(mentionUrl);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredMention(null);
    };

    return (
        <div className="relative">
            {/* List - Limited to 6 items */}
            <ul className="space-y-1 font-mono text-xs mb-8">
                {mentions.slice(0, 6).map((mention, index) => (
                    <li
                        key={index}
                        className={`border-b border-neutral-200 hover:bg-neutral-50 transition-all duration-200 ${
                            hoveredMention && hoveredMention !== mention.url ? 'opacity-20' : ''
                        }`}
                    >
                        <a
                            href={mention.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2 px-2 group"
                            onMouseEnter={() => handleMouseEnter(mention.url)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors shrink-0">
                                        {mention.publication}
                                    </div>
                                    <div className="text-neutral-500 truncate">
                                        {mention.title}
                                    </div>
                                </div>
                                <div className="text-neutral-400 flex-shrink-0">
                                    {formatDate(mention.date)}
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Moving Banner */}
            <div className="relative overflow-hidden py-8 border-t border-neutral-200 mb-8">
                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

                {/* Scrolling container */}
                <div className="flex animate-infinite-scroll hover:[animation-play-state:paused]">
                    {duplicatedLogos.map((media, index) => (
                        <div
                            key={`${media.name}-${index}`}
                            className="flex-shrink-0 mx-8 flex items-center justify-center"
                            style={{ minWidth: '200px' }}
                        >
                            <img
                                src={media.logo}
                                alt={media.name}
                                className="h-12 md:h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const textDiv = document.createElement('div');
                                    textDiv.className = 'text-gray-500 font-semibold text-sm text-center px-4 py-2 border border-gray-300 rounded';
                                    textDiv.textContent = media.name;
                                    target.parentElement?.appendChild(textDiv);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* View All Button */}
            <div className="text-center mb-8">
                <a
                    href="/mentions"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-sm"
                >
                    <span>View all mentions</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
            </div>

            {/* Image Preview on Hover */}
            {hoveredMention && (
                (() => {
                    const mention = mentions.find(m => m.url === hoveredMention);
                    if (!mention?.image) return null;

                    const coverDistance = 32;

                    return (
                        <div
                            className="fixed z-50 pointer-events-none"
                            style={{
                                left: `${mousePosition.x + coverDistance}px`,
                                top: `${mousePosition.y - 200 - coverDistance}px`,
                            }}
                        >
                            <img
                                src={mention.image}
                                alt={mention.title}
                                className="w-80 h-auto rounded-lg shadow-2xl border-2 border-white"
                            />
                        </div>
                    );
                })()
            )}
        </div>
    );
}
