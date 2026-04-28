import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, StarHalf, X } from '@phosphor-icons/react';
import type { Author } from './BookSection.astro';

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    authors?: Author[];
    cover: string;
    rating?: number;
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
    hardcoverUrl?: string;
}

const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <span className="flex items-center">
            {[...Array(full)].map((_, i) => (
                <Star key={`f${i}`} size={16} weight="fill" className="fill-black-600" />
            ))}
            {half && <StarHalf size={16} weight="fill" className="fill-black-600" />}
            {[...Array(empty)].map((_, i) => (
                <Star key={`e${i}`} size={16} weight="regular" className="fill-black-600" />
            ))}
        </span>
    );
};

const BookModal: React.FC<BookModalProps> = ({
    isOpen,
    onClose,
    title,
    authors,
    cover,
    rating,
    description,
    tags,
    review,
    hardcoverUrl
}) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    const hasReview = review && review.text && review.text.trim().length > 0;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${title}`}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
                >
                    <X size={18} weight="bold" />
                </button>

                <div className="flex flex-col gap-6 sm:flex-row">
                    <img
                        src={cover}
                        alt={title}
                        className="h-auto w-32 flex-shrink-0 self-center rounded-md object-cover shadow-md sm:self-start"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="pr-8 text-xl font-bold text-black-700">{title}</h2>
                        {authors && authors.length > 0 && (
                            <p className="mt-1 text-sm text-black-400">
                                {authors.map((a) => a.name).join(', ')}
                            </p>
                        )}
                        {rating != null && rating > 0 && (
                            <div className="mt-2">{renderStars(rating)}</div>
                        )}
                        {tags && tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {description && (
                    <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                            Summary
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-black-600">
                            {description}
                        </p>
                    </div>
                )}

                {hasReview && (
                    <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                            My Review
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-black-700">
                            {review!.text}
                        </p>
                    </div>
                )}

                {hardcoverUrl && (
                    <div className="mt-6 border-t border-neutral-100 pt-4">
                        <a
                            href={hardcoverUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue hover:text-blue-dark underline decoration-dotted underline-offset-2"
                        >
                            View on Hardcover →
                        </a>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default BookModal;
