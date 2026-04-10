import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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

import type { Skill, SkillTag, SkillXp } from '@data/skills';

interface SkillGridProps {
    skills: Skill[];
}

const tagColors: Record<SkillTag, { color: string; gradient: string }> = {
    Creative: { color: '#db2777', gradient: 'from-pink-500 to-rose-600' },
    Adventurous: { color: '#0891b2', gradient: 'from-cyan-500 to-teal-600' },
    Physical: { color: '#ea580c', gradient: 'from-orange-500 to-red-600' },
    Sport: { color: '#16a34a', gradient: 'from-green-500 to-emerald-600' },
    Intellectual: { color: '#7c3aed', gradient: 'from-purple-500 to-violet-600' },
    Social: { color: '#d97706', gradient: 'from-yellow-500 to-amber-600' },
};

const xpConfig: Record<SkillXp, { label: string; color: string; width: string }> = {
    explored: { label: 'Explored', color: 'bg-neutral-400', width: '15%' },
    beginner: { label: 'Beginner', color: 'bg-blue-500', width: '35%' },
    hobbyist: { label: 'Hobbyist', color: 'bg-purple-500', width: '65%' },
    passionate: { label: 'Passionate', color: 'bg-amber-500', width: '100%' },
};

function formatDuration(minutes: number): string {
    if (minutes >= 60000) return `${Math.round(minutes / 60000)}K hrs`;
    if (minutes >= 60) return `${Math.round(minutes / 60)} hrs`;
    return `${minutes} min`;
}

