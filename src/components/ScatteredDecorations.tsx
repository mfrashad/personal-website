import { useEffect, useState, useRef } from 'react';
import DraggableImage from './DraggableImage';

// Import decoration images (WebP optimized)
import cdImg from '@assets/decorations/cd.webp';
import chipImg from '@assets/decorations/chip.webp';
import kindleImg from '@assets/decorations/kindle.webp';
import newspaperImg from '@assets/decorations/newspaper.webp';
import openNotebookImg from '@assets/decorations/open-notebook.webp';
import penImg from '@assets/decorations/pen.webp';

interface DecorationData {
    src: string;
    alt: string;
    initialX?: number;
    initialY: number;
    width: number;
    rotation?: number;
    scale?: number;
    zIndex: number;
    srcVar?: string; // Variable name for saving
    enabled?: boolean; // Whether this decoration is visible
    shadow?: boolean; // Whether to show shadow
}

// Define decoration positions scattered across the page
const decorationsConfig: DecorationData[] = [
        {
            src: penImg.src,
            srcVar: 'penImg.src',
            alt: 'Pen decoration',
            initialX: 243,
            initialY: 230,
            width: 50,
            rotation: 10,
            scale: 0.7,
            zIndex: 100,
            enabled: true
        },
        {
            src: chipImg.src,
            srcVar: 'chipImg.src',
            alt: 'Chip decoration',
            initialX: 1609,
            initialY: 549,
            width: 100,
            rotation: -74,
            zIndex: 91,
            enabled: true
        },
        {
            src: cdImg.src,
            srcVar: 'cdImg.src',
            alt: 'CD decoration',
            initialX: -21,
            initialY: 538,
            width: 250,
            scale: 0.8,
            zIndex: 92,
            enabled: true
        },
        {
            src: kindleImg.src,
            srcVar: 'kindleImg.src',
            alt: 'Kindle decoration',
            initialX: 1260,
            initialY: 412,
            width: 500,
            zIndex: 93,
            enabled: true
        },
        {
            src: openNotebookImg.src,
            srcVar: 'openNotebookImg.src',
            alt: 'Notebook decoration',
            initialX: -282,
            initialY: 209,
            width: 500,
            rotation: -14,
            scale: 1.4,
            zIndex: 94,
            enabled: true
        },
        {
            src: newspaperImg.src,
            srcVar: 'newspaperImg.src',
            alt: 'Newspaper decoration',
            initialX: 1346,
            initialY: 133,
            width: 500,
            rotation: -20,
            scale: 1.1,
            zIndex: 80,
            enabled: true
        }
    ];

