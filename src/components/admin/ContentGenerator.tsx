import { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '@remotion/player';
import { CarouselHookSlide } from '../../../remotion/compositions/CarouselHookSlide';
import { CarouselItemSlide } from '../../../remotion/compositions/CarouselItemSlide';
import { CarouselCtaSlide } from '../../../remotion/compositions/CarouselCtaSlide';
import { CarouselMockupSlide } from '../../../remotion/compositions/CarouselMockupSlide';
import { VideoComposition } from '../../../remotion/compositions/VideoComposition';
import { CAROUSEL, VIDEO, getVideoDuration, DEFAULT_HOOK_OVERLAY } from '../../../remotion/lib/theme';
import type { ResourceItem, ResourceImages, ItemSlideTemplate, OverlayConfig } from '../../../remotion/lib/types';
import { useDesignEditor } from './editor/useDesignEditor';
import { getDefaultHookSlideLayout, getDefaultItemSlideOverrides, getDefaultMockupSlideLayout } from '../../../remotion/lib/default-layouts';
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
    url?: string;
}

interface ItemImageEdits {
    favicon?: string;
    screenshot?: string;
}

type Mode = 'carousel' | 'video';

interface CategoryCache {
    hookText: string;
    subtitle: string;
    itemTemplate: ItemSlideTemplate;
    mode: Mode;
    // Design editor
    hookLayout: import('../../../remotion/lib/design-types').SlideLayout;
    mockupLayout: import('../../../remotion/lib/design-types').SlideLayout;
    itemOverrides: import('../../../remotion/lib/design-types').ItemSlideOverrides;
    videoOverrides: import('../../../remotion/lib/types').VideoLayoutOverrides;
    // Media (server paths only — blob URLs don't survive refresh)
    backgroundImage: string | null;
    backgroundVideo: string | null;
    audioSrc: string | null;
    audioFileName: string | null;
    // Overlay
    hookOverlayConfig: OverlayConfig;
    // Video settings
    showVideoCta: boolean;
    videoBackgroundMode: 'full' | 'hook-only';
    backgroundFallbackColor: string;
    hookDurationSec: number;
    beatIntervalSec: number;
    // Per-item edits
    itemEdits: Record<string, ItemEdits>;
    itemImageEdits: Record<string, ItemImageEdits>;
    // Mockup
    mockupImages: Record<string, string>;
    selectedGsTemplate: string | null;
    mockupBasePath: string | null;
    mockupBasePreview: string | null;
    mockupTemplateUrl: string | null;
    mockupCorners: number[][] | null;
    mockupAdjustments: Record<string, number>;
    // Navigation
    selectedItems: string[];
    currentSlide: number;
}

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
        if (pathSegments.length >= 1) {
            return `${domain}-${pathSegments.join('-')}`;
        }
        return domain;
    } catch {
        return null;
    }
}

const VIRAL_HOOKS = [
    'free courses I regret not knowing as a student 😭',
    'websites that feel illegal to know',
    '5 apps I use to build my startup',
    '5 free resources I wish I knew when first learning to code',
    'websites that make you better at programming',
    '5 YouTubers that got me a software engineering job at Amazon',
    '7 coding tips I\'d tell my 18-year-old self',
    'if I had 90 days to learn to code...',
    'math YouTubers that will save your life',
    'free tools every developer should be using',
    'websites I use daily as a software engineer',
    'AI tools that replaced my entire workflow',
    'repos on GitHub you need to know about',
    'extensions every VS Code user needs',
    'books that made me a better engineer',
    'side project ideas that actually make money',
    'APIs most developers don\'t know exist',
    'things I wish I knew before my first tech interview',
];

const CATEGORY_DEFAULT_HOOKS: Record<string, string> = {
    'products': 'purchases I made that actually changed my life',
    'software': 'apps I can\'t live without as a developer',
    'games': 'games that are actual masterpieces',
    'anime': 'anime that will ruin your sleep schedule',
    'nonfiction-books': 'books that changed how I think about everything',
    'novels': 'novels I think about years after reading',
    'webnovels': 'web novels that are better than most published books',
    'concepts': 'mental models that made me think differently',
    'kl-ai-communities': 'AI communities in KL you need to join',
    'kl-tech-communities': 'tech communities in KL every developer should know',
    'student-ambassador-programs': 'ambassador programs that look insane on your resume',
    'developer-ambassador-programs': 'developer programs that pay you to learn',
    'student-free-perks': 'free stuff you\'re missing out on as a student',
    'startup-accelerators': 'accelerators that actually launch startups',
    'malaysia-gov-grants': 'government grants most Malaysian founders don\'t know about',
    'global-student-competitions': 'competitions that can change your career as a student',
    'malaysia-student-competitions': 'competitions every Malaysian student should enter',
    'malaysia-open-competitions': 'competitions in Malaysia with massive prizes',
    'startup-learning-resources': 'resources I used to learn how to build a startup from zero',
    'startup-ideation': 'tools that help you find startup ideas that actually work',
    'startup-building-mvp': 'tools to go from idea to MVP in a weekend',
    'startup-fundraising': 'resources that helped me understand startup fundraising',
    'startup-marketing-growth': 'growth tools every early-stage founder needs',
    'startup-ai-tech-stack': 'the AI stack I\'d use to build a startup in 2025',
    'my-startup-tools': 'every tool my startup uses to run everything',
    'ai-writing-tools': 'AI writing tools that replaced my entire content workflow',
    'ai-image-tools': 'AI image tools that make Photoshop feel outdated',
    'ai-audio-tools': 'AI audio tools most people don\'t know exist',
    'ai-video-tools': 'AI video tools that feel like they\'re from the future',
    'ai-research-tools': 'AI tools that do 10 hours of research in 10 minutes',
    'ai-design-tools': 'AI design tools every creator needs to know about',
    'ai-avatar-tools': 'AI avatar tools that are honestly scary good',
    'learn-programming': 'free resources I wish I had when learning to code',
    'paid-open-source-programs': 'programs that pay you to contribute to open source',
};

