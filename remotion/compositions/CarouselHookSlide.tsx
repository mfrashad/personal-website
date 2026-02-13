import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import type { CarouselHookSlideProps } from '../lib/types';
import { CAROUSEL, colors, fonts, spacing } from '../lib/theme';

export const CarouselHookSlide: React.FC<CarouselHookSlideProps> = ({
    backgroundImage,
    hookText,
    subtitle,
    brandName,
}) => {
    return (
        <AbsoluteFill>
            {/* Background */}
            <Img
                src={backgroundImage}
                style={{
                    width: CAROUSEL.width,
                    height: CAROUSEL.height,
                    objectFit: 'cover',
                }}
            />

            {/* Dark gradient overlay */}
            <AbsoluteFill
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.75) 100%)',
                }}
            />

            {/* Content */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: spacing.pagePadding,
                    paddingBottom: 100,
                }}
            >
                {/* Hook text */}
                <div
                    style={{
                        fontFamily: fonts.heading,
                        fontSize: 72,
                        fontWeight: 800,
                        color: colors.white,
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        marginBottom: subtitle ? 24 : 40,
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    {hookText}
                </div>

                {/* Subtitle */}
                {subtitle && (
                    <div
                        style={{
                            fontFamily: fonts.body,
                            fontSize: 32,
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.85)',
                            lineHeight: 1.4,
                            marginBottom: 40,
                            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                        }}
                    >
                        {subtitle}
                    </div>
                )}

                {/* Swipe CTA */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <div
                        style={{
                            fontFamily: fonts.body,
                            fontSize: 26,
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.7)',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase' as const,
                        }}
                    >
                        Swipe to explore →
                    </div>
                </div>
            </AbsoluteFill>

            {/* Brand watermark */}
            <div
                style={{
                    position: 'absolute',
                    top: spacing.pagePadding,
                    left: spacing.pagePadding,
                    fontFamily: fonts.body,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.8)',
                    letterSpacing: '0.02em',
                }}
            >
                {brandName}
            </div>
        </AbsoluteFill>
    );
};
