import React from 'react';
import type { VideoLayoutOverrides } from '../../../../remotion/lib/types';

interface VideoEditorPanelProps {
    overrides: VideoLayoutOverrides;
    onUpdate: <K extends keyof VideoLayoutOverrides>(key: K, value: VideoLayoutOverrides[K]) => void;
    onReset: () => void;
}

export const VideoEditorPanel: React.FC<VideoEditorPanelProps> = ({
    overrides,
    onUpdate,
    onReset,
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>Video Editor</div>
                <button
                    onClick={onReset}
                    style={{
                        padding: '4px 10px',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#ef4444',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Global */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                    type="checkbox"
                    checked={overrides.showLinks ?? false}
                    onChange={(e) => onUpdate('showLinks', e.target.checked)}
                />
                Show Links
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                    type="checkbox"
                    checked={overrides.showLogos ?? true}
                    onChange={(e) => onUpdate('showLogos', e.target.checked)}
                />
                Show Logos on Hook
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                    type="checkbox"
                    checked={overrides.disableItemTransition ?? false}
                    onChange={(e) => onUpdate('disableItemTransition', e.target.checked)}
                />
                Disable Item Transition
            </label>

            {!overrides.disableItemTransition && (
                <SliderField
                    label="Transition Speed"
                    value={Math.round((overrides.transitionSpeed ?? 0.5) * 100)}
                    min={0}
                    max={100}
                    onChange={(v) => onUpdate('transitionSpeed', v / 100)}
                />
            )}

            {/* Hook Section */}
            <Section title="Hook Section">
                <SliderField
                    label="Hook Font Size"
                    value={overrides.hookTextFontSize ?? 80}
                    min={40}
                    max={120}
                    onChange={(v) => onUpdate('hookTextFontSize', v)}
                />
                <SliderField
                    label="Subtitle Font Size"
                    value={overrides.subtitleFontSize ?? 36}
                    min={20}
                    max={60}
                    onChange={(v) => onUpdate('subtitleFontSize', v)}
                />
                <SliderField
                    label="Brand Font Size"
                    value={overrides.brandFontSize ?? 28}
                    min={16}
                    max={48}
                    onChange={(v) => onUpdate('brandFontSize', v)}
                />
            </Section>

            {/* Item Section */}
            <Section title="Item Cards">
                <SliderField
                    label="Card Max Width"
                    value={overrides.itemCardMaxWidth ?? 960}
                    min={600}
                    max={1020}
                    onChange={(v) => onUpdate('itemCardMaxWidth', v)}
                />
                <SliderField
                    label="Name Font Size"
                    value={overrides.itemNameFontSize ?? 44}
                    min={24}
                    max={72}
                    onChange={(v) => onUpdate('itemNameFontSize', v)}
                />
                <SliderField
                    label="Desc Font Size"
                    value={overrides.itemDescFontSize ?? 28}
                    min={16}
                    max={48}
                    onChange={(v) => onUpdate('itemDescFontSize', v)}
                />
                <SliderField
                    label="Screenshot Height"
                    value={overrides.itemScreenshotHeight ?? 380}
                    min={200}
                    max={600}
                    onChange={(v) => onUpdate('itemScreenshotHeight', v)}
                />
            </Section>

            {/* CTA Section */}
            <Section title="CTA Section">
                <SliderField
                    label="CTA Font Size"
                    value={overrides.ctaTextFontSize ?? 64}
                    min={32}
                    max={96}
                    onChange={(v) => onUpdate('ctaTextFontSize', v)}
                />
                <SliderField
                    label="CTA Brand Size"
                    value={overrides.ctaBrandFontSize ?? 36}
                    min={20}
                    max={60}
                    onChange={(v) => onUpdate('ctaBrandFontSize', v)}
                />
            </Section>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
);

const SliderField: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
}> = ({ label, value, min, max, onChange }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>{label}</span>
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
