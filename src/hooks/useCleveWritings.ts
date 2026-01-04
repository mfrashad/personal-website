import { useState, useEffect, useCallback } from 'react';

export interface CleveWriting {
    id: string;
    title: string;
    category: string;
    created_at: string;
    updated_at: string;
    content_markdown: string;
}

interface UseCleveWritingsOptions {
    initialWritings: CleveWriting[];
    revalidateOnMount?: boolean;
    revalidateInterval?: number; // in ms, 0 = disabled
}

interface UseCleveWritingsResult {
    writings: CleveWriting[];
    newWritings: CleveWriting[];
    updatedWritings: CleveWriting[];
    isRevalidating: boolean;
    lastFetched: Date | null;
    error: string | null;
    revalidate: () => Promise<void>;
}

export function useCleveWritings({
    initialWritings,
    revalidateOnMount = true,
    revalidateInterval = 0
}: UseCleveWritingsOptions): UseCleveWritingsResult {
    const [writings, setWritings] = useState<CleveWriting[]>(initialWritings);
    const [newWritings, setNewWritings] = useState<CleveWriting[]>([]);
    const [updatedWritings, setUpdatedWritings] = useState<CleveWriting[]>([]);
    const [isRevalidating, setIsRevalidating] = useState(false);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const revalidate = useCallback(async () => {
        setIsRevalidating(true);
        setError(null);

        try {
            const response = await fetch('/api/writings');
            const data = await response.json();

            if (data.error && data.writings.length === 0) {
                setError(data.error);
                return;
            }

            const freshWritings: CleveWriting[] = data.writings;
            setLastFetched(new Date(data.fetched_at));

            // Find new writings (not in current list)
            const currentIds = new Set(writings.map(w => w.id));
            const freshNew = freshWritings.filter(w => !currentIds.has(w.id));

            // Find updated writings (same id, different updated_at)
            const freshUpdated = freshWritings.filter(fresh => {
                const existing = writings.find(w => w.id === fresh.id);
                return existing && existing.updated_at !== fresh.updated_at;
            });

            if (freshNew.length > 0 || freshUpdated.length > 0) {
                setNewWritings(freshNew);
                setUpdatedWritings(freshUpdated);
                setWritings(freshWritings);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch');
        } finally {
            setIsRevalidating(false);
        }
    }, [writings]);

    // Revalidate on mount
    useEffect(() => {
        if (revalidateOnMount) {
            // Small delay to not block initial render
            const timer = setTimeout(revalidate, 100);
            return () => clearTimeout(timer);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Periodic revalidation
    useEffect(() => {
        if (revalidateInterval > 0) {
            const interval = setInterval(revalidate, revalidateInterval);
            return () => clearInterval(interval);
        }
    }, [revalidateInterval, revalidate]);

    return {
        writings,
        newWritings,
        updatedWritings,
        isRevalidating,
        lastFetched,
        error,
        revalidate
    };
}

// Helper to slugify titles
export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Helper to format dates
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
    });
}
