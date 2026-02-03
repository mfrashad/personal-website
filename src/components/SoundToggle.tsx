import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { soundManager } from '@utils/soundManager';

export default function SoundToggle() {
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        setIsEnabled(soundManager.isEnabled());
    }, []);

    const toggleSound = () => {
        const newState = soundManager.toggle();
        setIsEnabled(newState);
    };

    return (
        <motion.button
            onClick={toggleSound}
            className="fixed bottom-6 right-6 z-50 bg-surface-tertiary text-content-body p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
        >
            {isEnabled ? (
                <SpeakerHigh size={24} weight="fill" />
            ) : (
                <SpeakerSlash size={24} weight="fill" />
            )}
        </motion.button>
    );
}
