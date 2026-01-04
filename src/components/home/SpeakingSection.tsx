import { useState } from 'react';
import type { SpeakingEngagement } from '@data/speaking';

interface SpeakingSectionProps {
    engagements: SpeakingEngagement[];
}

export default function SpeakingSection({ engagements }: SpeakingSectionProps) {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [hoveredEngagement, setHoveredEngagement] = useState<string | null>(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    // Sort engagements by date (newest first)
    const sortedEngagements = [...engagements].sort((a, b) =>
        b.date.getTime() - a.date.getTime()
    );

    const handleMouseEnter = (engagementId: string, event: React.MouseEvent) => {
        const engagement = sortedEngagements.find(e => e.id === engagementId);
        if (!engagement?.images || engagement.images.length === 0) return;

        setHoveredEngagement(engagementId);
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setImagePosition({ x: rect.right + 10, y: rect.top });
    };

    const handleMouseLeave = () => {
        setHoveredEngagement(null);
    };

    return (
        <div className="speaking-section relative">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-end mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            viewMode === 'grid'
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                        aria-label="Grid view"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            viewMode === 'list'
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                        aria-label="List view"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Speaking Engagements Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedEngagements.map((engagement) => (
                        <div key={engagement.id} className="engagement-card border border-neutral-200 rounded-lg p-6 bg-white hover:shadow-md transition-all duration-300">
                            <div className="flex items-start justify-between mb-2">
                                <div className="text-xs font-mono text-neutral-500">
                                    {engagement.date.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full capitalize">
                                    {engagement.type}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                                {engagement.title}
                            </h3>
                            <div className="text-sm text-neutral-700 mb-1">
                                {engagement.event}
                            </div>
                            <div className="text-xs text-neutral-600 mb-3">
                                by {engagement.organizer}
                                {engagement.location && <> • 📍 {engagement.location}</>}
                            </div>
                            {engagement.description && (
                                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                                    {engagement.description}
                                </p>
                            )}
                            {engagement.audience && (
                                <div className="text-xs text-neutral-500 mb-3">
                                    👥 {engagement.audience}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-1">
                    {sortedEngagements.map((engagement) => (
                        <div
                            key={engagement.id}
                            className="engagement-item border-b border-neutral-200 py-3 hover:bg-neutral-50 transition-all duration-200 group cursor-default"
                            onMouseEnter={(e) => handleMouseEnter(engagement.id, e)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-xs font-mono text-neutral-500 shrink-0 whitespace-nowrap">
                                        {engagement.date.toLocaleDateString('en-US', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            year: '2-digit'
                                        })}
                                    </div>
                                    <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                                        {engagement.title}
                                    </h3>
                                    <span className="text-xs text-neutral-500 truncate hidden sm:inline">
                                        {engagement.event}
                                    </span>
                                    <span className="text-xs text-neutral-400 truncate hidden md:inline">
                                        • {engagement.organizer}
                                    </span>
                                </div>
                                <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full capitalize shrink-0">
                                    {engagement.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Preview on Hover */}
            {hoveredEngagement && (
                (() => {
                    const engagement = sortedEngagements.find(e => e.id === hoveredEngagement);
                    if (!engagement?.images || engagement.images.length === 0) return null;

                    return (
                        <div
                            className="fixed z-50 pointer-events-none"
                            style={{
                                left: `${imagePosition.x}px`,
                                top: `${imagePosition.y}px`,
                            }}
                        >
                            <img
                                src={engagement.images[0]}
                                alt={engagement.title}
                                className="w-64 h-auto rounded-lg shadow-2xl border-2 border-white"
                            />
                        </div>
                    );
                })()
            )}

            {engagements.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                    <p>No speaking engagements yet. Check back later!</p>
                </div>
            )}
        </div>
    );
}
