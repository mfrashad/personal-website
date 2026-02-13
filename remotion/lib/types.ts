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
}

export interface CarouselItemSlideProps {
    backgroundImage: string;
    item: ResourceItem;
    images?: ResourceImages;
    slideNumber: number;
    totalSlides: number;
    brandName: string;
}

export interface VideoReelProps {
    backgroundVideo?: string;
    backgroundImage?: string;
    hookText: string;
    subtitle?: string;
    brandName: string;
    items: Array<{
        item: ResourceItem;
        images?: ResourceImages;
    }>;
}
