import { useState, useMemo, useEffect } from 'react';

interface Post {
    date: Date | string;
    title: string;
}

// Helper to normalize dates (handles both Date objects and ISO strings)
function toDate(date: Date | string): Date {
    return date instanceof Date ? date : new Date(date);
}

// Use LOCAL date string to avoid timezone issues
function toDateString(date: Date | string): string {
    const d = toDate(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

interface ContributionGraphProps {
    posts: Post[];
}

interface DayData {
    date: Date;
    dateStr: string;
    count: number;
    titles: string[];
}

// Custom event for new writings
export const NEW_WRITINGS_EVENT = 'newWritingsFound';

export interface NewWritingsEventDetail {
    posts: Array<{ date: Date | string; title: string }>;
}

export default function ContributionGraph({ posts: initialPosts = [] }: ContributionGraphProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Listen for new writings events
    useEffect(() => {
        const handleNewWritings = (event: CustomEvent<NewWritingsEventDetail>) => {
            setPosts(prevPosts => {
                const existingTitles = new Set(prevPosts.map(p => p.title));
                const newPosts = event.detail.posts.filter(p => !existingTitles.has(p.title));
                if (newPosts.length === 0) return prevPosts;
                return [...prevPosts, ...newPosts];
            });
        };

        window.addEventListener(NEW_WRITINGS_EVENT, handleNewWritings as EventListener);
        return () => {
            window.removeEventListener(NEW_WRITINGS_EVENT, handleNewWritings as EventListener);
        };
    }, []);

    // Process posts and create contribution data
    const contributionData = useMemo(() => {
        // Create a map of date strings to posts
        const postsByDate: Record<string, string[]> = {};

        posts.forEach(post => {
            const dateStr = toDateString(post.date);
            if (!postsByDate[dateStr]) {
                postsByDate[dateStr] = [];
            }
            postsByDate[dateStr].push(post.title);
        });

        // Generate all days for the past year
        const days: DayData[] = [];
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = toDateString(d); // Use local date to match posts
            const titles = postsByDate[dateStr] || [];
            days.push({
                date: new Date(d),
                dateStr,
                count: titles.length,
                titles,
            });
        }

        return days;
    }, [posts]);

    // Group days into weeks
    const weeks = useMemo(() => {
        const weeksArray: DayData[][] = [];
        let currentWeek: DayData[] = [];

        // Start from Sunday of the first week
        const firstDay = contributionData[0];
        const dayOfWeek = firstDay.date.getDay();

        // Add empty cells for days before the first day
        for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push({
                date: new Date(0),
                dateStr: '',
                count: -1,
                titles: [],
            });
        }

        contributionData.forEach((day, index) => {
            currentWeek.push(day);

            if (currentWeek.length === 7) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        });

        // Fill remaining days in the last week
        while (currentWeek.length > 0 && currentWeek.length < 7) {
            currentWeek.push({
                date: new Date(0),
                dateStr: '',
                count: -1,
                titles: [],
            });
        }
        if (currentWeek.length > 0) {
            weeksArray.push(currentWeek);
        }

        return weeksArray;
    }, [contributionData]);

    const getColor = (count: number): string => {
        if (count === -1) return '#00000000'; // Empty cell
        if (count === 0) return '#ebedf0';
        if (count === 1) return '#9be9a8';
        if (count === 2) return '#40c463';
        if (count <= 4) return '#30a14e';
        return '#216e39';
    };

    const handleMouseEnter = (day: DayData, event: React.MouseEvent) => {
        if (day.count === -1) return;
        setHoveredDay(day);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
    };

    const handleMouseLeave = () => {
        setHoveredDay(null);
    };

    return (
        <div className="contribution-graph">
            <h3 className="text-sm font-mono text-neutral-600 mb-4 text-center">
                Writing activity over the past year
            </h3>

            <div className="overflow-x-auto pb-2 flex justify-center">
                <div className="inline-flex gap-[3px]" style={{ minWidth: 'fit-content' }}>
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[3px]">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className="rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-neutral-400"
                                    style={{
                                        width: '11px',
                                        height: '11px',
                                        backgroundColor: getColor(day.count),
                                    }}
                                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-600">
                <span>Less</span>
                <div className="flex gap-1">
                    {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map((color, i) => (
                        <div
                            key={i}
                            className="rounded-sm"
                            style={{ width: '11px', height: '11px', backgroundColor: color }}
                        />
                    ))}
                </div>
                <span>More</span>
            </div>

            {/* Tooltip */}
            {hoveredDay && (
                <div
                    className="fixed z-50 bg-neutral-900 text-white text-xs px-3 py-2 rounded-md shadow-lg pointer-events-none max-w-xs"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y - 10}px`,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="font-semibold mb-1">
                        {hoveredDay.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </div>
                    {hoveredDay.count > 0 ? (
                        <div className="space-y-0.5">
                            {hoveredDay.titles.map((title, i) => (
                                <div key={i} className="text-neutral-200">• {title}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-neutral-400">No posts</div>
                    )}
                </div>
            )}
        </div>
    );
}
