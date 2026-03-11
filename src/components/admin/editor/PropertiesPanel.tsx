import React from 'react';
import type { DesignElement, TextElement, ImageElement, LogoGridElement, ItemSlideOverrides } from '../../../../remotion/lib/design-types';
import type { OverlayConfig, OverlayDirection } from '../../../../remotion/lib/types';
import { DEFAULT_HOOK_OVERLAY, DEFAULT_ITEM_OVERLAY } from '../../../../remotion/lib/theme';

interface PropertiesPanelProps {
    element: DesignElement | null;
    editingSlideType: 'hook' | 'item' | 'mockup';
    itemOverrides: ItemSlideOverrides;
    onUpdateElement: (id: string, updates: Record<string, any>) => void;
    onUpdateItemOverride: <K extends keyof ItemSlideOverrides>(
        key: K,
        value: ItemSlideOverrides[K],
    ) => void;
    hookOverlayConfig?: OverlayConfig;
    onUpdateHookOverlay?: (config: OverlayConfig) => void;
}

const DIRECTION_OPTIONS: { value: OverlayDirection; label: string }[] = [
    { value: 'bottom', label: 'Bottom' },
    { value: 'top', label: 'Top' },
    { value: 'both', label: 'Both Edges' },
    { value: 'solid', label: 'Solid' },
];

