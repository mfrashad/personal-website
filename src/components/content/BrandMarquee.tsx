import { useState } from 'react';

interface BrandLogo {
    name: string;
    src: string;
}

interface BrandMarqueeProps {
    logos: BrandLogo[];
}

export default function BrandMarquee({ logos }: BrandMarqueeProps) {
    // Scrolling by default; click to lay every logo out at once so nobody has to
    // wait for a brand to come around on the belt.
    const [expanded, setExpanded] = useState(false);
    const duplicated = [...logos, ...logos];

    return (
        <div className="mb-10">
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="group flex items-center gap-2 mb-4 text-xs font-medium uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors"
            >
                <span>Brands I've partnered with</span>
                <span className="normal-case tracking-normal text-[10px] text-neutral-300 group-hover:text-neutral-500 transition-colors">
                    ({logos.length})
                </span>
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {expanded ? (
                <div className="border-y border-neutral-200 py-5">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7">
                        {logos.map((logo) => (
                            <div key={logo.name} className="flex flex-col items-center gap-2">
                                <div className="flex h-10 md:h-12 w-full items-center justify-center">
                                    <img
                                        src={logo.src}
                                        alt={logo.name}
                                        title={logo.name}
                                        loading="lazy"
                                        className="h-full w-auto max-w-[100px] object-contain"
                                    />
                                </div>
                                <span className="text-[10px] sm:text-xs text-neutral-400 text-center leading-tight">
                                    {logo.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-label="Show all brands at once"
                    className="relative block w-full cursor-pointer overflow-hidden py-5 border-y border-neutral-200"
                >
                    <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10" />
                    <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                        {duplicated.map((logo, i) => (
                            <div
                                key={`${logo.name}-${i}`}
                                className="flex-shrink-0 mx-8 flex items-center justify-center w-[120px]"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.name}
                                    title={logo.name}
                                    loading="lazy"
                                    className="h-8 md:h-10 w-auto max-w-[100px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </button>
            )}
        </div>
    );
}
