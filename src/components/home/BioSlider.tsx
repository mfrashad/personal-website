import { useState, useEffect } from 'react';
import { RoughNotation } from 'react-rough-notation';

interface TimelineItem {
    text: string;
    icon?: string;
    color?: string;
}

interface TimelineLevel {
    currently: TimelineItem[];
    previously: TimelineItem[];
}

interface BioSliderProps {
    bios: string[]; // Array of 20 bio variations
    timeline: TimelineLevel[]; // Array of 20 timeline variations
}

// Helper to render content inside notation (handles links inside annotations)
function renderNotationContent(content: string) {
    // Check if content is a markdown link
    const linkMatch = content.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
        const [, linkText, url] = linkMatch;
        const isExternal = url.startsWith('http://') || url.startsWith('https://');
        return (
            <a
                href={url}
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
                {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
            >
                {linkText}
            </a>
        );
    }
    return content;
}

// Helper to render markdown bold text, links, and rough notation
function renderTextWithBold(text: string, showAnnotations: boolean = false) {
    // Enhanced regex to capture: **bold**, [link](url), and {type:text} for rough notation
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|\{[a-z-]+:.*?\})/g);
    let annotationIndex = 0;

    return parts.map((part, i) => {
        // Handle bold **text**
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }

        // Handle markdown links [text](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            const [, linkText, url] = linkMatch;
            const isExternal = url.startsWith('http://') || url.startsWith('https://');
            return (
                <a
                    key={i}
                    href={url}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                    {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                    {linkText}
                </a>
            );
        }

        // Handle rough notation {type:text}
        const notationMatch = part.match(/^\{([a-z-]+):(.*?)\}$/);
        if (notationMatch) {
            const [, type, content] = notationMatch;
            const typeMap: Record<string, any> = {
                'underline': { type: 'underline', color: '#3b82f6' },
                'highlight': { type: 'highlight', color: '#fef08a' },
                'box': { type: 'box', color: '#ef4444' },
                'circle': { type: 'circle', color: '#8b5cf6', padding: 8 },
                'strike': { type: 'strike-through', color: '#6b7280' },
                'crossed': { type: 'crossed-off', color: '#dc2626' },
                'bracket': { type: 'bracket', color: '#059669' },
            };

            const config = typeMap[type] || { type: 'underline', color: '#3b82f6' };
            const currentIndex = annotationIndex++;
            const delay = 600 + currentIndex * 300; // Stagger animations by 300ms

            return (
                <RoughNotation
                    key={i}
                    type={config.type}
                    show={showAnnotations}
                    color={config.color}
                    animationDuration={800}
                    animationDelay={delay}
                    padding={config.padding}
                    strokeWidth={2}
                    iterations={2}
                >
                    {renderNotationContent(content)}
                </RoughNotation>
            );
        }

        return part;
    });
}

