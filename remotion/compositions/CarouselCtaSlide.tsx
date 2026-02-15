import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselCtaSlideProps } from '../lib/types';
import { CAROUSEL, colors, fonts, spacing } from '../lib/theme';

export const CarouselCtaSlide: React.FC<CarouselCtaSlideProps> = ({
    backgroundImage,
    ctaText,
    brandName,
}) => {
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
                    gap: 32,
                }}
            >
                <div
                    style={{
                        fontFamily: fonts.heading,
                        fontSize: 56,
                        fontWeight: 800,
                        color: colors.white,
                        textAlign: 'center',
                        lineHeight: 1.2,
                        textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                        maxWidth: 900,
                    }}
                >
                    {ctaText}
                </div>
                <div
                    style={{
                        fontFamily: fonts.body,
                        fontSize: 32,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.8)',
                    }}
                >
                    {brandName}
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
        </AbsoluteFill>
    );
};
