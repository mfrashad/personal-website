import { useEffect, useState, useRef } from 'react';
import DraggablePolaroid from './DraggablePolaroid';

// Import polaroid images
import camelImg from '@assets/polaroids/camel.JPEG';
import codeImg from '@assets/polaroids/code.JPEG';
import coding2Img from '@assets/polaroids/coding2.JPEG';
import coding3Img from '@assets/polaroids/coding3.JPEG';
import contentImg from '@assets/polaroids/content.JPEG';
import cookingImg from '@assets/polaroids/cooking.JPEG';
import divingImg from '@assets/polaroids/diving.JPEG';
import judgingImg from '@assets/polaroids/judging.JPEG';
import ontvImg from '@assets/polaroids/ontv.jpeg';
import polaroidImg from '@assets/polaroids/polaroid.JPEG';
import profileImg from '@assets/polaroids/profile.JPEG';
import readingImg from '@assets/polaroids/reading.JPEG';
import selfieImg from '@assets/polaroids/selfie.JPEG';
import skydivingImg from '@assets/polaroids/skydiving.JPEG';
import snowboardingImg from '@assets/polaroids/snowboarding.JPEG';
import speakingImg from '@assets/polaroids/speaking.JPEG';
import speaking2Img from '@assets/polaroids/speaking2.JPEG';
import speaking3Img from '@assets/polaroids/speaking3.JPEG';
import speaking4Img from '@assets/polaroids/speaking4.JPEG';
import surfingImg from '@assets/polaroids/surfing.JPEG';
import talkImg from '@assets/polaroids/talk.JPEG';
import writingImg from '@assets/polaroids/writing.JPEG';

interface PolaroidData {
    src: string;
    srcVar?: string;
    alt: string;
    caption: string;
    initialX?: number;
    initialY: number;
    rotation: number;
    zIndex: number;
    enabled?: boolean;
}

