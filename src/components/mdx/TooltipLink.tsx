import { useState } from 'react';

/**
 * Tooltip Link
 * External link with hover tooltip showing URL
 * Useful for inline citations and references
 */

interface TooltipLinkProps {
    href: string;
    children: React.ReactNode;
    tooltip?: string;
    className?: string;
}

export function TooltipLink({ href, children, tooltip, className = '' }: TooltipLinkProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const displayTooltip = tooltip || href;

    return (
        <span className="relative inline-block">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-blue hover:text-blue-dark underline decoration-dotted underline-offset-2 transition-colors ${className}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
            >
                {children}
            </a>
            {showTooltip && (
                <span
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none"
                    role="tooltip"
                >
                    {displayTooltip}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-800"></span>
                </span>
            )}
        </span>
    );
}
