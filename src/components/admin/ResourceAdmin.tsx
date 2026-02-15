import { useState, useEffect, useCallback, useRef } from 'react';

interface Item {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
    [key: string]: any;
}

interface Category {
    category: string;
    title: string;
    icon: string;
    items: Item[];
}

interface ImageResult {
    favicon?: string;
    ogImage?: string;
}

function getDomainKey(url?: string): string | null {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.replace(/^www\./, '');
        const domain = hostname.replace(/\./g, '-');
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2) {
            return `${domain}-${pathSegments.join('-')}`;
        }
        return domain;
    } catch {
        return null;
    }
}

function ImageDropZone({
    label,
    imageType,
    currentSrc,
    domainKey,
    onUploaded,
}: {
    label: string;
    imageType: 'favicon' | 'ogImage' | 'screenshot';
    currentSrc?: string;
    domainKey: string | null;
    onUploaded: (path: string, type: string) => void;
}) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const zoneRef = useRef<HTMLDivElement>(null);

    const upload = useCallback(async (file: File) => {
        if (!domainKey) {
            setError('No URL set - add a URL first');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Not an image file');
            return;
        }
        // Show local preview immediately
        const blobUrl = URL.createObjectURL(file);
        setLocalPreview(blobUrl);
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('domainKey', domainKey);
            formData.append('imageType', imageType);
            const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            onUploaded(data.path, imageType);
        } catch (err: any) {
            setError(err.message);
            setLocalPreview(null);
            URL.revokeObjectURL(blobUrl);
        } finally {
            setUploading(false);
        }
    }, [domainKey, imageType, onUploaded]);

    useEffect(() => {
        const zone = zoneRef.current;
        if (!zone) return;
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) upload(file);
                    return;
                }
            }
        };
        zone.addEventListener('paste', handlePaste);
        return () => zone.removeEventListener('paste', handlePaste);
    }, [upload]);

    const isFavicon = imageType === 'favicon';
    const imgW = isFavicon ? 48 : 160;
    const imgH = isFavicon ? 48 : 90;
    const displaySrc = localPreview || (currentSrc ? currentSrc + '?t=' + Date.now() : null);

    return (
        <div
            ref={zoneRef}
            tabIndex={0}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) upload(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: 10,
                border: dragging ? '2px dashed #4361ee' : '2px dashed #ddd',
                borderRadius: 8,
                background: dragging ? '#f0f4ff' : '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.15s',
                outline: 'none',
                minWidth: isFavicon ? 80 : 180,
            }}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(file);
                    e.target.value = '';
                }}
            />
            {displaySrc ? (
                <img
                    src={displaySrc}
                    alt={label}
                    style={{
                        width: imgW,
                        height: imgH,
                        objectFit: 'contain',
                        borderRadius: 4,
                        border: '1px solid #e0e0e0',
                        background: '#fff',
                    }}
                />
            ) : (
                <div style={{
                    width: imgW,
                    height: imgH,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#bbb',
                    fontSize: 11,
                    textAlign: 'center',
                }}>
                    No image
                </div>
            )}
            <span style={{ fontSize: 10, fontWeight: 600, color: '#555' }}>{label}</span>
            <span style={{ fontSize: 9, color: '#aaa' }}>
                {uploading ? 'Uploading...' : 'Drop, paste, or click'}
            </span>
            {error && <span style={{ fontSize: 9, color: '#e74c3c' }}>{error}</span>}
        </div>
    );
}

