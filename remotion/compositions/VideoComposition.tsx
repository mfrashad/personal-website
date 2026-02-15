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
import { VIDEO, colors, fonts, spacing } from '../lib/theme';

const DEFAULT_HOOK_FRAMES = VIDEO.hookDurationSec * VIDEO.fps;
const DEFAULT_ITEM_FRAMES = VIDEO.itemDurationSec * VIDEO.fps;
const DEFAULT_CTA_FRAMES = VIDEO.ctaDurationSec * VIDEO.fps;

/* --- Hook Section --- */
const HookSection: React.FC<{
    hookText: string;
    subtitle?: string;
    brandName: string;
    overrides?: VideoLayoutOverrides;
    logoUrls?: string[];
}> = ({ hookText, subtitle, brandName, overrides, logoUrls }) => {
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
                            src={url}
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 14,
                                objectFit: 'cover',
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
    const description = item.description
        ? item.description.length > 100
            ? item.description.slice(0, 97) + '...'
            : item.description
        : '';

    const nameFontSize = overrides?.itemNameFontSize ?? 44;
    const descFontSize = overrides?.itemDescFontSize ?? 28;
    const screenshotHeight = overrides?.itemScreenshotHeight ?? 380;
    const cardMaxWidth = overrides?.itemCardMaxWidth ?? 960;
    const brandFontSize = overrides?.brandFontSize ?? 28;
    const brandPos = overrides?.brandPosition ?? { x: spacing.pagePadding, y: 80 };
    const showLinks = overrides?.showLinks ?? false;
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
                        <img
                            src={favicon}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 14,
                                objectFit: 'cover',
                                flexShrink: 0,
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
                {description && (
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
                        <img
                            src={screenshot}
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

            {/* Slide counter */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: spacing.pagePadding,
                    fontFamily: fonts.body,
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                    opacity: combinedOpacity,
                }}
            >
                {slideNumber}/{totalSlides}
            </div>

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
        <Img src={backgroundImage} style={bgStyle} />
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
                            <Video src={backgroundVideo!} style={bgStyle} muted />
                        </AbsoluteFill>
                    </Sequence>
                </>
            ) : backgroundVideo ? (
                <Video src={backgroundVideo} style={bgStyle} muted />
            ) : backgroundImage ? (
                <Img src={backgroundImage || bgFallback} style={bgStyle} />
            ) : (
                <AbsoluteFill style={{ backgroundColor: backgroundFallbackColor }} />
            )}

            {/* Dark overlay */}
            <AbsoluteFill
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
                }}
            />

            {/* Audio track */}
            {audioSrc && <Audio src={audioSrc} />}

            {/* Hook */}
            <Sequence from={0} durationInFrames={HOOK_FRAMES}>
                <HookSection
                    hookText={hookText}
                    subtitle={subtitle}
                    brandName={brandName}
                    overrides={layoutOverrides}
                    logoUrls={logoUrls}
                />
            </Sequence>

            {/* Items */}
            {items.map((entry, i) => (
                <Sequence
                    key={i}
                    from={HOOK_FRAMES + i * ITEM_FRAMES}
                    durationInFrames={ITEM_FRAMES}
                >
                    <ItemSection
                        item={entry}
                        slideNumber={i + 1}
                        totalSlides={items.length}
                        brandName={brandName}
                        overrides={layoutOverrides}
                    />
                </Sequence>
            ))}

            {/* CTA */}
            <Sequence
                from={HOOK_FRAMES + items.length * ITEM_FRAMES}
                durationInFrames={CTA_FRAMES}
            >
                <CtaSection brandName={brandName} overrides={layoutOverrides} />
            </Sequence>
        </AbsoluteFill>
    );
};
