export interface Company {
    name: string;
    role: string;
    period: string;
    logo?: string;
}

export interface PersonalStats {
    companies: Company[];
    usersImpacted: number;
    talksGiven: number;
    hackathonsWon: number;
    hackathonsJudged: number;
    socialMedia: {
        followers: number;
        totalViews: number;
    };
}

export const personalStats: PersonalStats = {
    companies: [
        {
            name: 'Cleve',
            role: 'Co-founder & CTO',
            period: '2023-present',
            logo: '/logos/cleve.svg'
        },
        {
            name: 'AI Consulting Company',
            role: 'Founder',
            period: '2021-2023',
            logo: '/logos/ai-consulting.svg'
        }
    ],
    usersImpacted: 100000,
    talksGiven: 20,
    hackathonsWon: 5,
    hackathonsJudged: 10,
    socialMedia: {
        followers: 20000,
        totalViews: 5000000
    }
};
