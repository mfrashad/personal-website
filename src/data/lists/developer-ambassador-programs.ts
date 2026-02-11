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
        description: 'Google\'s most prestigious external developer recognition. Referral-only with ~1,400+ members globally.\n\n<strong>Perks:</strong> Sponsored travel to Google I/O, DevFest, and conferences worldwide, early access to Google products, featured in GDE directory, insight calls with product teams\n<strong>Categories:</strong> Android, Cloud, ML/AI, Web, Firebase, Flutter, Angular\n<strong>Eligibility:</strong> Must be referred by existing GDE or Googler\n<strong>Term:</strong> 1 year (renewable)',
        url: 'https://developers.google.com/community/experts',
        tags: ['Tier 1: Elite', 'Referral only', 'Travel sponsored', '1 year'],
    },
    {
        name: 'Microsoft Most Valuable Professional (MVP)',
        description: 'Nomination-only elite program with ~4,000 MVPs across 90+ countries. The gold standard for Microsoft ecosystem expertise.\n\n<strong>Perks:</strong> Visual Studio Enterprise, Azure credits, GitHub Copilot, Office 365, LinkedIn Learning, early NDA product access, executive recognition letter + trophy\n<strong>Top Benefit:</strong> Annual MVP Summit at Microsoft HQ (travel supported)\n<strong>Categories:</strong> 11 award areas including Azure, AI, Developer Technologies\n<strong>Eligibility:</strong> Nomination only, 1 year term',
        url: 'https://mvp.microsoft.com',
        tags: ['Tier 1: Elite', 'Nomination only', 'Very high perks', '1 year'],
    },
    {
        name: 'AWS Hero',
        description: 'The most prestigious AWS recognition. Extremely selective with small quarterly cohorts. Cannot self-nominate.\n\n<strong>Perks:</strong> Exclusive access to AWS resources/experts/events, speaking at re:Invent and Summits, direct connection to product teams\n<strong>Categories:</strong> Community, Container, Data, DevTools, IoT, ML, Serverless, Security\n<strong>Eligibility:</strong> AWS-nominated only, ongoing term',
        url: 'https://aws.amazon.com/developer/community/heroes/',
        tags: ['Tier 1: Elite', 'AWS-nominated', 'Extremely selective', 'Ongoing'],
    },
    {
        name: 'GitHub Stars',
        description: 'Nomination-only program recognizing outstanding community leaders. Anyone can nominate, but you cannot self-nominate.\n\n<strong>Perks:</strong> Early access to GitHub features, exclusive insight calls with GitHub HQ, featured on stars.github.com, social media recognition, exclusive swag\n<strong>Extras:</strong> Continued education opportunities\n<strong>Term:</strong> 1 year, annual renewal subject to GitHub review',
        url: 'https://stars.github.com/',
        tags: ['Tier 1: Elite', 'Nomination only', 'Early access + recognition', '1 year'],
    },
    // TIER 2: EXPERT AMBASSADOR PROGRAMS
    {
        name: 'Docker Captain',
        description: 'Docker\'s expert community program for deep container ecosystem contributors.\n\n<strong>Perks:</strong> Early/beta access to Docker products, education budget, private Slack with Captains + Docker staff, biweekly briefings, Docker Pro discounts\n<strong>Top Benefit:</strong> Annual Docker Captains event, speaking at DockerCon\n<strong>Eligibility:</strong> Application or referral. Requires deep Docker expertise + 5,000+ monthly content views OR Docker team endorsement.\n<strong>Term:</strong> 1 year',
        url: 'https://www.docker.com/community/captains/',
        tags: ['Tier 2: Expert', 'Application/referral', 'Beta + training budget', '1 year'],
    },
    {
        name: 'CNCF Cloud Native Ambassador',
        description: 'Official ambassador for the Cloud Native Computing Foundation. One of the best-compensated non-paid ambassador programs.\n\n<strong>Stipend:</strong> $150/month reimbursement for hosting meetups/events\n<strong>Perks:</strong> Free access to ALL Linux Foundation certifications (CKA, CKAD, CKS \u2014 worth $1,000s), KubeCon event discounts, professional speaking coaching\n<strong>Community:</strong> Global network of ~140 ambassadors\n<strong>Eligibility:</strong> 20+ DevStats score or 1+ year community leadership. Applications reopen 2026.\n<strong>Term:</strong> 2 years',
        url: 'https://www.cncf.io/people/ambassadors/',
        tags: ['Tier 2: Expert', 'Application', '$150/mo + free certs', '2 years'],
    },
    {
        name: 'AWS Community Builder',
        description: 'AWS\'s accessible expert program for active community contributors. More achievable than AWS Hero.\n\n<strong>Perks:</strong> $500 AWS credits annually, 100% certification exam vouchers (all levels), 1 year free QA subscription, publishing on community.aws\n<strong>Access:</strong> Exclusive Slack with AWS service teams, NDA webinars previewing new services, beta access, CFP opportunities at AWS events\n<strong>Applications:</strong> Open ~first week of January for ~2 weeks\n<strong>Term:</strong> 1 year',
        url: 'https://aws.amazon.com/developer/community/community-builders/',
        tags: ['Tier 2: Expert', 'Application', '$500 credits + cert vouchers', '1 year'],
    },
    {
        name: 'Cursor Ambassador',
        description: 'Intentionally small program with unusually direct access to the development team.\n\n<strong>Perks:</strong> Special badge in Cursor forum, funding for community meetups, early access to features and product direction\n<strong>Top Benefit:</strong> Direct daily contact with Cursor development team\n<strong>Role:</strong> Help troubleshoot users, host meetups/hackathons, share expertise, provide product feedback, moderate community\n<strong>Term:</strong> Ongoing',
        url: 'https://cursor.com/ambassadors',
        tags: ['Tier 2: Expert', 'Application', 'Funding + early access', 'Ongoing'],
    },
    {
        name: 'Lovable Ambassador',
        description: 'Global community of builders at the heart of Lovable, the AI app builder valued at $6.6B. Currently waitlist-based.\n\n<strong>Perks:</strong> Exclusive access to early product drops, private workshops with Lovable team, and special perks\n<strong>Role:</strong> Help shape the future of software creation\n<strong>Eligibility:</strong> Waitlist-based, ongoing term',
        url: 'https://ambassadors.lovable.app/',
        tags: ['Tier 2: Expert', 'Waitlist', 'Early access + workshops', 'Ongoing'],
    },
];

export const developerProgramsSourceUrl = 'https://github.com/geshan/developer-ambassador-programs';
