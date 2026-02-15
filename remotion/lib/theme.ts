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
