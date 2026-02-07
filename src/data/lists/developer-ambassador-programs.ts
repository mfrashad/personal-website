export interface ProgramItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const developerAmbassadorPrograms: ProgramItem[] = [
    // TIER 1: ELITE RECOGNITION PROGRAMS
    {
        name: 'Google Developer Expert (GDE)',
        description: 'Referral-only elite program. Sponsored travel to Google I/O, DevFest, and conferences worldwide. Early access to Google products, featured in GDE directory (~1,400+ members globally), insight calls with product teams. Categories include Android, Cloud, ML/AI, Web, Firebase, Flutter, Angular. Must be referred by existing GDE or Googler.',
        url: 'https://developers.google.com/community/experts',
        tags: ['Tier 1: Elite', 'Referral only', 'Travel sponsored', '1 year'],
    },
    {
        name: 'Microsoft Most Valuable Professional (MVP)',
        description: 'Nomination-only program with ~4,000 MVPs across 90+ countries. Benefits include Visual Studio Enterprise, Azure credits, GitHub Copilot, Office 365, LinkedIn Learning, early NDA product access, annual MVP Summit at Microsoft HQ (travel supported), executive recognition letter + trophy. 11 award areas including Azure, AI, Developer Technologies.',
        url: 'https://mvp.microsoft.com',
        tags: ['Tier 1: Elite', 'Nomination only', 'Very high perks', '1 year'],
    },
    {
        name: 'AWS Hero',
        description: 'Most prestigious AWS recognition. Exclusive access to AWS resources/experts/events, speaking at re:Invent and Summits, direct connection to product teams. Categories: Community, Container, Data, DevTools, IoT, ML, Serverless, Security. AWS-nominated only — cannot self-nominate. Very selective with small quarterly cohorts.',
        url: 'https://aws.amazon.com/developer/community/heroes/',
        tags: ['Tier 1: Elite', 'AWS-nominated', 'Extremely selective', 'Ongoing'],
    },
    {
        name: 'GitHub Stars',
        description: 'Nomination-only program for community leaders. Early access to GitHub features, exclusive insight calls with GitHub HQ, continued education, featured on stars.github.com, social media recognition, exclusive swag. Anyone can nominate, but cannot self-nominate. Annual renewal subject to GitHub review.',
        url: 'https://stars.github.com/',
        tags: ['Tier 1: Elite', 'Nomination only', 'Early access + recognition', '1 year'],
    },
    // TIER 2: EXPERT AMBASSADOR PROGRAMS
    {
        name: 'Docker Captain',
        description: 'Application or referral-based. Early/beta access to Docker products, education budget, private Slack with Captains + Docker staff, biweekly briefings, annual Docker Captains event, Docker Pro discounts, speaking at DockerCon. Requires deep Docker expertise + 5,000+ monthly content views OR Docker team endorsement.',
        url: 'https://www.docker.com/community/captains/',
        tags: ['Tier 2: Expert', 'Application/referral', 'Beta + training budget', '1 year'],
    },
    {
        name: 'CNCF Cloud Native Ambassador',
        description: '$150/month reimbursement for hosting meetups/events, free access to ALL Linux Foundation certifications (CKA, CKAD, CKS — worth $1,000s), KubeCon event discounts, professional speaking coaching, global network of ~140 ambassadors. Requires 20+ DevStats score or 1+ year community leadership. Applications closed for 2025, reopen 2026.',
        url: 'https://www.cncf.io/people/ambassadors/',
        tags: ['Tier 2: Expert', 'Application', '$150/mo + free certs', '2 years'],
    },
    {
        name: 'AWS Community Builder',
        description: '$500 AWS credits annually, 100% certification exam vouchers (all levels), 1 year free QA subscription, exclusive Slack with AWS service teams, NDA webinars previewing new services, beta access, CFP opportunities at AWS events, publishing on community.aws. Applications open ~first week of January for ~2 weeks.',
        url: 'https://aws.amazon.com/developer/community/community-builders/',
        tags: ['Tier 2: Expert', 'Application', '$500 credits + cert vouchers', '1 year'],
    },
    {
        name: 'Cursor Ambassador',
        description: 'Intentionally small program. Special badge in Cursor forum, funding for community meetups, direct daily contact with Cursor development team, early access to features and product direction. Help troubleshoot users, host meetups/hackathons, share expertise, provide product feedback, moderate community.',
        url: 'https://cursor.com/ambassadors',
        tags: ['Tier 2: Expert', 'Application', 'Funding + early access', 'Ongoing'],
    },
    {
        name: 'Lovable Ambassador',
        description: 'Global group of builders, dreamers, and doers at the heart of the Lovable community (AI app builder valued at $6.6B). Exclusive access to early product drops, private workshops with Lovable team, and special perks. Help shape the future of software creation. Currently waitlist-based.',
        url: 'https://ambassadors.lovable.app/',
        tags: ['Tier 2: Expert', 'Waitlist', 'Early access + workshops', 'Ongoing'],
    },
];

export const developerProgramsSourceUrl = 'https://github.com/geshan/developer-ambassador-programs';
