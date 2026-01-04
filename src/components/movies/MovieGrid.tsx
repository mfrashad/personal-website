import { useState, useMemo } from 'react';
import { Star, StarHalf, Heart, ThumbsUp, FilmStrip } from '@phosphor-icons/react';

interface Film {
    title: string;
    watched_on: string;
    rating: number;
    liked: boolean;
    rewatched: boolean;
    permalink: string;
    posterUrl?: string;
}

interface Props {
    films: Film[];
}

type SortOption = 'rating-desc' | 'rating-asc' | 'date-desc' | 'date-asc' | 'title-asc';

export default function MovieGrid({ films }: Props) {
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');

    const sortedFilms = useMemo(() => {
        const filmsCopy = [...films];

        switch (sortBy) {
            case 'rating-desc':
                return filmsCopy.sort((a, b) => b.rating - a.rating);
            case 'rating-asc':
                return filmsCopy.sort((a, b) => a.rating - b.rating);
            case 'date-desc':
                return filmsCopy.sort((a, b) => {
                    if (!a.watched_on && !b.watched_on) return 0;
                    if (!a.watched_on) return 1;
                    if (!b.watched_on) return -1;
                    return new Date(b.watched_on).getTime() - new Date(a.watched_on).getTime();
                });
            case 'date-asc':
                return filmsCopy.sort((a, b) => {
                    if (!a.watched_on && !b.watched_on) return 0;
                    if (!a.watched_on) return 1;
                    if (!b.watched_on) return -1;
                    return new Date(a.watched_on).getTime() - new Date(b.watched_on).getTime();
                });
            case 'title-asc':
                return filmsCopy.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return filmsCopy;
        }
    }, [films, sortBy]);

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === '') return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: fullStars }, (_, i) => (
                    <Star key={`full-${i}`} weight="fill" size={14} style={{ color: '#fbbf24' }} />
                ))}
                {hasHalfStar && <StarHalf weight="fill" size={14} style={{ color: '#fbbf24' }} />}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <Star key={`empty-${i}`} weight="fill" className="text-neutral-400" size={14} />
                ))}
            </div>
        );
    };

    return (
        <div>
            {/* Sort Controls */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
                <label className="text-sm font-medium text-neutral-700">Sort by:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                    <option value="rating-desc">Rating (High to Low)</option>
                    <option value="rating-asc">Rating (Low to High)</option>
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="title-asc">Title (A-Z)</option>
                </select>
                <span className="text-sm text-neutral-500">{sortedFilms.length} films</span>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                {sortedFilms.map((film) => (
                    <a
                        key={film.permalink}
                        href={`https://letterboxd.com/${film.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-200 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        {/* Poster Image */}
                        {film.posterUrl ? (
                            <img
                                src={film.posterUrl}
                                alt={film.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-neutral-300">
                                <FilmStrip size={48} className="text-neutral-400" />
                            </div>
                        )}

                        {/* Rating Badge - Bottom Right (hidden on hover) */}
                        {film.rating === 5 && (
                            <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 shadow-lg transition-opacity duration-300 group-hover:opacity-0">
                                <Heart weight="fill" size={18} className="text-white" />
                            </div>
                        )}
                        {film.rating >= 4 && film.rating < 5 && (
                            <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-opacity duration-300 group-hover:opacity-0">
                                <ThumbsUp weight="fill" size={18} className="text-white" />
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <h3 className="mb-2 text-xs font-bold leading-tight text-white line-clamp-2">
                                {film.title}
                            </h3>

                            {film.rating > 0 && (
                                <div className="mb-1 flex items-center gap-2">
                                    {renderStars(film.rating)}
                                    <span className="text-xs font-medium text-white">
                                        {film.rating.toFixed(1)}
                                    </span>
                                </div>
                            )}

                            {formatDate(film.watched_on) && (
                                <p className="text-xs text-neutral-300">
                                    {formatDate(film.watched_on)}
                                </p>
                            )}

                            <div className="mt-2 flex items-center gap-2">
                                {film.rewatched && (
                                    <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs text-white">
                                        Rewatch
                                    </span>
                                )}
                                {film.liked && (
                                    <Heart weight="fill" size={14} className="text-red-400" />
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
