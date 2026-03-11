import React from 'react';
import {
    AbsoluteFill,
    Audio,
    Img,
    Video,
    Sequence,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from 'remotion';
import type { VideoReelProps, VideoLayoutOverrides } from '../lib/types';
import type { SlideLayout } from '../lib/design-types';
import { LayoutRenderer } from './LayoutRenderer';
import { VIDEO, CAROUSEL, colors, fonts, spacing, getOverlayStyle, DEFAULT_ITEM_OVERLAY } from '../lib/theme';
import { resolveAsset } from '../lib/resolve-asset';

const DEFAULT_HOOK_FRAMES = VIDEO.hookDurationSec * VIDEO.fps;
const DEFAULT_ITEM_FRAMES = VIDEO.itemDurationSec * VIDEO.fps;
const DEFAULT_CTA_FRAMES = VIDEO.ctaDurationSec * VIDEO.fps;

/* --- Hook Section --- */
const HookSection: React.FC<{
    hookText: string;
    subtitle?: string;
    brandName: string;
    overrides?: VideoLayoutOverrides;
    hookLayout?: SlideLayout;
    logoUrls?: string[];
}> = ({ hookText, subtitle, brandName, overrides, hookLayout, logoUrls }) => {
    // If a layout is provided, use LayoutRenderer for positioning
    if (hookLayout) {
        const data: Record<string, string> = {
            hookText,
            subtitle: subtitle || '',
            brandName,
        };
        return (
            <AbsoluteFill>
                <LayoutRenderer layout={hookLayout} data={data} logoUrls={logoUrls} yScale={VIDEO.height / CAROUSEL.height} />
            </AbsoluteFill>
        );
    }

    // Fallback: hardcoded layout using overrides
    const hookFontSize = overrides?.hookTextFontSize ?? 80;
    const subtitleFontSize = overrides?.subtitleFontSize ?? 36;
    const brandFontSize = overrides?.brandFontSize ?? 28;
    const brandPos = overrides?.brandPosition ?? { x: spacing.pagePadding, y: 80 };
    const showLogos = overrides?.showLogos ?? true;
    const visibleLogos = showLogos ? (logoUrls || []) : [];

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: spacing.pagePadding,
            }}
        >
            {/* Brand */}
            <div
                style={{
                    position: 'absolute',
                    top: brandPos.y,
                    left: brandPos.x,
                    fontFamily: fonts.body,
                    fontSize: brandFontSize,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                }}
            >
                {brandName}
            </div>

            {/* Hook text */}
            <div
                style={{
                    fontFamily: fonts.heading,
                    fontSize: hookFontSize,
                    fontWeight: 800,
                    color: colors.white,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                    marginBottom: 32,
                }}
            >
                {hookText}
            </div>

            {/* Subtitle */}
            {subtitle && (
                <div
                    style={{
                        fontFamily: fonts.body,
                        fontSize: subtitleFontSize,
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.8)',
                        textShadow: '0 2px 16px rgba(0,0,0,0.4)',
                        marginBottom: 32,
                    }}
                >
                    {subtitle}
                </div>
            )}

            {/* Logo grid */}
            {visibleLogos.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 20,
                        marginTop: 16,
                    }}
                >
                    {visibleLogos.map((url, i) => (
                        <Img
                            key={i}
                            src={resolveAsset(url)}
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 14,
                                objectFit: 'contain',
                                background: 'rgba(255,255,255,0.12)',
                                padding: 4,
                            }}
                        />
                    ))}
                </div>
            )}
        </AbsoluteFill>
    );
};

