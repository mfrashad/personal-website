import type { SlideLayout, TextElement, LogoGridElement, ItemSlideOverrides, DesignElement } from './design-types';
import { fonts, spacing } from './theme';

let nextId = 1;
function id(prefix: string) {
    return `${prefix}-${nextId++}`;
}

export function getDefaultHookSlideLayout(): SlideLayout {
    nextId = 1;
    return {
        elements: [
            {
                id: 'hook-brand',
                type: 'text',
                content: '{{brandName}}',
                x: spacing.pagePadding,
                y: spacing.pagePadding,
                width: 300,
                height: 40,
                fontSize: 24,
                fontWeight: 700,
                fontFamily: fonts.body,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.2,
                letterSpacing: '0.02em',
                textAlign: 'left',
                visible: true,
                locked: false,
            },
            {
                id: 'hook-text',
                type: 'text',
                content: '{{hookText}}',
                x: 60,
                y: 450,
                width: 960,
                height: 300,
                fontSize: 72,
                fontWeight: 800,
                fontFamily: fonts.heading,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                visible: true,
                locked: false,
            },
            {
                id: 'hook-subtitle',
                type: 'text',
                content: '{{subtitle}}',
                x: 60,
                y: 750,
                width: 960,
                height: 60,
                fontSize: 32,
                fontWeight: 400,
                fontFamily: fonts.body,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.4,
                letterSpacing: '0',
                textAlign: 'center',
                textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                visible: true,
                locked: false,
            } as TextElement,
            {
                id: 'hook-logo-grid',
                type: 'logo-grid',
                x: 140,
                y: 830,
                width: 800,
                height: 400,
                columns: 5,
                logoSize: 72,
                gap: 24,
                borderRadius: 16,
                opacity: 1,
                visible: true,
                locked: false,
            } as LogoGridElement,
        ] as DesignElement[],
    };
}

export function getDefaultItemSlideOverrides(): ItemSlideOverrides {
    return {
        nameFontSize: 44,
        descriptionFontSize: 28,
        screenshotHeight: 400,
        cardMaxWidth: 920,
        cardPadding: spacing.cardPadding,
        showLinks: true,
        brandPosition: { x: spacing.pagePadding, y: spacing.pagePadding },
        counterPosition: { x: 1020, y: 1290 },
        customElements: [],
    };
}
