export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
    image?: string;
}

export interface ResourceImages {
    favicon?: string;
    ogImage?: string;
    screenshot?: string;
}

export interface CarouselHookSlideProps {
    backgroundImage: string;
    hookText: string;
    subtitle?: string;
    brandName: string;
    layout?: import('./design-types').SlideLayout;
    /** Favicon URLs for the logo grid on the hook slide */
    logoUrls?: string[];
}

export interface CarouselCtaSlideProps {
    backgroundImage: string;
    ctaText: string;
    brandName: string;
}

export interface CarouselItemSlideProps {
    backgroundImage: string;
    item: ResourceItem;
    images?: ResourceImages;
    slideNumber: number;
    totalSlides: number;
    brandName: string;
    overrides?: import('./design-types').ItemSlideOverrides;
}

export interface VideoLayoutOverrides {
    hookTextPosition?: { x: number; y: number };
    hookTextFontSize?: number;
    subtitlePosition?: { x: number; y: number };
    subtitleFontSize?: number;
    brandPosition?: { x: number; y: number };
    brandFontSize?: number;
    itemCardMaxWidth?: number;
    itemNameFontSize?: number;
    itemDescFontSize?: number;
    itemScreenshotHeight?: number;
    ctaTextFontSize?: number;
    ctaBrandFontSize?: number;
    showLinks?: boolean;
    disableItemTransition?: boolean;
    /** 0 = slowest, 1 = fastest. Default 0.5 */
    transitionSpeed?: number;
    showLogos?: boolean;
}

export interface VideoReelProps {
    backgroundVideo?: string;
    backgroundImage?: string;
    /** 'full' = video plays entire duration, 'hook-only' = video on hook slide only */
    videoBackgroundMode?: 'full' | 'hook-only';
    /** Solid color fallback when video is hook-only and no backgroundImage */
    backgroundFallbackColor?: string;
    audioSrc?: string;
    /** Custom frame durations (override theme defaults) */
    hookDurationFrames?: number;
    itemDurationFrames?: number;
    ctaDurationFrames?: number;
    hookText: string;
    subtitle?: string;
    brandName: string;
    items: Array<{
        item: ResourceItem;
        images?: ResourceImages;
    }>;
    layoutOverrides?: VideoLayoutOverrides;
    /** Favicon URLs for logo grid on hook section */
    logoUrls?: string[];
}
