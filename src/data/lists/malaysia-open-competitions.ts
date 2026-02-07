export interface CompetitionItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const malaysiaOpenCompetitions: CompetitionItem[] = [
    {
        name: 'Startup World Cup Malaysia (USD $1M global)',
        description: 'Regional chapter of global Startup World Cup (60+ countries). Winner represents Malaysia at Grand Finale in San Francisco for USD $1,000,000 investment. 2025: KL + Kuching chapters + ASEAN Chapter.',
        url: 'https://growthcharger.com/startupworldcupmalaysia',
        tags: ['Startup pitch', 'Any startup'],
    },
    {
        name: 'MYStartup Accelerator (up to RM1M+)',
        description: '4-month accelerator under MOSTI\'s MYStartup initiative run with NEXEA. Top 20 selected → Top 5 qualify for cash prizes. Up to RM1,000,000+ in grants & investments for early to growth-stage Malaysian startups.',
        url: 'https://mystartupaccelerator.org',
        tags: ['Accelerator', 'SSM-registered'],
    },
    {
        name: 'MYHackathon (RM250k grant)',
        description: 'National-level government hackathon by MOSTI via Cradle Fund. Theme: Digitalization of Government Service Delivery. Nationwide events across Malaysia. Winners receive RM250,000 conditional grant from Cradle.',
        url: 'https://www.myhackathon.gov.my',
        tags: ['Govt hackathon', 'Citizens 18+'],
    },
    {
        name: 'Selangor Accelerator Programme (RM50k-100k)',
        description: 'By SIDEC under Selangor Government, equity-free, zero fees. 338 applications in 2025, 24 finalists. Cash prize pool RM50,000-100,000 at Demo Day + overseas study trips. Requires SSM-registered early-stage tech startup with MVP.',
        url: 'https://sidec.com.my',
        tags: ['Accelerator', 'Early startups'],
    },
    {
        name: 'Alpha Startups (up to RM50k)',
        description: '5-week pre-accelerator bootcamp by 1337 Ventures, equity-free. Quarterly intakes. Includes cloud credits (Microsoft/AWS/Google), co-working space, and investor network access. For tech/innovation businesses, Malaysia-based or Malaysian co-founder.',
        url: 'https://1337.ventures',
        tags: ['Pre-accelerator', 'Early startups'],
    },
    {
        name: 'Malaysia Startup Challenge',
        description: 'Online competition for professionals and tertiary students. 3 categories: Startup Idea, Startup Product, Startup Innovation. Annual competition.',
        url: 'https://mystartupchallenge.my',
        tags: ['Startup', 'Students + pros'],
    },
];
