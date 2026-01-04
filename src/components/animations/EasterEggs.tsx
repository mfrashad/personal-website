import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundManager } from '@utils/soundManager';

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

// Secret word trigger
const SECRET_WORD = 'rashad';

export default function EasterEggs() {
    const [konamiIndex, setKonamiIndex] = useState(0);
    const [secretWordIndex, setSecretWordIndex] = useState(0);
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [easterEggType, setEasterEggType] = useState<'konami' | 'secret' | 'shake' | null>(null);
    const [clickCount, setClickCount] = useState(0);
    const [partyMode, setPartyMode] = useState(false);

    // Konami code detection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === KONAMI_CODE[konamiIndex]) {
                setKonamiIndex(prev => prev + 1);

                if (konamiIndex + 1 === KONAMI_CODE.length) {
                    triggerEasterEgg('konami');
                    setKonamiIndex(0);
                }
            } else {
                setKonamiIndex(0);
            }

            // Secret word detection
            const key = e.key.toLowerCase();
            if (key === SECRET_WORD[secretWordIndex]) {
                setSecretWordIndex(prev => prev + 1);

                if (secretWordIndex + 1 === SECRET_WORD.length) {
                    triggerEasterEgg('secret');
                    setSecretWordIndex(0);
                }
            } else if (key === SECRET_WORD[0]) {
                setSecretWordIndex(1);
            } else {
                setSecretWordIndex(0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [konamiIndex, secretWordIndex]);

    // Device shake detection (for mobile)
    useEffect(() => {
        let shakeThreshold = 15;
        let lastX: number, lastY: number, lastZ: number;
        let lastTime = 0;

        const handleMotion = (e: DeviceMotionEvent) => {
            const acceleration = e.accelerationIncludingGravity;
            if (!acceleration) return;

            const currentTime = Date.now();
            if (currentTime - lastTime > 100) {
                const diffTime = currentTime - lastTime;
                lastTime = currentTime;

                const x = acceleration.x || 0;
                const y = acceleration.y || 0;
                const z = acceleration.z || 0;

                const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

                if (speed > shakeThreshold) {
                    triggerEasterEgg('shake');
                }

                lastX = x;
                lastY = y;
                lastZ = z;
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, []);

    // Triple click on logo triggers party mode
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-logo]')) {
                setClickCount(prev => prev + 1);

                setTimeout(() => setClickCount(0), 500);

                if (clickCount >= 2) {
                    togglePartyMode();
                    setClickCount(0);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [clickCount]);

    const triggerEasterEgg = useCallback((type: 'konami' | 'secret' | 'shake') => {
        setEasterEggType(type);
        setShowEasterEgg(true);
        soundManager.play('success');

        // Epic confetti burst
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
            });
            confetti({
                particleCount: 7,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        setTimeout(() => setShowEasterEgg(false), 5000);
    }, []);

    const togglePartyMode = useCallback(() => {
        setPartyMode(prev => !prev);
        soundManager.play('success');

        if (!partyMode) {
            // Start party mode
            document.body.classList.add('party-mode');
        } else {
            document.body.classList.remove('party-mode');
        }
    }, [partyMode]);

    const easterEggMessages = {
        konami: {
            title: '🎮 KONAMI CODE ACTIVATED! 🎮',
            message: 'You found the secret! You\'re a true gamer!'
        },
        secret: {
            title: '🔮 SECRET DISCOVERED! 🔮',
            message: 'You typed the magic word! You\'re awesome!'
        },
        shake: {
            title: '📱 SHAKE IT! 📱',
            message: 'You shook your device! Party time!'
        }
    };

    return (
        <>
            {/* Easter Egg Modal */}
            <AnimatePresence>
                {showEasterEgg && easterEggType && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-[10000] bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEasterEgg(false)}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 rounded-3xl text-white text-center max-w-md mx-4 shadow-2xl"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', damping: 15 }}
                        >
                            <motion.h2
                                className="text-3xl font-bold mb-4"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                {easterEggMessages[easterEggType].title}
                            </motion.h2>
                            <p className="text-xl mb-6">
                                {easterEggMessages[easterEggType].message}
                            </p>
                            <motion.div
                                className="text-6xl"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                🎉🎊🥳
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Party Mode Indicator */}
            {partyMode && (
                <motion.div
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                >
                    🎉 PARTY MODE 🎉
                </motion.div>
            )}

            {/* Party Mode Styles */}
            <style>{`
                .party-mode {
                    animation: party-colors 1s infinite;
                }

                @keyframes party-colors {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }

                .party-mode * {
                    animation: party-shake 0.1s infinite;
                }

                @keyframes party-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
            `}</style>
        </>
    );
}
