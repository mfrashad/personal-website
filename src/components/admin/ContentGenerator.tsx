import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '@remotion/player';
import { CarouselHookSlide } from '../../../remotion/compositions/CarouselHookSlide';
import { CarouselItemSlide } from '../../../remotion/compositions/CarouselItemSlide';
import { CarouselCtaSlide } from '../../../remotion/compositions/CarouselCtaSlide';
import { VideoComposition } from '../../../remotion/compositions/VideoComposition';
import { CAROUSEL, VIDEO, getVideoDuration } from '../../../remotion/lib/theme';
import type { ResourceItem, ResourceImages } from '../../../remotion/lib/types';
import { useDesignEditor } from './editor/useDesignEditor';
import { EditorOverlay } from './editor/EditorOverlay';
import { PropertiesPanel } from './editor/PropertiesPanel';
import { AddElementToolbar } from './editor/AddElementToolbar';
import { VideoEditorPanel } from './editor/VideoEditorPanel';
import { ItemEditorPanel } from './editor/ItemEditorPanel';
import { analyzeAudio, type BeatAnalysis } from './editor/beatDetection';
import { AudioWaveform } from './editor/AudioWaveform';
import { MediaPicker } from './editor/MediaPicker';

interface ItemEdits {
    name?: string;
    description?: string;
}

interface ItemImageEdits {
    favicon?: string;
    screenshot?: string;
}

type Mode = 'carousel' | 'video';

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

interface ImageManifest {
    images: Record<string, { favicon?: string; ogImage?: string; screenshot?: string }>;
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

export default function ContentGenerator() {
    const [mode, setMode] = useState<Mode>('carousel');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [imageManifest, setImageManifest] = useState<ImageManifest>({ images: {} });
    const [hookText, setHookText] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [brandName, setBrandName] = useState('@rashadcodes');
    const [ctaText, setCtaText] = useState('Comment links to get all links sent to you');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);
    const [backgroundVideo, setBackgroundVideo] = useState<string | null>(null);
    const [bgVideoPreview, setBgVideoPreview] = useState<string | null>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [audioFileName, setAudioFileName] = useState<string | null>(null);
    const [videoBackgroundMode, setVideoBackgroundMode] = useState<'full' | 'hook-only'>('full');
    const [backgroundFallbackColor, setBackgroundFallbackColor] = useState('#0f172a');
    // Beat-synced timing
    const [hookDurationSec, setHookDurationSec] = useState(VIDEO.hookDurationSec);
    const [beatIntervalSec, setBeatIntervalSec] = useState(VIDEO.itemDurationSec);
    const [detectingBeats, setDetectingBeats] = useState(false);
    const [beatAnalysis, setBeatAnalysis] = useState<BeatAnalysis | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [currentSlide, setCurrentSlide] = useState(0);
    const [rendering, setRendering] = useState(false);
    const [renderProgress, setRenderProgress] = useState('');
    const [outputPaths, setOutputPaths] = useState<string[]>([]);
    const [videoOutputPath, setVideoOutputPath] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const bgInputRef = useRef<HTMLInputElement>(null);
    const bgVideoInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    // Design editor
    const editor = useDesignEditor();

    // Per-item edits (text overrides)
    const [itemEdits, setItemEdits] = useState<Record<string, ItemEdits>>({});
    // Per-item image overrides (server paths for render)
    const [itemImageEdits, setItemImageEdits] = useState<Record<string, ItemImageEdits>>({});
    // Per-item image previews (blob URLs for instant preview)
    const [itemImagePreviews, setItemImagePreviews] = useState<Record<string, { favicon?: string; screenshot?: string }>>({});

    const updateItemEdit = useCallback((itemName: string, field: 'name' | 'description', value: string) => {
        setItemEdits((prev) => ({
            ...prev,
            [itemName]: { ...prev[itemName], [field]: value },
        }));
    }, []);

