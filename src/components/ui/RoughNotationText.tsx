import { RoughNotation } from 'react-rough-notation';
import type { RoughNotationProps } from 'react-rough-notation';

interface RoughNotationTextProps extends Omit<RoughNotationProps, 'show'> {
    children: React.ReactNode;
    delay?: number;
}

export default function RoughNotationText({
    children,
    type = 'underline',
    color = '#3b82f6',
    animationDuration = 1000,
    delay = 500,
    strokeWidth = 2,
    iterations = 2,
    padding = 5,
    ...props
}: RoughNotationTextProps) {
    return (
        <RoughNotation
            type={type}
            show={true}
            color={color}
            animationDuration={animationDuration}
            animationDelay={delay}
            strokeWidth={strokeWidth}
            iterations={iterations}
            padding={padding}
            {...props}
        >
            {children}
        </RoughNotation>
    );
}