export default function ResourceAdmin() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [editState, setEditState] = useState<Record<string, Item>>({});
    const [saving, setSaving] = useState<string | null>(null);
    const [fetching, setFetching] = useState<string | null>(null);
    const [fetchedImages, setFetchedImages] = useState<Record<string, ImageResult>>({});
    const [resourceImages, setResourceImages] = useState<Record<string, { favicon?: string; ogImage?: string; screenshot?: string }>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [search, setSearch] = useState('');

    const showToast = useCallback((msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        Promise.all([
            fetch('/api/admin/lists').then((r) => r.json()),
            fetch('/src/data/resource-images.json').then((r) => r.json()),
        ])
            .then(([listData, imageData]) => {
                if (listData.error) throw new Error(listData.error);
                setCategories(listData);
                if (listData.length > 0) setSelected(listData[0].category);
                setResourceImages(imageData.images || {});
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const selectedCategory = categories.find((c) => c.category === selected);

    const filteredItems = selectedCategory?.items.filter((item) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            item.name.toLowerCase().includes(q) ||
            (item.url || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            (item.tags || []).some((t) => t.toLowerCase().includes(q))
        );
    });

    function getManifestImages(url?: string): { favicon?: string; ogImage?: string; screenshot?: string } {
        if (!url) return {};
        try {
            const hostname = new URL(url).hostname.replace(/^www\./, '');
            const key = hostname.replace(/\./g, '-');
            return resourceImages[key] || {};
        } catch {
            return {};
        }
    }

    function handleImageUploaded(url: string | undefined, uploadedPath: string, imageType: string) {
        const key = getDomainKey(url);
        if (!key) return;
        setResourceImages((s) => ({
            ...s,
            [key]: { ...s[key], [imageType]: uploadedPath },
        }));
    }

    function getEditItem(name: string, original: Item): Item {
        return editState[name] || { ...original };
    }

    function updateEditField(name: string, original: Item, field: string, value: any) {
        const current = getEditItem(name, original);
        setEditState((s) => ({ ...s, [name]: { ...current, [field]: value } }));
    }

    async function handleSave(originalName: string) {
        if (!selected) return;
        const item = editState[originalName];
        if (!item) {
            showToast('No changes to save', 'error');
            return;
        }

        setSaving(originalName);
        try {
            const res = await fetch('/api/admin/update-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: selected, originalName, item }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Save failed');

            // Update local state
            setCategories((cats) =>
                cats.map((c) => {
                    if (c.category !== selected) return c;
                    return {
                        ...c,
                        items: c.items.map((it) => (it.name === originalName ? { ...item } : it)),
                    };
                }),
            );

            // If name changed, update edit state key
            if (item.name !== originalName) {
                setEditState((s) => {
                    const next = { ...s };
                    delete next[originalName];
                    return next;
                });
                setExpandedItem(item.name);
            }

            showToast(`Saved "${item.name}"`, 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(null);
        }
    }

    async function handleFetchImages(name: string, url: string) {
        if (!url) return;
        setFetching(name);
        try {
            const res = await fetch('/api/admin/fetch-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Fetch failed');
            setFetchedImages((s) => ({ ...s, [name]: data }));
            // Also update manifest cache so images persist across tab switches
            if (data.favicon || data.ogImage || data.screenshot) {
                try {
                    const hostname = new URL(url).hostname.replace(/^www\./, '');
                    const key = hostname.replace(/\./g, '-');
                    setResourceImages((s) => ({ ...s, [key]: { ...s[key], ...data } }));
                } catch {}
            }
            showToast('Images fetched', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setFetching(null);
        }
    }

    if (loading) {
        return (
            <div style={styles.loadingScreen}>
                <div style={styles.spinner} />
                <p>Loading resource lists...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.loadingScreen}>
                <p style={{ color: '#e74c3c' }}>Error: {error}</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {toast && (
                <div
                    style={{
                        ...styles.toast,
                        background: toast.type === 'success' ? '#27ae60' : '#e74c3c',
                    }}
                >
                    {toast.msg}
                </div>
            )}

            <header style={styles.header}>
                <h1 style={styles.headerTitle}>Resource Admin</h1>
                <span style={styles.headerSubtitle}>
                    {categories.length} categories, {categories.reduce((n, c) => n + c.items.length, 0)} items
                </span>
            </header>

            <div style={styles.layout}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    {categories.map((cat) => (
                        <button
                            key={cat.category}
                            onClick={() => {
                                setSelected(cat.category);
                                setExpandedItem(null);
                                setSearch('');
                            }}
                            style={{
                                ...styles.sidebarItem,
                                ...(selected === cat.category ? styles.sidebarItemActive : {}),
                            }}
                        >
                            <span style={styles.sidebarTitle}>{cat.title}</span>
                            <span style={styles.sidebarCount}>{cat.items.length}</span>
                        </button>
                    ))}
                </aside>

                {/* Main */}
                <main style={styles.main}>
                    {selectedCategory && (
                        <>
                            <div style={styles.mainHeader}>
                                <h2 style={styles.mainTitle}>{selectedCategory.title}</h2>
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </div>

                            <div style={styles.itemList}>
                                {(filteredItems || []).map((item) => {
                                    const isExpanded = expandedItem === item.name;
                                    const edit = getEditItem(item.name, item);
                                    const freshImages = fetchedImages[item.name];
                                    const manifestImages = getManifestImages(item.url);
                                    const isSaving = saving === item.name;
                                    const isFetching = fetching === item.name;
                                    const faviconSrc = item.image || freshImages?.favicon || manifestImages.favicon;
                                    const ogSrc = freshImages?.ogImage || manifestImages.ogImage;
                                    const screenshotSrc = (manifestImages as any).screenshot;

                                    return (
                                        <div key={item.name} style={styles.itemCard}>
                                            {/* Collapsed row */}
                                            <div
                                                style={styles.itemRow}
                                                onClick={() =>
                                                    setExpandedItem(isExpanded ? null : item.name)
                                                }
                                            >
                                                <div style={styles.itemRowLeft}>
                                                    {faviconSrc ? (
                                                        <img
                                                            src={faviconSrc}
                                                            alt=""
                                                            style={styles.itemFavicon}
                                                        />
                                                    ) : (
                                                        <div style={styles.itemFaviconPlaceholder}>
                                                            {item.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={styles.itemName}>{item.name}</div>
                                                        {item.url && (
                                                            <div style={styles.itemUrl}>
                                                                {item.url.length > 60
                                                                    ? item.url.slice(0, 60) + '...'
                                                                    : item.url}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        ...styles.chevron,
                                                        transform: isExpanded
                                                            ? 'rotate(90deg)'
                                                            : 'rotate(0deg)',
                                                    }}
                                                >
                                                    {'\u25B6'}
                                                </div>
                                            </div>

                                            {/* Expanded edit form */}
                                            {isExpanded && (
                                                <div style={styles.editForm}>
                                                    <label style={styles.label}>
                                                        Name
                                                        <input
                                                            type="text"
                                                            value={edit.name}
                                                            onChange={(e) =>
                                                                updateEditField(
                                                                    item.name,
                                                                    item,
                                                                    'name',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            style={styles.input}
                                                        />
                                                    </label>

                                                    <label style={styles.label}>
                                                        URL
                                                        <div style={styles.urlRow}>
                                                            <input
                                                                type="text"
                                                                value={edit.url || ''}
                                                                onChange={(e) =>
                                                                    updateEditField(
                                                                        item.name,
                                                                        item,
                                                                        'url',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                style={{
                                                                    ...styles.input,
                                                                    flex: 1,
                                                                }}
                                                            />
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleFetchImages(
                                                                        item.name,
                                                                        edit.url || item.url || '',
                                                                    );
                                                                }}
                                                                disabled={isFetching}
                                                                style={{
                                                                    ...styles.btnSecondary,
                                                                    opacity: isFetching ? 0.6 : 1,
                                                                }}
                                                            >
                                                                {isFetching
                                                                    ? 'Fetching...'
                                                                    : 'Fetch Images'}
                                                            </button>
                                                        </div>
                                                    </label>

                                                    <label style={styles.label}>
                                                        Description
                                                        <textarea
                                                            value={edit.description || ''}
                                                            onChange={(e) =>
                                                                updateEditField(
                                                                    item.name,
                                                                    item,
                                                                    'description',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            rows={3}
                                                            style={styles.textarea}
                                                        />
                                                    </label>

                                                    <label style={styles.label}>
                                                        Tags (comma-separated)
                                                        <input
                                                            type="text"
                                                            value={(edit.tags || []).join(', ')}
                                                            onChange={(e) =>
                                                                updateEditField(
                                                                    item.name,
                                                                    item,
                                                                    'tags',
                                                                    e.target.value
                                                                        .split(',')
                                                                        .map((t) => t.trim())
                                                                        .filter(Boolean),
                                                                )
                                                            }
                                                            style={styles.input}
                                                        />
                                                    </label>

                                                    <label style={styles.label}>
                                                        Image (manual override path)
                                                        <input
                                                            type="text"
                                                            value={edit.image || ''}
                                                            onChange={(e) =>
                                                                updateEditField(
                                                                    item.name,
                                                                    item,
                                                                    'image',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            style={styles.input}
                                                            placeholder="/communities/example.png"
                                                        />
                                                    </label>

                                                    {/* Image upload zones */}
                                                    <div style={styles.imagePreviews}>
                                                        <span style={{ ...styles.label, marginBottom: 4 }}>
                                                            Images (drop, paste, or click to upload)
                                                        </span>
                                                        <div style={styles.imageRow}>
                                                            <ImageDropZone
                                                                label="Favicon"
                                                                imageType="favicon"
                                                                currentSrc={manifestImages.favicon}
                                                                domainKey={getDomainKey(edit.url || item.url)}
                                                                onUploaded={(p, t) => handleImageUploaded(edit.url || item.url, p, t)}
                                                            />
                                                            <ImageDropZone
                                                                label="OG Image"
                                                                imageType="ogImage"
                                                                currentSrc={ogSrc}
                                                                domainKey={getDomainKey(edit.url || item.url)}
                                                                onUploaded={(p, t) => handleImageUploaded(edit.url || item.url, p, t)}
                                                            />
                                                            <ImageDropZone
                                                                label="Screenshot"
                                                                imageType="screenshot"
                                                                currentSrc={screenshotSrc}
                                                                domainKey={getDomainKey(edit.url || item.url)}
                                                                onUploaded={(p, t) => handleImageUploaded(edit.url || item.url, p, t)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={styles.editActions}>
                                                        <button
                                                            onClick={() => handleSave(item.name)}
                                                            disabled={isSaving}
                                                            style={{
                                                                ...styles.btnPrimary,
                                                                opacity: isSaving ? 0.6 : 1,
                                                            }}
                                                        >
                                                            {isSaving ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditState((s) => {
                                                                    const next = { ...s };
                                                                    delete next[item.name];
                                                                    return next;
                                                                });
                                                            }}
                                                            style={styles.btnGhost}
                                                        >
                                                            Reset
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        background: '#f8f9fa',
    },
    loadingScreen: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 16,
    },
    spinner: {
        width: 32,
        height: 32,
        border: '3px solid #e0e0e0',
        borderTopColor: '#333',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
    },
    toast: {
        position: 'fixed',
        top: 20,
        right: 20,
        padding: '10px 20px',
        borderRadius: 8,
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    header: {
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 700,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#888',
        fontFamily: 'monospace',
    },
    layout: {
        display: 'flex',
        height: 'calc(100vh - 57px)',
    },
    sidebar: {
        width: 280,
        background: '#fff',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto',
        flexShrink: 0,
    },
    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: 13,
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderLeftColor: 'transparent',
        transition: 'all 0.15s',
    },
    sidebarItemActive: {
        background: '#f0f4ff',
        borderLeftColor: '#4361ee',
        fontWeight: 600,
    },
    sidebarTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    sidebarCount: {
        fontSize: 11,
        color: '#888',
        fontFamily: 'monospace',
        flexShrink: 0,
        marginLeft: 8,
    },
    main: {
        flex: 1,
        overflowY: 'auto',
        padding: 24,
    },
    mainHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 16,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 700,
        whiteSpace: 'nowrap' as const,
    },
    searchInput: {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 13,
        width: 260,
        outline: 'none',
    },
    itemList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    itemCard: {
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    itemRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        cursor: 'pointer',
        userSelect: 'none' as const,
    },
    itemRowLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0,
    },
    itemFavicon: {
        width: 28,
        height: 28,
        borderRadius: 4,
        objectFit: 'contain' as const,
        flexShrink: 0,
    },
    itemFaviconPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 4,
        background: '#e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 600,
        color: '#888',
        flexShrink: 0,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 600,
    },
    itemUrl: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'monospace',
    },
    chevron: {
        fontSize: 10,
        color: '#aaa',
        transition: 'transform 0.15s',
        flexShrink: 0,
    },
    editForm: {
        padding: '0 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        borderTop: '1px solid #f0f0f0',
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        color: '#555',
    },
    input: {
        padding: '8px 10px',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 400,
        color: '#1a1a2e',
        outline: 'none',
    },
    textarea: {
        padding: '8px 10px',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 400,
        color: '#1a1a2e',
        outline: 'none',
        resize: 'vertical' as const,
        fontFamily: 'inherit',
    },
    urlRow: {
        display: 'flex',
        gap: 8,
        alignItems: 'stretch',
    },
    imagePreviews: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    imageRow: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap' as const,
    },
    editActions: {
        display: 'flex',
        gap: 8,
        marginTop: 4,
    },
    btnPrimary: {
        padding: '8px 20px',
        background: '#4361ee',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
    btnSecondary: {
        padding: '8px 14px',
        background: '#fff',
        color: '#4361ee',
        border: '1px solid #4361ee',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
    },
    btnGhost: {
        padding: '8px 14px',
        background: 'transparent',
        color: '#888',
        border: '1px solid #ddd',
        borderRadius: 6,
        fontSize: 13,
        cursor: 'pointer',
    },
};
