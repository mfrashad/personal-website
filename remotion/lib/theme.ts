export const CAROUSEL = {
    width: 1080,
    height: 1350,
};

export const VIDEO = {
    width: 1080,
    height: 1920,
    fps: 30,
    hookDurationSec: 3,
    itemDurationSec: 2,
    ctaDurationSec: 2,
};

export function getVideoDuration(
    itemCount: number,
    customHookFrames?: number,
    customItemFrames?: number,
    customCtaFrames?: number,
): number {
    const hookFrames = customHookFrames ?? Math.ceil(VIDEO.hookDurationSec * VIDEO.fps);
    const itemFrames = customItemFrames ?? Math.ceil(VIDEO.itemDurationSec * VIDEO.fps);
    const ctaFrames = customCtaFrames ?? Math.ceil(VIDEO.ctaDurationSec * VIDEO.fps);
    return hookFrames + itemCount * itemFrames + ctaFrames;
}

// --- Overlay helpers ---

import type { OverlayConfig } from './types';

export const DEFAULT_HOOK_OVERLAY: OverlayConfig = {
    enabled: true,
    direction: 'bottom',
    opacity: 0.75,
    color: '#000000',
    offset: 0,
};

export const DEFAULT_ITEM_OVERLAY: OverlayConfig = {
    enabled: true,
    direction: 'bottom',
    opacity: 0.8,
    color: '#000000',
    offset: 70,
};

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
        parseInt(h.slice(0, 2), 16) || 0,
        parseInt(h.slice(2, 4), 16) || 0,
        parseInt(h.slice(4, 6), 16) || 0,
    ];
}

/** Generate inline style for an overlay gradient from an OverlayConfig */
export function getOverlayStyle(config: OverlayConfig): React.CSSProperties {
    if (!config.enabled) return { display: 'none' };
    const [r, g, b] = hexToRgb(config.color);
    const a = config.opacity;
    const off = config.offset;

    const base: React.CSSProperties = { position: 'absolute', left: 0, right: 0 };

    switch (config.direction) {
        case 'bottom':
            return {
                ...base,
                top: `${off}%`,
                bottom: 0,
                background: `linear-gradient(to bottom, rgba(${r},${g},${b},0) 0%, rgba(${r},${g},${b},${a}) 100%)`,
            };
        case 'top':
            return {
                ...base,
                top: 0,
                bottom: `${off}%`,
                background: `linear-gradient(to top, rgba(${r},${g},${b},0) 0%, rgba(${r},${g},${b},${a}) 100%)`,
            };
        case 'both':
            return {
                ...base,
                top: 0,
                bottom: 0,
                background: `linear-gradient(to bottom, rgba(${r},${g},${b},${a}) 0%, rgba(${r},${g},${b},${a * 0.15}) 40%, rgba(${r},${g},${b},${a * 0.15}) 60%, rgba(${r},${g},${b},${a}) 100%)`,
            };
        case 'solid':
            return {
                ...base,
                top: 0,
                bottom: 0,
                background: `rgba(${r},${g},${b},${a})`,
            };
    }
}

export const colors = {
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.55)',
    overlayHeavy: 'rgba(0, 0, 0, 0.7)',
    card: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    accent: '#6366f1',
    accentLight: '#818cf8',
    tagBg: 'rgba(99, 102, 241, 0.15)',
    tagText: '#6366f1',
    textPrimary: '#1a1a2e',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
};

export const fonts = {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
};

export const spacing = {
    pagePadding: 60,
    cardPadding: 48,
    gap: 24,
};
