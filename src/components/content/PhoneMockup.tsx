import { useEffect, useRef, useState } from 'react';

interface PhoneMockupProps {
    src: string;
    alt: string;
    className?: string;
}

export default function PhoneMockup({ src, alt, className = '' }: PhoneMockupProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);

    // Reset on src change (post <-> insights); cached images are already complete.
    useEffect(() => {
        const img = imgRef.current;
        setLoaded(!!img && img.complete && img.naturalWidth > 0);
    }, [src]);

    return (
        <div className={`relative inline-block ${className}`}>
            <div className="relative rounded-[1.2rem] border-[3px] border-neutral-800 bg-neutral-800 shadow-lg overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-neutral-800 rounded-b-lg z-10" />
                <div className="relative rounded-[0.9rem] overflow-hidden">
                    {!loaded && <PhoneSkeleton />}
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className={`w-full h-auto block transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                        loading="lazy"
                        onLoad={() => setLoaded(true)}
                        onError={() => setLoaded(true)}
                    />
                </div>
            </div>
        </div>
    );
}

/** Placeholder phone screen (800x1732 ratio) shown until the screenshot loads. */
export function PhoneSkeleton({ dark = false }: { dark?: boolean }) {
    const bar = dark ? 'bg-neutral-700' : 'bg-neutral-200';
    return (
        <div className={`w-full aspect-[400/866] animate-pulse ${dark ? 'bg-neutral-800' : 'bg-neutral-100'} flex flex-col justify-end p-4 gap-2`} aria-hidden="true">
            <div className={`h-2.5 w-1/2 rounded-full ${bar}`} />
            <div className={`h-2 w-4/5 rounded-full ${bar}`} />
            <div className={`h-2 w-2/3 rounded-full ${bar}`} />
            <div className={`mt-3 h-3 w-full rounded-full ${bar}`} />
        </div>
    );
}
