interface PhoneMockupProps {
    src: string;
    alt: string;
    className?: string;
}

export default function PhoneMockup({ src, alt, className = '' }: PhoneMockupProps) {
    return (
        <div className={`relative inline-block ${className}`}>
            <div className="relative rounded-[1.2rem] border-[3px] border-neutral-800 bg-neutral-800 shadow-lg overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-neutral-800 rounded-b-lg z-10" />
                <div className="rounded-[0.9rem] overflow-hidden">
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto block"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
}
