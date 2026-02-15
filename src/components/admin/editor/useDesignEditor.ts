import { useState, useCallback } from 'react';
import type { SlideLayout, DesignElement, TextElement, ItemSlideOverrides } from '../../../../remotion/lib/design-types';
import type { VideoLayoutOverrides } from '../../../../remotion/lib/types';
import { getDefaultHookSlideLayout, getDefaultItemSlideOverrides, getDefaultMockupSlideLayout } from '../../../../remotion/lib/default-layouts';
import { fonts } from '../../../../remotion/lib/theme';

let _nextCustomId = 1;
function nextCustomId() {
    return `custom-${_nextCustomId++}`;
}

export function useDesignEditor() {
    const [hookLayout, setHookLayout] = useState<SlideLayout>(getDefaultHookSlideLayout);
    const [mockupLayout, setMockupLayout] = useState<SlideLayout>(getDefaultMockupSlideLayout);
    const [itemOverrides, setItemOverrides] = useState<ItemSlideOverrides>(getDefaultItemSlideOverrides);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [editingSlideType, setEditingSlideType] = useState<'hook' | 'item' | 'mockup'>('hook');

    const selectedElement = editingSlideType === 'hook'
        ? hookLayout.elements.find((el) => el.id === selectedElementId) ?? null
        : editingSlideType === 'mockup'
        ? mockupLayout.elements.find((el) => el.id === selectedElementId) ?? null
        : itemOverrides.customElements?.find((el) => el.id === selectedElementId) ?? null;

    const updateElement = useCallback(
        (id: string, updates: Record<string, any>) => {
            // Route to correct layout based on element id prefix or current editing type
            const isHookElement = id.startsWith('hook-');
            const isMockupElement = id.startsWith('mockup-');
            if (isMockupElement || editingSlideType === 'mockup') {
                setMockupLayout((prev) => ({
                    ...prev,
                    elements: prev.elements.map((el) =>
                        el.id === id ? ({ ...el, ...updates } as DesignElement) : el,
                    ),
                }));
            } else if (isHookElement || editingSlideType === 'hook') {
                setHookLayout((prev) => ({
                    ...prev,
                    elements: prev.elements.map((el) =>
                        el.id === id ? ({ ...el, ...updates } as DesignElement) : el,
                    ),
                }));
            } else {
                setItemOverrides((prev) => ({
                    ...prev,
                    customElements: (prev.customElements || []).map((el) =>
                        el.id === id ? ({ ...el, ...updates } as DesignElement) : el,
                    ),
                }));
            }
        },
        [editingSlideType],
    );

    const addTextElement = useCallback(() => {
        const newEl: TextElement = {
            id: nextCustomId(),
            type: 'text',
            content: 'New Text',
            x: 100,
            y: 400,
            width: 400,
            height: 60,
            fontSize: 36,
            fontWeight: 600,
            fontFamily: fonts.heading,
            color: '#FFFFFF',
            lineHeight: 1.2,
            letterSpacing: '0',
            textAlign: 'left',
            visible: true,
            locked: false,
        };

        if (editingSlideType === 'hook') {
            setHookLayout((prev) => ({
                ...prev,
                elements: [...prev.elements, newEl],
            }));
        } else if (editingSlideType === 'mockup') {
            setMockupLayout((prev) => ({
                ...prev,
                elements: [...prev.elements, newEl],
            }));
        } else {
            setItemOverrides((prev) => ({
                ...prev,
                customElements: [...(prev.customElements || []), newEl],
            }));
        }
        setSelectedElementId(newEl.id);
    }, [editingSlideType]);

    const deleteElement = useCallback(
        (id: string) => {
            if (editingSlideType === 'hook') {
                setHookLayout((prev) => ({
                    ...prev,
                    elements: prev.elements.filter((el) => el.id !== id),
                }));
            } else if (editingSlideType === 'mockup') {
                setMockupLayout((prev) => ({
                    ...prev,
                    elements: prev.elements.filter((el) => el.id !== id),
                }));
            } else {
                setItemOverrides((prev) => ({
                    ...prev,
                    customElements: (prev.customElements || []).filter((el) => el.id !== id),
                }));
            }
            if (selectedElementId === id) setSelectedElementId(null);
        },
        [editingSlideType, selectedElementId],
    );

    const resetHookLayout = useCallback(() => {
        setHookLayout(getDefaultHookSlideLayout());
        setSelectedElementId(null);
    }, []);

    const resetMockupLayout = useCallback(() => {
        setMockupLayout(getDefaultMockupSlideLayout());
        setSelectedElementId(null);
    }, []);

    const resetItemOverrides = useCallback(() => {
        setItemOverrides(getDefaultItemSlideOverrides());
        setSelectedElementId(null);
    }, []);

    const updateItemOverride = useCallback(
        <K extends keyof ItemSlideOverrides>(key: K, value: ItemSlideOverrides[K]) => {
            setItemOverrides((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    // Video layout overrides
    const [videoOverrides, setVideoOverrides] = useState<VideoLayoutOverrides>({});

    const updateVideoOverride = useCallback(
        <K extends keyof VideoLayoutOverrides>(key: K, value: VideoLayoutOverrides[K]) => {
            setVideoOverrides((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const resetVideoOverrides = useCallback(() => {
        setVideoOverrides({});
    }, []);

    return {
        hookLayout,
        mockupLayout,
        itemOverrides,
        videoOverrides,
        selectedElementId,
        selectedElement,
        editingSlideType,
        setEditingSlideType,
        setSelectedElementId,
        updateElement,
        addTextElement,
        deleteElement,
        resetHookLayout,
        resetMockupLayout,
        resetItemOverrides,
        updateItemOverride,
        updateVideoOverride,
        resetVideoOverrides,
    };
}
