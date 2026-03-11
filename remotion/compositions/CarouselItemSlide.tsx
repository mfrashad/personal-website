import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselItemSlideProps } from '../lib/types';
import { CAROUSEL, colors, fonts, spacing } from '../lib/theme';
import { LayoutRenderer } from './LayoutRenderer';
import { resolveAsset } from '../lib/resolve-asset';

export const CarouselItemSlide: React.FC<CarouselItemSlideProps> = ({
    backgroundImage,
    item,
    images,
    slideNumber,
    totalSlides,
    brandName,
    overrides,
}) => {
    const favicon = images?.favicon;
    const screenshot = images?.screenshot || images?.ogImage;

    // Apply overrides with defaults
    const nameFontSize = overrides?.nameFontSize ?? 44;
    const descFontSize = overrides?.descriptionFontSize ?? 28;
    const screenshotHeight = overrides?.screenshotHeight ?? 400;
    const cardMaxWidth = overrides?.cardMaxWidth ?? 920;
    const cardPadding = overrides?.cardPadding ?? spacing.cardPadding;
    const brandPos = overrides?.brandPosition ?? { x: spacing.pagePadding, y: spacing.pagePadding };
    const showLinks = overrides?.showLinks ?? false;
    const showDescription = overrides?.showDescription ?? true;
    const maxDescLen = overrides?.maxDescriptionLength ?? 120;
    const showOverlay = overrides?.showOverlay ?? true;

    const description = item.description
        ? item.description.length > maxDescLen
            ? item.description.slice(0, maxDescLen - 3) + '...'
            : item.description
        : '';

    return (
        <AbsoluteFill>
            {/* Background - blurred + darkened */}
            <Img
                src={resolveAsset(backgroundImage)}
                style={{
                    width: CAROUSEL.width,
                    height: CAROUSEL.height,
                    objectFit: 'cover',
                    filter: showOverlay ? 'blur(20px) brightness(0.4)' : 'blur(20px)',
                    transform: 'scale(1.1)',
                }}
            />

            {/* Content */}
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
                        padding: cardPadding,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 28,
                        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Header: favicon + name */}
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
                                letterSpacing: '-0.01em',
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
                                fontWeight: 400,
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
                            {item.tags.slice(0, 5).map((tag) => (
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
            </AbsoluteFill>

            {/* Custom elements overlay */}
            {overrides?.customElements && overrides.customElements.length > 0 && (
                <AbsoluteFill>
                    <LayoutRenderer
                        layout={{ elements: overrides.customElements }}
                        data={{
                            brandName,
                            itemName: item.name,
                            itemDescription: description,
                        }}
                    />
                </AbsoluteFill>
            )}

            {/* Brand watermark - top left */}
            <div
                style={{
                    position: 'absolute',
                    top: brandPos.y,
                    left: brandPos.x,
                    fontFamily: fonts.body,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.8)',
                }}
            >
                {brandName}
            </div>

        </AbsoluteFill>
    );
};
