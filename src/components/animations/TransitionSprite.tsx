import { useEffect, useMemo, useState } from 'react';
import { SPRITES } from '../../data/sprites';
import SpriteCharacter from './SpriteCharacter';

const SPRITE_KEYS = Object.keys(SPRITES);

export default function TransitionSprite() {
    const [spriteConfig, setSpriteConfig] = useState(() => {
        const key = SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)];
        return SPRITES[key];
    });

    // Pick a new random sprite each time the overlay becomes active
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target as HTMLElement;
                    if (target.classList.contains('active')) {
                        const key = SPRITE_KEYS[Math.floor(Math.random() * SPRITE_KEYS.length)];
                        setSpriteConfig(SPRITES[key]);
                    }
                }
            }
        });

        const overlay = document.querySelector('.page-loading-overlay');
        if (overlay) {
            observer.observe(overlay, { attributes: true });
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="mb-4">
            <SpriteCharacter config={spriteConfig} scale={0.5} interval={800} />
        </div>
    );
}
