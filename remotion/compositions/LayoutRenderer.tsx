import React from 'react';
import { Img } from 'remotion';
import type { SlideLayout, DesignElement, TextElement, ImageElement, LogoGridElement } from '../lib/design-types';

interface LayoutRendererProps {
    layout: SlideLayout;
    data: Record<string, string>;
    /** Logo URLs for logo-grid elements */
    logoUrls?: string[];
}

function resolveTokens(content: string, data: Record<string, string>): string {
    return content.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
}

const TextElementRenderer: React.FC<{ el: TextElement; data: Record<string, string> }> = ({
    el,
    data,
}) => {
    const resolved = resolveTokens(el.content, data);
    if (!resolved && el.content.startsWith('{{')) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
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
            }}
        >
            {resolved}
        </div>
    );
};

const ImageElementRenderer: React.FC<{ el: ImageElement; data: Record<string, string> }> = ({ el, data }) => {
    const resolvedSrc = resolveTokens(el.src, data);
    if (!resolvedSrc) return null;

    return (
        <Img
            src={resolvedSrc}
            style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                objectFit: el.objectFit,
                borderRadius: el.borderRadius,
                opacity: el.opacity,
            }}
        />
    );
};

const LogoGridElementRenderer: React.FC<{ el: LogoGridElement; logoUrls: string[] }> = ({
    el,
    logoUrls,
}) => {
    if (logoUrls.length === 0) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
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
                    src={url}
                    style={{
                        width: el.logoSize,
                        height: el.logoSize,
                        borderRadius: el.borderRadius,
                        objectFit: 'cover',
                        flexShrink: 0,
                    }}
                />
            ))}
        </div>
    );
};

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ layout, data, logoUrls }) => {
    return (
        <>
            {layout.elements
                .filter((el) => el.visible)
                .map((el) => {
                    if (el.type === 'text') {
                        return <TextElementRenderer key={el.id} el={el} data={data} />;
                    }
                    if (el.type === 'image') {
                        return <ImageElementRenderer key={el.id} el={el} data={data} />;
                    }
                    if (el.type === 'logo-grid') {
                        return <LogoGridElementRenderer key={el.id} el={el} logoUrls={logoUrls || []} />;
                    }
                    return null;
                })}
        </>
    );
};
