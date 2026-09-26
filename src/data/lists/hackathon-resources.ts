export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const hackathonResources: ResourceItem[] = [
    // WHERE TO FIND HACKATHONS
    {
        name: 'Devpost',
        description: 'The biggest hackathon platform. Hundreds of online and in-person hackathons at any time, filterable by theme, prize, and location. Also the best place to study past winners: every submission has a demo, repo, and write-up.',
        url: 'https://devpost.com/hackathons',
        tags: ['Find hackathons', 'Free', 'Online + in-person'],
    },
    {
        name: 'Major League Hacking (MLH)',
        description: 'The official student hackathon league. Season calendar of 200+ student hackathons worldwide, plus Global Hack Weeks and the paid MLH Fellowship. Most MLH events give free food, swag, and sponsor prizes.',
        url: 'https://www.mlh.com/seasons/2027/events',
        tags: ['Find hackathons', 'Students', 'Global'],
    },
    {
        name: 'Devfolio',
        description: 'Hackathon platform behind ETHIndia and most big Indian and Asian hackathons. Strong for Web3 and student events, with one-click applications once your profile is set up.',
        url: 'https://devfolio.co/hackathons',
        tags: ['Find hackathons', 'Asia', 'Web3'],
    },
    {
        name: 'Unstop',
        description: 'Competitions and hackathon listings for students in India and Southeast Asia, including corporate hackathons that double as hiring pipelines.',
        url: 'https://unstop.com/hackathons',
        tags: ['Find hackathons', 'Students', 'Hiring'],
    },
    {
        name: 'Luma',
        description: 'Where most AI and startup hackathons are posted now, especially in SF, NYC, London, Singapore, and KL. Follow local calendars (AI Tinkerers, sponsors, VCs) to hear about weekend hackathons first.',
        url: 'https://luma.com/discover',
        tags: ['Find hackathons', 'AI hackathons', 'Local events'],
    },
    {
        name: 'Hackathon.com',
        description: 'Global hackathon directory with corporate, government, and city-run hackathons that don\'t always show up on Devpost.',
        url: 'https://www.hackathon.com/',
        tags: ['Find hackathons', 'Global', 'Corporate'],
    },

    // TEAM BUILDING & MINDSET
    {
        name: 'MLH Hackathon Guide',
        description: 'Short, free guide from MLH on what to expect at your first hackathon: what to bring, how teams form, how judging works, and how to ship something in 24–48 hours.',
        url: 'https://guide.mlh.com/',
        tags: ['Beginner', 'Guide', 'Free'],
    },
    {
        name: 'Hackathon Starter Pack (GitHub)',
        description: 'Open-source roadmap for beginners covering ideas, free APIs, deployment, pitching, and GitHub workflow in one repo. Good checklist to run through before your first event.',
        url: 'https://github.com/udaysharmadev/Hackathon-Starter-Pack-Complete-Guide-Roadmap',
        tags: ['Roadmap', 'Beginner', 'Open source'],
    },
    {
        name: 'The Hackathon Insider Playbook',
        description: 'Write-up from an 8x hackathon winner on what separates finalists: pick a real pain point, explain it in one line, and show what\'s unique before showing features.',
        url: 'https://medium.com/codetodeploy/the-hackathon-insider-playbook-from-a-8x-winner-de83d138bab5',
        tags: ['Guide', 'Winning strategy', 'Article'],
    },

    // IDEATION & DOMAIN SELECTION
    {
        name: 'Devpost Project Gallery',
        description: 'Browse winning projects by hackathon and prize. Before any event, look at the last 2–3 editions\' winners to see what the judges and sponsors actually reward.',
        url: 'https://devpost.com/software',
        tags: ['Ideation', 'Past winners', 'Free'],
    },
    {
        name: 'YC Requests for Startups',
        description: 'Y Combinator\'s list of problems they want founders to solve. A great source of hackathon ideas that are ambitious enough to impress judges and can turn into a real startup after the event.',
        url: 'https://www.ycombinator.com/rfs',
        tags: ['Ideation', 'Startup ideas', 'YC'],
    },
    {
        name: 'Build Your Own X',
        description: 'Huge list of tutorials for building your own version of things like databases, Git, and neural networks. Useful for picking a technical challenge you can actually finish in a weekend.',
        url: 'https://github.com/codecrafters-io/build-your-own-x',
        tags: ['Project ideas', 'Tutorials', 'Open source'],
    },

    // MARKET RESEARCH
    {
        name: 'Google Trends',
        description: 'Validate that people care about your problem in 2 minutes. Screenshot a rising trend for your pitch deck\'s "why now" slide.',
        url: 'https://trends.google.com/',
        tags: ['Market research', 'Free', 'Validation'],
    },
    {
        name: 'Exploding Topics',
        description: 'Spots fast-growing trends before they peak. Handy for picking a domain with momentum and backing your idea with a stat judges remember.',
        url: 'https://explodingtopics.com/',
        tags: ['Market research', 'Trends', 'Freemium'],
    },
    {
        name: 'Crunchbase',
        description: 'Look up competitors, funding, and market size in minutes. A quick "competitors raised $X" slide makes your idea feel real and fundable.',
        url: 'https://www.crunchbase.com/',
        tags: ['Market research', 'Competitors', 'Freemium'],
    },

    // TECH STACK & MVP BUILDING
    {
        name: 'Cursor',
        description: 'AI code editor most hackathon winners are using now. Lets a small team ship a full-stack MVP in a weekend. Free tier available, with student discounts.',
        url: 'https://cursor.com/',
        tags: ['MVP stack', 'AI coding', 'Student discount'],
    },
    {
        name: 'Lovable',
        description: 'Describe your app and get a working full-stack prototype with auth and database. Perfect for non-technical teammates to build the front end while devs handle the hard parts.',
        url: 'https://lovable.dev/',
        tags: ['MVP stack', 'AI app builder', 'Freemium'],
    },
    {
        name: 'v0 by Vercel',
        description: 'Generate polished React + Tailwind UI from a prompt or screenshot, then deploy on Vercel in one click. The fastest way to make your demo look professional.',
        url: 'https://v0.app/',
        tags: ['MVP stack', 'UI', 'Freemium'],
    },
    {
        name: 'Supabase',
        description: 'Postgres database, auth, storage, and realtime in minutes with a generous free tier. The default backend for hackathon projects.',
        url: 'https://supabase.com/',
        tags: ['MVP stack', 'Backend', 'Free tier'],
    },
    {
        name: 'Vercel',
        description: 'Deploy your front end from GitHub in seconds with free hosting and a live URL. Judges trust a link they can click more than a localhost demo.',
        url: 'https://vercel.com/',
        tags: ['MVP stack', 'Deployment', 'Free tier'],
    },
    {
        name: 'Hugging Face',
        description: 'Thousands of free open-source models and datasets, plus Spaces to host a Gradio/Streamlit demo for free. Essential for AI hackathons.',
        url: 'https://huggingface.co/',
        tags: ['AI', 'Models + datasets', 'Free'],
    },

    // FREE APIS
    {
        name: 'Public APIs',
        description: 'Massive GitHub list of free public APIs grouped by category, from weather and finance to games and government data. Many need no API key.',
        url: 'https://github.com/public-apis/public-apis',
        tags: ['Free APIs', 'Open source', 'No key needed'],
    },
    {
        name: 'Google AI Studio (Gemini API)',
        description: 'Free Gemini API key in 30 seconds with a generous free tier. Great for adding LLM, vision, or voice features without paying anything during the event.',
        url: 'https://aistudio.google.com/',
        tags: ['Free APIs', 'AI', 'Free tier'],
    },
    {
        name: 'GitHub Student Developer Pack',
        description: 'Free credits and pro plans for 100+ dev tools (domains, cloud, databases, Copilot) for verified students. Claim it before your first hackathon.',
        url: 'https://education.github.com/pack',
        tags: ['Free credits', 'Students', 'Dev tools'],
    },

    // DESIGN
    {
        name: 'Figma',
        description: 'Wireframe your app before coding and design pitch slides in the same tool. Free Education plan for students.',
        url: 'https://www.figma.com/education/',
        tags: ['Design', 'Free for students', 'Prototyping'],
    },
    {
        name: 'Mobbin',
        description: 'Library of real app screens and flows from top products. Copy proven UI patterns instead of designing from scratch at 3am.',
        url: 'https://mobbin.com/',
        tags: ['Design', 'UI inspiration', 'Freemium'],
    },
    {
        name: 'shadcn/ui',
        description: 'Copy-paste React components that look good by default. Drop them into your MVP and skip the styling rabbit hole.',
        url: 'https://ui.shadcn.com/',
        tags: ['Design', 'Components', 'Free'],
    },

    // GITHUB & WORKFLOW
    {
        name: 'GitHub Skills',
        description: 'Free interactive courses on Git, pull requests, and GitHub Actions. Learn how to work on one repo as a team without merge-conflict disasters.',
        url: 'https://skills.github.com/',
        tags: ['GitHub', 'Team workflow', 'Free'],
    },
    {
        name: 'Make a README',
        description: 'Template and guide for writing a clear README. Judges often open your repo, and a good README with screenshots and setup steps stands out.',
        url: 'https://www.makeareadme.com/',
        tags: ['GitHub', 'Submission', 'Free'],
    },

    // PITCH & DEMO
    {
        name: 'YC: How to Pitch Your Startup',
        description: 'Y Combinator\'s guide to pitching clearly: what you do in one sentence, the problem, traction, and why you. The same structure wins hackathon demos.',
        url: 'https://www.ycombinator.com/library/4b-how-to-pitch-your-company',
        tags: ['Pitch', 'Guide', 'YC'],
    },
    {
        name: 'Screen Studio',
        description: 'Record polished demo videos with automatic zoom and smooth cursor motion. Most Devpost submissions need a 2–3 minute demo video.',
        url: 'https://screen.studio/',
        tags: ['Demo video', 'Recording', 'Paid (trial)'],
    },
    {
        name: 'Loom',
        description: 'Free screen + camera recording for quick demo videos and backup demos in case your live demo breaks on stage.',
        url: 'https://www.loom.com/',
        tags: ['Demo video', 'Recording', 'Free tier'],
    },

    // FREE SLIDE TEMPLATES
    {
        name: 'Slidesgo',
        description: 'Free Google Slides and PowerPoint templates, including pitch-deck and tech themes. Pick one, change the colors, done.',
        url: 'https://slidesgo.com/',
        tags: ['Slide templates', 'Free', 'Google Slides'],
    },
    {
        name: 'Pitch.com Templates',
        description: 'Clean startup pitch deck templates you can edit together as a team in real time. Free plan available.',
        url: 'https://pitch.com/templates',
        tags: ['Slide templates', 'Pitch deck', 'Free tier'],
    },
    {
        name: 'Gamma',
        description: 'Generate a full pitch deck from your idea in a minute, then edit. Saves an hour when you\'re racing to finish the build.',
        url: 'https://gamma.app/',
        tags: ['Slide templates', 'AI', 'Freemium'],
    },

    // POST-HACK
    {
        name: 'YC Startup School',
        description: 'Free program for turning a side project into a startup. The natural next step if your hackathon project gets real users or a prize.',
        url: 'https://www.startupschool.org/',
        tags: ['Post-hack', 'Startup', 'Free'],
    },
    {
        name: 'Product Hunt',
        description: 'Launch your hackathon project after the event to get real users and feedback. Several companies started as hackathon projects launched here.',
        url: 'https://www.producthunt.com/',
        tags: ['Post-hack', 'Launch', 'Free'],
    },
];