export default function BioSlider({ bios, timeline }: BioSliderProps) {
    const [level, setLevel] = useState(8); // Start at level 8 (Standard range)
    const [isSticky, setIsSticky] = useState(true);
    const [showAnnotations, setShowAnnotations] = useState(false);

    const currentTimeline = timeline[level];

    // Trigger annotations to show after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnnotations(true);
        }, 200); // Small delay before starting animations

        return () => clearTimeout(timer);
    }, []);

    // Reset and restart annotations when level changes
    useEffect(() => {
        setShowAnnotations(false);
        const timer = setTimeout(() => {
            setShowAnnotations(true);
        }, 50);

        return () => clearTimeout(timer);
    }, [level]);

    // Generate label for current level
    const getLevelLabel = (level: number) => {
        if (level === 0) return 'Minimal';
        if (level <= 4) return 'Brief';
        if (level <= 9) return 'Standard';
        if (level <= 14) return 'Detailed';
        return 'Complete';
    };

    // Dispatch custom event when bio level changes
    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is ready and listeners are set up
        const frame = requestAnimationFrame(() => {
            const event = new CustomEvent('bioLevelChange', { detail: { level } });
            window.dispatchEvent(event);
        });

        return () => cancelAnimationFrame(frame);
    }, [level]);

    // Handle sticky behavior - unstick when scrolling past the about section
    useEffect(() => {
        const handleScroll = () => {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect();

                // Add hysteresis to prevent flickering
                // Use different thresholds for sticking vs unsticking
                if (isSticky) {
                    // When sticky, need to scroll well past before unsticking
                    if (rect.bottom < window.innerHeight - 600) {
                        setIsSticky(false);
                    }
                } else {
                    // When not sticky, need to scroll well back before sticking again
                    if (rect.bottom > window.innerHeight + 100) {
                        setIsSticky(true);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    return (
        <div className="bio-slider-with-timeline w-full mx-auto">
            {/* Bio Text */}
            <div className="bio-content mb-8 relative z-[120] w-full mx-auto">
                <div className="text-neutral-700 leading-relaxed whitespace-pre-line w-full mx-auto">
                    {renderTextWithBold(bios[level], showAnnotations)}
                </div>
            </div>

            {/* Timeline - Currently & Previously */}
            <div className="grid md:grid-cols-2 gap-8 pb-32 w-full mx-auto">
                {/* Currently */}
                <div>
                    <h3 className="text-lg font-bold mb-4 relative z-[120]">currently:</h3>
                    <ul className="space-y-2 font-mono text-sm relative z-[120]">
                        {currentTimeline.currently.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {item.icon && (
                                    <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                                )}
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Previously */}
                <div>
                    <h3 className="text-lg font-bold mb-4 relative z-[120]">previously:</h3>
                    <ul className="space-y-1.5 font-mono text-sm text-neutral-700 relative z-[120]">
                        {currentTimeline.previously.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {item.icon && (
                                    <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                                )}
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Slider Control - Floating rounded bar */}
            <div
                className={
                    isSticky
                        ? 'fixed bottom-8 z-[200]'
                        : 'relative w-full max-w-2xl mx-auto'
                }
                style={isSticky ? {
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(42rem, calc(100vw - 2rem))'
                } : {}}
            >
                <div
                    className="bg-white rounded-2xl border border-neutral-200 py-5 px-8 relative z-[200]"
                    style={{
                        boxShadow: isSticky
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <label htmlFor="bio-range" className="block text-sm font-mono text-neutral-600 mb-3">
                        Adjust detail level:{' '}
                        <span className="font-semibold text-neutral-900">
                            {getLevelLabel(level)}
                        </span>
                    </label>
                    <input
                        id="bio-range"
                        type="range"
                        min="0"
                        max="19"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                    />

                    {/* Labels */}
                    <div className="flex justify-between mt-3 gap-2">
                        <button
                            onClick={() => setLevel(0)}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg flex-1 border"
                            style={{
                                backgroundColor: level === 0 ? '#171717' : '#fafafa',
                                color: level === 0 ? '#ffffff' : '#525252',
                                borderColor: level === 0 ? '#171717' : '#d4d4d4'
                            }}
                        >
                            Minimal
                        </button>
                        <button
                            onClick={() => setLevel(4)}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg flex-1 border"
                            style={{
                                backgroundColor: level >= 1 && level <= 4 ? '#171717' : '#fafafa',
                                color: level >= 1 && level <= 4 ? '#ffffff' : '#525252',
                                borderColor: level >= 1 && level <= 4 ? '#171717' : '#d4d4d4'
                            }}
                        >
                            Brief
                        </button>
                        <button
                            onClick={() => setLevel(9)}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg flex-1 border"
                            style={{
                                backgroundColor: level >= 5 && level <= 9 ? '#171717' : '#fafafa',
                                color: level >= 5 && level <= 9 ? '#ffffff' : '#525252',
                                borderColor: level >= 5 && level <= 9 ? '#171717' : '#d4d4d4'
                            }}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setLevel(14)}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg flex-1 border"
                            style={{
                                backgroundColor: level >= 10 && level <= 14 ? '#171717' : '#fafafa',
                                color: level >= 10 && level <= 14 ? '#ffffff' : '#525252',
                                borderColor: level >= 10 && level <= 14 ? '#171717' : '#d4d4d4'
                            }}
                        >
                            Detailed
                        </button>
                        <button
                            onClick={() => setLevel(19)}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg flex-1 border"
                            style={{
                                backgroundColor: level >= 15 ? '#171717' : '#fafafa',
                                color: level >= 15 ? '#ffffff' : '#525252',
                                borderColor: level >= 15 ? '#171717' : '#d4d4d4'
                            }}
                        >
                            Complete
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Styles for Range Slider */}
            <style jsx>{`
                input[type='range'].slider {
                    -webkit-appearance: none;
                    appearance: none;
                }

                input[type='range'].slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #171717;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                input[type='range'].slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #171717;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                input[type='range'].slider::-webkit-slider-thumb:hover {
                    background: #000000;
                    transform: scale(1.1);
                }

                input[type='range'].slider::-moz-range-thumb:hover {
                    background: #000000;
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}