const OverlayControls: React.FC<{
    config: OverlayConfig;
    onChange: (config: OverlayConfig) => void;
}> = ({ config, onChange }) => {
    const update = (patch: Partial<OverlayConfig>) => onChange({ ...config, ...patch });
    return (
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={sectionTitleStyle}>Overlay</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => update({ enabled: e.target.checked })}
                    />
                    On
                </label>
            </div>
            {config.enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                        <div style={fieldLabelStyle}>Direction</div>
                        <select
                            value={config.direction}
                            onChange={(e) => update({ direction: e.target.value as OverlayDirection })}
                            style={textInputStyle}
                        >
                            {DIRECTION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <SliderField
                        label="Opacity"
                        value={Math.round(config.opacity * 100)}
                        min={0}
                        max={100}
                        onChange={(v) => update({ opacity: v / 100 })}
                    />
                    {(config.direction === 'bottom' || config.direction === 'top') && (
                        <SliderField
                            label="Offset"
                            value={config.offset}
                            min={0}
                            max={90}
                            onChange={(v) => update({ offset: v })}
                        />
                    )}
                    <div>
                        <div style={fieldLabelStyle}>Color</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                type="color"
                                value={config.color}
                                onChange={(e) => update({ color: e.target.value })}
                                style={{ width: 32, height: 32, border: 'none', cursor: 'pointer' }}
                            />
                            <input
                                type="text"
                                value={config.color}
                                onChange={(e) => update({ color: e.target.value })}
                                style={{ ...textInputStyle, flex: 1 }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    element,
    editingSlideType,
    itemOverrides,
    onUpdateElement,
    onUpdateItemOverride,
    hookOverlayConfig,
    onUpdateHookOverlay,
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Overlay controls */}
            {editingSlideType === 'hook' && onUpdateHookOverlay && (
                <OverlayControls
                    config={hookOverlayConfig ?? DEFAULT_HOOK_OVERLAY}
                    onChange={onUpdateHookOverlay}
                />
            )}
            {(editingSlideType === 'item' || editingSlideType === 'mockup') && (
                <OverlayControls
                    config={itemOverrides.overlayConfig ?? { ...DEFAULT_ITEM_OVERLAY, enabled: itemOverrides.showOverlay ?? true }}
                    onChange={(config) => {
                        onUpdateItemOverride('overlayConfig', config);
                        onUpdateItemOverride('showOverlay', config.enabled);
                    }}
                />
            )}

            {/* Item slide overrides (always shown on item slides) */}
            {editingSlideType === 'item' && (
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
                    <div style={sectionTitleStyle}>Card Overrides</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <SliderField
                            label="Name Font Size"
                            value={itemOverrides.nameFontSize ?? 44}
                            min={24}
                            max={72}
                            onChange={(v) => onUpdateItemOverride('nameFontSize', v)}
                        />
                        <SliderField
                            label="Desc Font Size"
                            value={itemOverrides.descriptionFontSize ?? 28}
                            min={16}
                            max={48}
                            onChange={(v) => onUpdateItemOverride('descriptionFontSize', v)}
                        />
                        <SliderField
                            label="Screenshot Height"
                            value={itemOverrides.screenshotHeight ?? 400}
                            min={200}
                            max={600}
                            onChange={(v) => onUpdateItemOverride('screenshotHeight', v)}
                        />
                        <SliderField
                            label="Card Max Width"
                            value={itemOverrides.cardMaxWidth ?? 920}
                            min={600}
                            max={1020}
                            onChange={(v) => onUpdateItemOverride('cardMaxWidth', v)}
                        />
                        <SliderField
                            label="Card Padding"
                            value={itemOverrides.cardPadding ?? 48}
                            min={16}
                            max={80}
                            onChange={(v) => onUpdateItemOverride('cardPadding', v)}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 4 }}>
                            <input
                                type="checkbox"
                                checked={itemOverrides.showLinks ?? true}
                                onChange={(e) => onUpdateItemOverride('showLinks', e.target.checked)}
                            />
                            Show Links
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 4 }}>
                            <input
                                type="checkbox"
                                checked={itemOverrides.showDescription ?? true}
                                onChange={(e) => onUpdateItemOverride('showDescription', e.target.checked)}
                            />
                            Show Description
                        </label>
                        {(itemOverrides.showDescription ?? true) && (
                            <SliderField
                                label="Max Description Length"
                                value={itemOverrides.maxDescriptionLength ?? 120}
                                min={30}
                                max={300}
                                onChange={(v) => onUpdateItemOverride('maxDescriptionLength', v)}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Element properties */}
            {element ? (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={sectionTitleStyle}>
                            {element.type === 'text' ? 'Text' : element.type === 'logo-grid' ? 'Logo Grid' : 'Image'} Properties
                            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>
                                {element.id}
                            </span>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={element.visible}
                                onChange={(e) => onUpdateElement(element.id, { visible: e.target.checked })}
                            />
                            Visible
                        </label>
                    </div>

                    {/* Position */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <NumberField
                            label="X"
                            value={element.x}
                            onChange={(v) => onUpdateElement(element.id, { x: v })}
                        />
                        <NumberField
                            label="Y"
                            value={element.y}
                            onChange={(v) => onUpdateElement(element.id, { y: v })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <NumberField
                            label="W"
                            value={element.width}
                            onChange={(v) => onUpdateElement(element.id, { width: v })}
                        />
                        <NumberField
                            label="H"
                            value={element.height}
                            onChange={(v) => onUpdateElement(element.id, { height: v })}
                        />
                    </div>

                    {/* Text-specific */}
                    {element.type === 'text' && (
                        <>
                            {!element.content.startsWith('{{') && (
                                <div>
                                    <div style={fieldLabelStyle}>Content</div>
                                    <textarea
                                        value={element.content}
                                        onChange={(e) =>
                                            onUpdateElement(element.id, { content: e.target.value })
                                        }
                                        style={{ ...textInputStyle, minHeight: 60, resize: 'vertical' }}
                                    />
                                </div>
                            )}
                            <SliderField
                                label="Font Size"
                                value={(element as TextElement).fontSize}
                                min={12}
                                max={120}
                                onChange={(v) => onUpdateElement(element.id, { fontSize: v })}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={fieldLabelStyle}>Weight</div>
                                    <select
                                        value={(element as TextElement).fontWeight}
                                        onChange={(e) =>
                                            onUpdateElement(element.id, {
                                                fontWeight: Number(e.target.value),
                                            })
                                        }
                                        style={textInputStyle}
                                    >
                                        <option value={300}>Light</option>
                                        <option value={400}>Regular</option>
                                        <option value={500}>Medium</option>
                                        <option value={600}>SemiBold</option>
                                        <option value={700}>Bold</option>
                                        <option value={800}>ExtraBold</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={fieldLabelStyle}>Align</div>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {(['left', 'center', 'right'] as const).map((align) => (
                                            <button
                                                key={align}
                                                onClick={() => onUpdateElement(element.id, { textAlign: align })}
                                                style={{
                                                    flex: 1,
                                                    padding: '4px 0',
                                                    fontSize: 13,
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: 4,
                                                    cursor: 'pointer',
                                                    background: (element as TextElement).textAlign === align ? '#4f46e5' : '#fff',
                                                    color: (element as TextElement).textAlign === align ? '#fff' : '#334155',
                                                    fontWeight: (element as TextElement).textAlign === align ? 600 : 400,
                                                }}
                                            >
                                                {align[0].toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={fieldLabelStyle}>Color</div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={
                                            (element as TextElement).color.startsWith('rgba')
                                                ? '#ffffff'
                                                : (element as TextElement).color
                                        }
                                        onChange={(e) =>
                                            onUpdateElement(element.id, { color: e.target.value })
                                        }
                                        style={{ width: 32, height: 32, border: 'none', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={(element as TextElement).color}
                                        onChange={(e) =>
                                            onUpdateElement(element.id, { color: e.target.value })
                                        }
                                        style={{ ...textInputStyle, flex: 1 }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div style={fieldLabelStyle}>Background Color</div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                                        <input
                                            type="checkbox"
                                            checked={!!(element as TextElement).backgroundColor}
                                            onChange={(e) =>
                                                onUpdateElement(element.id, {
                                                    backgroundColor: e.target.checked ? 'rgba(0,0,0,0.6)' : undefined,
                                                    backgroundPadding: e.target.checked ? 12 : undefined,
                                                    backgroundBorderRadius: e.target.checked ? 8 : undefined,
                                                })
                                            }
                                        />
                                        On
                                    </label>
                                    {(element as TextElement).backgroundColor && (
                                        <>
                                            <input
                                                type="text"
                                                value={(element as TextElement).backgroundColor || ''}
                                                onChange={(e) =>
                                                    onUpdateElement(element.id, { backgroundColor: e.target.value })
                                                }
                                                style={{ ...textInputStyle, flex: 1 }}
                                                placeholder="rgba(0,0,0,0.6)"
                                            />
                                        </>
                                    )}
                                </div>
                                {(element as TextElement).backgroundColor && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                        <SliderField
                                            label="Padding"
                                            value={(element as TextElement).backgroundPadding ?? 12}
                                            min={0}
                                            max={40}
                                            onChange={(v) => onUpdateElement(element.id, { backgroundPadding: v })}
                                        />
                                        <SliderField
                                            label="Radius"
                                            value={(element as TextElement).backgroundBorderRadius ?? 8}
                                            min={0}
                                            max={30}
                                            onChange={(v) => onUpdateElement(element.id, { backgroundBorderRadius: v })}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Image-specific */}
                    {element.type === 'image' && (
                        <>
                            <SliderField
                                label="Border Radius"
                                value={(element as ImageElement).borderRadius}
                                min={0}
                                max={60}
                                onChange={(v) => onUpdateElement(element.id, { borderRadius: v })}
                            />
                            <SliderField
                                label="Opacity"
                                value={Math.round((element as ImageElement).opacity * 100)}
                                min={0}
                                max={100}
                                onChange={(v) => onUpdateElement(element.id, { opacity: v / 100 })}
                            />
                        </>
                    )}

                    {/* Logo-grid-specific */}
                    {element.type === 'logo-grid' && (
                        <>
                            <SliderField
                                label="Logo Size"
                                value={(element as LogoGridElement).logoSize}
                                min={32}
                                max={120}
                                onChange={(v) => onUpdateElement(element.id, { logoSize: v })}
                            />
                            <SliderField
                                label="Gap"
                                value={(element as LogoGridElement).gap}
                                min={8}
                                max={48}
                                onChange={(v) => onUpdateElement(element.id, { gap: v })}
                            />
                            <SliderField
                                label="Border Radius"
                                value={(element as LogoGridElement).borderRadius}
                                min={0}
                                max={60}
                                onChange={(v) => onUpdateElement(element.id, { borderRadius: v })}
                            />
                            <SliderField
                                label="Opacity"
                                value={Math.round((element as LogoGridElement).opacity * 100)}
                                min={0}
                                max={100}
                                onChange={(v) => onUpdateElement(element.id, { opacity: v / 100 })}
                            />
                        </>
                    )}

                    {/* Visibility + Lock */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <input
                                type="checkbox"
                                checked={element.visible}
                                onChange={(e) =>
                                    onUpdateElement(element.id, { visible: e.target.checked })
                                }
                            />
                            Visible
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <input
                                type="checkbox"
                                checked={element.locked}
                                onChange={(e) =>
                                    onUpdateElement(element.id, { locked: e.target.checked })
                                }
                            />
                            Locked
                        </label>
                    </div>
                </>
            ) : (
                (editingSlideType === 'hook' || editingSlideType === 'mockup') && (
                    <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 20 }}>
                        Click an element to edit
                    </div>
                )
            )}
        </div>
    );
};

// --- Field Components ---

const SliderField: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
}> = ({ label, value, min, max, onChange }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={fieldLabelStyle}>{label}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: '100%' }}
        />
    </div>
);

const NumberField: React.FC<{
    label: string;
    value: number;
    onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
    <div style={{ flex: 1 }}>
        <div style={fieldLabelStyle}>{label}</div>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ ...textInputStyle, width: '100%' }}
        />
    </div>
);

const sectionTitleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 10,
};

const fieldLabelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: '#64748b',
    marginBottom: 4,
};

const textInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
};