// Define polaroid positions scattered across the page
const polaroidsConfig: PolaroidData[] = [
    {
        src: profileImg.src,
        srcVar: 'profileImg.src',
        alt: 'Profile',
        caption: 'That\'s me!',
        initialX: 55,
        initialY: 227,
        rotation: -5,
        zIndex: 100,
        enabled: true
    },
    {
        src: selfieImg.src,
        srcVar: 'selfieImg.src',
        alt: 'Selfie',
        caption: 'Hello there!',
        initialX: 177,
        initialY: 567,
        rotation: 7,
        zIndex: 101,
        enabled: true
    },
    {
        src: contentImg.src,
        srcVar: 'contentImg.src',
        alt: 'Shooting interview',
        caption: 'Shooting interview',
        initialX: 45,
        initialY: 1203,
        rotation: -4,
        zIndex: 102,
        enabled: true
    },
    {
        src: polaroidImg.src,
        srcVar: 'polaroidImg.src',
        alt: 'Polaroid moment',
        caption: 'In podcast',
        initialX: 55,
        initialY: 1460,
        rotation: 6,
        zIndex: 103,
        enabled: true
    },
    {
        src: judgingImg.src,
        srcVar: 'judgingImg.src',
        alt: 'Judging hackathon',
        caption: 'Judging competition',
        initialX: 59,
        initialY: 2261,
        rotation: -3,
        zIndex: 104,
        enabled: true
    },
    {
        src: speakingImg.src,
        srcVar: 'speakingImg.src',
        alt: 'Speaking at conference',
        caption: 'Speaking at a conference',
        initialX: 1455,
        initialY: 2907,
        rotation: 5,
        zIndex: 105,
        enabled: true
    },
    {
        src: speaking2Img.src,
        srcVar: 'speaking2Img.src',
        alt: 'Speaking',
        caption: 'On stage',
        initialX: 100,
        initialY: 2400,
        rotation: -6,
        zIndex: 106,
        enabled: false
    },
    {
        src: talkImg.src,
        srcVar: 'talkImg.src',
        alt: 'Giving a talk',
        caption: 'Tech talk',
        initialX: 31,
        initialY: 2843,
        rotation: 4,
        zIndex: 107,
        enabled: true
    },
    {
        src: speaking3Img.src,
        srcVar: 'speaking3Img.src',
        alt: 'Conference talk',
        caption: 'Tech conference',
        initialX: 100,
        initialY: 2800,
        rotation: -4,
        zIndex: 108,
        enabled: false
    },
    {
        src: writingImg.src,
        srcVar: 'writingImg.src',
        alt: 'Writing',
        caption: 'Sharing my thoughts',
        initialX: 68,
        initialY: 3687,
        rotation: 7,
        zIndex: 109,
        enabled: true
    },
    {
        src: codeImg.src,
        srcVar: 'codeImg.src',
        alt: 'Coding',
        caption: 'Writing code',
        initialX: 100,
        initialY: 4400,
        rotation: -5,
        zIndex: 110,
        enabled: false
    },
    {
        src: coding2Img.src,
        srcVar: 'coding2Img.src',
        alt: 'Coding session',
        caption: 'Building projects',
        initialX: 45,
        initialY: 4778,
        rotation: 6,
        zIndex: 111,
        enabled: true
    },
    {
        src: coding3Img.src,
        srcVar: 'coding3Img.src',
        alt: 'Coding time',
        caption: 'Hacking away',
        initialX: 100,
        initialY: 4600,
        rotation: -3,
        zIndex: 112,
        enabled: false
    },
    {
        src: skydivingImg.src,
        srcVar: 'skydivingImg.src',
        alt: 'Skydiving',
        caption: 'First skydive!',
        initialX: 513,
        initialY: 6336,
        rotation: 4,
        zIndex: 113,
        enabled: true
    },
    {
        src: surfingImg.src,
        srcVar: 'surfingImg.src',
        alt: 'Surfing',
        caption: 'Learning to surf',
        initialX: 236,
        initialY: 6362,
        rotation: -6,
        zIndex: 114,
        enabled: true
    },
    {
        src: snowboardingImg.src,
        srcVar: 'snowboardingImg.src',
        alt: 'Snowboarding',
        caption: 'Winter adventures',
        initialX: 1379,
        initialY: 6228,
        rotation: 5,
        zIndex: 115,
        enabled: true
    },
    {
        src: divingImg.src,
        srcVar: 'divingImg.src',
        alt: 'Diving',
        caption: 'Underwater exploration',
        initialX: 1128,
        initialY: 6299,
        rotation: -4,
        zIndex: 116,
        enabled: true
    },
    {
        src: camelImg.src,
        srcVar: 'camelImg.src',
        alt: 'Camel riding',
        caption: 'Desert adventures',
        initialX: 6,
        initialY: 6215,
        rotation: 7,
        zIndex: 117,
        enabled: true
    },
    {
        src: readingImg.src,
        srcVar: 'readingImg.src',
        alt: 'Reading',
        caption: 'i love reading :)',
        initialX: 1422,
        initialY: 6646,
        rotation: -5,
        zIndex: 118,
        enabled: true
    },
    {
        src: cookingImg.src,
        srcVar: 'cookingImg.src',
        alt: 'Cooking',
        caption: 'Culinary adventures',
        initialX: 100,
        initialY: 6900,
        rotation: 6,
        zIndex: 119,
        enabled: false
    },
    {
        src: speaking4Img.src,
        srcVar: 'speaking4Img.src',
        alt: 'Presenting',
        caption: 'Sharing knowledge',
        initialX: 38,
        initialY: 3118,
        rotation: -4,
        zIndex: 120,
        enabled: true
    },
    {
        src: ontvImg.src,
        srcVar: 'ontvImg.src',
        alt: 'On TV',
        caption: 'TV appearance',
        initialX: 1455,
        initialY: 1264,
        rotation: 5,
        zIndex: 121,
        enabled: true
    }
];

