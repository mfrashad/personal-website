import React, { useRef, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import type { SlideLayout } from '../../../../remotion/lib/design-types';

interface EditorOverlayProps {
    compositionWidth: number;
    compositionHeight: number;
    layout: SlideLayout;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Record<string, any>) => void;
    onDeleteElement: (id: string) => void;
    children: React.ReactNode;
}

export const EditorOverlay: React.FC<EditorOverlayProps> = ({
    compositionWidth,
    compositionHeight,
    layout,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    onDeleteElement,
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const moveableRef = useRef<Moveable>(null);
    const [displayWidth, setDisplayWidth] = useState(380);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDisplayWidth(entry.contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const scale = displayWidth / compositionWidth;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Don't delete if user is typing in an input
                if (
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement
                )
                    return;
                if (selectedElementId) {
                    const el = layout.elements.find((el) => el.id === selectedElementId);
                    if (el && !el.locked && el.id.startsWith('custom-')) {
                        onDeleteElement(selectedElementId);
                    }
                }
            }
            if (e.key === 'Escape') {
                onSelectElement(null);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedElementId, layout.elements, onDeleteElement, onSelectElement]);

    // Re-render moveable when selection changes
    useEffect(() => {
        moveableRef.current?.updateRect();
    }, [selectedElementId]);

    const selectedTarget = selectedElementId
        ? document.querySelector(`[data-element-id="${selectedElementId}"]`) as HTMLElement | null
        : null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: `${compositionWidth}/${compositionHeight}`,
            }}
        >
            {/* Remotion Player */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>{children}</div>

            {/* Interactive overlay - scaled to composition space */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: compositionWidth,
                    height: compositionHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    zIndex: 1,
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onSelectElement(null);
                    }
                }}
            >
                {layout.elements
                    .filter((el) => el.visible)
                    .map((el) => (
                        <div
                            key={el.id}
                            data-element-id={el.id}
                            style={{
                                position: 'absolute',
                                left: el.x,
                                top: el.y,
                                width: el.width,
                                height: el.height,
                                cursor: el.locked ? 'default' : 'move',
                                outline:
                                    selectedElementId === el.id
                                        ? '2px solid #4f46e5'
                                        : 'none',
                                outlineOffset: 2,
                                boxSizing: 'border-box',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!el.locked) onSelectElement(el.id);
                            }}
                            onMouseEnter={(e) => {
                                if (selectedElementId !== el.id && !el.locked) {
                                    (e.currentTarget as HTMLElement).style.outline =
                                        '1px dashed rgba(79, 70, 229, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedElementId !== el.id) {
                                    (e.currentTarget as HTMLElement).style.outline = 'none';
                                }
                            }}
                        />
                    ))}
            </div>

            {/* Moveable - rendered outside the scaled container */}
            {selectedTarget && selectedElementId && (
                <Moveable
                    ref={moveableRef}
                    target={selectedTarget}
                    draggable={
                        !layout.elements.find((el) => el.id === selectedElementId)?.locked
                    }
                    resizable={
                        !layout.elements.find((el) => el.id === selectedElementId)?.locked
                    }
                    snappable={true}
                    zoom={1 / scale}
                    origin={false}
                    throttleDrag={1}
                    throttleResize={1}
                    onDrag={({ target, left, top }) => {
                        target.style.left = `${left}px`;
                        target.style.top = `${top}px`;
                    }}
                    onDragEnd={({ target }) => {
                        if (selectedElementId) {
                            const left = parseFloat(target.style.left);
                            const top = parseFloat(target.style.top);
                            onUpdateElement(selectedElementId, {
                                x: Math.round(left),
                                y: Math.round(top),
                            });
                        }
                    }}
                    onResize={({ target, width, height, drag }) => {
                        target.style.width = `${width}px`;
                        target.style.height = `${height}px`;
                        target.style.left = `${drag.left}px`;
                        target.style.top = `${drag.top}px`;
                    }}
                    onResizeEnd={({ target }) => {
                        if (selectedElementId) {
                            onUpdateElement(selectedElementId, {
                                width: Math.round(parseFloat(target.style.width)),
                                height: Math.round(parseFloat(target.style.height)),
                                x: Math.round(parseFloat(target.style.left)),
                                y: Math.round(parseFloat(target.style.top)),
                            });
                        }
                    }}
                />
            )}
        </div>
    );
};
