import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { CarouselMockupSlideProps } from '../lib/types';
import { getDefaultMockupSlideLayout } from '../lib/default-layouts';
import { LayoutRenderer } from './LayoutRenderer';
import { CAROUSEL, getOverlayStyle, DEFAULT_ITEM_OVERLAY } from '../lib/theme';
import { resolveAsset } from '../lib/resolve-asset';

export const CarouselMockupSlide: React.FC<CarouselMockupSlideProps> = ({
    item,
    mockupImage,
    slideNumber,
    totalSlides,
    brandName,
    favicon,
    layout,
    showOverlay = true,
    overlayConfig,
}) => {
    const resolvedLayout = layout ?? getDefaultMockupSlideLayout();

    const domain = item.url
        ? (() => {
              const u = new URL(item.url);
              const host = u.hostname.replace(/^www\./, '');
              const p = u.pathname.replace(/\/$/, '');
              return p ? `${host}${p}` : host;
          })()
        : '';

    const data: Record<string, string> = {
        itemName: item.name,
        itemDescription: item.description || '',
        itemDomain: domain,
        brandName,
        counter: '',
        itemFavicon: favicon || '',
    };

    return (
        <AbsoluteFill>
            {/* Mockup image - full screen */}
            <Img
                src={resolveAsset(mockupImage)}
                style={{
                    width: CAROUSEL.width,
                    height: CAROUSEL.height,
                    objectFit: 'cover',
                }}
            />

            {/* Bottom gradient overlay */}
            {(() => {
                const ov = overlayConfig ?? { ...DEFAULT_ITEM_OVERLAY, enabled: showOverlay };
                return ov.enabled ? <div style={getOverlayStyle(ov)} /> : null;
            })()}

            {/* Layout-driven text elements */}
            <LayoutRenderer layout={resolvedLayout} data={data} />
        </AbsoluteFill>
    );
};
