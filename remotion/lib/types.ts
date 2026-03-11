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
    mockup?: string;
}

export type ItemSlideTemplate = 'card' | 'mockup';

export type OverlayDirection = 'bottom' | 'top' | 'both' | 'solid';

export interface OverlayConfig {
    enabled: boolean;
    /** Gradient direction: bottom=dark at bottom, top=dark at top, both=dark edges, solid=flat */
    direction: OverlayDirection;
    /** Max opacity of the overlay, 0–1 */
    opacity: number;
    /** Hex color, e.g. '#000000' */
    color: string;
    /** For bottom/top: percentage of slide from the edge where gradient starts (0=full slide, 70=edge 30% only) */
    offset: number;
}

export interface CarouselHookSlideProps {
    backgroundImage: string;
    hookText: string;
    subtitle?: string;
    brandName: string;
    layout?: import('./design-types').SlideLayout;
    /** Favicon URLs for the logo grid on the hook slide */
    logoUrls?: string[];
    showOverlay?: boolean;
    overlayConfig?: OverlayConfig;
}

export interface CarouselCtaSlideProps {
    backgroundImage: string;
    ctaText: string;
    ctaSubtitle?: string;
    ctaImage?: string;
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

export interface CarouselMockupSlideProps {
    item: ResourceItem;
    mockupImage: string;
    slideNumber: number;
    totalSlides: number;
    brandName: string;
    favicon?: string;
    layout?: import('./design-types').SlideLayout;
    showOverlay?: boolean;
    overlayConfig?: OverlayConfig;
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
    showDescription?: boolean;
    maxDescriptionLength?: number;
    disableItemTransition?: boolean;
    /** 0 = slowest, 1 = fastest. Default 0.5 */
    transitionSpeed?: number;
    showLogos?: boolean;
    showOverlay?: boolean;
    overlayConfig?: OverlayConfig;
}

export interface VideoReelProps {
    template?: ItemSlideTemplate;
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
    /** Hook slide layout from carousel editor (positions text elements) */
    hookLayout?: import('./design-types').SlideLayout;
    /** Mockup slide layout from carousel editor (positions text + logo elements) */
    mockupLayout?: import('./design-types').SlideLayout;
    /** Favicon URLs for logo grid on hook section */
    logoUrls?: string[];
}
