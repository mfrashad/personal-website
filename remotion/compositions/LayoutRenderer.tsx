import React from 'react';
import { Img } from 'remotion';
import type { SlideLayout, DesignElement, TextElement, ImageElement, LogoGridElement } from '../lib/design-types';
import { resolveAsset } from '../lib/resolve-asset';

interface LayoutRendererProps {
    layout: SlideLayout;
    data: Record<string, string>;
    /** Logo URLs for logo-grid elements */
    logoUrls?: string[];
    /** Scale factor for Y positions (e.g. 1920/1350 to map 4:5 carousel coords to 9:16 video) */
    yScale?: number;
}

function resolveTokens(content: string, data: Record<string, string>): string {
    return content.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
}

const TextElementRenderer: React.FC<{ el: TextElement; data: Record<string, string>; yScale: number }> = ({
    el,
    data,
    yScale,
}) => {
    const resolved = resolveTokens(el.content, data);
    if (!resolved && el.content.startsWith('{{')) return null;

    const bgPad = el.backgroundPadding ?? 0;
    const hasBg = !!el.backgroundColor;

    return (
        <div
            style={{
                position: 'absolute',
                left: el.x,
                top: el.y * yScale,
                width: el.width,
                fontFamily: el.fontFamily,
                fontSize: el.fontSize,
                fontWeight: el.fontWeight,
                color: el.color,
                lineHeight: el.lineHeight,
                letterSpacing: el.letterSpacing,
                textAlign: el.textAlign,
                textShadow: el.textShadow,
                textTransform: el.textTransform as any,
                ...(hasBg && {
                    backgroundColor: el.backgroundColor,
                    padding: bgPad,
                    borderRadius: el.backgroundBorderRadius ?? 0,
                }),
            }}
        >
            {resolved}
        </div>
    );
};

const ImageElementRenderer: React.FC<{ el: ImageElement; data: Record<string, string>; yScale: number }> = ({ el, data, yScale }) => {
    const resolvedSrc = resolveTokens(el.src, data);
    if (!resolvedSrc) return null;

    return (
        <Img
            src={resolveAsset(resolvedSrc)}
            style={{
                position: 'absolute',
                left: el.x,
                top: el.y * yScale,
                width: el.width,
                height: el.height,
                objectFit: el.objectFit,
                borderRadius: el.borderRadius,
                opacity: el.opacity,
            }}
        />
    );
};

const LogoGridElementRenderer: React.FC<{ el: LogoGridElement; logoUrls: string[]; yScale: number }> = ({
    el,
    logoUrls,
    yScale,
}) => {
    if (logoUrls.length === 0) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: el.x,
                top: el.y * yScale,
                width: el.width,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: el.gap,
                opacity: el.opacity,
            }}
        >
            {logoUrls.map((url, i) => (
                <Img
                    key={i}
                    src={resolveAsset(url)}
                    style={{
                        width: el.logoSize,
                        height: el.logoSize,
                        borderRadius: el.borderRadius,
                        objectFit: 'contain',
                        flexShrink: 0,
                        background: 'rgba(255,255,255,0.12)',
                        padding: 4,
                    }}
                />
            ))}
        </div>
    );
};

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ layout, data, logoUrls, yScale = 1 }) => {
    return (
        <>
            {layout.elements
                .filter((el) => el.visible)
                .map((el) => {
                    if (el.type === 'text') {
                        return <TextElementRenderer key={el.id} el={el} data={data} yScale={yScale} />;
                    }
                    if (el.type === 'image') {
                        return <ImageElementRenderer key={el.id} el={el} data={data} yScale={yScale} />;
                    }
                    if (el.type === 'logo-grid') {
                        return <LogoGridElementRenderer key={el.id} el={el} logoUrls={logoUrls || []} yScale={yScale} />;
                    }
                    return null;
                })}
        </>
    );
};