/* --- Item Card Section --- */
const ItemSection: React.FC<{
    item: VideoReelProps['items'][number];
    slideNumber: number;
    totalSlides: number;
    brandName: string;
    overrides?: VideoLayoutOverrides;
}> = ({ item: { item, images }, slideNumber, totalSlides, brandName, overrides }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const favicon = images?.favicon;
    const screenshot = images?.screenshot || images?.ogImage;

    const nameFontSize = overrides?.itemNameFontSize ?? 44;
    const descFontSize = overrides?.itemDescFontSize ?? 28;
    const screenshotHeight = overrides?.itemScreenshotHeight ?? 380;
    const cardMaxWidth = overrides?.itemCardMaxWidth ?? 960;
    const brandFontSize = overrides?.brandFontSize ?? 28;
    const brandPos = overrides?.brandPosition ?? { x: spacing.pagePadding, y: 80 };
    const showLinks = overrides?.showLinks ?? false;
    const showDescription = overrides?.showDescription ?? true;
    const maxDescLen = overrides?.maxDescriptionLength ?? 100;

    const description = item.description
        ? item.description.length > maxDescLen
            ? item.description.slice(0, maxDescLen - 3) + '...'
            : item.description
        : '';
    const noTransition = overrides?.disableItemTransition ?? false;
    // speed 0 = slow (damping 8, mass 1.2), speed 1 = snappy (damping 30, mass 0.3)
    const speed = overrides?.transitionSpeed ?? 0.5;
    const springDamping = 8 + speed * 22;   // 8–30
    const springMass = 1.2 - speed * 0.9;   // 1.2–0.3
    const exitFrames = Math.round(4 + (1 - speed) * 16); // 4–20 frames for exit fade

    // Card entrance transition
    const cardIn = noTransition
        ? 1
        : spring({ frame, fps, config: { damping: springDamping, mass: springMass } });
    // Card exit (fade out near end) — uses durationInFrames from parent Sequence
    const exitStart = durationInFrames - exitFrames;
    const cardOut = noTransition
        ? 1
        : interpolate(frame, [exitStart, durationInFrames], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
          });

    const combinedOpacity = cardIn * cardOut;
    const cardTranslateY = noTransition ? 0 : interpolate(cardIn, [0, 1], [60, 0]);
    const exitTranslateY = noTransition ? 0 : interpolate(cardOut, [0, 1], [-30, 0]);

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing.pagePadding,
            }}
        >
            {/* Card */}
            <div
                style={{
                    width: '100%',
                    maxWidth: cardMaxWidth,
                    backgroundColor: colors.card,
                    borderRadius: 32,
                    padding: spacing.cardPadding,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                    opacity: combinedOpacity,
                    transform: `translateY(${cardTranslateY + exitTranslateY}px)`,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                    }}
                >
                    {favicon && (
                        <Img
                            src={resolveAsset(favicon)}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 14,
                                objectFit: 'contain',
                                flexShrink: 0,
                                background: 'rgba(255,255,255,0.12)',
                                padding: 6,
                            }}
                        />
                    )}
                    <div
                        style={{
                            fontFamily: fonts.heading,
                            fontSize: nameFontSize,
                            fontWeight: 700,
                            color: colors.textPrimary,
                            lineHeight: 1.2,
                        }}
                    >
                        {item.name}
                    </div>
                </div>

                {/* Description */}
                {showDescription && description && (
                    <div
                        style={{
                            fontFamily: fonts.body,
                            fontSize: descFontSize,
                            color: colors.textSecondary,
                            lineHeight: 1.5,
                        }}
                    >
                        {description}
                    </div>
                )}

                {/* Screenshot */}
                {screenshot && (
                    <div
                        style={{
                            borderRadius: 16,
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.08)',
                        }}
                    >
                        <Img
                            src={resolveAsset(screenshot)}
                            style={{
                                width: '100%',
                                height: screenshotHeight,
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 10,
                        }}
                    >
                        {item.tags.slice(0, 4).map((tag) => (
                            <div
                                key={tag}
                                style={{
                                    backgroundColor: colors.tagBg,
                                    color: colors.tagText,
                                    fontFamily: fonts.body,
                                    fontSize: 22,
                                    fontWeight: 600,
                                    padding: '8px 18px',
                                    borderRadius: 20,
                                }}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* URL - below card, centered, cursor-selection style */}
            {showLinks && item.url && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 24,
                        opacity: combinedOpacity,
                        transform: `translateY(${cardTranslateY + exitTranslateY}px)`,
                    }}
                >
                    <div
                        style={{
                            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace',
                            fontSize: 28,
                            fontWeight: 600,
                            color: '#FFFFFF',
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            padding: '8px 20px',
                            borderRadius: 6,
                            letterSpacing: '0.01em',
                        }}
                    >
                        {item.url.replace(/\/$/, '')}
                    </div>
                </div>
            )}

            {/* Brand */}
            <div
                style={{
                    position: 'absolute',
                    top: brandPos.y,
                    left: brandPos.x,
                    fontFamily: fonts.body,
                    fontSize: brandFontSize,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                }}
            >
                {brandName}
            </div>
        </AbsoluteFill>
    );
};

/* --- Continuous mockup image track (prevents background flash between items) --- */
const MockupImageTrack: React.FC<{
    items: VideoReelProps['items'];
    itemFrames: number;
    showOverlay?: boolean;
    overlayConfig?: import('../lib/types').OverlayConfig;
}> = ({ items, itemFrames, showOverlay = true, overlayConfig }) => {
    const frame = useCurrentFrame();
    const currentIndex = Math.min(Math.floor(frame / itemFrames), items.length - 1);
    const mockupImage = items[currentIndex]?.images?.mockup;

    if (!mockupImage) return null;

    const ov = overlayConfig ?? { ...DEFAULT_ITEM_OVERLAY, enabled: showOverlay };

    return (
        <AbsoluteFill>
            <Img
                src={resolveAsset(mockupImage)}
                style={{
                    width: VIDEO.width,
                    height: VIDEO.height,
                    objectFit: 'cover',
                }}
            />
            {/* Bottom gradient */}
            {ov.enabled && <div style={getOverlayStyle(ov)} />}
        </AbsoluteFill>
    );
};

