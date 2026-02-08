import { useState, useMemo } from 'react';
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
};

export default function ResourcesFilter({ lists, allTags }: ResourcesFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredLists = useMemo(() => {
        return lists.filter((list) => {
            // Filter by search query
            const matchesSearch =
                searchQuery === '' ||
                list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.items.some((item) =>
                    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Filter by tags
            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((tag) => list.tags.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [lists, searchQuery, selectedTags]);

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

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent size={20} className="text-content-muted" /> : null;
    };

    return (
        <div>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                {/* Search Bar */}
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

                {/* Tag Filters */}
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

                {/* Active Filters Summary */}
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

            {/* Results */}
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
                                    <a
                                        href={list.href}
                                        className="transition-colors hover:text-blue-600"
                                    >
                                        {list.title}
                                    </a>
                                </h3>
                                <span className="ml-auto font-mono text-xs text-content-subtle">
                                    {list.items.length}
                                </span>
                            </div>

                            {/* List Tags */}
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
                                    const hasDetails = item.description || (item.tags && item.tags.length > 0);
                                    return (
                                        <li key={index} className="group/item relative">
                                            <span className="relative inline-flex items-center gap-2 py-0.5 text-sm text-content-body">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={`${item.name} logo`}
                                                        className="h-5 w-5 rounded object-contain"
                                                        loading="lazy"
                                                    />
                                                )}
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
                                                        {item.description && (
                                                            <div className="text-xs text-content-muted">{item.description}</div>
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
                    padding: 0.5rem 0.75rem;
                    background: var(--color-bg-overlay, #fff);
                    border: 1px solid var(--color-border-default, #e5e5e5);
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.15s ease, transform 0.15s ease;
                    margin-left: 0.25rem;
                }

                .group\\/item:hover .item-tooltip {
                    opacity: 1;
                    transform: translateY(-50%) translateX(0);
                    pointer-events: auto;
                }
            `}</style>
        </div>
    );
}
