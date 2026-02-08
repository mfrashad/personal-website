import { useState, useMemo } from 'react';
import { MagnifyingGlass, X, ArrowSquareOut } from '@phosphor-icons/react';

export type Bookmark = {
    link: string;
    title: string;
    cover: string;
    tags: string[];
    type: string;
    created: string;
};

interface BookmarksFilterProps {
    bookmarks: Bookmark[];
    allTags: { name: string; count: number }[];
}

export default function BookmarksFilter({ bookmarks, allTags }: BookmarksFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredBookmarks = useMemo(() => {
        return bookmarks.filter((bookmark) => {
            // Filter by search query
            const matchesSearch =
                searchQuery === '' ||
                bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (bookmark.tags || []).some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                );

            // Filter by tags
            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((tag) => (bookmark.tags || []).includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [bookmarks, searchQuery, selectedTags]);

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return '';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'article':
                return 'bg-green-500';
            case 'video':
                return 'bg-blue-500';
            case 'link':
                return 'bg-purple-400';
            default:
                return 'bg-red-500';
        }
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
                        placeholder="Search bookmarks..."
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
                        const isActive = selectedTags.includes(tag.name);
                        return (
                            <button
                                key={tag.name}
                                onClick={() => toggleTag(tag.name)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                    !isActive ? 'bg-surface-tertiary text-content-subtle hover:bg-surface-secondary hover:text-content-body' : ''
                                }`}
                                style={isActive ? { backgroundColor: '#d1fae5', color: '#047857' } : undefined}
                            >
                                #{tag.name} ({tag.count})
                            </button>
                        );
                    })}
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-content-muted">
                        <span>
                            Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
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
            {filteredBookmarks.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-content-muted">No bookmarks found matching your criteria.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-2 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <ul className="mb-40">
                    {filteredBookmarks.map((bookmark, index) => (
                        <li key={index} className="group">
                            {/* Desktop Version */}
                            <a
                                href={bookmark.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center justify-between gap-4 py-2 hover:bg-surface-secondary/50 rounded transition-colors"
                            >
                                <div className="flex max-w-[80%] shrink-0 items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${getTypeColor(bookmark.type)}`} />
                                    <p className="mr-2 truncate font-mono text-sm">{bookmark.title}</p>
                                    {bookmark.tags && bookmark.tags.length > 0 && (
                                        <div className="flex gap-1">
                                            {bookmark.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="hidden h-[1px] w-full grow bg-neutral-200 md:block" />
                                <p className="shrink-0 text-right font-mono text-xs text-neutral-500 group-hover:hidden">
                                    {formatDate(bookmark.created)}
                                </p>
                                <div className="hidden shrink-0 items-center gap-2 group-hover:flex">
                                    <p className="text-sm">{getDomain(bookmark.link)}</p>
                                    <ArrowSquareOut size={16} />
                                </div>
                            </a>

                            {/* Mobile Version */}
                            <a
                                href={bookmark.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="md:hidden mt-5 flex flex-col gap-2 border-b border-neutral-200 pb-5"
                            >
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex shrink items-center gap-2 overflow-x-auto">
                                        <div className={`h-2 w-2 shrink-0 rounded-full ${getTypeColor(bookmark.type)}`} />
                                        <p className="mr-2 truncate font-mono text-xs md:text-sm">{bookmark.title}</p>
                                    </div>
                                    <p className="shrink-0 text-right font-mono text-xs text-neutral-500">
                                        {formatDate(bookmark.created)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    {bookmark.tags && bookmark.tags.length > 0 && (
                                        <div className="flex gap-1">
                                            {bookmark.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex shrink-0 items-center gap-2 text-neutral-400">
                                        <p className="text-[10px]">{getDomain(bookmark.link)}</p>
                                        <ArrowSquareOut size={12} />
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
