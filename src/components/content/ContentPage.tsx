import BrandMarquee from './BrandMarquee';
import ContentSection, { type SerializedContentPiece } from './ContentSection';

// Deliberately narrow: pieces are serialized into the delivered HTML as island
// props, so SerializedContentPiece (in ContentSection.tsx) is the allowlist of
// what /create makes public. Widen it only with fields that are safe to publish.

interface CategoryConfig {
    label: string;
    description: string;
}

interface ContentPageProps {
    brandLogos: { name: string; src: string }[];
    contentByType: Record<string, SerializedContentPiece[]>;
    categories: Record<string, CategoryConfig>;
    imageManifest: Record<string, { content: string; analytics: string }>;
}


// Sections to render: advocacy and education lead, then personal brand, then the services
const SECTION_ORDER = ['advocacy', 'educational', 'personal-brand', 'experience', 'cafe-hopping', 'products'];

export default function ContentPage({ brandLogos, contentByType, categories, imageManifest }: ContentPageProps) {
    return (
        <div>
            {/* Brand logos (grid by default, collapsible to a marquee) */}
            <BrandMarquee logos={brandLogos} />

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
