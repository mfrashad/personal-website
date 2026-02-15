import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselHookSlideProps } from '../lib/types';
import { CAROUSEL, colors, fonts, spacing } from '../lib/theme';
import { LayoutRenderer } from './LayoutRenderer';

export const CarouselHookSlide: React.FC<CarouselHookSlideProps> = ({
    backgroundImage,
    hookText,
    subtitle,
    brandName,
    layout,
    logoUrls,
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

            {layout ? (
                /* Layout-driven rendering */
                <AbsoluteFill>
                    <LayoutRenderer
                        layout={layout}
                        data={{
                            hookText: hookText,
                            subtitle: subtitle || '',
                            brandName: brandName,
                        }}
                        logoUrls={logoUrls}
                    />
                </AbsoluteFill>
            ) : (
                /* Original hardcoded rendering (backward compat) */
                <>
                    <AbsoluteFill
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: spacing.pagePadding,
                        }}
                    >
                        <div
                            style={{
                                fontFamily: fonts.heading,
                                fontSize: 72,
                                fontWeight: 800,
                                color: colors.white,
                                lineHeight: 1.15,
                                letterSpacing: '-0.02em',
                                marginBottom: subtitle ? 24 : 0,
                                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                            }}
                        >
                            {hookText}
                        </div>

                        {subtitle && (
                            <div
                                style={{
                                    fontFamily: fonts.body,
                                    fontSize: 32,
                                    fontWeight: 400,
                                    color: 'rgba(255,255,255,0.85)',
                                    lineHeight: 1.4,
                                    textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                                    textAlign: 'center',
                                }}
                            >
                                {subtitle}
                            </div>
                        )}
                    </AbsoluteFill>

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
                </>
            )}
        </AbsoluteFill>
    );
};
