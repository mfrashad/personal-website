import { useState, useMemo, useEffect, useCallback } from 'react';
import {
    MagnifyingGlass,
    X,
    ArrowSquareOut,
    ShoppingBag,
    AppWindow,
    GameController,
    Television,
    BookOpen,
    Book,
    Scroll,
    Lightbulb,
    Microphone,
    Article,
    MusicNotes,
    Users,
    UsersThree,
    Code,
    Student,
    Trophy,
    Gift,
    RocketLaunch,
    Bank,
    Medal,
    FlagBanner,
    GraduationCap,
    Hammer,
    HandCoins,
    ChartLineUp,
    Stack,
    Toolbox,
    PencilLine,
    FilmStrip,
    ImageSquare,
    Waveform,
    Palette,
    UserCircle,
    CodeBlock,
    CurrencyDollar,
    Monitor,
    ArrowLeft,
    List,
} from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

export interface ResourceList {
    title: string;
    items: any[];
    href: string;
    icon: string;
    tags: string[];
}

interface ResourcesFilterProps {
    lists: ResourceList[];
    allTags: string[];
    resourceImages?: Record<string, { favicon?: string; ogImage?: string; screenshot?: string }>;
}

// Map icon names to Phosphor components
const iconMap: Record<string, PhosphorIcon> = {
    'ph:shopping-bag': ShoppingBag,
    'ph:app-window': AppWindow,
    'ph:game-controller': GameController,
    'ph:television': Television,
    'ph:book-open': BookOpen,
    'ph:book': Book,
    'ph:scroll': Scroll,
    'ph:lightbulb': Lightbulb,
    'ph:microphone': Microphone,
    'ph:article': Article,
    'ph:music-notes': MusicNotes,
    'ph:users': Users,
    'ph:users-three': UsersThree,
    'ph:code': Code,
    'ph:student': Student,
    'ph:trophy': Trophy,
    'ph:gift': Gift,
    'ph:rocket-launch': RocketLaunch,
    'ph:bank': Bank,
    'ph:medal': Medal,
    'ph:flag-banner': FlagBanner,
    'ph:graduation-cap': GraduationCap,
    'ph:lightbulb-filament': Lightbulb,
    'ph:hammer': Hammer,
    'ph:hand-coins': HandCoins,
    'ph:chart-line-up': ChartLineUp,
    'ph:stack': Stack,
    'ph:toolbox': Toolbox,
    'ph:pencil-line': PencilLine,
    'ph:image': ImageSquare,
    'ph:waveform': Waveform,
    'ph:film-strip': FilmStrip,
    'ph:magnifying-glass': MagnifyingGlass,
    'ph:palette': Palette,
    'ph:user-circle': UserCircle,
    'ph:code-block': CodeBlock,
    'ph:currency-dollar': CurrencyDollar,
};

