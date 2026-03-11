interface BrandLogo {
    name: string;
    src: string;
}

interface BrandMarqueeProps {
    logos: BrandLogo[];
}

export default function BrandMarquee({ logos }: BrandMarqueeProps) {
    const duplicated = [...logos, ...logos];

    return (
        <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
                Brands I've partnered with
            </p>
            <div className="relative overflow-hidden py-5 border-y border-neutral-200">
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
                                className="h-8 md:h-10 w-auto max-w-[100px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
