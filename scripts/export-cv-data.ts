#!/usr/bin/env tsx
/**
 * Export CV-relevant site data into a single JSON snapshot (cv/site-data.json).
 *
 * This is the deterministic half of the CV pipeline: it collects and normalizes
 * data already maintained on the website so the /update-cv skill (or a future
 * admin endpoint) can diff it against cv/master.yaml. No AI logic lives here.
 *
 * Run: npm run generate:cv-data
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { register } from 'node:module';

import { personalStats } from '../src/data/stats';
import { achievements, metrics } from '../src/data/achievements';
import { speakingEngagements } from '../src/data/speaking';
import { hackathonEngagements } from '../src/data/hackathons';
import { mediaMentions } from '../src/data/media-mentions';

const OUTPUT_FILE = path.join(process.cwd(), 'cv', 'site-data.json');

const CV_ACHIEVEMENT_CATEGORIES = new Set([
    'academic',
    'professional',
    'technical',
    'community',
]);

function toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

async function loadProjects(): Promise<Record<string, unknown>[]> {
    try {
        // projects.ts imports image assets; register a loader that stubs them.
        register(new URL('./lib/image-stub-loader.mjs', import.meta.url));
        const { projects } = await import('../src/content/projects');
        return projects.map((p: Record<string, unknown>) => ({
            title: p.title,
            description: p.description,
            href: p.href,
            labels: p.labels,
            year: p.year,
        }));
    } catch (error) {
        console.warn(
            'Could not import src/content/projects.ts (image loader issue?); skipping projects.',
            error instanceof Error ? error.message : error,
        );
        return [];
    }
}

async function main() {
    let gitCommit = 'unknown';
    try {
        gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
    } catch {
        // not fatal
    }

    const judging = hackathonEngagements
        .filter((h) => h.role === 'judge' || h.role === 'mentor')
        .map((h) => ({
            id: h.id,
            date: toDateString(h.date),
            event: h.event,
            organizer: h.organizer,
            role: h.role,
            description: h.description,
            location: h.location,
            topics: h.topics,
        }));

    const wins = hackathonEngagements
        .filter((h) => h.role === 'participant' && h.result)
        .map((h) => ({
            id: h.id,
            date: toDateString(h.date),
            event: h.event,
            organizer: h.organizer,
            result: h.result,
            description: h.description,
        }));

    const data = {
        generatedAt: new Date().toISOString(),
        gitCommit,
        stats: {
            companies: personalStats.companies.map(({ name, role, period }) => ({
                name,
                role,
                period,
            })),
            usersImpacted: personalStats.usersImpacted,
            talksGiven: personalStats.talksGiven,
            hackathonsWon: personalStats.hackathonsWon,
            hackathonsJudged: personalStats.hackathonsJudged,
            followers: personalStats.socialMedia.followers,
            totalViews: personalStats.socialMedia.totalViews,
        },
        hackathons: {
            judgingCount: judging.length,
            judging: judging.sort((a, b) => b.date.localeCompare(a.date)),
            wins: wins.sort((a, b) => b.date.localeCompare(a.date)),
        },
        speaking: speakingEngagements
            .map((s) => ({
                id: s.id,
                date: toDateString(s.date),
                title: s.title,
                event: s.event,
                organizer: s.organizer,
                type: s.type,
                audience: s.audience,
                topics: s.topics,
                featured: s.featured,
            }))
            .sort((a, b) => b.date.localeCompare(a.date)),
        achievements: achievements
            .filter((a) => a.unlocked && CV_ACHIEVEMENT_CATEGORIES.has(a.category))
            .map((a) => ({
                id: a.id,
                title: a.title,
                description: a.description,
                category: a.category,
                date: a.date,
                tags: a.tags,
            })),
        metrics: metrics.map(({ id, label, value, unit }) => ({ id, label, value, unit })),
        projects: await loadProjects(),
        mediaMentions: mediaMentions.map((m) => ({
            title: m.title,
            publication: m.publication,
            date: m.date,
            type: m.type,
            url: m.url,
        })),
    };

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(
        `Wrote ${OUTPUT_FILE} (${judging.length} judging events, ${wins.length} wins, ` +
            `${data.speaking.length} talks, ${data.achievements.length} achievements, ` +
            `${data.projects.length} projects)`,
    );
}

main();
