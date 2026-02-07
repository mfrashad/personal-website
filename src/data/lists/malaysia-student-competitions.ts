export interface CompetitionItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const malaysiaStudentCompetitions: CompetitionItem[] = [
    {
        name: 'National AI Competition (RM850k bursaries)',
        description: 'Malaysia\'s largest AI competition for youth (ages 14-19). Ministry of Education approved, Minister of Digital attended 2025 finale. 3 tracks: AI Art, AI Innovation, AI Technical. 2,500+ participants, 600+ submissions. Teams of 4, Form 3 to Pre-U students.',
        url: 'https://hyperbyte.ai/naic/',
        tags: ['AI', 'Youth 14-19'],
    },
    {
        name: 'UMHackathon (RM52k)',
        description: 'National hackathon by PEKOM & Faculty of CS&IT at Universiti Malaya. Focus: Data Science & Machine Learning. Up to RM52,000 across three domains. Open to all undergraduates from public/private universities. Annual in April.',
        url: 'https://umhackathon.com',
        tags: ['Hackathon', 'University'],
    },
    {
        name: 'Sunway iLabs LaunchX',
        description: 'Malaysia\'s first university startup accelerator. Equity-free, no-strings-attached, 3+2 month program. Supported by Ministry of Higher Education. Partners: MRANTI, CARSOME, The Hive SEA, Ficus Capital. At least 50% of team must be active students at any Malaysian HEI. Applications April-September.',
        url: 'https://innovationlabs.sunway.edu.my/launchx/',
        tags: ['Accelerator', 'University'],
    },
    {
        name: 'KitaHack (GDGoC Malaysia)',
        description: 'Nationwide hackathon by all GDG on Campus chapters in Malaysia. 3-month program: workshops across 7+ universities → Top 10 DemoDay. Focus: AI + Google technologies solving UN SDG challenges. Prep for Google\'s global Solution Challenge. Annual Jan-April.',
        url: 'https://kitahack2026.my',
        tags: ['Google', 'Hackathon', 'University'],
    },
    {
        name: 'Huawei ICT Competition',
        description: 'National → Regional → Global Final in Shenzhen. 210,000+ students globally across 100+ countries. Tracks: Network, Cloud, Computing (Practice & Innovation). Prizes include cash, certifications, and trip to Shenzhen.',
        url: 'https://e.huawei.com/en/talent/ict-competition/',
        tags: ['Huawei', 'ICT', 'University'],
    },
    {
        name: 'EY AI & Data Challenge',
        description: 'One of the world\'s largest data challenges — 45,000+ participants across 146 countries. 2026 theme: AI models to forecast water quality. Annual competition.',
        url: 'https://www.ey.com/en_my/careers/data-science-challenge',
        tags: ['AI/Data', 'University+'],
    },
];