export default function ScatteredDecorations() {
    const [screenWidth, setScreenWidth] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isDev, setIsDev] = useState(false);
    const [showDevPanel, setShowDevPanel] = useState(false);
    const [selectedDecoration, setSelectedDecoration] = useState<number | null>(null);
    const [enabledDecorations, setEnabledDecorations] = useState<Map<number, boolean>>(new Map());
    const [decorationProps, setDecorationProps] = useState<Map<number, { rotation: number; scale: number; zIndex: number }>>(new Map());
    const currentPositions = useRef<Map<number, { x: number; y: number }>>(new Map());

    // Reference viewport width that positions were designed for
    const REFERENCE_WIDTH = 1692;

    // Scale X position based on current viewport width
    const scaleXPosition = (originalX: number) => {
        if (screenWidth === 0) return originalX;
        const scale = screenWidth / REFERENCE_WIDTH;
        return originalX * scale;
    };

    useEffect(() => {
        // Set initial width
        setScreenWidth(window.innerWidth);

        // Check if we're in development
        setIsDev(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        // Update on resize
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize enabled state and positions from config
    useEffect(() => {
        const initialEnabled = new Map<number, boolean>();
        const initialProps = new Map<number, { rotation: number; scale: number; zIndex: number }>();
        decorationsConfig.forEach((config, index) => {
            initialEnabled.set(index, config.enabled !== false);
            initialProps.set(index, {
                rotation: config.rotation || 0,
                scale: config.scale || 1,
                zIndex: config.zIndex
            });
            // Initialize currentPositions with the initial values
            currentPositions.current.set(index, {
                x: config.initialX || 100,
                y: config.initialY
            });
        });
        setEnabledDecorations(initialEnabled);
        setDecorationProps(initialProps);
        console.log('Initialized positions:', currentPositions.current);
    }, []);

    // Use decorationsConfig directly
    const decorations = decorationsConfig;

    // Handle position changes
    const handlePositionChange = (index: number, x: number, y: number) => {
        currentPositions.current.set(index, { x, y });
    };

    // Toggle decoration visibility
    const toggleDecoration = (index: number) => {
        setEnabledDecorations(prev => {
            const next = new Map(prev);
            next.set(index, !prev.get(index));
            return next;
        });
    };

    // Update decoration properties
    const updateDecorationProp = (index: number, prop: 'rotation' | 'scale' | 'zIndex', value: number) => {
        setDecorationProps(prev => {
            const next = new Map(prev);
            const current = next.get(index) || { rotation: 0, scale: 1, zIndex: 90 };
            next.set(index, { ...current, [prop]: value });
            return next;
        });
    };

    // Save positions to file
    const savePositions = async () => {
        setIsSaving(true);
        try {
            // Convert current positions to config format
            const updatedConfig = decorationsConfig.map((config, index) => {
                const enabled = enabledDecorations.get(index) !== false;
                const props = decorationProps.get(index) || { rotation: 0, scale: 1, zIndex: config.zIndex };
                const pos = currentPositions.current.get(index);
                if (pos) {
                    return {
                        srcVar: config.srcVar,
                        alt: config.alt,
                        initialX: Math.round(pos.x),
                        initialY: Math.round(pos.y),
                        width: config.width,
                        rotation: props.rotation,
                        scale: props.scale,
                        zIndex: props.zIndex,
                        enabled,
                        shadow: config.shadow
                    };
                }
                return {
                    srcVar: config.srcVar,
                    alt: config.alt,
                    initialX: config.initialX,
                    initialY: config.initialY,
                    width: config.width,
                    rotation: props.rotation,
                    scale: props.scale,
                    zIndex: props.zIndex,
                    enabled,
                    shadow: config.shadow
                };
            });

            console.log('Saving config:', updatedConfig);

            const response = await fetch('/api/save-decorations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedConfig)
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.ok) {
                const data = JSON.parse(responseText);
                alert('Positions saved! The file has been updated.');
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
            {decorations.map((decoration, index) => {
                const isEnabled = enabledDecorations.get(index) !== false;
                if (!isEnabled) return null;

                const props = decorationProps.get(index) || { rotation: 0, scale: 1, zIndex: decoration.zIndex };

                // Scale X position based on viewport width
                const scaledX = scaleXPosition(decoration.initialX || 100);

                return (
                    <DraggableImage
                        key={index}
                        src={decoration.src}
                        alt={decoration.alt}
                        initialX={scaledX}
                        initialY={decoration.initialY}
                        width={decoration.width}
                        rotation={props.rotation}
                        scale={props.scale}
                        zIndex={props.zIndex}
                        shadow={decoration.shadow}
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
                        className="fixed bottom-4 left-4 z-[1000] bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-colors"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {showDevPanel ? '✖️ Close Panel' : '🎨 Decoration Settings'}
                    </button>

                    {/* Dev Panel */}
                    {showDevPanel && (
                        <div
                            className="fixed top-20 left-4 z-[1000] bg-white rounded-lg shadow-2xl p-4 max-h-[70vh] overflow-y-auto w-96"
                            style={{ pointerEvents: 'auto' }}
                        >
                            <h3 className="font-bold text-lg mb-3 text-gray-800">Decoration Controls</h3>
                            <div className="space-y-3 mb-4">
                                {decorationsConfig.map((config, index) => {
                                    const props = decorationProps.get(index) || { rotation: 0, scale: 1, zIndex: config.zIndex };
                                    const isSelected = selectedDecoration === index;

                                    return (
                                        <div
                                            key={index}
                                            className={`border rounded-lg p-3 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={enabledDecorations.get(index) !== false}
                                                    onChange={() => toggleDecoration(index)}
                                                    className="w-4 h-4"
                                                />
                                                <img
                                                    src={config.src}
                                                    alt={config.alt}
                                                    className="w-8 h-8 object-contain"
                                                />
                                                <span className="text-sm font-medium text-gray-700 flex-1">{config.alt}</span>
                                                <button
                                                    onClick={() => setSelectedDecoration(isSelected ? null : index)}
                                                    className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded"
                                                >
                                                    {isSelected ? 'Hide' : 'Edit'}
                                                </button>
                                            </div>

                                            {isSelected && (
                                                <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                                                    <div>
                                                        <label className="text-xs text-gray-600 block mb-1">
                                                            Rotation: {props.rotation}°
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="-180"
                                                            max="180"
                                                            value={props.rotation}
                                                            onChange={(e) => updateDecorationProp(index, 'rotation', parseInt(e.target.value))}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-600 block mb-1">
                                                            Scale: {props.scale.toFixed(2)}x
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="0.1"
                                                            max="3"
                                                            step="0.1"
                                                            value={props.scale}
                                                            onChange={(e) => updateDecorationProp(index, 'scale', parseFloat(e.target.value))}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-600 block mb-1">
                                                            Z-Index (Layer): {props.zIndex}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="-100"
                                                            max="1000"
                                                            value={props.zIndex}
                                                            onChange={(e) => updateDecorationProp(index, 'zIndex', parseInt(e.target.value))}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                        <p className="text-xs text-gray-400 mt-1">Negative values go behind content</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                Drag decorations to position them, adjust properties, then click save.
                            </div>
                        </div>
                    )}

                    {/* Save button */}
                    <button
                        onClick={savePositions}
                        disabled={isSaving}
                        className="fixed bottom-4 right-4 z-[1000] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-colors"
                        style={{ pointerEvents: 'auto' }}
                    >
                        {isSaving ? 'Saving...' : '💾 Save Decoration Positions'}
                    </button>
                </>
            )}
        </>
    );
}
