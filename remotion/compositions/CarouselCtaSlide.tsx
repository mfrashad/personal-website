import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselCtaSlideProps } from '../lib/types';
import { CAROUSEL, colors, fonts, spacing } from '../lib/theme';
import { resolveAsset } from '../lib/resolve-asset';

export const CarouselCtaSlide: React.FC<CarouselCtaSlideProps> = ({
    backgroundImage,
    ctaText,
    ctaSubtitle,
    ctaImage,
}) => {
    const bgSrc = ctaImage || backgroundImage;
    const useCustomBg = !!ctaImage;

    return (
        <AbsoluteFill>
            {/* Background */}
            <Img
                src={resolveAsset(bgSrc)}
                style={{
                    width: CAROUSEL.width,
                    height: CAROUSEL.height,
                    objectFit: 'cover',
                    ...(useCustomBg
                        ? {}
                        : { filter: 'blur(20px) brightness(0.4)', transform: 'scale(1.1)' }),
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
                {ctaSubtitle && (
                    <div
                        style={{
                            fontFamily: fonts.body,
                            fontSize: 28,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            lineHeight: 1.4,
                            maxWidth: 800,
                        }}
                    >
                        {ctaSubtitle}
                    </div>
                )}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
