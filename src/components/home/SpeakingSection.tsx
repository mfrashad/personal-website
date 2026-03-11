import { useState, useMemo } from 'react';

interface SerializedEngagement {
    id: string;
    date: string;
    title: string;
    event: string;
    organizer: string;
    description?: string;
    location?: string;
    audience?: string;
    type: string;
    topics?: string[];
    logos?: string[];
}

interface SpeakingSectionProps {
    engagements: SerializedEngagement[];
    imageManifest: Record<string, string[]>;
    allLogos?: { src: string; name: string }[];
}

export default function SpeakingSection({ engagements, imageManifest, allLogos: allLogosProp }: SpeakingSectionProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [hoveredThumb, setHoveredThumb] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const sortedEngagements = [...engagements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const getImages = (id: string) => imageManifest[id] || [];
    const getThumbs = (id: string) =>
        getImages(id).map(img => img.replace(`/${id}/`, `/${id}/thumbs/`));

    const allLogos = useMemo(() => {
        if (allLogosProp) return allLogosProp;
        const seen = new Set<string>();
        const logos: { src: string; name: string }[] = [];
        for (const eng of sortedEngagements) {
            if (eng.logos) {
                for (const logo of eng.logos) {
                    if (!seen.has(logo)) {
                        seen.add(logo);
                        logos.push({ src: logo, name: eng.organizer });
                    }
                }
            }
        }
        return logos;
    }, [sortedEngagements, allLogosProp]);

    const duplicatedLogos = [...allLogos, ...allLogos];

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleMouseEnter = (id: string, e: React.MouseEvent) => {
        if (getImages(id).length === 0) return;
        setHoveredId(id);
        setHoveredThumb(null);
        setMousePos({ x: e.clientX + 16, y: e.clientY - 100 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (hoveredId) setMousePos({ x: e.clientX + 16, y: e.clientY - 100 });
    };

    return (
        <div className="relative">
            {/* Logo marquee */}
            {allLogos.length > 0 && (
                <div className="relative overflow-hidden py-6 mb-6 border-b border-neutral-200">
                    <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10" />
                    <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                        {duplicatedLogos.map((logo, i) => (
                            <div
                                key={`${logo.src}-${i}`}
                                className="flex-shrink-0 mx-8 flex items-center justify-center w-[120px]"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.name}
                                    className="max-h-12 md:max-h-14 max-w-[120px] w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Engagement list */}
            <ul className="space-y-1 font-mono text-xs mb-8">
                {sortedEngagements.map((engagement) => (
                    <li
                        key={engagement.id}
                        className={`border-b border-neutral-200 hover:bg-neutral-50 transition-all duration-200 ${
                            hoveredId && hoveredId !== engagement.id ? 'opacity-20' : ''
                        }`}
                    >
                        <a
                            href={`/speaking/${engagement.id}`}
                            className="block py-2 px-2 group"
                            onMouseEnter={(e) => handleMouseEnter(engagement.id, e)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate sm:whitespace-normal sm:overflow-visible">
                                        {engagement.title}
                                    </div>
                                    <div className="text-neutral-500 truncate hidden sm:block">
                                        {engagement.event} &middot; {engagement.organizer}
                                    </div>
                                    {getThumbs(engagement.id).length > 0 && (
                                        <div className="hidden sm:flex items-center -space-x-2 shrink-0">
                                            {getThumbs(engagement.id).slice(0, 3).map((thumb, i) => (
                                                <img
                                                    key={i}
                                                    src={thumb}
                                                    alt=""
                                                    className={`w-8 h-8 rounded-full object-cover border-2 border-white transition-transform ${hoveredThumb === getImages(engagement.id)[i] ? 'scale-125 z-10' : ''}`}
                                                    loading="lazy"
                                                    onMouseEnter={() => setHoveredThumb(getImages(engagement.id)[i])}
                                                    onMouseLeave={() => setHoveredThumb(null)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-neutral-400 flex-shrink-0">
                                    {formatDate(engagement.date)}
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Hover preview */}
            {hoveredId && (
                <div
                    className="fixed z-40 pointer-events-none"
                    style={{ left: mousePos.x, top: mousePos.y }}
                >
                    <img
                        src={hoveredThumb || getThumbs(hoveredId)[0]}
                        alt=""
                        className="w-48 h-auto rounded-lg shadow-2xl border-2 border-white"
                    />
                </div>
            )}
        </div>
    );
}