export default function ContentGenerator() {
    const [mode, setMode] = useState<Mode>('carousel');
    const [itemTemplate, setItemTemplate] = useState<ItemSlideTemplate>('card');
    // Greenscreen / mockup state
    const [mockupBasePath, setMockupBasePath] = useState<string | null>(null);
    const [mockupBasePreview, setMockupBasePreview] = useState<string | null>(null);
    const [mockupTemplateUrl, setMockupTemplateUrl] = useState<string | null>(null);
    const [mockupCorners, setMockupCorners] = useState<number[][] | null>(null);
    const [mockupImages, setMockupImages] = useState<Record<string, string>>({});
    const [isCompositing, setIsCompositing] = useState(false);
    const [compositingProgress, setCompositingProgress] = useState('');
    const [greenscreenConnected, setGreenscreenConnected] = useState<boolean | null>(null);
    const [gsTemplates, setGsTemplates] = useState<Array<{ id: string; filename: string; thumbUrl: string; fullUrl: string; corners: number[][]; width: number; height: number }>>([]);
    const [selectedGsTemplate, setSelectedGsTemplate] = useState<string | null>(null);
    const [mockupAdjustments, setMockupAdjustments] = useState<Record<string, number>>({
        blur: 0, brightness: 0, contrast: 0, temperature: 0, saturation: 0,
    });
    const [mockupAdjustmentsOpen, setMockupAdjustmentsOpen] = useState(false);
    const mockupBaseInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [imageManifest, setImageManifest] = useState<ImageManifest>({ images: {} });
    const [hookText, setHookText] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [brandName, setBrandName] = useState('@rashadcodes');
    const [ctaText, setCtaText] = useState('Comment links to get all links sent to you');
    const [ctaSubtitle, setCtaSubtitle] = useState('');
    const [ctaImage, setCtaImage] = useState('');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);
    const [backgroundVideo, setBackgroundVideo] = useState<string | null>(null);
    const [bgVideoPreview, setBgVideoPreview] = useState<string | null>(null);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [audioFileName, setAudioFileName] = useState<string | null>(null);
    const [videoBackgroundMode, setVideoBackgroundMode] = useState<'full' | 'hook-only'>('full');
    const [backgroundFallbackColor, setBackgroundFallbackColor] = useState('#0f172a');
    const [showVideoCta, setShowVideoCta] = useState(true);
    const [hookOverlayConfig, setHookOverlayConfig] = useState<OverlayConfig>({ ...DEFAULT_HOOK_OVERLAY });
    // Beat-synced timing
    const [hookDurationSec, setHookDurationSec] = useState(VIDEO.hookDurationSec);
    const [beatIntervalSec, setBeatIntervalSec] = useState(VIDEO.itemDurationSec);
    const [detectingBeats, setDetectingBeats] = useState(false);
    const [beatAnalysis, setBeatAnalysis] = useState<BeatAnalysis | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const dragItemRef = useRef<string | null>(null);
    const dragOverItemRef = useRef<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [rendering, setRendering] = useState(false);
    const [forceRebundle, setForceRebundle] = useState(false);
    const [renderProgress, setRenderProgress] = useState('');
    const [outputPaths, setOutputPaths] = useState<string[]>([]);
    const [videoOutputPath, setVideoOutputPath] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const bgInputRef = useRef<HTMLInputElement>(null);
    const bgVideoInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    // Design editor
    const editor = useDesignEditor();

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<'preview' | 'settings'>('preview');
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Per-category state cache (persisted to server)
    const prevCategoryRef = useRef<string | null>(null);
    const [cacheDirty, setCacheDirty] = useState(false);
    const [cacheSaving, setCacheSaving] = useState(false);

    // Persistent content descriptions (saved to disk, separate from website descriptions)
    const [contentDescriptions, setContentDescriptions] = useState<Record<string, string>>({});
    // Persistent list notes (saved to disk, per category)
    const [listNotes, setListNotes] = useState<Record<string, string>>({});
    const [listNotesOpen, setListNotesOpen] = useState(false);
    // Per-item edits (text overrides)
    const [itemEdits, setItemEdits] = useState<Record<string, ItemEdits>>({});
    // Per-item image overrides (server paths for render)
    const [itemImageEdits, setItemImageEdits] = useState<Record<string, ItemImageEdits>>({});
    // Per-item image previews (blob URLs for instant preview)
    const [itemImagePreviews, setItemImagePreviews] = useState<Record<string, { favicon?: string; screenshot?: string }>>({});

    const listNoteSaveTimer = useRef<ReturnType<typeof setTimeout>>();
    const updateListNote = useCallback((category: string, value: string) => {
        setListNotes((prev) => ({ ...prev, [category]: value }));
        clearTimeout(listNoteSaveTimer.current);
        listNoteSaveTimer.current = setTimeout(() => {
            fetch('/api/admin/list-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, note: value || null }),
            });
        }, 500);
    }, []);

    const contentDescSaveTimer = useRef<ReturnType<typeof setTimeout>>();
    const updateContentDescription = useCallback((itemName: string, value: string) => {
        setContentDescriptions((prev) => ({ ...prev, [itemName]: value }));
        clearTimeout(contentDescSaveTimer.current);
        contentDescSaveTimer.current = setTimeout(() => {
            fetch('/api/admin/content-descriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemName, description: value || null }),
            });
        }, 500);
    }, []);

    const updateItemEdit = useCallback((itemName: string, field: 'name' | 'description' | 'url', value: string) => {
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

    // Get edited item data (merges edits with original, content description as base)
    function getEditedItem(item: Item) {
        const edits = itemEdits[item.name];
        const contentDesc = contentDescriptions[item.name];
        const base = contentDesc ? { ...item, description: contentDesc } : item;
        if (!edits) return base;
        return {
            ...base,
            ...(edits.name !== undefined && { name: edits.name }),
            ...(edits.description !== undefined && { description: edits.description }),
            ...(edits.url !== undefined && { url: edits.url }),
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

    // Load categories + image manifest + media defaults + content descriptions + list notes + active category
    useEffect(() => {
        Promise.all([
            fetch('/api/admin/lists').then((r) => r.json()),
            fetch('/src/data/resource-images.json').then((r) => r.json()),
            fetch('/api/admin/media-defaults').then((r) => r.json()).catch(() => ({})),
            fetch('/api/admin/content-descriptions').then((r) => r.json()).catch(() => ({})),
            fetch('/api/admin/list-notes').then((r) => r.json()).catch(() => ({})),
            fetch('/api/admin/category-cache?active=1').then((r) => r.json()).catch(() => ({})),
        ]).then(([cats, manifest, defaults, descriptions, notes, activeData]) => {
            setCategories(cats);
            setImageManifest(manifest);
            setContentDescriptions(descriptions);
            setListNotes(notes);
            if (defaults.backgroundImage && !backgroundImage) setBackgroundImage(defaults.backgroundImage);
            if (defaults.backgroundVideo && !backgroundVideo) setBackgroundVideo(defaults.backgroundVideo);
            if (defaults.audioSrc && !audioSrc) setAudioSrc(defaults.audioSrc);
            if (defaults.ctaImage && !ctaImage) setCtaImage(defaults.ctaImage);
            // Set active category AFTER categories are loaded so the switch effect finds currentCategory
            if (activeData?.category) setSelectedCategory(activeData.category);
        });
    }, []);

    const currentCategory = categories.find((c) => c.category === selectedCategory);
    const items = currentCategory?.items || [];
    const selectedArr = Array.isArray(selectedItems) ? selectedItems : [...selectedItems as any];
    const activeItems = selectedArr.map((name: string) => items.find((i) => i.name === name)).filter(Boolean) as Item[];
    const totalSlides = activeItems.length + 2; // hook slide + item slides + CTA slide

    // --- Server-side helpers for per-category cache ---
    async function saveCategoryCache(category: string, cache: CategoryCache): Promise<boolean> {
        try {
            const res = await fetch('/api/admin/category-cache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, cache }),
            });
            return res.ok;
        } catch { return false; }
    }
    async function loadCategoryCache(category: string): Promise<CategoryCache | null> {
        try {
            const res = await fetch(`/api/admin/category-cache?category=${encodeURIComponent(category)}`);
            const data = await res.json();
            return data || null;
        } catch { return null; }
    }
    async function deleteCategoryCache(category: string): Promise<void> {
        await fetch('/api/admin/category-cache', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, cache: null }),
        }).catch(() => {});
    }

    function snapshotCurrentState(): CategoryCache {
        return {
            hookText, subtitle, itemTemplate, mode,
            hookLayout: editor.hookLayout,
            mockupLayout: editor.mockupLayout,
            itemOverrides: editor.itemOverrides,
            videoOverrides: editor.videoOverrides,
            hookOverlayConfig,
            backgroundImage, backgroundVideo, audioSrc, audioFileName,
            showVideoCta, videoBackgroundMode, backgroundFallbackColor,
            hookDurationSec, beatIntervalSec,
            itemEdits, itemImageEdits,
            mockupImages, selectedGsTemplate,
            mockupBasePath, mockupBasePreview, mockupTemplateUrl, mockupCorners, mockupAdjustments,
            selectedItems, currentSlide,
        };
    }

    function restoreFromCache(cached: CategoryCache) {
        setHookText(cached.hookText);
        setSubtitle(cached.subtitle);
        setItemTemplate(cached.itemTemplate);
        if (cached.mode) setMode(cached.mode);
        editor.setHookLayout(cached.hookLayout);
        editor.setMockupLayout(cached.mockupLayout);
        editor.setItemOverrides(cached.itemOverrides);
        editor.setVideoOverrides(cached.videoOverrides);
        if (cached.hookOverlayConfig) setHookOverlayConfig(cached.hookOverlayConfig);
        setBackgroundImage(cached.backgroundImage);
        setBgPreview(cached.backgroundImage); // use server path as preview
        setBackgroundVideo(cached.backgroundVideo);
        setBgVideoPreview(cached.backgroundVideo); // use server path as preview
        setAudioSrc(cached.audioSrc);
        setAudioPreview(cached.audioSrc); // use server path as preview
        setAudioFileName(cached.audioFileName);
        setShowVideoCta(cached.showVideoCta ?? true);
        setVideoBackgroundMode(cached.videoBackgroundMode);
        setBackgroundFallbackColor(cached.backgroundFallbackColor);
        setHookDurationSec(cached.hookDurationSec);
        setBeatIntervalSec(cached.beatIntervalSec);
        setBeatAnalysis(null); // not serializable, re-detect if needed
        setItemEdits(cached.itemEdits);
        setItemImageEdits(cached.itemImageEdits);
        setItemImagePreviews({}); // blob URLs don't survive refresh
        setMockupImages(cached.mockupImages);
        setSelectedGsTemplate(cached.selectedGsTemplate);
        setMockupBasePath(cached.mockupBasePath);
        setMockupBasePreview(cached.mockupBasePreview);
        setMockupTemplateUrl(cached.mockupTemplateUrl);
        setMockupCorners(cached.mockupCorners);
        setMockupAdjustments(cached.mockupAdjustments);
        setSelectedItems(cached.selectedItems);
        setCurrentSlide(cached.currentSlide);
    }

    // Restore or initialize state when switching categories
    useEffect(() => {
        if (!currentCategory) return;

        // Save previous category before switching (if dirty)
        const prev = prevCategoryRef.current;
        if (prev && cacheDirty) {
            saveCategoryCache(prev, snapshotCurrentState());
        }
        prevCategoryRef.current = selectedCategory;

        // Persist active category to server
        fetch('/api/admin/category-cache', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activeCategory: selectedCategory }),
        }).catch(() => {});

        // Suppress dirty-tracking during restore
        initialLoadRef.current = true;

        // Restore cached state or use defaults (async)
        loadCategoryCache(selectedCategory!).then((cached) => {
            if (cached) {
                restoreFromCache(cached);
            } else {
                // Defaults for a fresh category
                setHookText(CATEGORY_DEFAULT_HOOKS[selectedCategory!] || `Top ${items.length} ${currentCategory.title}`);
                setSubtitle('');
                setItemTemplate('card');
                editor.setHookLayout(getDefaultHookSlideLayout());
                editor.setMockupLayout(getDefaultMockupSlideLayout());
                editor.setItemOverrides(getDefaultItemSlideOverrides());
                editor.setVideoOverrides({});
                setHookOverlayConfig({ ...DEFAULT_HOOK_OVERLAY });
                setItemEdits({});
                setItemImageEdits({});
                setItemImagePreviews({});
                setMockupImages({});
                setSelectedGsTemplate(null);
                setMockupBasePath(null);
                setMockupBasePreview(null);
                setMockupTemplateUrl(null);
                setMockupCorners(null);
                setMockupAdjustments({ blur: 0, brightness: 0, contrast: 0, temperature: 0, saturation: 0 });
                setShowVideoCta(true);
                setHookDurationSec(VIDEO.hookDurationSec);
                setBeatIntervalSec(VIDEO.itemDurationSec);
                setBeatAnalysis(null);
                setSelectedItems(items.map((i) => i.name));
                setCurrentSlide(0);
            }
            setCacheDirty(false);
        });
    }, [selectedCategory]);

    // Track dirty state when any cached field changes
    const initialLoadRef = useRef(true);
    useEffect(() => {
        if (!selectedCategory) return;
        // Skip marking dirty during initial load/restore
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }
        setCacheDirty(true);
    }, [
        hookText, subtitle, itemTemplate, mode,
        editor.hookLayout, editor.mockupLayout, editor.itemOverrides, editor.videoOverrides,
        hookOverlayConfig,
        backgroundImage, backgroundVideo, audioSrc, audioFileName,
        showVideoCta, videoBackgroundMode, backgroundFallbackColor,
        hookDurationSec, beatIntervalSec,
        itemEdits, itemImageEdits,
        mockupImages, selectedGsTemplate,
        mockupBasePath, mockupBasePreview, mockupTemplateUrl, mockupCorners, mockupAdjustments,
        selectedItems, currentSlide,
    ]);

    // Explicit save handler
    async function handleSaveCache() {
        if (!selectedCategory) return;
        setCacheSaving(true);
        const ok = await saveCategoryCache(selectedCategory, snapshotCurrentState());
        setCacheSaving(false);
        if (ok) {
            setCacheDirty(false);
            showToast('State saved');
        } else {
            showToast('Save failed');
        }
    }

    // Sync editing slide type with current slide
    useEffect(() => {
        const slideType = currentSlide === 0 ? 'hook'
            : currentSlide <= activeItems.length
                ? (itemTemplate === 'mockup' ? 'mockup' : 'item')
                : 'hook';
        editor.setEditingSlideType(slideType);
        editor.setSelectedElementId(null);
    }, [currentSlide, itemTemplate]);

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
        const isImage = file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name);
        if (!isImage) {
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

    // Greenscreen health check + template loading
    const checkGreenscreen = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/greenscreen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'health' }),
            });
            const data = await res.json();
            setGreenscreenConnected(data.connected);

            // If connected, also load templates
            if (data.connected) {
                const tmplRes = await fetch('/api/admin/greenscreen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'list-templates' }),
                });
                const tmplData = await tmplRes.json();
                if (tmplRes.ok && tmplData.templates) {
                    setGsTemplates(tmplData.templates);
                }
            }
        } catch {
            setGreenscreenConnected(false);
        }
    }, []);

    // Check greenscreen when mockup template is selected
    useEffect(() => {
        if (itemTemplate === 'mockup') {
            checkGreenscreen();
        }
    }, [itemTemplate, checkGreenscreen]);

    // Select a greenscreen template (from the server's defaults)
    const handleSelectGsTemplate = useCallback((tmpl: typeof gsTemplates[number]) => {
        setSelectedGsTemplate(tmpl.id);
        setMockupTemplateUrl(tmpl.fullUrl);
        setMockupBasePreview(tmpl.thumbUrl);
        setMockupBasePath(null); // not a local path
        setMockupCorners(tmpl.corners);
        setMockupImages({}); // reset composited images when template changes
        setCompositingProgress('');
        showToast(`Template "${tmpl.id}" selected`);
    }, [gsTemplates]);

    // Upload custom greenscreen base image
    const handleMockupBaseUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            showToast('Not an image file');
            return;
        }
        const preview = URL.createObjectURL(file);
        setMockupBasePreview(preview);
        setSelectedGsTemplate(null); // deselect any server template
        setMockupTemplateUrl(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', `mockup-base-${Date.now()}`);
        try {
            const res = await fetch('/api/admin/media-library', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMockupBasePath(data.path);

            // Auto-detect corners
            const detectRes = await fetch('/api/admin/greenscreen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'detect', baseImagePath: data.path }),
            });
            const detectData = await detectRes.json();
            if (detectRes.ok && detectData.corners) {
                setMockupCorners(detectData.corners);
                showToast('Green screen detected!');
            }
        } catch (err: any) {
            showToast(`Upload failed: ${err.message}`);
            setMockupBasePreview(null);
        }
    }, []);

    // Composite all items
    const handleCompositeAll = useCallback(async () => {
        if (!mockupBasePath && !mockupTemplateUrl) {
            showToast('Select a template or upload a base image first');
            return;
        }

        const itemsToComposite = activeItems
            .map((item) => {
                const imgs = getEditedImages(item);
                const screenshot = imgs?.screenshot;
                const domainKey = getDomainKey(item.url);
                if (!screenshot || !domainKey) return null;
                return { domainKey, screenshotPath: screenshot, itemName: item.name };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null);

        if (itemsToComposite.length === 0) {
            showToast('No items have screenshots to composite');
            return;
        }

        setIsCompositing(true);
        setCompositingProgress(`Compositing 0/${itemsToComposite.length}...`);

        const results: Record<string, string> = {};
        for (let i = 0; i < itemsToComposite.length; i++) {
            const entry = itemsToComposite[i];
            setCompositingProgress(`Compositing ${i + 1}/${itemsToComposite.length}: ${entry.itemName}...`);
            try {
                const res = await fetch('/api/admin/greenscreen', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'composite-one',
                        ...(mockupTemplateUrl
                            ? { templateUrl: mockupTemplateUrl }
                            : { baseImagePath: mockupBasePath }),
                        screenshotPath: entry.screenshotPath,
                        corners: mockupCorners || undefined,
                        domainKey: entry.domainKey,
                        adjustments: mockupAdjustments,
                    }),
                });
                const data = await res.json();
                if (res.ok && data.path) {
                    results[entry.itemName] = data.path;
                }
            } catch (err) {
                console.error(`Failed to composite ${entry.itemName}:`, err);
            }
        }

        setMockupImages((prev) => ({ ...prev, ...results }));
        setIsCompositing(false);
        setCompositingProgress(`Done! ${Object.keys(results).length}/${itemsToComposite.length} composited.`);
        showToast(`Composited ${Object.keys(results).length} mockups`);
    }, [mockupBasePath, mockupTemplateUrl, mockupCorners, mockupAdjustments, activeItems]);

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
                    ctaSubtitle: ctaSubtitle || undefined,
                    ctaImage: ctaImage || undefined,
                    template: itemTemplate,
                    logoUrls: showLogos ? logoUrlsForRender : [],
                    hookLayout: editor.hookLayout,
                    mockupLayout: editor.mockupLayout,
                    itemOverrides: editor.itemOverrides,
                    hookOverlayConfig,
                    rebundle: forceRebundle,
                    items: activeItems.map((item) => {
                        const edited = getEditedItem(item);
                        return {
                            item: edited,
                            images: getRenderImages(item),
                            mockupImage: mockupImages[item.name] || undefined,
                        };
                    }),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOutputPaths(data.paths);
            setRenderProgress(`Done! ${data.paths.length} slides rendered.`);
            showToast('Carousel rendered successfully!');
            if (forceRebundle) setForceRebundle(false);
            downloadAll(data.paths);
        } catch (err: any) {
            setRenderProgress(`Error: ${err.message}`);
        } finally {
            setRendering(false);
        }
    }, [backgroundImage, hookText, subtitle, brandName, ctaText, ctaSubtitle, ctaImage, activeItems, editor.hookLayout, editor.mockupLayout, editor.itemOverrides, itemEdits, itemImageEdits, itemTemplate, mockupImages]);

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
                    template: itemTemplate,
                    layoutOverrides: editor.videoOverrides,
                    hookLayout: editor.hookLayout,
                    mockupLayout: editor.mockupLayout,
                    logoUrls: logoUrlsForRender,
                    rebundle: forceRebundle,
                    items: activeItems.map((item) => {
                        const edited = getEditedItem(item);
                        return {
                            item: edited,
                            images: getRenderImages(item),
                            mockupImage: mockupImages[item.name] || undefined,
                        };
                    }),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setVideoOutputPath(data.path);
            setRenderProgress('Video rendered!');
            showToast('Video rendered successfully!');
            if (forceRebundle) setForceRebundle(false);
            triggerDownload(data.path, data.path.split('/').pop() || 'reel.mp4');
        } catch (err: any) {
            setRenderProgress(`Error: ${err.message}`);
        } finally {
            setRendering(false);
        }
    }, [backgroundVideo, backgroundImage, hookText, subtitle, brandName, activeItems, editor.videoOverrides, editor.hookLayout, editor.mockupLayout, itemEdits, itemImageEdits, hookDurationSec, beatIntervalSec, itemTemplate, mockupImages]);

    function triggerDownload(url: string, filename: string) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function downloadAll(paths: string[]) {
        paths.forEach((p, i) => {
            setTimeout(() => {
                const filename = p.split('/').pop() || `slide-${i}.png`;
                triggerDownload(p, filename);
            }, i * 300);
        });
    }

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    }

    function toggleItem(name: string) {
        setSelectedItems((prev) => {
            if (prev.includes(name)) return prev.filter((n) => n !== name);
            return [...prev, name];
        });
    }

    function selectAll() {
        setSelectedItems(items.map((i) => i.name));
    }

    function selectNone() {
        setSelectedItems([]);
    }

    const handleResetCategoryState = useCallback(() => {
        if (!selectedCategory || !currentCategory) return;
        deleteCategoryCache(selectedCategory);
        setHookText(CATEGORY_DEFAULT_HOOKS[selectedCategory] || `Top ${items.length} ${currentCategory.title}`);
        setSubtitle('');
        setItemTemplate('card');
        editor.resetHookLayout();
        editor.resetMockupLayout();
        editor.resetItemOverrides();
        editor.resetVideoOverrides();
        setHookOverlayConfig({ ...DEFAULT_HOOK_OVERLAY });
        setItemEdits({});
        setItemImageEdits({});
        setItemImagePreviews({});
        setMockupImages({});
        setSelectedGsTemplate(null);
        setMockupBasePath(null);
        setMockupBasePreview(null);
        setMockupTemplateUrl(null);
        setMockupCorners(null);
        setMockupAdjustments({ blur: 0, brightness: 0, contrast: 0, temperature: 0, saturation: 0 });
        setShowVideoCta(true);
        setHookDurationSec(VIDEO.hookDurationSec);
        setBeatIntervalSec(VIDEO.itemDurationSec);
        setBeatAnalysis(null);
        setSelectedItems(items.map((i) => i.name));
        setCurrentSlide(0);
        setCacheDirty(false);
        showToast('List state reset');
    }, [selectedCategory, currentCategory, items]);

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
    const isMockupSlide = !isHookSlide && !isCtaSlide && itemTemplate === 'mockup';
    const currentItemIndex = currentSlide - 1;
    const currentItem = activeItems[currentItemIndex];

    // Video timing (frame counts from seconds)
    const hookDurationFrames = Math.round(hookDurationSec * VIDEO.fps);
    const itemDurationFrames = Math.round(beatIntervalSec * VIDEO.fps);
    const ctaDurationFrames = showVideoCta ? Math.round(VIDEO.ctaDurationSec * VIDEO.fps) : 0;
    const videoDuration = getVideoDuration(activeItems.length, hookDurationFrames, itemDurationFrames, ctaDurationFrames);

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar - desktop: fixed column, mobile: compact header bar */}
            {isMobile ? (
                <div
                    style={{
                        borderBottom: '1px solid #e2e8f0',
                        background: '#fff',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        flexShrink: 0,
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>Content</h2>
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            fontSize: 14,
                            background: '#fff',
                            minWidth: 0,
                        }}
                    >
                        <option value="">Select category...</option>
                        {categories.map((cat) => (
                            <option key={cat.category} value={cat.category}>
                                {cat.title} ({cat.items.length})
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
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
            )}

            {/* Mobile tab bar */}
            {isMobile && selectedCategory && (
                <div
                    style={{
                        display: 'flex',
                        borderBottom: '1px solid #e2e8f0',
                        background: '#fff',
                        flexShrink: 0,
                    }}
                >
                    {(['preview', 'settings'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setMobilePanel(tab)}
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                border: 'none',
                                borderBottom: mobilePanel === tab ? '2px solid #4f46e5' : '2px solid transparent',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: mobilePanel === tab ? 600 : 400,
                                color: mobilePanel === tab ? '#4f46e5' : '#64748b',
                                textTransform: 'capitalize',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}

            {/* Main panel */}
            <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? 0 : 32 }}>
                {!selectedCategory ? (
                    <div style={{ textAlign: 'center', marginTop: 120, color: '#94a3b8', fontSize: 18 }}>
                        Select a category to start
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 32 }}>
                        {/* Left: Settings */}
                        <div style={{ flex: 1, minWidth: 0, display: isMobile && mobilePanel !== 'settings' ? 'none' : undefined, padding: isMobile ? 16 : undefined }}>
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
                                <button
                                    onClick={handleSaveCache}
                                    disabled={!cacheDirty || cacheSaving}
                                    style={{
                                        ...smallBtnStyle,
                                        background: cacheDirty ? '#4f46e5' : '#e2e8f0',
                                        color: cacheDirty ? '#fff' : '#94a3b8',
                                        borderColor: cacheDirty ? '#4f46e5' : '#e2e8f0',
                                        fontSize: 11,
                                        opacity: cacheSaving ? 0.7 : 1,
                                    }}
                                    title="Save state to server (syncs across devices)"
                                >
                                    {cacheSaving ? 'Saving...' : cacheDirty ? 'Save' : 'Saved'}
                                </button>
                                <button
                                    onClick={handleResetCategoryState}
                                    style={{
                                        ...smallBtnStyle,
                                        color: '#ef4444',
                                        borderColor: '#fecaca',
                                        fontSize: 11,
                                    }}
                                    title="Reset all edits for this list"
                                >
                                    Reset List
                                </button>
                            </div>

                            {/* Template toggle */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                                    Item Slide Template
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        background: '#f1f5f9',
                                        borderRadius: 8,
                                        padding: 3,
                                    }}
                                >
                                    <button
                                        onClick={() => setItemTemplate('card')}
                                        style={{
                                            ...toggleBtnStyle,
                                            flex: 1,
                                            background: itemTemplate === 'card' ? '#fff' : 'transparent',
                                            color: itemTemplate === 'card' ? '#4f46e5' : '#64748b',
                                            boxShadow: itemTemplate === 'card' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        }}
                                    >
                                        Card
                                    </button>
                                    <button
                                        onClick={() => setItemTemplate('mockup')}
                                        style={{
                                            ...toggleBtnStyle,
                                            flex: 1,
                                            background: itemTemplate === 'mockup' ? '#fff' : 'transparent',
                                            color: itemTemplate === 'mockup' ? '#4f46e5' : '#64748b',
                                            boxShadow: itemTemplate === 'mockup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        }}
                                    >
                                        Mockup
                                    </button>
                                </div>
                            </div>

                            {/* Greenscreen / Mockup Config (when mockup template selected) */}
                            {itemTemplate === 'mockup' && (
                                <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Greenscreen Config
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: greenscreenConnected === true ? '#22c55e' : greenscreenConnected === false ? '#ef4444' : '#94a3b8',
                                                }}
                                            />
                                            <span style={{ fontSize: 11, color: '#64748b' }}>
                                                {greenscreenConnected === true ? 'Connected' : greenscreenConnected === false ? 'Disconnected' : 'Checking...'}
                                            </span>
                                            <button onClick={checkGreenscreen} style={{ ...smallBtnStyle, fontSize: 11, padding: '2px 6px' }}>
                                                Retry
                                            </button>
                                        </div>
                                    </div>

                                    {greenscreenConnected === false && (
                                        <div style={{
                                            padding: '8px 12px',
                                            background: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            borderRadius: 8,
                                            fontSize: 12,
                                            color: '#dc2626',
                                            marginBottom: 12,
                                        }}>
                                            Python greenscreen server not running. Start it with: cd ../greenscreen &amp;&amp; python server.py
                                        </div>
                                    )}

                                    {/* Template picker from greenscreen server */}
                                    {gsTemplates.length > 0 && (
                                        <div style={{ marginBottom: 12 }}>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
                                                Templates
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: 8,
                                                    overflowX: 'auto',
                                                    paddingBottom: 4,
                                                }}
                                            >
                                                {gsTemplates.map((tmpl) => (
                                                    <img
                                                        key={tmpl.id}
                                                        src={tmpl.thumbUrl}
                                                        onClick={() => handleSelectGsTemplate(tmpl)}
                                                        style={{
                                                            width: 56,
                                                            height: 75,
                                                            objectFit: 'cover',
                                                            borderRadius: 6,
                                                            cursor: 'pointer',
                                                            flexShrink: 0,
                                                            border: selectedGsTemplate === tmpl.id
                                                                ? '2px solid #4f46e5'
                                                                : '2px solid transparent',
                                                            opacity: selectedGsTemplate === tmpl.id ? 1 : 0.7,
                                                            transition: 'all 0.15s',
                                                        }}
                                                        title={tmpl.id}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Custom upload (alternative to templates) */}
                                    <div style={{ fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 6 }}>
                                        {gsTemplates.length > 0 ? 'Or upload your own' : 'Base Image (mockup with green screen)'}
                                    </div>
                                    <div
                                        onClick={() => mockupBaseInputRef.current?.click()}
                                        style={{
                                            border: '2px dashed #cbd5e1',
                                            borderRadius: 8,
                                            padding: 12,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            background: mockupBasePreview && !selectedGsTemplate
                                                ? `url(${mockupBasePreview}) center/contain no-repeat`
                                                : '#fff',
                                            minHeight: 48,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        {mockupBasePreview && !selectedGsTemplate && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: 6 }} />
                                        )}
                                        <span style={{
                                            position: 'relative',
                                            color: mockupBasePreview && !selectedGsTemplate ? '#fff' : '#94a3b8',
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}>
                                            {mockupBasePath ? 'Custom image uploaded - click to replace' : 'Click to upload custom base image'}
                                        </span>
                                        <input
                                            ref={mockupBaseInputRef}
                                            type="file"
                                            accept="image/*,.heic,.heif"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleMockupBaseUpload(file);
                                            }}
                                        />
                                    </div>

                                    {mockupCorners && (
                                        <div style={{ marginTop: 8, fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
                                            Green screen detected ({mockupCorners.length} corners)
                                        </div>
                                    )}

                                    {/* Screenshot Adjustments (collapsible) */}
                                    {(mockupBasePath || mockupTemplateUrl) && (
                                        <div style={{ marginTop: 12 }}>
                                            <button
                                                onClick={() => setMockupAdjustmentsOpen((v) => !v)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    width: '100%',
                                                    background: 'none',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: 6,
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: '#475569',
                                                }}
                                            >
                                                <span style={{
                                                    display: 'inline-block',
                                                    transform: mockupAdjustmentsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.15s',
                                                    fontSize: 10,
                                                }}>
                                                    ▶
                                                </span>
                                                Screenshot Adjustments
                                                {Object.values(mockupAdjustments).some((v) => v !== 0) && (
                                                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6366f1' }}>modified</span>
                                                )}
                                            </button>
                                            {mockupAdjustmentsOpen && (
                                                <div style={{
                                                    marginTop: 8,
                                                    padding: '10px 12px',
                                                    background: '#f8fafc',
                                                    borderRadius: 8,
                                                    border: '1px solid #e2e8f0',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 10,
                                                }}>
                                                    {([
                                                        { key: 'blur', label: 'Blur', min: 0, max: 10, step: 0.5 },
                                                        { key: 'brightness', label: 'Brightness', min: -100, max: 100, step: 5 },
                                                        { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 5 },
                                                        { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 5 },
                                                        { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 5 },
                                                    ] as const).map(({ key, label, min, max, step }) => (
                                                        <div key={key}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 3 }}>
                                                                <span>{label}</span>
                                                                <span style={{ fontFamily: 'monospace', minWidth: 32, textAlign: 'right' }}>{mockupAdjustments[key]}</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min={min}
                                                                max={max}
                                                                step={step}
                                                                value={mockupAdjustments[key]}
                                                                onChange={(e) => setMockupAdjustments((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                                                                style={{ width: '100%', accentColor: '#6366f1' }}
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => setMockupAdjustments({ blur: 0, brightness: 0, contrast: 0, temperature: 0, saturation: 0 })}
                                                        style={{
                                                            alignSelf: 'flex-end',
                                                            background: 'none',
                                                            border: 'none',
                                                            fontSize: 11,
                                                            color: '#94a3b8',
                                                            cursor: 'pointer',
                                                            padding: '2px 0',
                                                        }}
                                                    >
                                                        Reset all
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Composite All button */}
                                    {(mockupBasePath || mockupTemplateUrl) && (
                                        <button
                                            onClick={handleCompositeAll}
                                            disabled={isCompositing || !greenscreenConnected}
                                            style={{
                                                marginTop: 12,
                                                width: '100%',
                                                padding: '10px 16px',
                                                background: isCompositing ? '#94a3b8' : '#059669',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 8,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                cursor: isCompositing ? 'default' : 'pointer',
                                            }}
                                        >
                                            {isCompositing ? 'Compositing...' : 'Composite All Items'}
                                        </button>
                                    )}
                                    {compositingProgress && (
                                        <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
                                            {compositingProgress}
                                        </div>
                                    )}

                                    {Object.keys(mockupImages).length > 0 && (
                                        <div style={{ marginTop: 8, fontSize: 12, color: '#059669', fontWeight: 500 }}>
                                            {Object.keys(mockupImages).length} mockups ready
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Text inputs */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                                <label style={labelStyle}>
                                    Hook Text
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value) setHookText(e.target.value);
                                        }}
                                        style={{ ...inputStyle, marginBottom: 6, color: hookText ? '#94a3b8' : '#334155' }}
                                    >
                                        <option value="">— pick a viral hook template —</option>
                                        {VIRAL_HOOKS.map((hook) => (
                                            <option key={hook} value={hook}>{hook}</option>
                                        ))}
                                    </select>
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
                                    <>
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
                                        <label style={labelStyle}>
                                            CTA Subtitle
                                            <input
                                                type="text"
                                                value={ctaSubtitle}
                                                onChange={(e) => setCtaSubtitle(e.target.value)}
                                                style={inputStyle}
                                                placeholder="Optional subtitle for CTA slide"
                                            />
                                        </label>
                                        <label style={labelStyle}>
                                            CTA Background Image
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <MediaPicker
                                                    type="image"
                                                    currentPath={ctaImage}
                                                    onSelect={(path) => setCtaImage(path)}
                                                    label={ctaImage ? 'Change' : 'Pick image'}
                                                    defaultKey="ctaImage"
                                                />
                                                {ctaImage && (
                                                    <>
                                                        <img src={ctaImage} style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />
                                                        <button
                                                            onClick={() => setCtaImage('')}
                                                            style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </>
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
                                        defaultKey="backgroundImage"
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
                                        accept="image/*,.heic,.heif"
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
                                            defaultKey="backgroundVideo"
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
                                            defaultKey="audioSrc"
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
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={showVideoCta}
                                                onChange={(e) => setShowVideoCta(e.target.checked)}
                                            />
                                            Include CTA slide
                                        </label>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: '#94a3b8',
                                                borderTop: '1px solid #f1f5f9',
                                                paddingTop: 8,
                                            }}
                                        >
                                            Total: {(videoDuration / VIDEO.fps).toFixed(1)}s
                                            ({hookDurationSec.toFixed(2)}s hook + {activeItems.length} × {beatIntervalSec.toFixed(2)}s{showVideoCta ? ` + ${VIDEO.ctaDurationSec}s CTA` : ''})
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* List Notes */}
                            {selectedCategory && (
                                <div style={{ marginBottom: 16 }}>
                                    <div
                                        onClick={() => setListNotesOpen(!listNotesOpen)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            marginBottom: listNotesOpen ? 8 : 0,
                                        }}
                                    >
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Internal Notes {listNotesOpen ? '▾' : '▸'}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {listNotesOpen && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(listNotes[selectedCategory!] || '');
                                                    }}
                                                    style={{ ...smallBtnStyle, fontSize: 11 }}
                                                >
                                                    Copy
                                                </button>
                                            )}
                                            {listNotesOpen && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const defaultNote = `${currentCategory?.title || selectedCategory}\n${items.map((item, i) => `${i + 1}. ${item.name}`).join('\n')}`;
                                                        updateListNote(selectedCategory!, defaultNote);
                                                    }}
                                                    style={{ ...smallBtnStyle, fontSize: 11 }}
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {listNotesOpen && (
                                        <textarea
                                            value={listNotes[selectedCategory!] ?? `${currentCategory?.title || selectedCategory}\n${items.map((item, i) => `${i + 1}. ${item.name}`).join('\n')}`}
                                            onChange={(e) => updateListNote(selectedCategory!, e.target.value)}
                                            style={{
                                                width: '100%',
                                                minHeight: 200,
                                                padding: '8px 10px',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: 8,
                                                fontSize: 12,
                                                fontFamily: 'ui-monospace, monospace',
                                                lineHeight: 1.5,
                                                resize: 'vertical',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                            placeholder="Add notes per item for AI content generation..."
                                        />
                                    )}
                                    {listNotesOpen && (
                                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                                            Add notes next to items, then copy into AI to generate content descriptions.
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
                                        Items ({selectedArr.length}/{items.length})
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
                                        maxHeight: 400,
                                        overflowY: 'auto',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 8,
                                    }}
                                >
                                    {/* Selected items first (draggable to reorder), then unselected */}
                                    {[...activeItems, ...items.filter((i) => !selectedArr.includes(i.name))].map((item) => {
                                        const isSelected = selectedArr.includes(item.name);
                                        const selectedIdx = selectedArr.indexOf(item.name);
                                        return (
                                            <div
                                                key={item.name}
                                                draggable={isSelected}
                                                onDragStart={(e) => {
                                                    dragItemRef.current = item.name;
                                                    e.currentTarget.style.opacity = '0.4';
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.style.opacity = '1';
                                                    dragItemRef.current = null;
                                                    dragOverItemRef.current = null;
                                                }}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    if (isSelected) dragOverItemRef.current = item.name;
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const from = dragItemRef.current;
                                                    const to = dragOverItemRef.current;
                                                    if (!from || !to || from === to) return;
                                                    setSelectedItems((prev) => {
                                                        const arr = Array.isArray(prev) ? [...prev] : [...prev as any];
                                                        const fromIdx = arr.indexOf(from);
                                                        const toIdx = arr.indexOf(to);
                                                        if (fromIdx === -1 || toIdx === -1) return prev;
                                                        arr.splice(fromIdx, 1);
                                                        arr.splice(toIdx, 0, from);
                                                        return arr;
                                                    });
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    padding: '8px 12px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    cursor: isSelected ? 'grab' : 'pointer',
                                                    fontSize: 14,
                                                    background: isSelected ? '#f0fdf4' : 'transparent',
                                                }}
                                            >
                                                {isSelected && (
                                                    <span style={{ color: '#9ca3af', fontSize: 12, cursor: 'grab', userSelect: 'none' }}>⠿</span>
                                                )}
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleItem(item.name)}
                                                />
                                                {isSelected && (
                                                    <span style={{ color: '#6b7280', fontSize: 11, minWidth: 14 }}>{selectedIdx + 1}.</span>
                                                )}
                                                <span style={{ flex: 1 }}>{item.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Export */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
                                <input type="checkbox" checked={forceRebundle} onChange={(e) => setForceRebundle(e.target.checked)} />
                                Force rebundle (use after code changes)
                            </label>
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
                        <div style={{
                            width: isMobile ? '100%' : 420,
                            flexShrink: 0,
                            display: isMobile && mobilePanel !== 'preview' ? 'none' : undefined,
                        }}>
                            {mode === 'carousel' ? (
                                /* Carousel preview */
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: isMobile ? 0 : 12,
                                            padding: isMobile ? '8px 12px' : undefined,
                                        }}
                                    >
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                                            Slide {currentSlide + 1}/{totalSlides}
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
                                            borderRadius: isMobile ? 0 : 12,
                                            overflow: 'hidden',
                                            boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.12)',
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
                                                        overlayConfig: hookOverlayConfig,
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
                                                    ctaSubtitle: ctaSubtitle || undefined,
                                                    ctaImage: ctaImage || undefined,
                                                    brandName,
                                                }}
                                            />
                                        ) : currentItem ? (
                                            itemTemplate === 'mockup' && mockupImages[currentItem.name] ? (
                                                <EditorOverlay
                                                    compositionWidth={CAROUSEL.width}
                                                    compositionHeight={CAROUSEL.height}
                                                    layout={editor.mockupLayout}
                                                    selectedElementId={editor.selectedElementId}
                                                    onSelectElement={editor.setSelectedElementId}
                                                    onUpdateElement={editor.updateElement}
                                                    onDeleteElement={editor.deleteElement}
                                                >
                                                    <Player
                                                        component={CarouselMockupSlide}
                                                        compositionWidth={CAROUSEL.width}
                                                        compositionHeight={CAROUSEL.height}
                                                        durationInFrames={1}
                                                        fps={1}
                                                        style={{ width: '100%', height: '100%' }}
                                                        inputProps={{
                                                            item: (() => {
                                                                const edited = getEditedItem(currentItem);
                                                                return {
                                                                    name: edited.name,
                                                                    description: edited.description,
                                                                    url: edited.url,
                                                                    tags: edited.tags,
                                                                };
                                                            })(),
                                                            mockupImage: mockupImages[currentItem.name],
                                                            slideNumber: currentItemIndex + 1,
                                                            totalSlides: activeItems.length,
                                                            brandName,
                                                            favicon: getEditedImages(currentItem)?.favicon,
                                                            layout: editor.mockupLayout,
                                                            overlayConfig: editor.itemOverrides.overlayConfig,
                                                            showOverlay: editor.itemOverrides.showOverlay ?? true,
                                                        }}
                                                    />
                                                </EditorOverlay>
                                            ) : itemTemplate === 'mockup' ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '100%',
                                                        aspectRatio: '1080/1350',
                                                        color: '#94a3b8',
                                                        gap: 8,
                                                    }}
                                                >
                                                    <div style={{ fontSize: 14 }}>Mockup not composited yet</div>
                                                    <div style={{ fontSize: 12, color: '#64748b' }}>{currentItem.name}</div>
                                                </div>
                                            ) : (
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
                                            )
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
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: isMobile ? 0 : 12, padding: isMobile ? '8px 12px' : undefined }}>
                                        Video Preview ({(videoDuration / VIDEO.fps).toFixed(1)}s)
                                    </div>
                                    <div
                                        style={{
                                            borderRadius: isMobile ? 0 : 12,
                                            overflow: 'hidden',
                                            boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.12)',
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
                                                    template: itemTemplate,
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
                                                    hookLayout: editor.hookLayout,
                                                    mockupLayout: editor.mockupLayout,
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
                                                            images: {
                                                                ...getEditedImages(item),
                                                                mockup: mockupImages[item.name] || undefined,
                                                            },
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
                            {/* Mobile export button */}
                            {isMobile && (
                                <div style={{ padding: 12 }}>
                                    <button
                                        onClick={mode === 'carousel' ? handleRenderCarousel : handleRenderVideo}
                                        disabled={rendering}
                                        style={{
                                            width: '100%',
                                            padding: '12px 20px',
                                            background: rendering ? '#94a3b8' : mode === 'video' ? '#7c3aed' : '#4f46e5',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 10,
                                            fontSize: 15,
                                            fontWeight: 600,
                                            cursor: rendering ? 'default' : 'pointer',
                                        }}
                                    >
                                        {rendering
                                            ? 'Rendering...'
                                            : mode === 'carousel'
                                              ? 'Export PNGs'
                                              : 'Export MP4'}
                                    </button>
                                    {renderProgress && (
                                        <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>{renderProgress}</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right: Design Editor Panel */}
                        <div
                            style={{
                                width: isMobile ? undefined : 240,
                                flexShrink: 0,
                                borderLeft: isMobile ? 'none' : '1px solid #e2e8f0',
                                padding: isMobile ? 16 : undefined,
                                paddingLeft: isMobile ? undefined : 24,
                                overflowY: 'auto',
                                maxHeight: isMobile ? undefined : 'calc(100vh - 64px)',
                                display: isMobile && mobilePanel !== 'preview' ? 'none' : undefined,
                            }}
                        >
                            {mode === 'carousel' ? (
                                <>
                                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#334155' }}>
                                        Design Editor
                                    </div>

                                    {(isHookSlide || isMockupSlide) && (
                                        <div style={{ marginBottom: 16 }}>
                                            <AddElementToolbar
                                                layout={isHookSlide ? editor.hookLayout : editor.mockupLayout}
                                                selectedElementId={editor.selectedElementId}
                                                editingSlideType={editor.editingSlideType}
                                                onAddText={editor.addTextElement}
                                                onSelectElement={editor.setSelectedElementId}
                                                onDeleteElement={editor.deleteElement}
                                                onUpdateElement={editor.updateElement}
                                                onResetLayout={isHookSlide ? editor.resetHookLayout : editor.resetMockupLayout}
                                            />
                                        </div>
                                    )}

                                    <PropertiesPanel
                                        element={editor.selectedElement}
                                        editingSlideType={editor.editingSlideType}
                                        itemOverrides={editor.itemOverrides}
                                        onUpdateElement={editor.updateElement}
                                        onUpdateItemOverride={editor.updateItemOverride}
                                        hookOverlayConfig={hookOverlayConfig}
                                        onUpdateHookOverlay={setHookOverlayConfig}
                                    />

                                    {/* Per-item editor (carousel item slides) */}
                                    {!isHookSlide && currentItem && (
                                        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 16, paddingTop: 16 }}>
                                            <ItemEditorPanel
                                                itemName={currentItem.name}
                                                itemDescription={currentItem.description}
                                                itemUrl={currentItem.url}
                                                images={getItemImages(currentItem)}
                                                edits={itemEdits[currentItem.name] || {}}
                                                imageEdits={itemImageEdits[currentItem.name] || {}}
                                                imagePreviews={itemImagePreviews[currentItem.name] || {}}
                                                contentDescription={contentDescriptions[currentItem.name] || ''}
                                                onUpdateContentDescription={(value) => updateContentDescription(currentItem.name, value)}
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
