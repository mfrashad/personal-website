import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { capture } from '../../lib/analytics';
import badge from '../../assets/shape-sticker-lilac.svg';
import type { Author } from './BookSection.astro';
import './book-item.css';
import stickerIcon from '../../icons/sticker-garden.svg';
import { Star, StarHalf } from '@phosphor-icons/react';
import BookModal from './BookModal';

interface BookItemProps {
    cover: string;
    title?: string;
    authors?: Author[];
    rating?: number;
    currentlyReading?: boolean;
    link?: string;
    hasGardenEntry?: boolean;
    description?: string;
    tags?: string[];
    review?: {
        id: string;
        rating: number;
        spoiler: boolean;
        text: string;
        createdAt: string;
        updatedAt: string;
        tags: any[];
    } | null;
}

const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max).trimEnd() + '…' : text;

const BookItem: React.FC<BookItemProps> = ({
    cover,
    title,
    authors,
    currentlyReading,
    link,
    rating,
    hasGardenEntry,
    description,
    tags,
    review
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        if (!description || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipPos({
            top: rect.top + window.scrollY - 12,
            left: rect.left + window.scrollX + rect.width / 2
        });
    };

    const hideTooltip = () => setTooltipPos(null);

    // Hide tooltip on scroll to avoid it drifting
    useEffect(() => {
        if (!tooltipPos) return;
        const onScroll = () => setTooltipPos(null);
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll, true);
    }, [tooltipPos]);

    const gardenHref = hasGardenEntry
        ? `/garden/books/${title?.trimEnd()}%20%E2%80%93%20${authors?.[0]?.name?.trimEnd()}.md`
        : null;

    const openModal = () => {
        capture('book_clicked', {
            title,
            author: authors?.[0]?.name,
            rating,
            currently_reading: currentlyReading
        });
        setIsModalOpen(true);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    };

    return (
        <div className="h-full w-full">
            <div
                ref={containerRef}
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${title}`}
                onClick={openModal}
                onKeyDown={onKeyDown}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                className="book-item group relative flex w-full cursor-pointer flex-col items-center gap-5 rounded-lg bg-neutral-100 px-4 py-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
                {currentlyReading && (
                    <span
                        style={{ backgroundImage: `url(${badge.src})` }}
                        className="absolute -right-4 -top-4 flex h-20 w-20 rotate-12 items-center justify-center rounded-full bg-cover bg-no-repeat text-center text-2xs leading-4 text-lilac-dark transition-all duration-300 group-hover:rotate-[18deg] group-hover:scale-105"
                    >
                        currently reading
                    </span>
                )}
                {hasGardenEntry && gardenHref && (
                    <a
                        href={gardenHref}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="View garden entry"
                        className="absolute right-4 top-4 z-10"
                    >
                        <img src={stickerIcon.src} alt="Garden Sticker" className="h-10 w-10" />
                    </a>
                )}
                <div className="book self-center">
                    <div className="book-cover">
                        <img src={cover} alt={title || 'Book cover'} loading="lazy" className="book-cover-img" />
                        <div className="effect"></div>
                        <div className="light"></div>
                    </div>
                    <div className="book-inside"></div>
                </div>
            </div>
            <div className="mt-2 text-xs">
                <p className="font-bold text-black-700">{title}</p>
                <p className="text-black-400">{authors?.map((author) => author.name).join(', ')}</p>
                {rating && (
                    <p className="mt-1 flex">
                        {[...Array(Math.floor(rating))].map((_, index) => (
                            <Star key={index} size={16} weight="fill" className="fill-black-600" />
                        ))}
                        {rating % 1 !== 0 && (
                            <StarHalf size={16} weight="fill" className="fill-black-600" />
                        )}
                        {[...Array(5 - Math.floor(rating) - (rating % 1 !== 0 ? 1 : 0))].map(
                            (_, index) => (
                                <Star
                                    key={index + Math.floor(rating) + 1}
                                    size={16}
                                    weight="regular"
                                    className="fill-black-600"
                                />
                            )
                        )}
                    </p>
                )}
            </div>

            {tooltipPos && description && typeof document !== 'undefined' &&
                createPortal(
                    <div
                        className="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-full rounded-lg bg-neutral-800 px-3 py-2 text-xs leading-relaxed text-white shadow-lg"
                        style={{
                            top: tooltipPos.top - window.scrollY,
                            left: tooltipPos.left - window.scrollX,
                            maxWidth: '240px'
                        }}
                        role="tooltip"
                    >
                        {truncate(description, 180)}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                    </div>,
                    document.body
                )}

            <BookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title || ''}
                authors={authors}
                cover={cover}
                rating={rating}
                description={description}
                tags={tags}
                review={review}
                hardcoverUrl={link}
            />
        </div>
    );
};

export default BookItem;
