import React, { useRef, useCallback } from 'react';

interface ItemImages {
    favicon?: string;
    ogImage?: string;
    screenshot?: string;
}

interface ItemEdits {
    name?: string;
    description?: string;
    url?: string;
}

interface ItemImageEdits {
    favicon?: string;
    screenshot?: string;
}

interface ItemEditorPanelProps {
    itemName: string;
    itemDescription?: string;
    itemUrl?: string;
    images?: ItemImages;
    edits: ItemEdits;
    imageEdits: ItemImageEdits;
    imagePreviews: { favicon?: string; screenshot?: string };
    onUpdateEdit: (field: 'name' | 'description' | 'url', value: string) => void;
    onUploadImage: (type: 'favicon' | 'screenshot', file: File) => void;
    onResetImage: (type: 'favicon' | 'screenshot') => void;
    onReset: () => void;
}

export const ItemEditorPanel: React.FC<ItemEditorPanelProps> = ({
    itemName,
    itemDescription,
    itemUrl,
    images,
    edits,
    imageEdits,
    imagePreviews,
    onUpdateEdit,
    onUploadImage,
    onResetImage,
    onReset,
}) => {
    const faviconRef = useRef<HTMLInputElement>(null);
    const screenshotRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        (type: 'favicon' | 'screenshot') => (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file && file.type.startsWith('image/')) {
                onUploadImage(type, file);
            }
        },
        [onUploadImage],
    );

    const currentName = edits.name ?? itemName;
    const currentDesc = edits.description ?? itemDescription ?? '';
    const currentUrl = edits.url ?? itemUrl ?? '';
    const currentFavicon = imagePreviews.favicon || imageEdits.favicon || images?.favicon;
    const currentScreenshot = imagePreviews.screenshot || imageEdits.screenshot || images?.screenshot || images?.ogImage;

    const hasEdits = edits.name !== undefined || edits.description !== undefined || edits.url !== undefined ||
        imageEdits.favicon !== undefined || imageEdits.screenshot !== undefined;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Item Editor</div>
                {hasEdits && (
                    <button onClick={onReset} style={resetBtnStyle}>
                        Reset
                    </button>
                )}
            </div>

            {/* Name */}
            <div>
                <div style={labelStyle}>Name</div>
                <input
                    type="text"
                    value={currentName}
                    onChange={(e) => onUpdateEdit('name', e.target.value)}
                    style={inputStyle}
                />
            </div>

            {/* Description */}
            <div>
                <div style={labelStyle}>Description</div>
                <textarea
                    value={currentDesc}
                    onChange={(e) => onUpdateEdit('description', e.target.value)}
                    style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                />
            </div>

            {/* URL */}
            <div>
                <div style={labelStyle}>URL</div>
                <input
                    type="text"
                    value={currentUrl}
                    onChange={(e) => onUpdateEdit('url', e.target.value)}
                    placeholder="https://..."
                    style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}
                />
            </div>

            {/* Favicon / Logo */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={labelStyle}>Logo / Favicon</div>
                    {imageEdits.favicon && (
                        <button onClick={() => onResetImage('favicon')} style={smallResetStyle}>
                            Reset
                        </button>
                    )}
                </div>
                <div
                    onClick={() => faviconRef.current?.click()}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        border: '2px dashed #cbd5e1',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                    }}
                >
                    {currentFavicon ? (
                        <img
                            src={currentFavicon}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: 20, color: '#94a3b8' }}>+</span>
                    )}
                </div>
                <input
                    ref={faviconRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange('favicon')}
                />
            </div>

            {/* Screenshot */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={labelStyle}>Screenshot</div>
                    {imageEdits.screenshot && (
                        <button onClick={() => onResetImage('screenshot')} style={smallResetStyle}>
                            Reset
                        </button>
                    )}
                </div>
                <div
                    onClick={() => screenshotRef.current?.click()}
                    style={{
                        width: '100%',
                        height: 80,
                        borderRadius: 8,
                        border: '2px dashed #cbd5e1',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                    }}
                >
                    {currentScreenshot ? (
                        <img
                            src={currentScreenshot}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>Click to upload screenshot</span>
                    )}
                </div>
                <input
                    ref={screenshotRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange('screenshot')}
                />
            </div>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: '#64748b',
    marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
};

const resetBtnStyle: React.CSSProperties = {
    padding: '3px 8px',
    border: '1px solid #fecaca',
    borderRadius: 5,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    color: '#ef4444',
};

const smallResetStyle: React.CSSProperties = {
    padding: '1px 6px',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 10,
    fontWeight: 500,
    color: '#94a3b8',
};