/* --- Mockup Item Section (text overlays only — image handled by MockupImageTrack) --- */
const MockupItemSection: React.FC<{
    item: VideoReelProps['items'][number];
    slideNumber: number;
    totalSlides: number;
    brandName: string;
    overrides?: VideoLayoutOverrides;
    mockupLayout?: SlideLayout;
}> = ({ item: { item, images }, slideNumber, totalSlides, brandName, overrides, mockupLayout }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const noTransition = overrides?.disableItemTransition ?? false;
    const speed = overrides?.transitionSpeed ?? 0.5;
    const springDamping = 8 + speed * 22;
    const springMass = 1.2 - speed * 0.9;
    const exitFrames = Math.round(4 + (1 - speed) * 16);

    const cardIn = noTransition
        ? 1
        : spring({ frame, fps, config: { damping: springDamping, mass: springMass } });
    const exitStart = durationInFrames - exitFrames;
    const cardOut = noTransition
        ? 1
        : interpolate(frame, [exitStart, durationInFrames], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
          });

    const combinedOpacity = cardIn * cardOut;

    const domain = item.url
        ? (() => {
              try {
                  const u = new URL(item.url);
                  const host = u.hostname.replace(/^www\./, '');
                  const p = u.pathname.replace(/\/$/, '');
                  return p ? `${host}${p}` : host;
              } catch { return undefined; }
          })()
        : undefined;

    // If a mockup layout is provided, use LayoutRenderer for positioning
    if (mockupLayout) {
        const data: Record<string, string> = {
            itemName: item.name,
            itemDescription: item.description || '',
            itemDomain: domain || '',
            brandName,
            counter: '',
            itemFavicon: images?.favicon || '',
        };
        return (
            <AbsoluteFill style={{ opacity: combinedOpacity }}>
                <LayoutRenderer layout={mockupLayout} data={data} yScale={VIDEO.height / CAROUSEL.height} />
            </AbsoluteFill>
        );
    }

    // Fallback: hardcoded layout
    const brandFontSize = overrides?.brandFontSize ?? 28;
    const brandPos = overrides?.brandPosition ?? { x: spacing.pagePadding, y: 80 };

    return (
        <AbsoluteFill>
            {/* Item name at bottom */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 160,
                    left: spacing.pagePadding,
                    right: spacing.pagePadding,
                    fontFamily: fonts.heading,
                    fontSize: 48,
                    fontWeight: 800,
                    color: colors.white,
                    textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                    opacity: combinedOpacity,
                }}
            >
                {item.name}
            </div>

            {/* Domain */}
            {domain && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 120,
                        left: spacing.pagePadding,
                        fontFamily: fonts.body,
                        fontSize: 24,
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.6)',
                        opacity: combinedOpacity,
                    }}
                >
                    {domain}
                </div>
            )}

            {/* Brand */}
            <div
                style={{
                    position: 'absolute',
                    top: brandPos.y,
                    left: brandPos.x,
                    fontFamily: fonts.body,
                    fontSize: brandFontSize,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                }}
            >
                {brandName}
            </div>
        </AbsoluteFill>
    );
};

/* --- CTA Section --- */
const CtaSection: React.FC<{
    brandName: string;
    overrides?: VideoLayoutOverrides;
}> = ({ brandName, overrides }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const ctaIn = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
    const brandIn = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, mass: 0.8 } });

    const ctaFontSize = overrides?.ctaTextFontSize ?? 64;
    const ctaBrandFontSize = overrides?.ctaBrandFontSize ?? 36;

    return (
        <AbsoluteFill
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 32,
            }}
        >
            <div
                style={{
                    fontFamily: fonts.heading,
                    fontSize: ctaFontSize,
                    fontWeight: 800,
                    color: colors.white,
                    textAlign: 'center',
                    textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                    opacity: ctaIn,
                    transform: `scale(${interpolate(ctaIn, [0, 1], [0.8, 1])})`,
                }}
            >
                Follow for more!
            </div>
            <div
                style={{
                    fontFamily: fonts.body,
                    fontSize: ctaBrandFontSize,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)',
                    opacity: brandIn,
                    transform: `translateY(${interpolate(brandIn, [0, 1], [20, 0])}px)`,
                }}
            >
                {brandName}
            </div>
        </AbsoluteFill>
    );
};

