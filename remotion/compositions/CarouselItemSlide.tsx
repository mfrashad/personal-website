import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselItemSlideProps } from '../lib/types';
import { CAROUSEL, colors, fonts, spacing } from '../lib/theme';

export const CarouselItemSlide: React.FC<CarouselItemSlideProps> = ({
    backgroundImage,
    item,
    images,
    slideNumber,
    totalSlides,
    brandName,
}) => {
    const favicon = images?.favicon;
    const screenshot = images?.screenshot || images?.ogImage;
    const description = item.description
        ? item.description.length > 120
            ? item.description.slice(0, 117) + '...'
            : item.description
        : '';

    return (
        <AbsoluteFill>
            {/* Background - blurred + darkened */}
            <Img
                src={backgroundImage}
                style={{
                    width: CAROUSEL.width,
                    height: CAROUSEL.height,
                    objectFit: 'cover',
                    filter: 'blur(20px) brightness(0.4)',
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
                        maxWidth: 920,
                        backgroundColor: colors.card,
                        borderRadius: 32,
                        padding: spacing.cardPadding,
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
                                letterSpacing: '-0.01em',
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
                                src={screenshot}
                                style={{
                                    width: '100%',
                                    height: 400,
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
            </AbsoluteFill>

            {/* Brand watermark - top left */}
            <div
                style={{
                    position: 'absolute',
                    top: spacing.pagePadding,
                    left: spacing.pagePadding,
                    fontFamily: fonts.body,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.8)',
                }}
            >
                {brandName}
            </div>

            {/* Slide counter - bottom right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: spacing.pagePadding,
                    right: spacing.pagePadding,
                    fontFamily: fonts.body,
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                }}
            >
                {slideNumber}/{totalSlides}
            </div>
        </AbsoluteFill>
    );
};
