import React from 'react';
import type { SlideLayout, DesignElement } from '../../../../remotion/lib/design-types';

interface AddElementToolbarProps {
    layout: SlideLayout;
    selectedElementId: string | null;
    editingSlideType: 'hook' | 'item' | 'mockup';
    onAddText: () => void;
    onSelectElement: (id: string | null) => void;
    onDeleteElement: (id: string) => void;
    onUpdateElement: (id: string, updates: Record<string, any>) => void;
    onResetLayout: () => void;
}

export const AddElementToolbar: React.FC<AddElementToolbarProps> = ({
    layout,
    selectedElementId,
    editingSlideType,
    onAddText,
    onSelectElement,
    onDeleteElement,
    onUpdateElement,
    onResetLayout,
}) => {
    const elements = layout.elements;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onAddText} style={toolbarBtnStyle}>
                    + Text
                </button>
                <button
                    onClick={onResetLayout}
                    style={{ ...toolbarBtnStyle, color: '#ef4444', borderColor: '#fecaca' }}
                >
                    Reset
                </button>
            </div>

            {/* Element layers */}
            {elements.length > 0 && (
                <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
                        Layers
                    </div>
                    <div
                        style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}
                    >
                        {elements.map((el) => (
                            <div
                                key={el.id}
                                onClick={() => onSelectElement(el.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '6px 10px',
                                    borderBottom: '1px solid #f1f5f9',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    background:
                                        selectedElementId === el.id ? '#eef2ff' : 'transparent',
                                    color: el.visible ? '#334155' : '#94a3b8',
                                }}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: el.type === 'text' ? '#6366f1' : '#22c55e',
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {getElementLabel(el)}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdateElement(el.id, { visible: !el.visible });
                                    }}
                                    title={el.visible ? 'Hide' : 'Show'}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: el.visible ? '#64748b' : '#cbd5e1',
                                        fontSize: 13,
                                        padding: '0 2px',
                                        lineHeight: 1,
                                    }}
                                >
                                    {el.visible ? '◉' : '◯'}
                                </button>
                                {el.locked && (
                                    <span style={{ fontSize: 10, color: '#94a3b8' }}>locked</span>
                                )}
                                {el.id.startsWith('custom-') && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteElement(el.id);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#ef4444',
                                            fontSize: 14,
                                            padding: '0 2px',
                                            lineHeight: 1,
                                        }}
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

function getElementLabel(el: DesignElement): string {
    if (el.type === 'text') {
        if (el.content.startsWith('{{')) {
            return el.content.replace(/\{\{|\}\}/g, '');
        }
        return el.content.slice(0, 30);
    }
    return 'Image';
}

const toolbarBtnStyle: React.CSSProperties = {
    padding: '6px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    color: '#4f46e5',
};
