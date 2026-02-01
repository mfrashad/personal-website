import { useState, useEffect } from 'react';
import { RoughNotation } from 'react-rough-notation';

interface AnnotatedHeadlineProps {
    children: React.ReactNode;
    className?: string;
}

export default function AnnotatedHeadline({ children, className = '' }: AnnotatedHeadlineProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <span className={className}>
            <RoughNotation
                type="highlight"
                show={show}
                color="#fef08a"
                animationDuration={1200}
                animationDelay={800}
                strokeWidth={2}
                iterations={1}
                padding={8}
            >
                {children}
            </RoughNotation>
        </span>
    );
}
