import { useEffect, useCallback } from 'react';

interface ImageLightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export default function ImageLightbox({ images, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
        if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    }, [currentIndex, images.length, onClose, onNavigate]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10 w-10 h-10 flex items-center justify-center"
                aria-label="Close"
            >
                &times;
            </button>

            {/* Left arrow */}
            {currentIndex > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center"
                    aria-label="Previous image"
                >
                    &#8249;
                </button>
            )}

            {/* Image */}
            <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1} of ${images.length}`}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />

            {/* Right arrow */}
            {currentIndex < images.length - 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center"
                    aria-label="Next image"
                >
                    &#8250;
                </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