function getImageKey(url?: string): string | null {
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

function getCategorySlug(href: string): string {
    return href.replace('/resources/', '');
}

export default function ResourcesFilter({ lists, allTags, resourceImages = {} }: ResourcesFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

    // Read hash on mount
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const match = lists.find((l) => getCategorySlug(l.href) === hash);
            if (match) setSelectedCategory(hash);
        }
    }, [lists]);

    // Sync hash
    const selectCategory = useCallback((slug: string | null) => {
        setSelectedCategory(slug);
        setMobileSidebarOpen(false);
        if (slug) {
            history.pushState(null, '', `/resources#${slug}`);
        } else {
            history.pushState(null, '', '/resources');
        }
    }, []);

    // Listen for back/forward navigation
    useEffect(() => {
        const onPop = () => {
            const hash = window.location.hash.slice(1);
            setSelectedCategory(hash || null);
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    // Close lightbox on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Filter lists for the masonry overview
    const filteredLists = useMemo(() => {
        return lists.filter((list) => {
            const matchesSearch =
                searchQuery === '' ||
                list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.items.some((item) =>
                    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((tag) => list.tags.includes(tag));
            return matchesSearch && matchesTags;
        });
    }, [lists, searchQuery, selectedTags]);

    // Filter sidebar list (by search + selected tags)
    const sidebarLists = useMemo(() => {
        let filtered = lists;
        if (sidebarSearch) {
            const q = sidebarSearch.toLowerCase();
            filtered = filtered.filter((l) => l.title.toLowerCase().includes(q));
        }
        if (selectedTags.length > 0) {
            filtered = filtered.filter((l) => selectedTags.some((tag) => l.tags.includes(tag)));
        }
        return filtered;
    }, [lists, sidebarSearch, selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTags([]);
    };

    const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;

    const getIcon = (iconName: string, size = 20, className = 'text-content-muted') => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent size={size} className={className} /> : null;
    };

    // Get the selected list data
    const selectedList = selectedCategory
        ? lists.find((l) => getCategorySlug(l.href) === selectedCategory)
        : null;

    function getItemImages(item: any) {
        const key = getImageKey(item.url);
        const manifest = key ? resourceImages[key] : null;
        return {
            manualImage: item.image || null,
            favicon: manifest?.favicon || null,
            ogImage: manifest?.ogImage || null,
            screenshot: manifest?.screenshot || null,
        };
    }

    // ── Sidebar ──
    const sidebar = (
        <aside className={`
            ${mobileSidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden'}
            lg:block lg:z-auto shrink-0
        `}>
            {/* Overlay for mobile */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}
            <div className={`
                relative z-10 flex flex-col w-72 lg:w-48
                lg:sticky lg:top-24
                max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain
                ${mobileSidebarOpen ? 'ml-0 bg-surface-secondary border border-border rounded-lg shadow-sm' : ''}
            `}>
                {/* Sidebar header */}
                <div className="pb-3 lg:pr-4">
                    <div className="relative">
                        <MagnifyingGlass
                            size={14}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-content-muted"
                        />
                        <input
                            type="text"
                            placeholder="Filter lists..."
                            value={sidebarSearch}
                            onChange={(e) => setSidebarSearch(e.target.value)}
                            className="w-full rounded-md border border-border bg-surface-primary py-1.5 pl-8 pr-3 text-xs text-content-body placeholder:text-content-muted focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Sidebar list */}
                <nav className="flex-1 overflow-y-auto overscroll-contain lg:border-r lg:border-border lg:pr-2">
                    {/* All Resources item */}
                    <button
                        onClick={() => selectCategory(null)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs rounded-md transition-colors ${
                            !selectedCategory
                                ? 'bg-surface-tertiary text-content-headings font-semibold'
                                : 'text-content-body hover:bg-surface-tertiary'
                        }`}
                    >
                        <span className="truncate">All Resources</span>
                        <span className="ml-auto font-mono text-[10px] text-content-subtle shrink-0">
                            {lists.reduce((n, l) => n + l.items.length, 0)}
                        </span>
                    </button>

                    {sidebarLists.map((list) => {
                        const slug = getCategorySlug(list.href);
                        const isActive = selectedCategory === slug;
                        const IconComp = iconMap[list.icon];
                        return (
                            <button
                                key={list.href}
                                onClick={() => selectCategory(slug)}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs rounded-md transition-colors ${
                                    isActive
                                        ? 'bg-surface-tertiary text-content-headings font-semibold'
                                        : 'text-content-body hover:bg-surface-tertiary'
                                }`}
                            >
                                {IconComp && <IconComp size={14} className="shrink-0 opacity-60" />}
                                <span className="truncate">{list.title}</span>
                                <span className="ml-auto font-mono text-[10px] text-content-subtle shrink-0">
                                    {list.items.length}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );

    // ── Card Grid (detail view) ──
    const cardGrid = selectedList && (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => selectCategory(null)}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft size={16} />
                    <span>All resources</span>
                </button>
                <div className="flex items-center gap-3">
                    {getIcon(selectedList.icon, 24, 'text-content-muted')}
                    <h2 className="text-xl font-bold text-content-headings">{selectedList.title}</h2>
                    <span className="font-mono text-sm text-content-subtle">{selectedList.items.length} items</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {selectedList.items.map((item: any, index: number) => {
                    const images = getItemImages(item);
                    const bannerSrc = images.manualImage || images.ogImage || images.screenshot;
                    const iconSrc = images.manualImage || images.favicon;
                    const hoverScreenshot = images.screenshot || images.manualImage || images.ogImage;
                    const FallbackIcon = iconMap[selectedList.icon];

                    return (
                        <div
                            key={index}
                            className="border border-border rounded-lg bg-surface-secondary hover:shadow-md transition-all duration-300 overflow-visible"
                        >
                            {/* Banner */}
                            <div className="w-full h-32 rounded-t-lg overflow-hidden bg-surface-tertiary relative">
                                {bannerSrc ? (
                                    <img
                                        src={bannerSrc}
                                        alt={`${item.name} preview`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" />
                                )}
                            </div>

                            {/* Icon badge */}
                            <div className="flex justify-center -mt-5 relative z-10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary border-2 border-border shadow-sm">
                                    {iconSrc ? (
                                        <img
                                            src={iconSrc}
                                            alt={`${item.name} icon`}
                                            className="h-5 w-5 rounded-sm object-contain"
                                            loading="lazy"
                                        />
                                    ) : FallbackIcon ? (
                                        <FallbackIcon size={18} className="text-content-muted" />
                                    ) : null}
                                </div>
                            </div>

                            {/* Card content */}
                            <div className="px-6 pb-6 pt-3 text-center">
                                <h3 className="font-semibold text-lg text-content-headings mb-2">
                                    {item.name}
                                </h3>
                                {item.description && (
                                    <p
                                        className="text-sm text-content-muted mb-3 text-left whitespace-pre-line"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                )}

                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                                        {item.tags.map((tag: string, tagIndex: number) => (
                                            <span
                                                key={tagIndex}
                                                className="text-xs px-2 py-1 bg-surface-tertiary text-content-subtle rounded-full font-mono"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {item.url && (
                                    <div className="flex items-center justify-center gap-3">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
                                        >
                                            <span>Visit</span>
                                            <ArrowSquareOut
                                                size={16}
                                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </a>
                                        {hoverScreenshot && (
                                            <button
                                                onClick={() => setLightbox({ src: hoverScreenshot!, name: item.name })}
                                                className="screenshot-preview-btn"
                                                aria-label={`View ${item.name} screenshot`}
                                            >
                                                <Monitor size={16} className="text-content-muted hover:text-blue-600 cursor-pointer transition-colors" />
                                                <div className="screenshot-preview-tooltip">
                                                    <img
                                                        src={hoverScreenshot}
                                                        alt={`${item.name} screenshot`}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // ── Masonry overview ──
    const masonryOverview = (
        <div>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                <div className="relative">
                    <MagnifyingGlass
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
                    />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-secondary py-3 pl-12 pr-4 text-sm text-content-body placeholder:text-content-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-body"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                        const isActive = selectedTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                    !isActive ? 'bg-surface-tertiary text-content-subtle hover:bg-surface-secondary hover:text-content-body' : ''
                                }`}
                                style={isActive ? { backgroundColor: '#d1fae5', color: '#047857' } : undefined}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-content-muted">
                        <span>
                            Showing {filteredLists.length} of {lists.length} resources
                        </span>
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {filteredLists.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-content-muted">No resources found matching your criteria.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-2 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="lists-masonry">
                    {filteredLists.map((list) => (
                        <div
                            key={list.href}
                            className="list-card mb-5 rounded-lg border border-border bg-surface-secondary p-5"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                {getIcon(list.icon)}
                                <h3 className="text-base font-semibold text-content-headings">
                                    <button
                                        onClick={() => selectCategory(getCategorySlug(list.href))}
                                        className="transition-colors hover:text-blue-600 text-left"
                                    >
                                        {list.title}
                                    </button>
                                </h3>
                                <span className="ml-auto font-mono text-xs text-content-subtle">
                                    {list.items.length}
                                </span>
                            </div>

                            {list.tags.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-1">
                                    {list.tags.map((tag) => {
                                        const isActive = selectedTags.includes(tag);
                                        return (
                                            <span
                                                key={tag}
                                                className={`cursor-pointer rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors ${
                                                    !isActive ? 'bg-surface-tertiary text-content-subtle hover:bg-surface-secondary' : ''
                                                }`}
                                                style={isActive ? { backgroundColor: '#d1fae5', color: '#047857' } : undefined}
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            <ul className="space-y-1">
                                {list.items.map((item: any, index: number) => {
                                    const imageKey = getImageKey(item.url);
                                    const manifestEntry = imageKey ? resourceImages[imageKey] : null;
                                    const faviconSrc = item.image || manifestEntry?.favicon;
                                    const tooltipImage = manifestEntry?.screenshot || manifestEntry?.ogImage;
                                    const hasDetails = item.description || (item.tags && item.tags.length > 0) || tooltipImage;
                                    const FallbackIcon = iconMap[list.icon];
                                    return (
                                        <li key={index} className="group/item relative">
                                            <span className="relative inline-flex items-center gap-2 py-0.5 text-sm text-content-body">
                                                {faviconSrc ? (
                                                    <img
                                                        src={faviconSrc}
                                                        alt={`${item.name} icon`}
                                                        className="h-4 w-4 rounded object-contain shrink-0"
                                                        loading="lazy"
                                                    />
                                                ) : FallbackIcon ? (
                                                    <FallbackIcon size={14} className="shrink-0 text-content-subtle" />
                                                ) : null}
                                                {item.url ? (
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 transition-colors hover:text-blue-600"
                                                    >
                                                        {item.name}
                                                        <ArrowSquareOut
                                                            size={12}
                                                            className="opacity-0 transition-opacity group-hover/item:opacity-100"
                                                        />
                                                    </a>
                                                ) : (
                                                    <span>{item.name}</span>
                                                )}
                                                {hasDetails && (
                                                    <div className="item-tooltip">
                                                        {tooltipImage && (
                                                            <img
                                                                src={tooltipImage}
                                                                alt={`${item.name} preview`}
                                                                className="tooltip-preview-img"
                                                                loading="lazy"
                                                            />
                                                        )}
                                                        {item.description && (
                                                            <div className="text-xs text-content-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.description }} />
                                                        )}
                                                        {item.tags && item.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                                {item.tags.map((tag: string, tagIndex: number) => (
                                                                    <span key={tagIndex} className="text-[10px] px-1.5 py-0.5 bg-surface-tertiary text-content-subtle rounded-full font-mono">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div>
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-content-body hover:bg-surface-tertiary transition-colors"
                >
                    <List size={18} />
                    <span>Browse lists</span>
                    {selectedCategory && selectedList && (
                        <span className="text-content-muted">· {selectedList.title}</span>
                    )}
                </button>
            </div>

            <div className="flex gap-6">
                {sidebar}

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {selectedCategory && selectedList ? cardGrid : masonryOverview}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 cursor-pointer"
                    onClick={() => setLightbox(null)}
                >
                    <div
                        className="relative max-w-[900px] w-full cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-white text-sm font-semibold mb-2">{lightbox.name}</div>
                        <img
                            src={lightbox.src}
                            alt={`${lightbox.name} screenshot`}
                            className="w-full h-auto rounded-lg shadow-2xl"
                        />
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg hover:bg-gray-100 text-lg"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .lists-masonry {
                    columns: 1;
                    column-gap: 1.25rem;
                }

                @media (min-width: 768px) {
                    .lists-masonry {
                        columns: 2;
                    }
                }

                @media (min-width: 1024px) {
                    .lists-masonry {
                        columns: 2;
                    }
                }

                @media (min-width: 1280px) {
                    .lists-masonry {
                        columns: 3;
                    }
                }

                .list-card {
                    break-inside: avoid;
                }

                .group\\/item {
                    position: relative;
                }

                .item-tooltip {
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%) translateX(4px);
                    z-index: 50;
                    width: max-content;
                    max-width: 280px;
                    background: var(--color-bg-overlay, #fff);
                    border: 1px solid var(--color-border-default, #e5e5e5);
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.15s ease, transform 0.15s ease;
                    margin-left: 0.25rem;
                    overflow: hidden;
                }

                .item-tooltip:has(.tooltip-preview-img) {
                    width: 260px;
                    padding: 0;
                }

                .item-tooltip:not(:has(.tooltip-preview-img)) {
                    padding: 0.5rem 0.75rem;
                }

                .tooltip-preview-img {
                    display: block;
                    width: 100%;
                    max-height: 180px;
                    object-fit: cover;
                    border-bottom: 1px solid var(--color-border-default, #e5e5e5);
                }

                .item-tooltip:has(.tooltip-preview-img) > :not(.tooltip-preview-img) {
                    padding-left: 0.75rem;
                    padding-right: 0.75rem;
                }

                .item-tooltip:has(.tooltip-preview-img) > :nth-child(2) {
                    padding-top: 0.5rem;
                }

                .item-tooltip:has(.tooltip-preview-img) > :last-child {
                    padding-bottom: 0.5rem;
                }

                .group\\/item:hover .item-tooltip {
                    opacity: 1;
                    transform: translateY(-50%) translateX(0);
                    pointer-events: auto;
                }

                .screenshot-preview-btn {
                    background: none;
                    border: none;
                    padding: 2px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    position: relative;
                }

                .screenshot-preview-tooltip {
                    display: none;
                    position: absolute;
                    bottom: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 50;
                    width: 280px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
                    border: 1px solid var(--color-border, #e0e0e0);
                    background: white;
                    pointer-events: none;
                }

                .screenshot-preview-tooltip img {
                    display: block;
                    width: 100%;
                    height: auto;
                }

                .screenshot-preview-btn:hover .screenshot-preview-tooltip {
                    display: block;
                }
            `}</style>
        </div>
    );
}
