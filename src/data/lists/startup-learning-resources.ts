export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const startupLearningResources: ResourceItem[] = [
    {
        name: 'Y Combinator Startup School',
        description: 'Free online program teaching how to start a startup. Includes video lectures from YC partners, weekly group sessions, and access to founder community. Covers ideation, building, launching, and fundraising.',
        url: 'https://www.startupschool.org/',
        tags: ['Course', 'Free', 'YC'],
    },
    {
        name: "Paul Graham's Essays",
        description: 'Collection of essays from YC co-founder Paul Graham. Essential reading on startups, programming, and life. Classics include "How to Start a Startup", "Do Things That Don\'t Scale", and "Maker\'s Schedule".',
        url: 'https://www.paulgraham.com/articles.html',
        tags: ['Essays', 'YC founder'],
    },
    {
        name: "Sam Altman's Blog",
        description: 'Blog from former YC president and OpenAI CEO. Covers startups, AI, and technology. Notable posts on startup advice, productivity, and the future of AI.',
        url: 'https://blog.samaltman.com/',
        tags: ['Blog', 'OpenAI CEO'],
    },
    {
        name: 'Y Combinator YouTube',
        description: 'Official YC channel with founder interviews, Startup School lectures, and "How to Start a Startup" series. Features advice from successful founders like Airbnb, Stripe, and Dropbox.',
        url: 'https://www.youtube.com/@ycombinator',
        tags: ['YouTube', 'YC'],
    },
    {
        name: 'a16z YouTube',
        description: 'Andreessen Horowitz channel covering tech trends, founder interviews, and deep dives into emerging technologies. High-quality production with insights from top VCs and founders.',
        url: 'https://www.youtube.com/@a16z',
        tags: ['YouTube', 'VC'],
    },
    {
        name: "Lenny's Podcast",
        description: 'Lenny Rachitsky interviews world-class product leaders and growth experts. Covers product management, growth strategies, and career advice. One of the top business podcasts.',
        url: 'https://www.youtube.com/@LennysPodcast',
        tags: ['Podcast', 'Product/Growth'],
    },
    {
        name: '20VC with Harry Stebbings',
        description: 'One of the most popular VC podcasts. Harry interviews top founders and investors including Zuckerberg, Musk, and leading VCs. Deep dives into fundraising, scaling, and startup strategy.',
        url: 'https://www.youtube.com/@20VC',
        tags: ['Podcast', 'VC'],
    },
    {
        name: "Greg Isenberg's Channel",
        description: 'Former WeWork head of product shares startup ideas, community building strategies, and internet business opportunities. Known for "Startup Ideas" series with actionable concepts.',
        url: 'https://www.youtube.com/@GregIsenberg',
        tags: ['YouTube', 'Ideas'],
    },
    {
        name: "Marc Lou's Channel",
        description: 'Indie hacker building and shipping products in public. Shares his journey building multiple SaaS products, revenue numbers, and practical coding/marketing tips. Inspirational for solo founders.',
        url: 'https://www.youtube.com/@marc-lou',
        tags: ['YouTube', 'Indie hacker'],
    },
    {
        name: 'Starter Story',
        description: 'Interviews with founders about how they started their businesses. Covers revenue numbers, strategies, and lessons learned. Great for seeing diverse paths to success.',
        url: 'https://www.youtube.com/@starterstory',
        tags: ['YouTube', 'Founder stories'],
    },
    {
        name: 'Masters of Scale',
        description: 'Reid Hoffman (LinkedIn co-founder) interviews iconic founders about scaling companies. Features Zuckerberg, Hastings, Chesky, and more. High production value with storytelling approach.',
        url: 'https://www.youtube.com/@MastersofScale_',
        tags: ['Podcast', 'Scaling'],
    },
    {
        name: 'Foundr',
        description: 'Entrepreneur magazine featuring founder interviews and business advice. Covers bootstrapping, ecommerce, and building companies from scratch.',
        url: 'https://www.youtube.com/@Foundr',
        tags: ['YouTube', 'Entrepreneurship'],
    },
    {
        name: 'EO Global',
        description: 'Entrepreneurs Organization channel with content for scaling founders. Features EO member stories, business strategies, and leadership advice.',
        url: 'https://www.youtube.com/@eoglobal',
        tags: ['YouTube', 'EO'],
    },
    {
        name: 'My First Million',
        description: 'Sam Parr and Shaan Puri discuss business ideas, trends, and opportunities. Entertaining format with actionable insights. Known for brainstorming million-dollar ideas live.',
        url: 'https://www.youtube.com/@MyFirstMillionPod',
        tags: ['Podcast', 'Ideas'],
    },
    {
        name: "Peter Yang's Channel",
        description: 'Former Roblox and Twitch PM sharing product management and career advice. Breaks down how top products work and how to build great products.',
        url: 'https://www.youtube.com/@PeterYangYT',
        tags: ['YouTube', 'Product'],
    },
];
