import { useEffect, useState } from 'react';
import EasterEggs from './EasterEggs';

interface AnimationProviderProps {
    enableEasterEggs?: boolean;
}

export default function AnimationProvider({
    enableEasterEggs = true
}: AnimationProviderProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            {/* Easter eggs (Konami code, secret word, shake) */}
            {enableEasterEggs && <EasterEggs />}
        </>
    );
}
