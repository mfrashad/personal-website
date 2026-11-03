import { useEffect, useRef, useState } from 'react';
import { PhoneSkeleton } from './PhoneMockup';

// "What you get" on /create: the selling point is that brand videos ship with
// custom motion graphics (3D scenes, mock product UI, animated captions), shown with
// short muted highlight loops cut from real brand reels.

const SHOWCASE: { label: string; logo?: string; video: string; poster: string; url: string; caption: string }[] = [
    {
        label: 'BJAK',
        logo: '/content-images/brandlogos/bjak.png',
        video: '/content-images/showcase/bjak-motion.mp4',
        poster: '/content-images/showcase/bjak-motion.jpg',
        url: 'https://www.instagram.com/reel/DfERJSLSGaw/',
        caption: '3D road scenes + the BJAK app rebuilt as animated screens',
    },
    {
        label: 'Cadbury',
        logo: '/content-images/brandlogos/cadbury.png',
        video: '/content-images/showcase/cadbury-motion.mp4',
        poster: '/content-images/showcase/cadbury-motion.jpg',
        url: 'https://www.instagram.com/reel/DfFL3c5SwFa/',
        caption: 'Real footage mixed with mock emails, code and to-do lists',
    },
    {
        label: 'Pocket of Pink',
        logo: '/content-images/brandlogos/pocketofpink-icon.png',
        video: '/content-images/showcase/pocketofpink-motion.mp4',
        poster: '/content-images/showcase/pocketofpink-motion.jpg',
        url: 'https://www.instagram.com/reel/DeWqvIuSLmo/',
        caption: '"What was she wearing?" exhibit cards animated to the music · 39K views',
    },
    {
        label: 'Haze explainer',
        video: '/content-images/showcase/haze-motion.mp4',
        poster: '/content-images/showcase/haze-motion.jpg',
        url: 'https://www.instagram.com/reel/DekoHRWSQqG/',
        caption: 'Paper-collage explainer with animated peat diagrams, maps and data · 477K views',
    },
    {
        label: 'Haze explainer, part 2',
        video: '/content-images/showcase/haze-asean-motion.mp4',
        poster: '/content-images/showcase/haze-asean-motion.jpg',
        url: 'https://www.instagram.com/reel/De69l2WSNjp/',
        caption: '"Can ASEAN sue Indonesia?" Vintage maps, countryballs and 3D shell-company boxes · 32K views',
    },
];

const FEATURES = [
    {
        title: '3D animation',
        body: 'Custom 3D scenes built for your story, like the cars, tow truck and police car in the BJAK reel.',
        icon: (
            <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 0v20M3 7l9 5 9-5" />
        ),
    },
    {
        title: 'Mock UI',
        body: 'Your app or website rebuilt as animated screens, so viewers see exactly how it works.',
        icon: (
            <>
                <rect x="6" y="2" width="12" height="20" rx="2.5" />
                <path d="M10 18h4M9 7h6M9 10.5h6M9 14h3" />
            </>
        ),
    },
    {
        title: 'Motion graphics',
        body: 'Animated captions, callouts and product pop-ups, timed to the voiceover and the beat.',
        icon: (
            <>
                <path d="M4 18c3-8 6-12 8-12s3 4 4 6 2 3 4 3" />
                <circle cx="20" cy="15" r="1.6" fill="currentColor" stroke="none" />
            </>
        ),
    },
    {
        title: 'Story first',
        body: 'Scripted around a real moment from my life, so it plays like content, not an ad.',
        icon: (
            <path d="M4 5h16v11H8l-4 4V5zm4 4h8M8 12h5" />
        ),
    },
];

function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
    const ref = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);

    // Only play while on screen.
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) el.play().catch(() => {});
                else el.pause();
            },
            { threshold: 0.25 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (el && el.readyState >= 2) setReady(true);
    }, []);

    return (
        <>
        {!ready && (
            <div className="absolute inset-0 z-10">
                <PhoneSkeleton dark />
            </div>
        )}
        <video
            ref={ref}
            onLoadedData={() => setReady(true)}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
            className="block w-full h-full object-cover"
        />
        </>
    );
}

export default function WhatYouGet() {
    return (
        <section className="mb-12">
            <div className="mb-5 sm:mb-6">
                <h2 className="text-base sm:text-xl font-bold text-neutral-800">What you get</h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                    Custom motion graphics, 3D animation and mock UI, built into the video.
                </p>
            </div>

            {/* Features */}
            <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                {FEATURES.map((f) => (
                    <li key={f.title} className="flex gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white">
                            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {f.icon}
                            </svg>
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-800">{f.title}</h3>
                            <p className="text-xs sm:text-sm text-neutral-500 leading-snug mt-0.5">{f.body}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Highlight loops: swipe sideways, no auto-scroll */}
            <div className="relative">
            <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-4 sm:gap-6 w-max mx-auto pb-2">
                    {SHOWCASE.map((s) => (
                        <a
                            key={s.label}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-[160px] sm:w-[205px] flex-shrink-0 snap-start"
                            title={`Watch the full ${s.label} reel`}
                        >
                            <div className="flex h-10 md:h-12 items-center justify-center mb-1">
                                {s.logo ? (
                                    <img src={s.logo} alt={s.label} className="max-h-full object-contain" style={{ maxWidth: 'min(100px, 100%)' }} loading="lazy" />
                                ) : (
                                    <span className="text-sm font-bold text-neutral-800">{s.label}</span>
                                )}
                            </div>
                            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] border-[4px] border-neutral-800 bg-neutral-900 shadow-lg transition-transform duration-300 group-hover:scale-[1.03]">
                                <LoopVideo src={s.video} poster={s.poster} label={`${s.label} reel highlights`} />
                            </div>
                            <p className="mt-2 text-[11px] sm:text-xs text-neutral-500 text-center leading-snug">{s.caption}</p>
                            <p className="mt-1 text-[11px] font-medium text-neutral-800 text-center group-hover:underline">Watch full reel →</p>
                        </a>
                    ))}
                </div>
            </div>
            </div>

        </section>
    );
}