export default function ScatteredPolaroids() {
    const [screenWidth, setScreenWidth] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isDev, setIsDev] = useState(false);
    const [showDevPanel, setShowDevPanel] = useState(false);
    const [enabledPolaroids, setEnabledPolaroids] = useState<Map<number, boolean>>(new Map());
    const [bioOffset, setBioOffset] = useState(0);
    const currentPositions = useRef<Map<number, { x: number; y: number }>>(new Map());

    // Y position threshold - polaroids below this should be affected by bio slider
    const HERO_THRESHOLD = 700;

    // Calculate offset based on bio level (baseline is level 1 "Short")
    const calculateOffset = (level: number) => {
        const offsets = [-150, 0, 200, 900]; // TLDR, Short, Medium, Long
        return offsets[level] || 0;
    };

    useEffect(() => {
        // Set initial width
        setScreenWidth(window.innerWidth);

        // Check if we're in development
        setIsDev(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        // Update on resize
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Listen for bio level changes
        const handleBioLevelChange = (event: CustomEvent) => {
            const newOffset = calculateOffset(event.detail.level);
            setBioOffset(newOffset);
        };

        window.addEventListener('bioLevelChange', handleBioLevelChange as EventListener);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('bioLevelChange', handleBioLevelChange as EventListener);
        };
    }, []);

    // Initialize enabled state and positions from config
    useEffect(() => {
        const initialEnabled = new Map<number, boolean>();
        polaroidsConfig.forEach((config, index) => {
            initialEnabled.set(index, config.enabled !== false);
            // Initialize currentPositions with the initial values
            currentPositions.current.set(index, {
                x: config.initialX || 100,
                y: config.initialY
            });
        });
        setEnabledPolaroids(initialEnabled);
    }, []);

    // Use polaroidsConfig directly
    const polaroids = polaroidsConfig;

    // Handle position changes
    const handlePositionChange = (index: number, x: number, y: number) => {
        currentPositions.current.set(index, { x, y });
    };

    // Toggle polaroid visibility
    const togglePolaroid = (index: number) => {
        setEnabledPolaroids(prev => {
            const next = new Map(prev);
            next.set(index, !prev.get(index));
            return next;
        });
    };

    // Save positions to file
    const savePositions = async () => {
        setIsSaving(true);
        try {
            // Convert current positions to config format
            const updatedConfig = polaroidsConfig.map((config, index) => {
                const enabled = enabledPolaroids.get(index) !== false;
                const pos = currentPositions.current.get(index);
                if (pos) {
                    return {
                        srcVar: config.srcVar,
                        alt: config.alt,
                        caption: config.caption,
                        initialX: Math.round(pos.x),
                        initialY: Math.round(pos.y),
                        rotation: config.rotation,
                        zIndex: config.zIndex,
                        enabled
                    };
                }
                return {
                    srcVar: config.srcVar,
                    alt: config.alt,
                    caption: config.caption,
                    initialX: config.initialX,
                    initialY: config.initialY,
                    rotation: config.rotation,
                    zIndex: config.zIndex,
                    enabled
                };
            });

            const response = await fetch('/api/save-polaroids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedConfig)
            });

            const responseText = await response.text();

            if (response.ok) {
                alert('Polaroid positions saved! The file has been updated.');
            } else {
                let errorMsg = 'Unknown error';
                try {
                    const error = JSON.parse(responseText);
                    errorMsg = error.error || error.message || responseText;
                } catch {
                    errorMsg = responseText;
                }
                alert('Error saving: ' + errorMsg);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving positions: ' + error);
        } finally {
            setIsSaving(false);
        }
    };

    // Don't render until we have screen width
    if (screenWidth === 0) return null;

    return (
        <>
            {polaroids.map((polaroid, index) => {
                const isEnabled = enabledPolaroids.get(index) !== false;
                if (!isEnabled) return null;

                // Apply offset to polaroids positioned below the hero section
                const shouldOffset = polaroid.initialY > HERO_THRESHOLD;
                const adjustedY = shouldOffset ? polaroid.initialY + bioOffset : polaroid.initialY;

                return (
                    <DraggablePolaroid
                        key={index}
                        src={polaroid.src}
                        alt={polaroid.alt}
                        caption={polaroid.caption}
                        initialX={polaroid.initialX}
                        initialY={adjustedY}
                        rotation={polaroid.rotation}
                        zIndex={polaroid.zIndex}
                        onPositionChange={(x, y) => handlePositionChange(index, x, y)}
                    />
                );
            })}

            {/* Dev Tools - only in development */}
            {isDev && (
                <>
                    {/* Toggle Dev Panel Button */}
                    <button
                        onClick={() => setShowDevPanel(!showDevPanel)}
                        className="fixed top-20 left-4 z-[1000] bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-colors"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {showDevPanel ? '✖️ Close Polaroid Panel' : '📸 Polaroid Settings'}
                    </button>

                    {/* Dev Panel */}
                    {showDevPanel && (
                        <div
                            className="fixed top-36 left-4 z-[1000] bg-white rounded-lg shadow-2xl p-4 max-h-[60vh] overflow-y-auto w-80"
                            style={{ pointerEvents: 'auto' }}
                        >
                            <h3 className="font-bold text-lg mb-3 text-gray-800">Polaroid Controls</h3>
                            <div className="space-y-2 mb-4">
                                {polaroidsConfig.map((config, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={enabledPolaroids.get(index) !== false}
                                            onChange={() => togglePolaroid(index)}
                                            className="w-4 h-4"
                                        />
                                        <img
                                            src={config.src}
                                            alt={config.alt}
                                            className="w-8 h-8 object-cover rounded"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-700">{config.caption}</span>
                                            <span className="text-xs text-gray-400">{config.alt}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                Drag polaroids to position them, then click save.
                            </div>
                        </div>
                    )}

                    {/* Save button */}
                    <button
                        onClick={savePositions}
                        disabled={isSaving}
                        className="fixed top-20 right-4 z-[1000] bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-colors"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {isSaving ? 'Saving...' : '💾 Save Polaroid Positions'}
                    </button>
                </>
            )}
        </>
    );
}
