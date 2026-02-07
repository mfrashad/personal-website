export interface AcceleratorItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const startupAccelerators: AcceleratorItem[] = [
    {
        name: 'Y Combinator ($500k for 7%)',
        description: 'The most prestigious accelerator. $125k for 7% equity + $375k MFN SAFE. 3-month program in SF, Demo Day to top investors. Alumni include Airbnb, Stripe, Dropbox, Coinbase.',
        url: 'https://www.ycombinator.com/',
        tags: ['Top tier'],
    },
    {
        name: 'Antler ($400k for 10%)',
        description: 'Global day-zero investor with residency programs. $250k for 10% + $150k MFN SAFE. Strong Asia presence including Singapore, KL.',
        url: 'https://www.antler.co/',
        tags: ['Global', 'Co-founder matching'],
    },
    {
        name: '500 Global ($150k for 6%)',
        description: 'Global accelerator with programs worldwide including Southeast Asia. Strong emerging markets presence.',
        url: 'https://500.co/',
        tags: ['Global', 'SEA presence'],
    },
    {
        name: 'Entrepreneur First (up to $250k for ~10%)',
        description: 'Talent investor that helps you find co-founders and build companies from scratch. Programs in London, Singapore, Bangalore, and more.',
        url: 'https://www.joinef.com/',
        tags: ['Co-founder matching'],
    },
    {
        name: 'a16z Speedrun ($500k-$1M for ~10%)',
        description: 'Andreessen Horowitz accelerator for technical founders. Access to a16z portfolio network and resources.',
        url: 'https://speedrun.a16z.com/',
        tags: ['a16z network'],
    },
    {
        name: 'Founders, Inc. ($100-250k for 5-7%)',
        description: 'Early-stage accelerator with flexible terms.',
        url: 'https://f.inc/',
    },
    {
        name: 'Berkeley SkyDeck ($200k for 7.5%)',
        description: 'UC Berkeley accelerator open to all founders. Access to Berkeley network and resources.',
        url: 'https://skydeck.berkeley.edu/',
        tags: ['Berkeley network'],
    },
    {
        name: 'Pear VC ($250k–$2M)',
        description: 'Pre-seed and seed fund with accelerator program.',
        url: 'https://pear.vc/',
        tags: ['Pre-seed/Seed'],
    },
    {
        name: 'South Park Commons ($400k for 7% + $600k follow-on)',
        description: 'Community for builders exploring what to work on next.',
        url: 'https://www.southparkcommons.com/',
    },
    {
        name: 'Greylock Edge (Uncapped SAFE + $500k credits)',
        description: 'Greylock Partners program for early founders.',
        url: 'https://greylock.com/edge/',
    },
    {
        name: 'HF0 Residency ($1M for 5%)',
        description: 'AI-focused residency program. Uncapped SAFE.',
        url: 'https://www.hf0.com/',
        tags: ['AI focus'],
    },
    {
        name: 'Founder Institute (Equity-based)',
        description: 'World\'s largest pre-seed accelerator. Fees vary by program. Programs in 200+ cities worldwide.',
        url: 'https://fi.co/',
        tags: ['200+ cities'],
    },
    {
        name: 'Techstars ($220k for 5%)',
        description: 'Global accelerator network with themed programs. $20k + $200k MFN SAFE. Industry-specific tracks available.',
        url: 'https://www.techstars.com/',
        tags: ['Themed programs'],
    },
    {
        name: 'Plug and Play ($25k-$500k)',
        description: 'Corporate-connected accelerator in Silicon Valley. Strong corporate partnership network.',
        url: 'https://www.plugandplaytechcenter.com/',
        tags: ['Corporate connections'],
    },
    {
        name: 'Seedcamp (£250k-£1M for 10-15%)',
        description: 'Europe\'s leading seed fund and accelerator. Based in London with pan-European focus.',
        url: 'https://seedcamp.com/',
        tags: ['Europe'],
    },
    {
        name: 'Soma Capital ($100k-$1M)',
        description: 'Pre-seed fund backing ambitious founders.',
        url: 'https://www.somacap.com/',
        tags: ['Pre-seed'],
    },
    {
        name: 'Afore Capital ($1M for 10%)',
        description: 'Pre-seed focused fund.',
        url: 'https://afore.vc/',
        tags: ['Pre-seed'],
    },
    {
        name: 'LAUNCH ($125k for 6-7%)',
        description: 'Jason Calacanis accelerator program.',
        url: 'https://www.launch.co/',
    },
    {
        name: 'Conviction Embed ($150k)',
        description: 'Conviction Partners residency program for early founders.',
        url: 'https://www.conviction.com/',
    },
    {
        name: 'Forum Ventures ($100k)',
        description: 'B2B SaaS focused accelerator.',
        url: 'https://forumvc.com/',
        tags: ['B2B SaaS'],
    },
    {
        name: 'AI2 Incubator ($50k-$600k)',
        description: 'Allen Institute for AI incubator for AI startups.',
        url: 'https://www.ai2incubator.com/',
        tags: ['AI focus'],
    },
    {
        name: 'ERA ($150k for 6% + $320k credits)',
        description: 'Entrepreneurs Roundtable Accelerator. NYC-based.',
        url: 'https://www.eranyc.com/',
        tags: ['NYC'],
    },
];
