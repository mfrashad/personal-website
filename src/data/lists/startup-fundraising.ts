export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const startupFundraising: ResourceItem[] = [
    {
        name: 'How to Raise Money (Paul Graham)',
        description: 'Essential essay on fundraising strategy. Covers when to raise, how much to raise, and negotiation tactics. Key insight: be in a position of strength before raising.',
        url: 'https://paulgraham.com/fr.html',
        tags: ['Essay', 'Paul Graham'],
    },
    {
        name: 'How to Convince Investors (Paul Graham)',
        description: 'What investors look for and how to pitch effectively. Covers the importance of traction, team, and market. Key insight: convince yourself first.',
        url: 'https://paulgraham.com/convince.html',
        tags: ['Essay', 'Paul Graham'],
    },
    {
        name: 'How to Raise Your First Round (Founder Institute)',
        description: 'Step-by-step guide to raising pre-seed/seed funding. Covers preparation, finding investors, pitching, and closing the round.',
        url: 'https://fi.co/first-startup-funding',
        tags: ['Guide', 'FI'],
    },
    {
        name: 'YC Guide to Seed Fundraising',
        description: 'Comprehensive guide from YC on raising seed rounds. Covers mechanics of fundraising, SAFEs vs priced rounds, and common mistakes.',
        url: 'https://www.ycombinator.com/blog/how-to-raise-a-seed-round/',
        tags: ['Guide', 'YC'],
    },
    {
        name: 'Ultimate YC Application Guide',
        description: 'How to write a winning YC application. Covers each question, common mistakes, and what YC partners look for. Includes successful application examples.',
        url: 'https://getfluently.notion.site/Y-Combinator-Application-Guide-1286a9ce04d98004b4dac50cf66fb883',
        tags: ['Guide', 'YC'],
    },
    {
        name: '40 Startup Accelerators for Early-Stage Founders',
        description: 'Curated list of top accelerators beyond YC. Includes Techstars, 500 Global, Antler, and regional accelerators. Compare investment terms and focus areas.',
        url: 'https://www.linkedin.com/posts/yrebryk_all-the-best-startup-accelerators-for-early-stage-activity-7391084448987049984-2KHf',
        tags: ['List', 'Accelerators'],
    },
    {
        name: '50 Pitch Decks That Raised $380M+',
        description: 'Collection of real pitch decks from successful startups including Airbnb, Buffer, and Front. Study what works and adapt for your own pitch.',
        url: 'https://www.figma.com/design/9IuacSyyLrJs3BKJOUIOBU/50-startup-pitch-decks',
        tags: ['Examples', 'Pitch decks'],
    },
    {
        name: 'Investor Update Template (500 Global)',
        description: '500 Global template for monthly investor updates. Covers key metrics, wins, challenges, and asks. Keep investors engaged and helpful.',
        url: 'https://500.co/content/investor-update-workshop',
        tags: ['Template', '500 Global'],
    },
    {
        name: 'Guide to Cap Tables for Founders',
        description: 'Everything you need to know about cap table management. Covers equity splits, option pools, dilution, and common mistakes to avoid.',
        url: 'https://carta.com/learn/startups/equity-management/cap-table/',
        tags: ['Guide', 'Equity'],
    },
    {
        name: 'Find Investors (Signal by NFX)',
        description: 'Database of investors to raise capital. Filter by stage, sector, and location. Includes contact info and investment thesis.',
        url: 'https://signal.nfx.com/login',
        tags: ['Tool', 'Investor database'],
    },
    {
        name: 'One Minute Pitch (YC)',
        description: 'How to deliver a compelling one-minute pitch. Covers structure, delivery, and common mistakes. Practice until you can pitch in your sleep.',
        url: 'https://lnkd.in/e6PAi5aH',
        tags: ['Video', 'YC'],
    },
    {
        name: 'Index Ventures OptionPlan',
        description: 'Interactive tool for modeling employee equity. Calculate option grants, vesting schedules, and dilution scenarios.',
        url: 'https://lnkd.in/ef_5enkt',
        tags: ['Tool', 'Equity'],
    },
    {
        name: 'Understanding SAFEs and Priced Rounds',
        description: 'YC explanation of SAFEs, convertible notes, and priced equity rounds. Covers mechanics, pros/cons, and when to use each.',
        url: 'https://lnkd.in/eRRJ_QQ2',
        tags: ['Guide', 'Legal'],
    },
    {
        name: 'Metrics That Matter to Investors',
        description: 'The key metrics VCs look for at each stage. Covers MRR, growth rate, churn, LTV/CAC, and unit economics. Know your numbers.',
        url: 'https://lnkd.in/ehz9XhGH',
        tags: ['Guide', 'Metrics'],
    },
    {
        name: 'Financial Model & Pitch Deck Templates',
        description: 'Collection of templates for financial models, pitch decks, and one-pagers. Start with proven structures and customize for your startup.',
        url: 'https://lnkd.in/eWm-b3zF',
        tags: ['Templates', 'Finance'],
    },
];
