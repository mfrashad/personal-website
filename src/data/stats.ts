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
            period: '2024-present',
            logo: '/logos/cleve.svg'
        },
        {
            name: 'Rashad Labs',
            role: 'Freelance ML Engineer',
            period: '2022-2024',
            logo: '/logos/ai-consulting.svg'
        }
    ],
    usersImpacted: 100000,
    talksGiven: 30,
    hackathonsWon: 5,
    hackathonsJudged: 15,
    socialMedia: {
        followers: 40000,
        totalViews: 10000000
    }
};
