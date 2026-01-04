import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
    value: string | number;
    duration?: number;
    className?: string;
}

// Parse abbreviated values like "100k", "5M", "1.2B"
function parseAbbreviatedValue(value: string | number): { numericValue: number; suffix: string; prefix: string } {
    if (typeof value === 'number') {
        return { numericValue: value, suffix: '', prefix: '' };
    }

    const str = value.toString().trim();

    // Extract prefix (like $ or +)
    const prefixMatch = str.match(/^([+$€£¥]*)(.*)$/);
    const prefix = prefixMatch ? prefixMatch[1] : '';
    const remaining = prefixMatch ? prefixMatch[2] : str;

    // Extract number and suffix
    const match = remaining.match(/^([\d,.]+)\s*([kKmMbBtT%+]*)$/);
    if (!match) {
        return { numericValue: parseFloat(remaining) || 0, suffix: '', prefix };
    }

    const numStr = match[1].replace(/,/g, '');
    const suffix = match[2];
    let numericValue = parseFloat(numStr);

    // Convert abbreviated values to actual numbers for animation
    const suffixLower = suffix.toLowerCase();
    if (suffixLower === 'k') numericValue *= 1000;
    else if (suffixLower === 'm') numericValue *= 1000000;
    else if (suffixLower === 'b') numericValue *= 1000000000;
    else if (suffixLower === 't') numericValue *= 1000000000000;

    return { numericValue, suffix, prefix };
}

// Format number back to abbreviated form
function formatWithSuffix(value: number, suffix: string, prefix: string): string {
    const suffixLower = suffix.toLowerCase();
    let displayValue: number;

    if (suffixLower === 'k') displayValue = value / 1000;
    else if (suffixLower === 'm') displayValue = value / 1000000;
    else if (suffixLower === 'b') displayValue = value / 1000000000;
    else if (suffixLower === 't') displayValue = value / 1000000000000;
    else displayValue = value;

    // Format with appropriate decimal places
    let formatted: string;
    if (displayValue >= 100 || Number.isInteger(displayValue)) {
        formatted = Math.round(displayValue).toLocaleString();
    } else if (displayValue >= 10) {
        formatted = displayValue.toFixed(1).replace(/\.0$/, '');
    } else {
        formatted = displayValue.toFixed(2).replace(/\.?0+$/, '');
    }

    return `${prefix}${formatted}${suffix}`;
}

export default function AnimatedCounter({ value, duration = 2000, className = '' }: AnimatedCounterProps) {
    const { numericValue, suffix, prefix } = parseAbbreviatedValue(value);
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (inView && !hasAnimated.current) {
            hasAnimated.current = true;
            let startTime: number | null = null;

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentCount = Math.floor(easeOutQuart * numericValue);

                setCount(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCount(numericValue);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [inView, numericValue, duration]);

    return (
        <span ref={ref} className={className}>
            {formatWithSuffix(count, suffix, prefix)}
        </span>
    );
}
