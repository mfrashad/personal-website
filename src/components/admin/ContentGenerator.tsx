import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '@remotion/player';
import { CarouselHookSlide } from '../../../remotion/compositions/CarouselHookSlide';
import { CarouselItemSlide } from '../../../remotion/compositions/CarouselItemSlide';
import { VideoComposition } from '../../../remotion/compositions/VideoComposition';
import { CAROUSEL, VIDEO, getVideoDuration } from '../../../remotion/lib/theme';
import type { ResourceItem, ResourceImages } from '../../../remotion/lib/types';

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
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        return hostname.replace(/\./g, '-');
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
    const [brandName, setBrandName] = useState('@rashad');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);
    const [backgroundVideo, setBackgroundVideo] = useState<string | null>(null);
    const [bgVideoPreview, setBgVideoPreview] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [currentSlide, setCurrentSlide] = useState(0);
    const [rendering, setRendering] = useState(false);
    const [renderProgress, setRenderProgress] = useState('');
    const [outputPaths, setOutputPaths] = useState<string[]>([]);
    const [videoOutputPath, setVideoOutputPath] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const bgInputRef = useRef<HTMLInputElement>(null);
    const bgVideoInputRef = useRef<HTMLInputElement>(null);

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
    const totalSlides = activeItems.length + 1; // hook slide + item slides

    // Auto-set hook text when category changes
    useEffect(() => {
        if (currentCategory) {
            setHookText(`Top ${items.length} ${currentCategory.title}`);
            setSubtitle('Curated by Rashad');
            setSelectedItems(new Set(items.map((i) => i.name)));
            setCurrentSlide(0);
        }
    }, [selectedCategory]);

    function getItemImages(item: Item): ResourceImages | undefined {
        const domainKey = getDomainKey(item.url);
        if (!domainKey) return undefined;
        return imageManifest.images[domainKey];
    }

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
        formData.append('name', `bg-${Date.now()}`);
        try {
            const res = await fetch('/api/admin/upload-background', { method: 'POST', body: formData });
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
        formData.append('name', `bgvid-${Date.now()}`);
        try {
            const res = await fetch('/api/admin/upload-background', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setBackgroundVideo(data.path);
        } catch (err: any) {
            showToast(`Upload failed: ${err.message}`);
            setBgVideoPreview(null);
        }
    }, []);

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
                    items: activeItems.map((item) => ({
                        item,
                        images: getItemImages(item),
                    })),
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
    }, [backgroundImage, hookText, subtitle, brandName, activeItems]);

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
                    hookText,
                    subtitle,
                    brandName,
                    items: activeItems.map((item) => ({
                        item,
                        images: getItemImages(item),
                    })),
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
    }, [backgroundVideo, backgroundImage, hookText, subtitle, brandName, activeItems]);

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
    const currentItemIndex = currentSlide - 1;
    const currentItem = activeItems[currentItemIndex];

    // Video duration
    const videoDuration = getVideoDuration(activeItems.length);

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
                                        placeholder="Curated by Rashad"
                                    />
                                </label>
                                <label style={labelStyle}>
                                    Brand Name
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        style={inputStyle}
                                        placeholder="@rashad"
                                    />
                                </label>
                            </div>

                            {/* Background upload - image */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#334155' }}>
                                    Background Image
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
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#334155' }}>
                                        Background Video (optional, overrides image)
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

                        {/* Right: Preview */}
                        <div style={{ width: 380, flexShrink: 0 }}>
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
                                            aspectRatio: '1080/1350',
                                            background: '#1a1a2e',
                                        }}
                                    >
                                        {isHookSlide ? (
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
                                                    item: {
                                                        name: currentItem.name,
                                                        description: currentItem.description,
                                                        url: currentItem.url,
                                                        tags: currentItem.tags,
                                                    },
                                                    images: getItemImages(currentItem),
                                                    slideNumber: currentItemIndex + 1,
                                                    totalSlides: activeItems.length,
                                                    brandName,
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
                                                    hookText: hookText || 'Your Hook Text',
                                                    subtitle: subtitle || undefined,
                                                    brandName,
                                                    items: activeItems.map((item) => ({
                                                        item: {
                                                            name: item.name,
                                                            description: item.description,
                                                            url: item.url,
                                                            tags: item.tags,
                                                        },
                                                        images: getItemImages(item),
                                                    })),
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
