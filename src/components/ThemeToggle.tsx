import { useState, useEffect } from 'react';
import { Sun, Moon, Desktop } from '@phosphor-icons/react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
            setTheme(stored);
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        const isDark =
            newTheme === 'dark' ||
            (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    useEffect(() => {
        if (mounted) {
            applyTheme(theme);
        }
    }, [theme, mounted]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const cycleTheme = () => {
        const themes: Theme[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];

        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-secondary"
                aria-label="Toggle theme"
            >
                <Sun size={18} weight="bold" className="text-content-muted" />
            </button>
        );
    }

    const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Desktop;
    const label =
        theme === 'light'
            ? 'Light mode (click for dark)'
            : theme === 'dark'
              ? 'Dark mode (click for system)'
              : 'System theme (click for light)';

    return (
        <button
            onClick={cycleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-secondary"
            aria-label={label}
            title={label}
        >
            <Icon size={18} weight="bold" className="text-content-muted hover:text-content-body" />
        </button>
    );
}
