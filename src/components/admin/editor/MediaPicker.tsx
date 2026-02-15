import React, { useState, useEffect, useRef, useCallback } from 'react';

interface MediaItem {
    name: string;
    path: string;
    type: 'image' | 'video' | 'audio';
    size: number;
    modified: number;
}

interface MediaPickerProps {
    /** Filter by media type */
    type: 'image' | 'video' | 'audio';
    /** Called when user selects a file (path is server-relative, e.g. /content-generator/library/foo.jpg) */
    onSelect: (path: string, name: string) => void;
    /** Label shown on the trigger button */
    label?: string;
    /** Current selected path (for highlighting) */
    currentPath?: string | null;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
    type,
    onSelect,
    label,
    currentPath,
}) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*';

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/media-library?type=${type}`);
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [type]);

    useEffect(() => {
        if (open) fetchItems();
    }, [open, fetchItems]);

    // Close on click outside
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleUpload = useCallback(
        async (file: File) => {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-'));
            try {
                const res = await fetch('/api/admin/media-library', { method: 'POST', body: formData });
                const data = await res.json();
                if (res.ok) {
                    onSelect(data.path, data.name);
                    setOpen(false);
                    fetchItems();
                }
            } finally {
                setUploading(false);
            }
        },
        [onSelect, fetchItems],
    );

    const handleDelete = useCallback(
        async (e: React.MouseEvent, item: MediaItem) => {
            e.stopPropagation();
            try {
                await fetch('/api/admin/media-library', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filePath: item.path }),
                });
                setItems((prev) => prev.filter((i) => i.path !== item.path));
            } catch {
                // ignore
            }
        },
        [],
    );

    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    padding: '4px 10px',
                    border: '1px solid #c7d2fe',
                    borderRadius: 6,
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#4f46e5',
                }}
            >
                {label || 'Library'}
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 4,
                        width: 320,
                        maxHeight: 360,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '10px 12px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                            {type === 'image' ? 'Images' : type === 'video' ? 'Videos' : 'Audio'}
                        </span>
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            style={{
                                padding: '4px 10px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 5,
                                background: '#f8fafc',
                                cursor: 'pointer',
                                fontSize: 11,
                                fontWeight: 600,
                                color: uploading ? '#94a3b8' : '#334155',
                            }}
                        >
                            {uploading ? 'Uploading...' : '+ Upload'}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept={accept}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(file);
                                e.target.value = '';
                            }}
                        />
                    </div>

                    {/* Items */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
                        {loading ? (
                            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                                Loading...
                            </div>
                        ) : items.length === 0 ? (
                            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                                No {type} files yet
                            </div>
                        ) : type === 'image' || type === 'video' ? (
                            /* Image / Video grid */
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 4,
                                }}
                            >
                                {items.map((item) => (
                                    <div
                                        key={item.path}
                                        onClick={() => {
                                            onSelect(item.path, item.name);
                                            setOpen(false);
                                        }}
                                        style={{
                                            position: 'relative',
                                            aspectRatio: '1',
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border:
                                                currentPath === item.path
                                                    ? '2px solid #4f46e5'
                                                    : '2px solid transparent',
                                        }}
                                    >
                                        {item.type === 'video' ? (
                                            <video
                                                src={item.path}
                                                muted
                                                preload="metadata"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={item.path}
                                                alt={item.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(e, item)}
                                            style={deleteBtnStyle}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Audio list */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {items.map((item) => (
                                    <div
                                        key={item.path}
                                        onClick={() => {
                                            onSelect(item.path, item.name);
                                            setOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '6px 8px',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            background:
                                                currentPath === item.path ? '#eef2ff' : 'transparent',
                                            border:
                                                currentPath === item.path
                                                    ? '1px solid #c7d2fe'
                                                    : '1px solid transparent',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 6,
                                                background: type === 'video' ? '#f3e8ff' : '#fef3c7',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {type === 'video' ? '▶' : '♪'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: '#334155',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: 10, color: '#94a3b8' }}>
                                                {formatSize(item.size)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, item)}
                                            style={{ ...deleteBtnStyle, position: 'static' }}
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const deleteBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    border: 'none',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: 12,
    lineHeight: '18px',
    textAlign: 'center',
    padding: 0,
    cursor: 'pointer',
    opacity: 0.7,
};
