import { useState } from 'react';
import ImageLightbox from './ImageLightbox';

interface DetailGalleryProps {
    images: string[];
    title: string;
}

export default function DetailGallery({ images, title }: DetailGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, i) => (
                    <button
                        key={i}
                        className="overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setLightboxIndex(i)}
                    >
                        <img
                            src={image}
                            alt={`${title} photo ${i + 1}`}
                            className="w-full h-auto object-cover aspect-[4/3]"
                            loading={i < 6 ? "eager" : "lazy"}
                        />
                    </button>
                ))}
            </div>

            {lightboxIndex !== null && (
                <ImageLightbox
                    images={images}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNavigate={(index) => setLightboxIndex(index)}
                />
            )}
        </>
    );
}
