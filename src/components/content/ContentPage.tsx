import { useCallback } from 'react';
import BrandMarquee from './BrandMarquee';
import ContentSection from './ContentSection';

interface SerializedContentPiece {
    id: string;
    title: string;
    location?: string;
    date: string;
    type: string;
    platform: string;
    url?: string;
    metrics: {
        views: number;
        likes: number;
        comments: number;
        saves?: number;
        shares?: number;
        newFollowers?: number;
    };
    description?: string;
    brand?: string;
}

interface CategoryConfig {
    label: string;
    description: string;
}

interface ContentPageProps {
    brandLogos: { name: string; src: string }[];
    contentByType: Record<string, SerializedContentPiece[]>;
    categories: Record<string, CategoryConfig>;
    imageManifest: Record<string, { content: string; analytics: string }>;
    totalMetrics: { views: number; likes: number; followers: number };
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'K';
    return n.toLocaleString();
}

const SERVICE_CARDS = [
    {
        type: 'educational',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
        title: 'Education & Advocacy',
        description: 'Educational content with your product or campaign seamlessly integrated. Perfect for CSR initiatives, social projects, NGOs, and brands that want to inform and inspire.',
        examples: 'Biji-biji x Microsoft, Schola, UNICEF',
    },
    {
        type: 'experience',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
        title: 'Experience',
        description: 'Content promoting experiences, activities, and destinations. Ideal for travel brands, activity providers, escape rooms, gyms, workshops, and adventure companies.',
        examples: 'Skydiving, Rock Climbing, Sewing Workshops',
    },
    {
        type: 'cafe-hopping',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
            </svg>
        ),
        title: 'Cafe Hopping',
        highlight: 'Most content reaching 100K-500K+ views',
        description: 'Aesthetic cafe and restaurant reviews with a focus on ambience, design, and the experience rather than just food. Consistently my highest-performing content category.',
        examples: 'Hulu Cafe, The Ame Soeur, The Farm',
    },
    {
        type: 'products',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <path d="M8 21h8M12 17v4" />
            </svg>
        ),
        title: 'Product',
        description: 'As a tech and business KOL, I\'m well-positioned for tech products, AI SaaS, fintech, and business tools. My audience trusts recommendations from someone who actually builds and runs a company.',
        examples: 'Touch \'n Go, Edifier, Honor, Samsung',
    },
];

// Sections to render (personal-brand shown first as social proof, then the 4 services)
const SECTION_ORDER = ['personal-brand', 'educational', 'experience', 'cafe-hopping', 'products'];

export default function ContentPage({ brandLogos, contentByType, categories, imageManifest, totalMetrics }: ContentPageProps) {
    const scrollToSection = useCallback((type: string) => {
        const el = document.getElementById(`content-section-${type}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <div>
            {/* Stats summary */}
            <div className="flex items-center gap-5 sm:gap-8 mb-6 sm:mb-8 text-center">
                <div>
                    <div className="text-lg sm:text-2xl font-bold text-neutral-900">{formatNumber(totalMetrics.views)}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">Total Views</div>
                </div>
                <div>
                    <div className="text-lg sm:text-2xl font-bold text-neutral-900">{formatNumber(totalMetrics.likes)}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">Total Likes</div>
                </div>
                <div>
                    <div className="text-lg sm:text-2xl font-bold text-neutral-900">{formatNumber(totalMetrics.followers)}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wide">Followers</div>
                </div>
            </div>

            {/* Brand logo marquee */}
            <BrandMarquee logos={brandLogos} />

            {/* Service cards */}
            <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-xl font-bold text-neutral-800">What I Can Create For You</h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">Click a category to see examples of my work</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-10 sm:mb-12">
                {SERVICE_CARDS.map((card) => (
                    <button
                        key={card.type}
                        onClick={() => scrollToSection(card.type)}
                        className="text-left p-3.5 sm:p-5 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:shadow-md transition-all duration-200 group"
                    >
                        <div className="flex items-start gap-2.5 sm:gap-3">
                            <div className="text-neutral-400 group-hover:text-neutral-800 transition-colors mt-0.5">
                                {card.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-blue-600 transition-colors">
                                    {card.title}
                                </h3>
                                {card.highlight && (
                                    <span className="inline-block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-green-700 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full mt-1">
                                        {card.highlight}
                                    </span>
                                )}
                                <p className="text-xs sm:text-sm text-neutral-600 mt-1 sm:mt-1.5 leading-relaxed">
                                    {card.description}
                                </p>
                                <p className="text-[10px] sm:text-xs text-neutral-400 mt-1.5 sm:mt-2">
                                    e.g. {card.examples}
                                </p>
                            </div>
                            <svg className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors mt-1 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 14l-7 7-7-7M12 3v18" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            {/* Contact CTA (inline) */}
            <ContactCTA />

            {/* Content sections */}
            {SECTION_ORDER.map((type, i) => {
                const pieces = contentByType[type];
                const category = categories[type];
                if (!pieces || pieces.length === 0 || !category) return null;

                return (
                    <div key={type} id={`content-section-${type}`} className="scroll-mt-24">
                        <ContentSection
                            pieces={pieces}
                            imageManifest={imageManifest}
                            categoryLabel={category.label}
                            categoryDescription={category.description}
                            reverse={i % 2 === 1}
                        />
                    </div>
                );
            })}

            {/* Contact CTA (bottom) */}
            <ContactCTA />
        </div>
    );
}

function ContactCTA() {
    return (
        <div className="py-6 sm:py-8 mb-10 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-y border-neutral-200">
            <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">Want to work together?</h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Reach out via email or DM me on socials</p>
            </div>
            <div className="flex items-center gap-2.5">
                <a
                    href="mailto:m.fathyrashad@gmail.com"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 4l-10 8L2 4" />
                    </svg>
                    Email
                </a>
                <a
                    href="https://instagram.com/rashadventure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 text-neutral-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                    Instagram
                </a>
                <a
                    href="https://tiktok.com/@rashadventure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 text-neutral-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
                    </svg>
                    TikTok
                </a>
            </div>
        </div>
    );
}