    const uploadItemImage = useCallback(async (itemName: string, type: 'favicon' | 'screenshot', file: File) => {
        // Set blob preview immediately
        const preview = URL.createObjectURL(file);
        setItemImagePreviews((prev) => ({
            ...prev,
            [itemName]: { ...prev[itemName], [type]: preview },
        }));

        // Upload to server
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', `item-${type}-${itemName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`);
        try {
            const res = await fetch('/api/admin/upload-background', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setItemImageEdits((prev) => ({
                ...prev,
                [itemName]: { ...prev[itemName], [type]: data.path },
            }));
        } catch (err: any) {
            showToast(`Image upload failed: ${err.message}`);
            // Remove preview on failure
            setItemImagePreviews((prev) => {
                const updated = { ...prev };
                if (updated[itemName]) {
                    const copy = { ...updated[itemName] };
                    delete copy[type];
                    updated[itemName] = copy;
                }
                return updated;
            });
        }
    }, []);

    const resetItemImage = useCallback((itemName: string, type: 'favicon' | 'screenshot') => {
        setItemImageEdits((prev) => {
            const updated = { ...prev };
            if (updated[itemName]) {
                const copy = { ...updated[itemName] };
                delete copy[type];
                updated[itemName] = copy;
            }
            return updated;
        });
        setItemImagePreviews((prev) => {
            const updated = { ...prev };
            if (updated[itemName]) {
                const copy = { ...updated[itemName] };
                if (copy[type]) URL.revokeObjectURL(copy[type]!);
                delete copy[type];
                updated[itemName] = copy;
            }
            return updated;
        });
    }, []);

    const resetItemEdits = useCallback((itemName: string) => {
        setItemEdits((prev) => {
            const updated = { ...prev };
            delete updated[itemName];
            return updated;
        });
        // Revoke blob URLs before clearing
        const previews = itemImagePreviews[itemName];
        if (previews) {
            if (previews.favicon) URL.revokeObjectURL(previews.favicon);
            if (previews.screenshot) URL.revokeObjectURL(previews.screenshot);
        }
        setItemImageEdits((prev) => {
            const updated = { ...prev };
            delete updated[itemName];
            return updated;
        });
        setItemImagePreviews((prev) => {
            const updated = { ...prev };
            delete updated[itemName];
            return updated;
        });
    }, [itemImagePreviews]);

    // Get edited item data (merges edits with original)
    function getEditedItem(item: Item) {
        const edits = itemEdits[item.name];
        if (!edits) return item;
        return {
            ...item,
            ...(edits.name !== undefined && { name: edits.name }),
            ...(edits.description !== undefined && { description: edits.description }),
        };
    }

    // Get edited images (merges image edits with manifest images)
    function getEditedImages(item: Item): ResourceImages | undefined {
        const base = getItemImages(item);
        const overrides = itemImageEdits[item.name];
        const previews = itemImagePreviews[item.name];
        if (!base && !overrides && !previews) return undefined;
        return {
            ...base,
            ...(overrides?.favicon && { favicon: overrides.favicon }),
            ...(overrides?.screenshot && { screenshot: overrides.screenshot }),
            // Blob previews take highest priority for display
            ...(previews?.favicon && { favicon: previews.favicon }),
            ...(previews?.screenshot && { screenshot: previews.screenshot }),
        };
    }

    // Get images for render (uses server paths, not blob URLs)
    function getRenderImages(item: Item): ResourceImages | undefined {
        const base = getItemImages(item);
        const overrides = itemImageEdits[item.name];
        if (!base && !overrides) return undefined;
        return {
            ...base,
            ...(overrides?.favicon && { favicon: overrides.favicon }),
            ...(overrides?.screenshot && { screenshot: overrides.screenshot }),
        };
    }

    // Load categories + image manifest
    useEffect(() => {
        Promise.all([
            fetch('/api/admin/lists').then((r) => r.json()),
            fetch('/src/data/resource-images.json').then((r) => r.json()),
        ]).then(([cats, manifest]) => {
            setCategories(cats);
            setImageManifest(manifest);
        });
    }, []);

    const currentCategory = categories.find((c) => c.category === selectedCategory);
    const items = currentCategory?.items || [];
    const activeItems = items.filter((item) => selectedItems.has(item.name));
    const totalSlides = activeItems.length + 2; // hook slide + item slides + CTA slide

    // Auto-set hook text when category changes
    useEffect(() => {
        if (currentCategory) {
            setHookText(`Top ${items.length} ${currentCategory.title}`);
            setSubtitle('');
            setSelectedItems(new Set(items.map((i) => i.name)));
            setCurrentSlide(0);
        }
    }, [selectedCategory]);

    // Sync editing slide type with current slide
    useEffect(() => {
        editor.setEditingSlideType(currentSlide === 0 ? 'hook' : currentSlide <= activeItems.length ? 'item' : 'hook');
        editor.setSelectedElementId(null);
    }, [currentSlide]);

    function getItemImages(item: Item): ResourceImages | undefined {
        const domainKey = getDomainKey(item.url);
        if (!domainKey) return undefined;
        return imageManifest.images[domainKey];
    }

    // Derive showLogos from layout element visibility
    const showLogos = editor.hookLayout.elements.find((el) => el.id === 'hook-logo-grid')?.visible ?? true;

    // Collect favicon URLs for logo grid on hook slide (preview uses edited images)
    const logoUrls = activeItems
        .map((item) => {
            const imgs = getEditedImages(item);
            return imgs?.favicon;
        })
        .filter((url): url is string => !!url);

    // Server paths for render
    const logoUrlsForRender = activeItems
        .map((item) => {
            const imgs = getRenderImages(item);
            return imgs?.favicon;
        })
        .filter((url): url is string => !!url);

    // Background image upload
    const handleBgUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            showToast('Not an image file');
            return;
        }
        const preview = URL.createObjectURL(file);
        setBgPreview(preview);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-'));
        try {
            const res = await fetch('/api/admin/media-library', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setBackgroundImage(data.path);
        } catch (err: any) {
            showToast(`Upload failed: ${err.message}`);
            setBgPreview(null);
        }
    }, []);

    // Background video upload
    const handleBgVideoUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('video/')) {
            showToast('Not a video file');
            return;
        }
        const preview = URL.createObjectURL(file);
        setBgVideoPreview(preview);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-'));
        try {
            const res = await fetch('/api/admin/media-library', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setBackgroundVideo(data.path);
        } catch (err: any) {
            showToast(`Upload failed: ${err.message}`);
            setBgVideoPreview(null);
        }
    }, []);

    // Audio upload
    const handleAudioUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('audio/')) {
            showToast('Not an audio file');
            return;
        }
        const preview = URL.createObjectURL(file);
        setAudioPreview(preview);
        setAudioFileName(file.name);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-'));
        try {
            const res = await fetch('/api/admin/media-library', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAudioSrc(data.path);
        } catch (err: any) {
            showToast(`Upload failed: ${err.message}`);
            setAudioPreview(null);
            setAudioFileName(null);
        }
    }, []);

    // Beat detection
    const handleDetectBeats = useCallback(async () => {
        const url = audioPreview || audioSrc;
        if (!url) {
            showToast('Upload audio first');
            return;
        }
        setDetectingBeats(true);
        try {
            const analysis = await analyzeAudio(url);
            setBeatAnalysis(analysis);
            setHookDurationSec(analysis.hookDuration);
            setBeatIntervalSec(analysis.beatInterval);
            showToast(`Detected: hook ${analysis.hookDuration}s, beat ${analysis.beatInterval}s`);
        } catch (err: any) {
            showToast(`Beat detection failed: ${err.message}`);
        } finally {
            setDetectingBeats(false);
        }
    }, [audioPreview, audioSrc]);

    const handleBgDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                if (mode === 'video' && file.type.startsWith('video/')) {
                    handleBgVideoUpload(file);
                } else {
                    handleBgUpload(file);
                }
            }
        },
        [handleBgUpload, handleBgVideoUpload, mode],
    );

    // Render carousel
    const handleRenderCarousel = useCallback(async () => {
        if (!backgroundImage) {
            showToast('Upload a background image first');
            return;
        }
        if (activeItems.length === 0) {
            showToast('Select at least one item');
            return;
        }

        setRendering(true);
        setRenderProgress('Starting carousel render...');
        setOutputPaths([]);

        try {
            const res = await fetch('/api/admin/render-carousel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    backgroundImage,
                    hookText,
                    subtitle,
                    brandName,
                    ctaText,
                    logoUrls: showLogos ? logoUrlsForRender : [],
                    hookLayout: editor.hookLayout,
                    itemOverrides: editor.itemOverrides,
                    items: activeItems.map((item) => {
                        const edited = getEditedItem(item);
                        return {
                            item: edited,
                            images: getRenderImages(item),
                        };
                    }),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOutputPaths(data.paths);
            setRenderProgress(`Done! ${data.paths.length} slides rendered.`);
            showToast('Carousel rendered successfully!');
        } catch (err: any) {
            setRenderProgress(`Error: ${err.message}`);
        } finally {
            setRendering(false);
        }
    }, [backgroundImage, hookText, subtitle, brandName, ctaText, activeItems, editor.hookLayout, editor.itemOverrides, itemEdits, itemImageEdits]);

    // Render video
    const handleRenderVideo = useCallback(async () => {
        if (!backgroundVideo && !backgroundImage) {
            showToast('Upload a background image or video first');
            return;
        }
        if (activeItems.length === 0) {
            showToast('Select at least one item');
            return;
        }

        setRendering(true);
        setRenderProgress('Starting video render (this may take 1-5 min)...');
        setVideoOutputPath(null);

        try {
            const res = await fetch('/api/admin/render-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    backgroundVideo,
                    backgroundImage,
                    videoBackgroundMode,
                    backgroundFallbackColor,
                    audioSrc: audioSrc || undefined,
                    hookDurationFrames,
                    itemDurationFrames,
                    ctaDurationFrames,
                    hookText,
                    subtitle,
                    brandName,
                    layoutOverrides: editor.videoOverrides,
                    logoUrls: logoUrlsForRender,
                    items: activeItems.map((item) => {
                        const edited = getEditedItem(item);
                        return {
                            item: edited,
                            images: getRenderImages(item),
                        };
                    }),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setVideoOutputPath(data.path);
            setRenderProgress('Video rendered!');
            showToast('Video rendered successfully!');
        } catch (err: any) {
            setRenderProgress(`Error: ${err.message}`);
        } finally {
            setRendering(false);
        }
    }, [backgroundVideo, backgroundImage, hookText, subtitle, brandName, activeItems, editor.videoOverrides, itemEdits, itemImageEdits, hookDurationSec, beatIntervalSec]);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }

    function toggleItem(name: string) {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    }

    function selectAll() {
        setSelectedItems(new Set(items.map((i) => i.name)));
    }

    function selectNone() {
        setSelectedItems(new Set());
    }

    // Build preview URL for background
    const previewBg =
        bgPreview ||
        backgroundImage ||
        (mode === 'video'
            ? 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1920&fit=crop'
            : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1350&fit=crop');

    // Current slide props (carousel mode)
    const isHookSlide = currentSlide === 0;
    const isCtaSlide = currentSlide === activeItems.length + 1;
    const currentItemIndex = currentSlide - 1;
    const currentItem = activeItems[currentItemIndex];

    // Video timing (frame counts from seconds)
    const hookDurationFrames = Math.round(hookDurationSec * VIDEO.fps);
    const itemDurationFrames = Math.round(beatIntervalSec * VIDEO.fps);
    const ctaDurationFrames = Math.round(VIDEO.ctaDurationSec * VIDEO.fps);
    const videoDuration = getVideoDuration(activeItems.length, hookDurationFrames, itemDurationFrames, ctaDurationFrames);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div
                style={{
                    width: 260,
                    borderRight: '1px solid #e2e8f0',
                    background: '#fff',
                    overflowY: 'auto',
                    flexShrink: 0,
                }}
            >
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Content Generator</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Select a category</p>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat.category}
                        onClick={() => setSelectedCategory(cat.category)}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            borderBottom: '1px solid #f1f5f9',
                            background: selectedCategory === cat.category ? '#eef2ff' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 14,
                            fontWeight: selectedCategory === cat.category ? 600 : 400,
                            color: selectedCategory === cat.category ? '#4f46e5' : '#334155',
                        }}
                    >
                        {cat.title}
                        <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 12 }}>
                            ({cat.items.length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Main panel */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                {!selectedCategory ? (
                    <div style={{ textAlign: 'center', marginTop: 120, color: '#94a3b8', fontSize: 18 }}>
                        Select a category to start
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: 32 }}>
                        {/* Left: Settings */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Mode toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, flex: 1 }}>
                                    {currentCategory?.title}
                                </h2>
                                <div
                                    style={{
                                        display: 'flex',
                                        background: '#f1f5f9',
                                        borderRadius: 8,
                                        padding: 3,
                                    }}
                                >
                                    <button
                                        onClick={() => setMode('carousel')}
                                        style={{
                                            ...toggleBtnStyle,
                                            background: mode === 'carousel' ? '#fff' : 'transparent',
                                            color: mode === 'carousel' ? '#4f46e5' : '#64748b',
                                            boxShadow:
                                                mode === 'carousel' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        }}
                                    >
                                        Carousel
                                    </button>
                                    <button
                                        onClick={() => setMode('video')}
                                        style={{
                                            ...toggleBtnStyle,
                                            background: mode === 'video' ? '#fff' : 'transparent',
                                            color: mode === 'video' ? '#4f46e5' : '#64748b',
                                            boxShadow: mode === 'video' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        }}
                                    >
                                        Video
                                    </button>
                                </div>
                            </div>

                            {/* Text inputs */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                                <label style={labelStyle}>
                                    Hook Text
                                    <input
                                        type="text"
                                        value={hookText}
                                        onChange={(e) => setHookText(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Top 10 Tools Every Startup Needs"
                                    />
                                </label>
                                <label style={labelStyle}>
                                    Subtitle
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Optional subtitle"
                                    />
                                </label>
                                <label style={labelStyle}>
                                    Brand Name
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        style={inputStyle}
                                        placeholder="@rashadcodes"
                                    />
                                </label>
                                {mode === 'carousel' && (
                                    <label style={labelStyle}>
                                        CTA Text (last slide)
                                        <input
                                            type="text"
                                            value={ctaText}
                                            onChange={(e) => setCtaText(e.target.value)}
                                            style={inputStyle}
                                            placeholder="Comment links to get all links sent to you"
                                        />
                                    </label>
                                )}
                                {mode === 'carousel' && (
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={showLogos}
                                            onChange={(e) => {
                                                editor.updateElement('hook-logo-grid', { visible: e.target.checked });
                                            }}
                                        />
                                        Show item logos on hook slide
                                    </label>
                                )}
                            </div>

                            {/* Background upload - image */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                        Background Image
                                    </div>
                                    <MediaPicker
                                        type="image"
                                        currentPath={backgroundImage}
                                        onSelect={(path) => {
                                            setBackgroundImage(path);
                                            setBgPreview(path);
                                        }}
                                    />
                                </div>
                                <div
                                    onDrop={handleBgDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => bgInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed #cbd5e1',
                                        borderRadius: 12,
                                        padding: 24,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: bgPreview ? `url(${bgPreview}) center/cover` : '#f8fafc',
                                        minHeight: 80,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {bgPreview && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(0,0,0,0.4)',
                                                borderRadius: 10,
                                            }}
                                        />
                                    )}
                                    <span
                                        style={{
                                            position: 'relative',
                                            color: bgPreview ? '#fff' : '#94a3b8',
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {bgPreview ? 'Click or drop to replace' : 'Drop image or click to upload'}
                                    </span>
                                    <input
                                        ref={bgInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleBgUpload(file);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Background video upload (video mode only) */}
                            {mode === 'video' && (
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Background Video
                                        </div>
                                        <MediaPicker
                                            type="video"
                                            currentPath={backgroundVideo}
                                            onSelect={(path) => {
                                                setBackgroundVideo(path);
                                                setBgVideoPreview(path);
                                            }}
                                        />
                                    </div>
                                    <div
                                        onClick={() => bgVideoInputRef.current?.click()}
                                        style={{
                                            border: '2px dashed #cbd5e1',
                                            borderRadius: 12,
                                            padding: 24,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            background: '#f8fafc',
                                            minHeight: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
                                            {bgVideoPreview
                                                ? 'Video uploaded - click to replace'
                                                : 'Drop video or click to upload (.mp4)'}
                                        </span>
                                        <input
                                            ref={bgVideoInputRef}
                                            type="file"
                                            accept="video/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleBgVideoUpload(file);
                                            }}
                                        />
                                    </div>
                                    {bgVideoPreview && (
                                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                                                Video ready
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setBackgroundVideo(null);
                                                    setBgVideoPreview(null);
                                                }}
                                                style={{
                                                    ...smallBtnStyle,
                                                    color: '#ef4444',
                                                    borderColor: '#fecaca',
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Video background mode (video mode only, when video uploaded) */}
                            {mode === 'video' && backgroundVideo && (
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#334155' }}>
                                        Video Background
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            background: '#f1f5f9',
                                            borderRadius: 8,
                                            padding: 3,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <button
                                            onClick={() => setVideoBackgroundMode('full')}
                                            style={{
                                                ...toggleBtnStyle,
                                                flex: 1,
                                                background: videoBackgroundMode === 'full' ? '#fff' : 'transparent',
                                                color: videoBackgroundMode === 'full' ? '#4f46e5' : '#64748b',
                                                boxShadow:
                                                    videoBackgroundMode === 'full'
                                                        ? '0 1px 3px rgba(0,0,0,0.1)'
                                                        : 'none',
                                            }}
                                        >
                                            Full Video
                                        </button>
                                        <button
                                            onClick={() => setVideoBackgroundMode('hook-only')}
                                            style={{
                                                ...toggleBtnStyle,
                                                flex: 1,
                                                background: videoBackgroundMode === 'hook-only' ? '#fff' : 'transparent',
                                                color: videoBackgroundMode === 'hook-only' ? '#4f46e5' : '#64748b',
                                                boxShadow:
                                                    videoBackgroundMode === 'hook-only'
                                                        ? '0 1px 3px rgba(0,0,0,0.1)'
                                                        : 'none',
                                            }}
                                        >
                                            Hook Only
                                        </button>
                                    </div>
                                    {videoBackgroundMode === 'hook-only' && (
                                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                                            Items &amp; CTA will use {backgroundImage ? 'background image' : 'solid color'}
                                        </div>
                                    )}
                                    {videoBackgroundMode === 'hook-only' && !backgroundImage && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 12, color: '#64748b' }}>Fallback Color</span>
                                            <input
                                                type="color"
                                                value={backgroundFallbackColor}
                                                onChange={(e) => setBackgroundFallbackColor(e.target.value)}
                                                style={{ width: 32, height: 28, border: 'none', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{backgroundFallbackColor}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Audio upload (video mode only) */}
                            {mode === 'video' && (
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Audio Track
                                        </div>
                                        <MediaPicker
                                            type="audio"
                                            currentPath={audioSrc}
                                            onSelect={(path, name) => {
                                                setAudioSrc(path);
                                                setAudioPreview(path);
                                                setAudioFileName(name);
                                                setBeatAnalysis(null);
                                            }}
                                        />
                                    </div>
                                    <div
                                        onClick={() => audioInputRef.current?.click()}
                                        style={{
                                            border: '2px dashed #cbd5e1',
                                            borderRadius: 12,
                                            padding: 16,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            background: '#f8fafc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>
                                            {audioFileName
                                                ? `${audioFileName} - click to replace`
                                                : 'Click to upload audio (.mp3, .wav, .m4a)'}
                                        </span>
                                        <input
                                            ref={audioInputRef}
                                            type="file"
                                            accept="audio/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleAudioUpload(file);
                                            }}
                                        />
                                    </div>
                                    {audioPreview && (
                                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <audio src={audioPreview} controls style={{ height: 32, flex: 1 }} />
                                            <button
                                                onClick={() => {
                                                    if (audioPreview) URL.revokeObjectURL(audioPreview);
                                                    setAudioSrc(null);
                                                    setAudioPreview(null);
                                                    setAudioFileName(null);
                                                    setBeatAnalysis(null);
                                                }}
                                                style={{
                                                    ...smallBtnStyle,
                                                    color: '#ef4444',
                                                    borderColor: '#fecaca',
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Beat-synced timing (video mode only) */}
                            {mode === 'video' && (
                                <div style={{ marginBottom: 24 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 10,
                                        }}
                                    >
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Timing
                                        </div>
                                        {(audioPreview || audioSrc) && (
                                            <button
                                                onClick={handleDetectBeats}
                                                disabled={detectingBeats}
                                                style={{
                                                    ...smallBtnStyle,
                                                    color: detectingBeats ? '#94a3b8' : '#4f46e5',
                                                    borderColor: detectingBeats ? '#e2e8f0' : '#c7d2fe',
                                                }}
                                            >
                                                {detectingBeats ? 'Detecting...' : 'Detect Beats'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Audio waveform visualization */}
                                    {beatAnalysis && (
                                        <AudioWaveform
                                            waveform={beatAnalysis.waveform}
                                            audioDuration={beatAnalysis.audioDuration}
                                            beats={beatAnalysis.beats}
                                            hookDuration={hookDurationSec}
                                            beatInterval={beatIntervalSec}
                                            itemCount={activeItems.length}
                                        />
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                                                    Hook Duration
                                                </span>
                                                <span style={{ fontSize: 12, color: '#64748b' }}>
                                                    {hookDurationSec.toFixed(2)}s
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={0.5}
                                                max={8}
                                                step={0.05}
                                                value={hookDurationSec}
                                                onChange={(e) => setHookDurationSec(Number(e.target.value))}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                                                    Beat Interval (per item)
                                                </span>
                                                <span style={{ fontSize: 12, color: '#64748b' }}>
                                                    {beatIntervalSec.toFixed(2)}s
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={0.3}
                                                max={5}
                                                step={0.05}
                                                value={beatIntervalSec}
                                                onChange={(e) => setBeatIntervalSec(Number(e.target.value))}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: '#94a3b8',
                                                borderTop: '1px solid #f1f5f9',
                                                paddingTop: 8,
                                            }}
                                        >
                                            Total: {(videoDuration / VIDEO.fps).toFixed(1)}s
                                            ({hookDurationSec.toFixed(2)}s hook + {activeItems.length} × {beatIntervalSec.toFixed(2)}s + {VIDEO.ctaDurationSec}s CTA)
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Item checklist */}
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 8,
                                    }}
                                >
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                        Items ({selectedItems.size}/{items.length})
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={selectAll} style={smallBtnStyle}>
                                            All
                                        </button>
                                        <button onClick={selectNone} style={smallBtnStyle}>
                                            None
                                        </button>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 8,
                                    }}
                                >
                                    {items.map((item) => (
                                        <label
                                            key={item.name}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '8px 12px',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                fontSize: 14,
                                                background: selectedItems.has(item.name)
                                                    ? '#f0fdf4'
                                                    : 'transparent',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item.name)}
                                                onChange={() => toggleItem(item.name)}
                                            />
                                            <span>{item.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Export */}
                            <button
                                onClick={mode === 'carousel' ? handleRenderCarousel : handleRenderVideo}
                                disabled={rendering}
                                style={{
                                    width: '100%',
                                    padding: '14px 24px',
                                    background: rendering ? '#94a3b8' : mode === 'video' ? '#7c3aed' : '#4f46e5',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    cursor: rendering ? 'default' : 'pointer',
                                }}
                            >
                                {rendering
                                    ? 'Rendering...'
                                    : mode === 'carousel'
                                      ? 'Export Carousel PNGs'
                                      : 'Export Video MP4'}
                            </button>
                            {renderProgress && (
                                <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>{renderProgress}</div>
                            )}

                            {/* Carousel output links */}
                            {mode === 'carousel' && outputPaths.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Output:</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {outputPaths.map((p, i) => (
                                            <a
                                                key={p}
                                                href={p}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '6px 12px',
                                                    background: '#eef2ff',
                                                    borderRadius: 6,
                                                    fontSize: 13,
                                                    color: '#4f46e5',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Slide {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Video output link */}
                            {mode === 'video' && videoOutputPath && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Output:</div>
                                    <a
                                        href={videoOutputPath}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'inline-block',
                                            padding: '8px 16px',
                                            background: '#f3e8ff',
                                            borderRadius: 6,
                                            fontSize: 14,
                                            color: '#7c3aed',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Download MP4
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Center: Preview with editor overlay */}
                        <div style={{ width: 420, flexShrink: 0 }}>
                            {mode === 'carousel' ? (
                                /* Carousel preview */
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 12,
                                        }}
                                    >
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Preview — Slide {currentSlide + 1}/{totalSlides}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button
                                                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                                                disabled={currentSlide === 0}
                                                style={navBtnStyle}
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))
                                                }
                                                disabled={currentSlide >= totalSlides - 1}
                                                style={navBtnStyle}
                                            >
                                                →
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                                            aspectRatio: `${CAROUSEL.width}/${CAROUSEL.height}`,
                                            background: '#1a1a2e',
                                        }}
                                    >
                                        {isHookSlide ? (
                                            <EditorOverlay
                                                compositionWidth={CAROUSEL.width}
                                                compositionHeight={CAROUSEL.height}
                                                layout={editor.hookLayout}
                                                selectedElementId={editor.selectedElementId}
                                                onSelectElement={editor.setSelectedElementId}
                                                onUpdateElement={editor.updateElement}
                                                onDeleteElement={editor.deleteElement}
                                            >
                                                <Player
                                                    component={CarouselHookSlide}
                                                    compositionWidth={CAROUSEL.width}
                                                    compositionHeight={CAROUSEL.height}
                                                    durationInFrames={1}
                                                    fps={1}
                                                    style={{ width: '100%', height: '100%' }}
                                                    inputProps={{
                                                        backgroundImage: previewBg,
                                                        hookText: hookText || 'Your Hook Text',
                                                        subtitle: subtitle || undefined,
                                                        brandName,
                                                        layout: editor.hookLayout,
                                                        logoUrls: showLogos ? logoUrls : [],
                                                    }}
                                                />
                                            </EditorOverlay>
                                        ) : isCtaSlide ? (
                                            <Player
                                                component={CarouselCtaSlide}
                                                compositionWidth={CAROUSEL.width}
                                                compositionHeight={CAROUSEL.height}
                                                durationInFrames={1}
                                                fps={1}
                                                style={{ width: '100%', height: '100%' }}
                                                inputProps={{
                                                    backgroundImage: previewBg,
                                                    ctaText,
                                                    brandName,
                                                }}
                                            />
                                        ) : currentItem ? (
                                            <Player
                                                component={CarouselItemSlide}
                                                compositionWidth={CAROUSEL.width}
                                                compositionHeight={CAROUSEL.height}
                                                durationInFrames={1}
                                                fps={1}
                                                style={{ width: '100%', height: '100%' }}
                                                inputProps={{
                                                    backgroundImage: previewBg,
                                                    item: (() => {
                                                        const edited = getEditedItem(currentItem);
                                                        return {
                                                            name: edited.name,
                                                            description: edited.description,
                                                            url: edited.url,
                                                            tags: edited.tags,
                                                        };
                                                    })(),
                                                    images: getEditedImages(currentItem),
                                                    slideNumber: currentItemIndex + 1,
                                                    totalSlides: activeItems.length,
                                                    brandName,
                                                    overrides: editor.itemOverrides,
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '100%',
                                                    aspectRatio: '1080/1350',
                                                    color: '#64748b',
                                                }}
                                            >
                                                No items selected
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Video preview */
                                <>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 12 }}>
                                        Video Preview ({(videoDuration / VIDEO.fps).toFixed(1)}s)
                                    </div>
                                    <div
                                        style={{
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                                            aspectRatio: '1080/1920',
                                            background: '#1a1a2e',
                                        }}
                                    >
                                        {activeItems.length > 0 ? (
                                            <Player
                                                component={VideoComposition}
                                                compositionWidth={VIDEO.width}
                                                compositionHeight={VIDEO.height}
                                                durationInFrames={videoDuration}
                                                fps={VIDEO.fps}
                                                style={{ width: '100%', height: '100%' }}
                                                controls
                                                loop
                                                inputProps={{
                                                    backgroundImage: previewBg,
                                                    backgroundVideo: bgVideoPreview || backgroundVideo || undefined,
                                                    videoBackgroundMode,
                                                    backgroundFallbackColor,
                                                    audioSrc: audioPreview || audioSrc || undefined,
                                                    hookDurationFrames,
                                                    itemDurationFrames,
                                                    ctaDurationFrames,
                                                    hookText: hookText || 'Your Hook Text',
                                                    subtitle: subtitle || undefined,
                                                    brandName,
                                                    layoutOverrides: editor.videoOverrides,
                                                    logoUrls,
                                                    items: activeItems.map((item) => {
                                                        const edited = getEditedItem(item);
                                                        return {
                                                            item: {
                                                                name: edited.name,
                                                                description: edited.description,
                                                                url: edited.url,
                                                                tags: edited.tags,
                                                            },
                                                            images: getEditedImages(item),
                                                        };
                                                    }),
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '100%',
                                                    color: '#64748b',
                                                }}
                                            >
                                                No items selected
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right: Design Editor Panel */}
                        <div
                            style={{
                                width: 240,
                                flexShrink: 0,
                                borderLeft: '1px solid #e2e8f0',
                                paddingLeft: 24,
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 64px)',
                            }}
                        >
                            {mode === 'carousel' ? (
                                <>
                                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#334155' }}>
                                        Design Editor
                                    </div>

                                    {isHookSlide && (
                                        <div style={{ marginBottom: 16 }}>
                                            <AddElementToolbar
                                                layout={editor.hookLayout}
                                                selectedElementId={editor.selectedElementId}
                                                editingSlideType={editor.editingSlideType}
                                                onAddText={editor.addTextElement}
                                                onSelectElement={editor.setSelectedElementId}
                                                onDeleteElement={editor.deleteElement}
                                                onResetLayout={editor.resetHookLayout}
                                            />
                                        </div>
                                    )}

                                    <PropertiesPanel
                                        element={editor.selectedElement}
                                        editingSlideType={editor.editingSlideType}
                                        itemOverrides={editor.itemOverrides}
                                        onUpdateElement={editor.updateElement}
                                        onUpdateItemOverride={editor.updateItemOverride}
                                    />

                                    {/* Per-item editor (carousel item slides) */}
                                    {!isHookSlide && currentItem && (
                                        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 16, paddingTop: 16 }}>
                                            <ItemEditorPanel
                                                itemName={currentItem.name}
                                                itemDescription={currentItem.description}
                                                images={getItemImages(currentItem)}
                                                edits={itemEdits[currentItem.name] || {}}
                                                imageEdits={itemImageEdits[currentItem.name] || {}}
                                                imagePreviews={itemImagePreviews[currentItem.name] || {}}
                                                onUpdateEdit={(field, value) => updateItemEdit(currentItem.name, field, value)}
                                                onUploadImage={(type, file) => uploadItemImage(currentItem.name, type, file)}
                                                onResetImage={(type) => resetItemImage(currentItem.name, type)}
                                                onReset={() => resetItemEdits(currentItem.name)}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <VideoEditorPanel
                                        overrides={editor.videoOverrides}
                                        onUpdate={editor.updateVideoOverride}
                                        onReset={editor.resetVideoOverrides}
                                    />

                                    {/* Per-item editor (video mode, keyed to first item as representative) */}
                                    {activeItems.length > 0 && (
                                        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 16, paddingTop: 16 }}>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                                                Edit items individually in Carousel mode
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: '#1e293b',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        zIndex: 999,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}
                >
                    {toast}
                </div>
            )}
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 14,
    fontWeight: 600,
    color: '#334155',
};

const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 400,
    outline: 'none',
};

const smallBtnStyle: React.CSSProperties = {
    padding: '4px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
};

const navBtnStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
};

const toggleBtnStyle: React.CSSProperties = {
    padding: '6px 16px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.15s',
};