function SkillCard({ skill, index, showImages, isBottomRow }: {
    skill: Skill;
    index: number;
    showImages: boolean;
    isBottomRow: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const hasImage = !!skill.image;
    const primaryTag = skill.tags[0] || 'Intellectual';
    const gradient = tagColors[primaryTag]?.gradient || 'from-neutral-500 to-neutral-600';

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
        hover, focus, dismiss, role,
    ]);

    const xp = skill.xp ? xpConfig[skill.xp] : null;
    const children = (skill as any)._childCount || 0;
    const canFlip = hasImage && !showImages;

    return (
        <>
            <motion.div
                ref={refs.setReference}
                {...getReferenceProps()}
                className="skill-flip-container"
                style={{ width: '100%', height: '100%', perspective: '1000px' }}
                whileHover={{ scale: 1.03, y: -3, transition: { duration: 0.2 } }}
            >
                <div className={`skill-flip-card ${canFlip ? 'has-image' : ''}`}>
                    {/* Front */}
                    {showImages && hasImage ? (
                        <div
                            className="skill-flip-front rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-lg"
                        >
                            <img
                                src={skill.image}
                                alt={skill.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                                <h4 className="font-semibold text-[11px] leading-tight line-clamp-2">{skill.title}</h4>
                                {xp && (
                                    <div className="text-[9px] opacity-75 mt-0.5">{xp.label}</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`skill-flip-front rounded-lg p-3 transition-all duration-300 cursor-pointer bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-lg`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div className="flex flex-col items-center text-center gap-1">
                                <div style={{ fontSize: '2.5rem', lineHeight: '1' }}>
                                    {skill.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-xs mb-0.5 line-clamp-2 text-neutral-900">
                                        {skill.title}
                                    </h4>
                                    {xp && (
                                        <div className="text-[10px] opacity-75 font-mono text-neutral-700">
                                            {xp.label}
                                        </div>
                                    )}
                                    {skill.duration && (
                                        <div className="text-[9px] opacity-60 font-mono text-neutral-600">
                                            {formatDuration(skill.duration)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {children > 0 && (
                                <div className="absolute top-1.5 right-1.5 text-[10px] bg-white/30 rounded-full px-1.5 py-0.5 font-mono">
                                    {children}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Back — image polaroid (only if has image and not in image mode) */}
                    {canFlip && (
                        <div
                            className="skill-flip-back rounded-lg p-2 bg-surface-secondary shadow-lg"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="h-full flex flex-col">
                                <div className="flex-1 bg-neutral-200 rounded overflow-hidden mb-1.5">
                                    <img
                                        src={skill.image}
                                        alt={skill.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-center text-[10px] font-mono text-neutral-700 px-1 line-clamp-2">
                                    {skill.icon} {skill.title}
                                    {xp && <span className="ml-1 opacity-60">· {xp.label}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Tooltip — only shown when card has no image to flip to */}
            {!canFlip && isOpen && skill.description && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="z-[9999] px-3 py-2 bg-neutral-900 text-white text-xs rounded-md shadow-xl max-w-[220px] text-center"
                    >
                        {skill.description}
                    </div>
                </FloatingPortal>
            )}
        </>
    );
}

export default function SkillGrid({ skills }: SkillGridProps) {
    const [filter, setFilter] = useState<string>('all');
    const scrollWrapperRef = useRef<HTMLDivElement>(null);

    // Compute child counts
    const skillsWithMeta = skills.map((s) => ({
        ...s,
        _childCount: skills.filter((c) => c.parentId === s.id).length,
    }));

    const tags: SkillTag[] = ['Creative', 'Adventurous', 'Physical', 'Sport', 'Intellectual', 'Social'];

    // Filter skills
    const filteredSkills = filter === 'all'
        ? skillsWithMeta
        : skillsWithMeta.filter((s) => s.tags.includes(filter as SkillTag));

    const infiniteSkills = [...filteredSkills, ...filteredSkills];

    // Infinite scroll effect
    useEffect(() => {
        const scrollWrapper = scrollWrapperRef.current;
        if (!scrollWrapper || filteredSkills.length === 0) return;

        let animationFrameId: number;
        let isPaused = false;
        const scrollSpeed = 0.5;

        const animate = () => {
            if (!isPaused && scrollWrapper) {
                scrollWrapper.scrollLeft += scrollSpeed;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleScroll = () => {
            if (!scrollWrapper) return;
            const { scrollLeft, scrollWidth } = scrollWrapper;
            const halfWidth = scrollWidth / 2;
            if (scrollLeft >= halfWidth) scrollWrapper.scrollLeft = scrollLeft - halfWidth;
            else if (scrollLeft <= 0) scrollWrapper.scrollLeft = halfWidth;
        };

        const handleMouseEnter = () => { isPaused = true; };
        const handleMouseLeave = () => { isPaused = false; };

        scrollWrapper.addEventListener('scroll', handleScroll);
        scrollWrapper.addEventListener('mouseenter', handleMouseEnter);
        scrollWrapper.addEventListener('mouseleave', handleMouseLeave);

        if (scrollWrapper.scrollLeft === 0) scrollWrapper.scrollLeft = 10;
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            scrollWrapper.removeEventListener('scroll', handleScroll);
            scrollWrapper.removeEventListener('mouseenter', handleMouseEnter);
            scrollWrapper.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [filteredSkills]);

    return (
        <div className="skill-grid">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={filter === 'all'
                        ? { background: '#1a1a2e', color: '#fff' }
                        : { background: 'var(--color-surface-tertiary, #f0f0f0)', color: 'var(--color-content-body, #555)' }
                    }
                >
                    All ({skills.length})
                </button>
                {tags.map((tag) => {
                    const count = skills.filter((s) => s.tags.includes(tag)).length;
                    const cfg = tagColors[tag];
                    return (
                        <button
                            key={tag}
                            onClick={() => setFilter(tag)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={filter === tag
                                ? { background: cfg.color, color: '#fff' }
                                : { background: 'var(--color-surface-tertiary, #f0f0f0)', color: 'var(--color-content-body, #555)' }
                            }
                        >
                            {tag} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Scroll Wall */}
            <div className="skill-scroll-container">
                <div className="skill-scroll-wrapper" ref={scrollWrapperRef}>
                    <div className="skill-grid-scroll">
                        {infiniteSkills.map((skill, index) => (
                            <div key={`${skill.id}-${index}`} className="skill-card-cell">
                                <SkillCard
                                    skill={skill}
                                    index={index}
                                    showImages={true}
                                    isBottomRow={index % 3 === 2}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .skill-flip-card {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                }

                .skill-flip-container:hover .skill-flip-card.has-image {
                    transform: rotateY(180deg);
                }

                .skill-flip-front,
                .skill-flip-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }

                .skill-flip-front {
                    z-index: 1;
                }

                .skill-flip-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 0;
                }

                .skill-scroll-container {
                    width: 100vw;
                    margin-left: 50%;
                    transform: translateX(-50%);
                    overflow: hidden;
                }

                .skill-scroll-wrapper {
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    padding: 0 2rem;
                }

                .skill-scroll-wrapper::-webkit-scrollbar {
                    display: none;
                }

                .skill-grid-scroll {
                    display: inline-grid;
                    grid-template-rows: repeat(3, 160px);
                    grid-auto-flow: column;
                    grid-auto-columns: 140px;
                    gap: 12px;
                    padding: 8px 0;
                }

                .skill-card-cell {
                    width: 140px;
                    height: 160px;
                    position: relative;
                }

                @media (max-width: 640px) {
                    .skill-scroll-wrapper {
                        padding: 0 1rem;
                    }

                    .skill-grid-scroll {
                        grid-template-rows: repeat(3, 140px);
                        grid-auto-columns: 120px;
                        gap: 10px;
                    }

                    .skill-card-cell {
                        width: 120px;
                        height: 140px;
                    }
                }
            `}</style>
        </div>
    );
}
