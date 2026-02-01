import { useState, useEffect } from 'react';
import { RoughNotation } from 'react-rough-notation';
import type { RoughNotationType } from 'react-rough-notation';

interface AnnotatedTextProps {
    children: React.ReactNode;
    type?: RoughNotationType;
    color?: string;
    className?: string;
    delay?: number;
}

export default function AnnotatedText({
    children,
    type = 'underline',
    color,
    className = '',
    delay = 600
}: AnnotatedTextProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Default colors for different types
    const defaultColors: Record<string, string> = {
        'underline': '#3b82f6',
        'highlight': '#fef08a',
        'box': '#ef4444',
        'circle': '#8b5cf6',
        'strike-through': '#6b7280',
        'crossed-off': '#dc2626',
        'bracket': '#059669'
    };

    const annotationColor = color || defaultColors[type] || '#3b82f6';

    return (
        <span className={className}>
            <RoughNotation
                type={type}
                show={show}
                color={annotationColor}
                animationDuration={1000}
                animationDelay={delay}
                strokeWidth={2}
                iterations={2}
                padding={type === 'circle' ? 8 : 5}
            >
                {children}
            </RoughNotation>
        </span>
    );
}
