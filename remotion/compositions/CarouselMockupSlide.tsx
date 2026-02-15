import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselMockupSlideProps } from '../lib/types';
import { getDefaultMockupSlideLayout } from '../lib/default-layouts';
import { LayoutRenderer } from './LayoutRenderer';
import { CAROUSEL } from '../lib/theme';

export const CarouselMockupSlide: React.FC<CarouselMockupSlideProps> = ({
    item,
    mockupImage,
    slideNumber,
    totalSlides,
    brandName,
    favicon,
    layout,
}) => {
    const resolvedLayout = layout ?? getDefaultMockupSlideLayout();

    const domain = item.url
        ? new URL(item.url).hostname.replace(/^www\./, '')
        : '';

    const data: Record<string, string> = {
        itemName: item.name,
        itemDomain: domain,
        brandName,
        counter: `${slideNumber}/${totalSlides}`,
        itemFavicon: favicon || '',
    };

    return (
        <AbsoluteFill>
            {/* Mockup image - full screen */}
            <Img
                src={mockupImage}
                style={{
                    width: CAROUSEL.width,
                    height: CAROUSEL.height,
                    objectFit: 'cover',
                }}
            />

            {/* Bottom gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 350,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                }}
            />

            {/* Layout-driven text elements */}
            <LayoutRenderer layout={resolvedLayout} data={data} />
        </AbsoluteFill>
    );
};
