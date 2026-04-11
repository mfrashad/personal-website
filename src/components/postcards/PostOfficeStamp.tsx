interface PostOfficeStampProps {
    country?: string;
    date: number; // timestamp
    rotation?: number;
    className?: string;
}

export default function PostOfficeStamp({ country, date, rotation = 0, className = '' }: PostOfficeStampProps) {
    const d = new Date(date);
    const day = d.toLocaleDateString('en-GB', { day: '2-digit' });
    const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const year = d.toLocaleDateString('en-GB', { year: 'numeric' });
    const stampText = (country || 'WORLD WIDE WEB').toUpperCase();
    const pathId = `stamp-${date}-${Math.random().toString(36).slice(2, 6)}`;

    return (
        <div
            className={`pointer-events-none select-none ${className}`}
            style={{ transform: `rotate(${rotation}deg)`, opacity: 0.4 }}
        >
            <div className="flex items-start gap-0">
                {/* Circular stamp */}
                <svg width="72" height="72" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <path id={pathId} d="M 12,58 A 38,38 0 1 1 88,58" fill="none" />
                    </defs>
                    <circle cx="50" cy="50" r="47" stroke="#4A4A4A" strokeWidth="2.5" fill="none" />
                    <circle cx="50" cy="50" r="42" stroke="#6C6C6C" strokeWidth="1.5" fill="none" />
                    <text fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="10" letterSpacing="0.5" fill="#333" fontWeight="600">
                        <textPath xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
                            {stampText}
                        </textPath>
                    </text>
                    <text x="50" y="45" fontFamily="'Courier New', monospace" fontWeight="bold" fontSize="12" textAnchor="middle" fill="#333">{day}</text>
                    <text x="50" y="58" fontFamily="'Courier New', monospace" fontWeight="bold" fontSize="12" textAnchor="middle" fill="#333">{month}</text>
                    <text x="50" y="71" fontFamily="'Courier New', monospace" fontWeight="bold" fontSize="12" textAnchor="middle" fill="#333">{year}</text>
                </svg>

                {/* Wavy lines */}
                <svg width="60" height="30" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" className="mt-3 -ml-1">
                    <g stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round">
                        <path d="M 2 6 Q 10 2, 18 6 T 34 6 T 50 6" />
                        <path d="M 2 12 Q 10 8, 18 12 T 34 12 T 50 12" />
                        <path d="M 2 18 Q 10 14, 18 18 T 34 18 T 50 18" />
                        <path d="M 2 24 Q 10 20, 18 24 T 34 24 T 50 24" />
                        <path d="M 2 30 Q 10 26, 18 30 T 34 30 T 50 30" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
