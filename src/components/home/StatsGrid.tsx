import { useState } from 'react';
import { motion } from 'framer-motion';
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
import confetti from 'canvas-confetti';

import type { Metric } from '@data/achievements';
import AnimatedCounter from '@components/animations/AnimatedCounter';
import { soundManager } from '@utils/soundManager';

interface StatsGridProps {
    metrics: Metric[];
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

export default function StatsGrid({ metrics }: StatsGridProps) {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const handleCardClick = (e: React.MouseEvent, metricId: string) => {
        soundManager.play('success');

        // Confetti effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 30,
            spread: 60,
            origin: { x, y },
            colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
        });
    };

    return (
        <div className="stats-grid">
            {metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {metrics.map((metric, index) => {
                        const hasMax = metric.maxValue !== undefined && metric.maxValue !== null;
                        const progress = hasMax ? (metric.value / metric.maxValue!) * 100 : 100;
                        const iconConfig = metricIconMap[metric.id];
                        const IconComponent = iconConfig?.Icon;
                        const isHovered = hoveredCard === metric.id;

                        return (
                            <motion.div
                                key={metric.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    rotateX: -5,
                                    transition: { duration: 0.2 }
                                }}
                                onHoverStart={() => {
                                    setHoveredCard(metric.id);
                                    soundManager.play('hover');
                                }}
                                onHoverEnd={() => setHoveredCard(null)}
                                onClick={(e) => handleCardClick(e, metric.id)}
                                className="border border-neutral-200 rounded-lg p-3 md:p-4 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                                style={{
                                    minHeight: '100px',
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px'
                                }}
                            >
                                {/* Animated gradient background on hover */}
                                <motion.div
                                    className="absolute inset-0 opacity-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
                                    animate={{
                                        opacity: isHovered ? 1 : 0,
                                        scale: isHovered ? 1 : 0.8
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        {IconComponent && (
                                            <motion.div
                                                animate={{
                                                    rotate: isHovered ? 360 : 0,
                                                    scale: isHovered ? 1.2 : 1
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <IconComponent
                                                    weight="fill"
                                                    size={18}
                                                    className={iconConfig.color}
                                                />
                                            </motion.div>
                                        )}
                                        <h4 className="font-semibold text-neutral-900 text-xs md:text-sm">
                                            {metric.label}
                                        </h4>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                                        <AnimatedCounter value={formatNumber(metric.value)} />
                                        {hasMax && (
                                            <span className="text-sm text-neutral-500 font-normal">
                                                {' / '}{formatNumber(metric.maxValue!)}
                                            </span>
                                        )}
                                    </div>

                                    {hasMax && (
                                        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                            />
                                        </div>
                                    )}
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