/* --- Main Video Composition --- */
export const VideoComposition: React.FC<VideoReelProps> = ({
    template = 'card',
    backgroundVideo,
    backgroundImage,
    videoBackgroundMode = 'full',
    backgroundFallbackColor = '#0f172a',
    audioSrc,
    hookDurationFrames,
    itemDurationFrames,
    ctaDurationFrames,
    hookText,
    subtitle,
    brandName,
    items,
    layoutOverrides,
    hookLayout,
    mockupLayout,
    logoUrls,
}) => {
    const HOOK_FRAMES = hookDurationFrames ?? DEFAULT_HOOK_FRAMES;
    const ITEM_FRAMES = itemDurationFrames ?? DEFAULT_ITEM_FRAMES;
    const CTA_FRAMES = ctaDurationFrames ?? DEFAULT_CTA_FRAMES;

    const bgFallback =
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1920&fit=crop';

    const hookOnly = videoBackgroundMode === 'hook-only' && !!backgroundVideo;

    const bgStyle = { width: VIDEO.width, height: VIDEO.height, objectFit: 'cover' as const };

    const staticBg = backgroundImage ? (
        <Img src={resolveAsset(backgroundImage)} style={bgStyle} />
    ) : (
        <AbsoluteFill style={{ backgroundColor: backgroundFallbackColor }} />
    );

    return (
        <AbsoluteFill>
            {/* Background */}
            {hookOnly ? (
                <>
                    {/* Static bg behind everything (items + CTA) */}
                    {staticBg}

                    {/* Video only during hook */}
                    <Sequence from={0} durationInFrames={HOOK_FRAMES}>
                        <AbsoluteFill>
                            <Video src={resolveAsset(backgroundVideo!)} style={bgStyle} muted loop />
                        </AbsoluteFill>
                    </Sequence>
                </>
            ) : backgroundVideo ? (
                <Video src={resolveAsset(backgroundVideo)} style={bgStyle} muted loop />
            ) : backgroundImage ? (
                <Img src={resolveAsset(backgroundImage) || bgFallback} style={bgStyle} />
            ) : (
                <AbsoluteFill style={{ backgroundColor: backgroundFallbackColor }} />
            )}

            {/* Dark overlay */}
            {(() => {
                const ov = layoutOverrides?.overlayConfig ?? (
                    layoutOverrides?.showOverlay !== false
                        ? { enabled: true, direction: 'both' as const, opacity: 0.5, color: '#000000', offset: 0 }
                        : { enabled: false, direction: 'both' as const, opacity: 0.5, color: '#000000', offset: 0 }
                );
                return ov.enabled ? <div style={getOverlayStyle(ov)} /> : null;
            })()}

            {/* Audio track */}
            {audioSrc && <Audio src={resolveAsset(audioSrc)} />}

            {/* Hook */}
            <Sequence from={0} durationInFrames={HOOK_FRAMES}>
                <HookSection
                    hookText={hookText}
                    subtitle={subtitle}
                    brandName={brandName}
                    overrides={layoutOverrides}
                    hookLayout={hookLayout}
                    logoUrls={logoUrls}
                />
            </Sequence>

            {/* Continuous mockup image track — single sequence, no gaps */}
            {template === 'mockup' && items.length > 0 && (
                <Sequence from={HOOK_FRAMES} durationInFrames={items.length * ITEM_FRAMES}>
                    <MockupImageTrack items={items} itemFrames={ITEM_FRAMES} showOverlay={layoutOverrides?.showOverlay !== false} overlayConfig={layoutOverrides?.overlayConfig} />
                </Sequence>
            )}

            {/* Items (text overlays for mockup, full sections for card) */}
            {items.map((entry, i) => (
                <Sequence
                    key={i}
                    from={HOOK_FRAMES + i * ITEM_FRAMES}
                    durationInFrames={ITEM_FRAMES}
                >
                    {template === 'mockup' && entry.images?.mockup ? (
                        <MockupItemSection
                            item={entry}
                            slideNumber={i + 1}
                            totalSlides={items.length}
                            brandName={brandName}
                            overrides={layoutOverrides}
                            mockupLayout={mockupLayout}
                        />
                    ) : (
                        <ItemSection
                            item={entry}
                            slideNumber={i + 1}
                            totalSlides={items.length}
                            brandName={brandName}
                            overrides={layoutOverrides}
                        />
                    )}
                </Sequence>
            ))}

            {/* CTA */}
            {CTA_FRAMES > 0 && (
                <Sequence
                    from={HOOK_FRAMES + items.length * ITEM_FRAMES}
                    durationInFrames={CTA_FRAMES}
                >
                    <CtaSection brandName={brandName} overrides={layoutOverrides} />
                </Sequence>
            )}
        </AbsoluteFill>
    );
};
