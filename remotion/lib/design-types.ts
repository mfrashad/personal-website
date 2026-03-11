export interface BaseElement {
    id: string;
    type: 'text' | 'image' | 'logo-grid';
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
    locked: boolean;
}

export interface TextElement extends BaseElement {
    type: 'text';
    content: string;
    fontSize: number;
    fontWeight: number;
    fontFamily: string;
    color: string;
    lineHeight: number;
    letterSpacing: string;
    textAlign: 'left' | 'center' | 'right';
    textShadow?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase';
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundBorderRadius?: number;
}

export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    objectFit: 'cover' | 'contain' | 'fill';
    borderRadius: number;
    opacity: number;
}

export interface LogoGridElement extends BaseElement {
    type: 'logo-grid';
    /** Resolved at render time from {{logoUrls}} data */
    columns: number;
    logoSize: number;
    gap: number;
    borderRadius: number;
    opacity: number;
}

export type DesignElement = TextElement | ImageElement | LogoGridElement;

export interface SlideLayout {
    elements: DesignElement[];
}

export interface ItemSlideOverrides {
    nameFontSize?: number;
    descriptionFontSize?: number;
    screenshotHeight?: number;
    cardMaxWidth?: number;
    cardPadding?: number;
    showLinks?: boolean;
    showDescription?: boolean;
    maxDescriptionLength?: number;
    brandPosition?: { x: number; y: number };
    counterPosition?: { x: number; y: number };
    customElements?: DesignElement[];
    showOverlay?: boolean;
    overlayConfig?: import('./types').OverlayConfig;
}
