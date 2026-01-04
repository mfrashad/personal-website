import { useState } from 'react';

/**
 * Accordion
 * Collapsible content sections
 * Useful for hiding long details or optional reading
 */

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className = '' }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion my-6 border border-neutral-300 rounded-lg overflow-hidden ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition-colors flex items-center justify-between gap-4 text-left font-medium text-neutral-800"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-white border-t border-neutral-200">
                    <div className="prose prose-sm max-w-none">{children}</div>
                </div>
            )}
        </div>
    );
}
