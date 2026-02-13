import React from 'react';
import {
    AbsoluteFill,
    Img,
    Video,
    Sequence,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from 'remotion';
import type { VideoReelProps } from '../lib/types';
import { VIDEO, colors, fonts, spacing } from '../lib/theme';

const HOOK_FRAMES = VIDEO.hookDurationSec * VIDEO.fps; // 90
const ITEM_FRAMES = VIDEO.itemDurationSec * VIDEO.fps; // 105
const CTA_FRAMES = VIDEO.ctaDurationSec * VIDEO.fps; // 60

/* ─── Hook Section ─── */
const HookSection: React.FC<{
    hookText: string;
    subtitle?: string;
    brandName: string;
}> = ({ hookText, subtitle, brandName }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleProgress = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
    const subtitleProgress = spring({
        frame: Math.max(0, frame - 12),
        fps,
        config: { damping: 14, mass: 0.8 },
    });
    const brandProgress = spring({
        frame: Math.max(0, frame - 6),
        fps,
        config: { damping: 14, mass: 0.8 },
    });

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
                    top: 80,
                    left: spacing.pagePadding,
                    fontFamily: fonts.body,
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                    opacity: brandProgress,
                    transform: `translateY(${interpolate(brandProgress, [0, 1], [20, 0])}px)`,
                }}
            >
                {brandName}
            </div>

            {/* Hook text */}
            <div
                style={{
                    fontFamily: fonts.heading,
                    fontSize: 80,
                    fontWeight: 800,
                    color: colors.white,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                    opacity: titleProgress,
                    transform: `scale(${interpolate(titleProgress, [0, 1], [0.85, 1])})`,
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
                        fontSize: 36,
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.8)',
                        textShadow: '0 2px 16px rgba(0,0,0,0.4)',
                        opacity: subtitleProgress,
                        transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
                    }}
                >
                    {subtitle}
                </div>
            )}
        </AbsoluteFill>
    );
};

/* ─── Item Card Section ─── */
const ItemSection: React.FC<{
    item: VideoReelProps['items'][number];
    slideNumber: number;
    totalSlides: number;
    brandName: string;
}> = ({ item: { item, images }, slideNumber, totalSlides, brandName }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const favicon = images?.favicon;
    const screenshot = images?.screenshot || images?.ogImage;
    const description = item.description
        ? item.description.length > 100
            ? item.description.slice(0, 97) + '...'
            : item.description
        : '';

    // Card entrance
    const cardIn = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
    // Card exit (start fading out 15 frames before end)
    const exitStart = ITEM_FRAMES - 18;
    const cardOut = interpolate(frame, [exitStart, ITEM_FRAMES], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Text stagger
    const nameIn = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 14, mass: 0.6 } });
    const descIn = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, mass: 0.6 } });
    const screenshotIn = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, mass: 0.6 } });
    const tagsIn = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 14, mass: 0.6 } });

    const combinedOpacity = cardIn * cardOut;
    const cardTranslateY = interpolate(cardIn, [0, 1], [80, 0]);
    const exitTranslateY = interpolate(cardOut, [0, 1], [-40, 0]);

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
                    maxWidth: 960,
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
                        opacity: nameIn,
                        transform: `translateX(${interpolate(nameIn, [0, 1], [40, 0])}px)`,
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
                            fontSize: 44,
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
                            fontSize: 28,
                            color: colors.textSecondary,
                            lineHeight: 1.5,
                            opacity: descIn,
                            transform: `translateX(${interpolate(descIn, [0, 1], [30, 0])}px)`,
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
                            opacity: screenshotIn,
                            transform: `scale(${interpolate(screenshotIn, [0, 1], [0.95, 1])})`,
                        }}
                    >
                        <img
                            src={screenshot}
                            style={{
                                width: '100%',
                                height: 380,
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
                            opacity: tagsIn,
                            transform: `translateY(${interpolate(tagsIn, [0, 1], [15, 0])}px)`,
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
                    top: 80,
                    left: spacing.pagePadding,
                    fontFamily: fonts.body,
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.85)',
                }}
            >
                {brandName}
            </div>
        </AbsoluteFill>
    );
};

/* ─── CTA Section ─── */
const CtaSection: React.FC<{ brandName: string }> = ({ brandName }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const ctaIn = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
    const brandIn = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, mass: 0.8 } });

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
                    fontSize: 64,
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
                    fontSize: 36,
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

/* ─── Main Video Composition ─── */
export const VideoComposition: React.FC<VideoReelProps> = ({
    backgroundVideo,
    backgroundImage,
    hookText,
    subtitle,
    brandName,
    items,
}) => {
    const bgFallback =
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1920&fit=crop';

    return (
        <AbsoluteFill>
            {/* Background */}
            {backgroundVideo ? (
                <Video
                    src={backgroundVideo}
                    style={{
                        width: VIDEO.width,
                        height: VIDEO.height,
                        objectFit: 'cover',
                    }}
                />
            ) : (
                <Img
                    src={backgroundImage || bgFallback}
                    style={{
                        width: VIDEO.width,
                        height: VIDEO.height,
                        objectFit: 'cover',
                    }}
                />
            )}

            {/* Dark overlay */}
            <AbsoluteFill
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
                }}
            />

            {/* Hook */}
            <Sequence from={0} durationInFrames={HOOK_FRAMES}>
                <HookSection hookText={hookText} subtitle={subtitle} brandName={brandName} />
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
                    />
                </Sequence>
            ))}

            {/* CTA */}
            <Sequence
                from={HOOK_FRAMES + items.length * ITEM_FRAMES}
                durationInFrames={CTA_FRAMES}
            >
                <CtaSection brandName={brandName} />
            </Sequence>
        </AbsoluteFill>
    );
};
