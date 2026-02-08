import { useState } from 'react';

interface MinimalBioSliderProps {
    bios: string[];
}

// Strip annotation syntax and render markdown links and bold
function renderBio(text: string) {
    // First, strip all annotation syntax {type:content} -> content
    let cleaned = text.replace(/\{(?:highlight|underline|circle|box):([^}]*)\}/g, '$1');

    // Split by newlines to preserve paragraph structure
    const paragraphs = cleaned.split('\n\n');

    return paragraphs.map((paragraph, pIndex) => {
        // Split by lines within paragraph
        const lines = paragraph.split('\n');

        return (
            <p key={pIndex} className={pIndex > 0 ? 'mt-4' : ''}>
                {lines.map((line, lIndex) => (
                    <span key={lIndex}>
                        {lIndex > 0 && <br />}
                        {renderLine(line, `${pIndex}-${lIndex}`)}
                    </span>
                ))}
            </p>
        );
    });
}

// Render a single line with bold and links
function renderLine(text: string, keyPrefix: string) {
    // Match **bold** and [links](url)
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
        const key = `${keyPrefix}-${i}`;

        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key}>{part.slice(2, -2)}</strong>;
        }

        // Link
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            const [, linkText, url] = linkMatch;
            const isExternal = url.startsWith('http://') || url.startsWith('https://');
            return (
                <a
                    key={key}
                    href={url}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                    {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                    {linkText}
                </a>
            );
        }

        return <span key={key}>{part}</span>;
    });
}

export default function MinimalBioSlider({ bios }: MinimalBioSliderProps) {
    const [level, setLevel] = useState(14);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Minimal Slider Control - Above bio */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-xs font-mono text-content-muted">
                    Bio length
                </span>
                <input
                    type="range"
                    min="0"
                    max="19"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-32 h-1.5 bg-surface-tertiary rounded-full appearance-none cursor-pointer minimal-slider"
                />
            </div>

            {/* Bio Text - min-height matches level 14 to prevent layout shift */}
            <div className="text-content-body leading-relaxed text-center min-h-[24rem]">
                {renderBio(bios[level])}
            </div>

            <style>{`
                .minimal-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #171717;
                    cursor: pointer;
                }
                .minimal-slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #171717;
                    cursor: pointer;
                    border: none;
                }
                .dark .minimal-slider::-webkit-slider-thumb {
                    background: #e5e5e5;
                }
                .dark .minimal-slider::-moz-range-thumb {
                    background: #e5e5e5;
                }
            `}</style>
        </div>
    );
}
