import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    bios: {
        tldr: string;
        short: string;
        medium: string;
        long: string;
    };
    timeline: {
        tldr: TimelineLevel;
        short: TimelineLevel;
        medium: TimelineLevel;
        long: TimelineLevel;
    };
}

// Helper to render markdown bold text and links
function renderTextWithBold(text: string) {
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
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
        return part;
    });
}

export default function BioSlider({ bios, timeline }: BioSliderProps) {
    const [level, setLevel] = useState(1); // Start at "Short" instead of "TLDR"
    const [isSticky, setIsSticky] = useState(true);

    const bioLevels = [bios.tldr, bios.short, bios.medium, bios.long];
    const timelineLevels = [timeline.tldr, timeline.short, timeline.medium, timeline.long];
    const labels = ['TLDR', 'Short', 'Medium', 'Long'];

    const currentTimeline = timelineLevels[level];

    // Dispatch custom event when bio level changes
    useEffect(() => {
        const event = new CustomEvent('bioLevelChange', { detail: { level } });
        window.dispatchEvent(event);
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
                    if (rect.bottom < window.innerHeight - 200) {
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={level}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-neutral-700 leading-relaxed whitespace-pre-line w-full mx-auto"
                    >
                        {renderTextWithBold(bioLevels[level])}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Timeline - Currently & Previously */}
            <div className="grid md:grid-cols-2 gap-8 pb-32 w-full mx-auto">
                {/* Currently */}
                <div>
                    <h3 className="text-lg font-bold mb-4 relative z-[120]">currently:</h3>
                    <AnimatePresence mode="wait">
                        <motion.ul
                            key={`currently-${level}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="space-y-2 font-mono text-sm relative z-[120]"
                        >
                            {currentTimeline.currently.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    className="flex items-center gap-2"
                                >
                                    {item.icon && (
                                        <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                                    )}
                                    <span>{item.text}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </AnimatePresence>
                </div>

                {/* Previously */}
                <div>
                    <h3 className="text-lg font-bold mb-4 relative z-[120]">previously:</h3>
                    <AnimatePresence mode="wait">
                        <motion.ul
                            key={`previously-${level}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="space-y-1.5 font-mono text-sm text-neutral-700 relative z-[120]"
                        >
                            {currentTimeline.previously.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    className="flex items-center gap-2"
                                >
                                    {item.icon && (
                                        <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                                    )}
                                    <span>{item.text}</span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </AnimatePresence>
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
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl border border-neutral-200 py-5 px-8 relative z-[200]"
                    animate={{
                        scale: isSticky ? 1 : 1,
                        boxShadow: isSticky
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <label htmlFor="bio-range" className="block text-sm font-mono text-neutral-600 mb-3">
                        Adjust detail level:{' '}
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={level}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                                className="font-semibold text-neutral-900 inline-block"
                            >
                                {labels[level]}
                            </motion.span>
                        </AnimatePresence>
                    </label>
                    <input
                        id="bio-range"
                        type="range"
                        min="0"
                        max="3"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                    />

                    {/* Labels */}
                    <div className="flex justify-between mt-3 gap-2">
                        {labels.map((label, i) => (
                            <motion.button
                                key={i}
                                onClick={() => setLevel(i)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    backgroundColor: i === level ? '#171717' : '#fafafa',
                                    color: i === level ? '#ffffff' : '#525252',
                                    borderColor: i === level ? '#171717' : '#d4d4d4'
                                }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="text-xs font-mono px-3 py-1.5 rounded-lg flex-1 border"
                            >
                                {label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
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
