import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal
} from '@floating-ui/react';
import {
    Article,
    MicrophoneStage,
    Trophy,
    Gavel,
    Briefcase,
    Users,
    Heart,
    Eye
} from '@phosphor-icons/react';

import type { Achievement, Metric } from '@data/achievements';

interface AchievementGridProps {
    achievements: Achievement[];
    metrics?: Metric[];
    showMetrics?: boolean;
}

// Icon mapping for metrics
const metricIconMap: Record<string, { Icon: React.ComponentType<any>; color: string }> = {
    'papers-published': { Icon: Article, color: 'text-purple-600' },
    'talks-given': { Icon: MicrophoneStage, color: 'text-purple-600' },
    'hackathons-won': { Icon: Trophy, color: 'text-yellow-600' },
    'hackathons-judged': { Icon: Gavel, color: 'text-orange-600' },
    'companies-founded': { Icon: Briefcase, color: 'text-blue-600' },
    'users-impacted': { Icon: Users, color: 'text-green-600' },
    'social-followers': { Icon: Heart, color: 'text-red-600' },
    'content-views': { Icon: Eye, color: 'text-indigo-600' },
};

// Format large numbers with abbreviations
function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

export default function AchievementGrid({ achievements, metrics = [], showMetrics = true }: AchievementGridProps) {
    const [filter, setFilter] = useState<string>('all');
    const scrollWrapperRef = useRef<HTMLDivElement>(null);

    const handleAchievementClick = (e: React.MouseEvent, achievement: Achievement) => {
        if (!achievement.unlocked) return;

        // Confetti effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        // Get category color for confetti
        const categoryColors: Record<string, string[]> = {
            academic: ['#3b82f6', '#2563eb'],
            professional: ['#10b981', '#059669'],
            technical: ['#8b5cf6', '#7c3aed'],
            athletic: ['#ef4444', '#dc2626'],
            community: ['#f59e0b', '#d97706'],
            adventure: ['#06b6d4', '#0891b2'],
            fitness: ['#f97316', '#ea580c'],
            skill: ['#ec4899', '#db2777']
        };

        confetti({
            particleCount: 50,
            spread: 70,
            origin: { x, y },
            colors: categoryColors[achievement.category] || ['#3b82f6', '#8b5cf6']
        });
    };

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(achievements.map(a => a.category)))];

    // Filter achievements
    const filteredAchievements = filter === 'all'
        ? achievements
        : achievements.filter(a => a.category === filter);

    // Duplicate achievements for seamless infinite scroll
    const infiniteAchievements = [...filteredAchievements, ...filteredAchievements];

    // Count unlocked achievements
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    // Infinite scroll effect
    useEffect(() => {
        const scrollWrapper = scrollWrapperRef.current;
        if (!scrollWrapper || filteredAchievements.length === 0) return;

        let animationFrameId: number;
        let isPaused = false;
        const scrollSpeed = 0.5; // pixels per frame

        const animate = () => {
            if (!isPaused && scrollWrapper) {
                scrollWrapper.scrollLeft += scrollSpeed;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleScroll = () => {
            if (!scrollWrapper) return;

            const { scrollLeft, scrollWidth, clientWidth } = scrollWrapper;
            const halfWidth = scrollWidth / 2;

            // When scrolled past the first set, reset to beginning of first set
            if (scrollLeft >= halfWidth) {
                scrollWrapper.scrollLeft = scrollLeft - halfWidth;
            }
            // When scrolled before the beginning, jump to second set
            else if (scrollLeft <= 0) {
                scrollWrapper.scrollLeft = halfWidth;
            }
        };

        // Pause on hover
        const handleMouseEnter = () => { isPaused = true; };
        const handleMouseLeave = () => { isPaused = false; };

        scrollWrapper.addEventListener('scroll', handleScroll);
        scrollWrapper.addEventListener('mouseenter', handleMouseEnter);
        scrollWrapper.addEventListener('mouseleave', handleMouseLeave);

        // Start at a small offset to allow backward scrolling
        if (scrollWrapper.scrollLeft === 0) {
            scrollWrapper.scrollLeft = 10;
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            scrollWrapper.removeEventListener('scroll', handleScroll);
            scrollWrapper.removeEventListener('mouseenter', handleMouseEnter);
            scrollWrapper.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [filteredAchievements]);

    const categoryColors: Record<string, string> = {
        academic: 'bg-blue-600',
        professional: 'bg-green-600',
        technical: 'bg-purple-600',
        athletic: 'bg-red-600',
        community: 'bg-yellow-600',
        adventure: 'bg-cyan-600',
        fitness: 'bg-orange-600',
        skill: 'bg-pink-600'
    };

    const categoryLabels: Record<string, string> = {
        all: 'All',
        academic: 'Academic',
        professional: 'Professional',
        technical: 'Technical',
        athletic: 'Athletic',
        community: 'Community',
        adventure: 'Adventure',
        fitness: 'Fitness',
        skill: 'Skill'
    };

    // Achievement Card Component with Floating UI Tooltip
    function AchievementCard({ achievement, index, gradientColor, hasImage, isBottomRow }: {
        achievement: Achievement;
        index: number;
        gradientColor: string;
        hasImage: boolean;
        isBottomRow: boolean;
    }) {
        const [isOpen, setIsOpen] = useState(false);

        const { refs, floatingStyles, context } = useFloating({
            open: isOpen,
            onOpenChange: setIsOpen,
            placement: isBottomRow ? 'top' : 'bottom',
            middleware: [offset(10), flip(), shift()],
            whileElementsMounted: autoUpdate,
        });

        const hover = useHover(context);
        const focus = useFocus(context);
        const dismiss = useDismiss(context);
        const role = useRole(context, { role: 'tooltip' });

        const { getReferenceProps, getFloatingProps } = useInteractions([
            hover,
            focus,
            dismiss,
            role,
        ]);

        return (
            <>
                <motion.div
                    ref={refs.setReference}
                    {...getReferenceProps()}
                    className="flip-card-container group"
                    style={{ perspective: '1000px' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: Math.min(index * 0.02, 0.3),
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                    whileHover={{
                        scale: achievement.unlocked ? 1.03 : 1,
                        y: achievement.unlocked ? -3 : 0,
                        transition: { duration: 0.2 }
                    }}
                    onHoverStart={() => {
                        if (achievement.unlocked) {
                            // Hover effect handled by CSS
                        }
                    }}
                    onClick={(e) => handleAchievementClick(e, achievement)}
                >
                    <div className={`flip-card ${hasImage ? 'has-image' : ''}`}>
                        {/* Front - Badge */}
                        <div
                            className={`flip-card-front rounded-lg p-3 transition-all duration-300 cursor-pointer ${
                                achievement.unlocked
                                    ? `bg-gradient-to-br ${gradientColor} text-white shadow-md hover:shadow-lg`
                                    : 'bg-neutral-200 text-neutral-400 opacity-60'
                            }`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                filter: achievement.unlocked ? 'none' : 'grayscale(1)',
                                backfaceVisibility: 'hidden',
                                overflow: 'visible'
                            }}
                        >
                            <div className="flex flex-col items-center text-center gap-1">
                                <div
                                    className={!achievement.unlocked ? 'opacity-50' : ''}
                                    style={{ fontSize: '2.5rem', lineHeight: '1' }}
                                >
                                    {achievement.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xs mb-0.5 line-clamp-2 text-neutral-900">
                                        {achievement.title}
                                    </h4>
                                    {achievement.date && achievement.unlocked && (
                                        <div className="text-[10px] opacity-75 font-mono text-neutral-700">
                                            {achievement.date}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!achievement.unlocked && (
                                <div className="absolute top-1.5 right-1.5 text-sm">
                                    🔒
                                </div>
                            )}
                        </div>

                        {/* Back - Polaroid */}
                        {hasImage && (
                            <div
                                className="flip-card-back rounded-lg p-2 bg-white shadow-lg"
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                }}
                            >
                                <div className="polaroid-frame h-full flex flex-col">
                                    <div className="polaroid-image flex-1 bg-neutral-200 rounded overflow-hidden mb-1.5">
                                        <img
                                            src={achievement.image}
                                            alt={achievement.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="polaroid-caption text-center text-[10px] font-mono text-neutral-700 px-1 line-clamp-2">
                                        {achievement.caption || achievement.title}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Floating UI Tooltip */}
                {!hasImage && isOpen && (
                    <FloatingPortal>
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            className="z-[9999] px-3 py-2 bg-neutral-900 text-white text-xs rounded-md shadow-xl max-w-[200px] text-center"
                        >
                            {achievement.description}
                        </div>
                    </FloatingPortal>
                )}
            </>
        );
    }

    return (
        <div className="achievement-grid">
            {/* Metrics Section */}
            {showMetrics && metrics.length > 0 && (
                <div className="mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {metrics.map((metric) => {
                            const hasMax = metric.maxValue !== undefined && metric.maxValue !== null;
                            const progress = hasMax ? (metric.value / metric.maxValue!) * 100 : 100;
                            const iconConfig = metricIconMap[metric.id];
                            const IconComponent = iconConfig?.Icon;

                            return (
                                <div
                                    key={metric.id}
                                    className="border border-neutral-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-300"
                                    style={{ minHeight: '120px' }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        {IconComponent && (
                                            <IconComponent
                                                weight="fill"
                                                size={20}
                                                className={iconConfig.color}
                                            />
                                        )}
                                        <h4 className="font-semibold text-neutral-900 text-sm">
                                            {metric.label}
                                        </h4>
                                    </div>
                                    <div className="text-3xl font-bold text-blue-600 mb-3">
                                        {formatNumber(metric.value)}
                                        {hasMax && (
                                            <span className="text-sm text-neutral-500 font-normal">
                                                {' / '}{formatNumber(metric.maxValue!)}
                                            </span>
                                        )}
                                    </div>

                                    {hasMax && (
                                        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filter === category
                                ? category === 'all'
                                    ? 'bg-neutral-900 text-white'
                                    : `${categoryColors[category]} text-white`
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                    >
                        {categoryLabels[category] || category}
                    </button>
                ))}
            </div>

            {/* Achievement Badges - Multi-row Horizontal Scroll */}
            <div className="achievement-scroll-container">
                <div className="achievement-scroll-wrapper" ref={scrollWrapperRef}>
                    <div className="achievement-grid-scroll">
                        {infiniteAchievements.map((achievement, index) => {
                            const gradientColors: Record<string, string> = {
                                academic: 'from-blue-500 to-blue-600',
                                professional: 'from-green-500 to-green-600',
                                technical: 'from-purple-500 to-purple-600',
                                athletic: 'from-red-500 to-red-600',
                                community: 'from-yellow-500 to-yellow-600',
                                adventure: 'from-cyan-500 to-cyan-600',
                                fitness: 'from-orange-500 to-orange-600',
                                skill: 'from-pink-500 to-pink-600'
                            };

                            return (
                                <AchievementCard
                                    key={`${achievement.id}-${index}`}
                                    achievement={achievement}
                                    index={index}
                                    gradientColor={gradientColors[achievement.category]}
                                    hasImage={!!achievement.image}
                                    isBottomRow={index % 3 === 2}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Stats Summary */}
            <div className="mt-6 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-md font-bold text-neutral-900">
                        {unlockedCount} / {achievements.length} Achievements Unlocked
                    </h3>
                    <p className="text-sm text-neutral-600">
                        {Math.round((unlockedCount / achievements.length) * 100)}% complete
                    </p>
                </div>
            </div>

            <style>{`
                .flip-card-container {
                    position: relative;
                    width: 140px;
                    height: 160px;
                }

                .flip-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                }

                .flip-card.has-image:hover {
                    transform: rotateY(180deg);
                }

                .flip-card-front,
                .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }

                .flip-card-front {
                    z-index: 1;
                }

                .flip-card-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 0;
                }

                .achievement-scroll-container {
                    width: 100vw;
                    margin-left: 50%;
                    transform: translateX(-50%);
                    overflow: hidden;
                }

                .achievement-scroll-wrapper {
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    padding: 0 2rem;
                }

                .achievement-scroll-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .achievement-grid-scroll {
                    display: inline-grid;
                    grid-template-rows: repeat(3, 1fr);
                    grid-auto-flow: column;
                    grid-auto-columns: 140px;
                    gap: 12px;
                    padding: 8px 0;
                }

                @media (max-width: 640px) {
                    .achievement-scroll-wrapper {
                        padding: 0 1rem;
                    }

                    .flip-card-container {
                        width: 120px;
                        height: 140px;
                    }

                    .achievement-grid-scroll {
                        grid-auto-columns: 120px;
                        gap: 10px;
                    }
                }
            `}</style>
        </div>
    );
}
