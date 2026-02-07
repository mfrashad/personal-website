export interface CompetitionItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const globalStudentCompetitions: CompetitionItem[] = [
    {
        name: 'MLH Hackathons (Varies)',
        description: 'Official collegiate hackathon league with 200+ hackathons per season. 150,000+ hackers, 12,500+ projects yearly. Events include Hack the North, HackMIT, PennApps, TreeHacks. Prizes vary per event — internships, tech gadgets, credits, swag, cash.',
        url: 'https://mlh.io',
        tags: ['Hackathons', 'Global'],
    },
    {
        name: 'Microsoft Imagine Cup ($100k)',
        description: '"Olympics of Student Innovation". Two paths: Launch ($50k, early-stage) and Scale ($100k + mentorship with Satya Nadella). Must use 2+ Microsoft AI services. Teams of 1-4 students. $1,000-$5,000 Azure credits included. World Championship at Microsoft Build.',
        url: 'https://imaginecup.microsoft.com',
        tags: ['AI/Tech startup', 'Jan-May'],
    },
    {
        name: 'Hult Prize ($1,000,000)',
        description: '"Nobel Prize for Students" — world\'s largest student social entrepreneurship competition. Year-long program: Qualifiers → Nationals → Digital Incubator (60 teams) → Global Accelerator at Ashridge House, London (20 teams) → Finals (6 teams). ~10% equity to Hult Foundation.',
        url: 'https://www.hultprize.org',
        tags: ['Social enterprise', '10,000+ teams'],
    },
    {
        name: 'Enactus World Cup',
        description: 'University teams from 34+ countries build social entrepreneurship ventures. National competitions → World Cup (2026 in São Paulo). 42,000+ students participate annually. Enactus Malaysia chapter exists.',
        url: 'https://enactus.org',
        tags: ['Social enterprise', 'Recognition prize'],
    },
    {
        name: 'GSEA ($100k pool)',
        description: 'Global Student Entrepreneur Awards for students who already own and operate a business while enrolled. Local (100+ cities) → Regional → Global Finals. Winners get EO network access, featured in YouTube series (10M+ views).',
        url: 'https://eonetwork.org/gsea',
        tags: ['Student founders', 'Business owners'],
    },
    {
        name: 'Rice RBPC ($1,000,000+)',
        description: 'World\'s largest and richest student startup competition. 42 teams judged by actual early-stage investors. Over $1,000,000 in cash, investments, and in-kind prizes.',
        url: 'https://rbpc.rice.edu',
        tags: ['Startup pitch', 'Investors'],
    },
    {
        name: 'James Dyson Award (£30,000)',
        description: '"Design something that solves a problem". 28 countries, 2,100+ entries annually. National: £5,000, Global winner: £30,000 (~$38K) + media exposure. Opens March 11, 2026. For current or recent (within 4 years) engineering/design students.',
        url: 'https://www.jamesdysonaward.org',
        tags: ['Design engineering', 'Mar-Jul'],
    },
    {
        name: 'NASA Space Apps Challenge',
        description: 'World\'s largest annual global hackathon — 551 events across 150+ countries. 48-hour hackathon using NASA\'s open data to solve Earth & space challenges. 15,000+ teams in 2025. Winners get NASA recognition and visits to NASA centers. Open to everyone.',
        url: 'https://www.spaceappschallenge.org',
        tags: ['Hackathon', 'October'],
    },
    {
        name: 'Meta Hacker Cup',
        description: 'Meta\'s annual worldwide programming competition. Online rounds → World Finals at Meta HQ. Tests algorithmic problem-solving skills. Cash prizes for top finishers.',
        url: 'https://www.facebook.com/codingcompetitions/hacker-cup',
        tags: ['Competitive programming', 'Cash prizes'],
    },
];
