export interface ProgramItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const studentAmbassadorPrograms: ProgramItem[] = [
    {
        name: 'GDG on Campus',
        description: 'Formerly Google Developer Student Clubs. Lead a campus tech community with Google\'s backing and resources. Perks: Google Cloud credits, swag, technical mentorship, networking with Google engineers. Leads can attend Google I/O Extended and DevFest. Solution Challenge is a global hackathon solving UN SDGs. Presence: Very active in Malaysia with chapters at UM, UTM, USM, MMU, APU, Sunway, Monash. Commitment: Volunteer role, 1 year term, students only.',
        url: 'https://gdg.community.dev/',
        tags: ['No stipend', 'Perks + credits', '1 year', 'Students only'],
    },
    {
        name: 'Google Summer of Code (GSoC)',
        description: 'Paid open-source coding program where you contribute to real-world projects mentored by experienced developers. Stipend: $750\u2013$6,600 (varies by project size and country PPP). Small (~90 hrs): $750\u2013$1,650 \u2022 Medium (~175 hrs): $1,500\u2013$3,300 \u2022 Large (~350 hrs): $3,000\u2013$6,600. Malaysia: ~$1,500\u2013$3,000 for medium projects. Duration: 8\u201322 weeks, fully remote. Eligibility: 18+, not student-only since 2022. ~10\u201320% acceptance rate. Payment: Two installments.',
        url: 'https://summerofcode.withgoogle.com/',
        tags: ['Paid', '$750-$6,600', '8-22 weeks', '18+ (not student-only)'],
    },
    {
        name: 'AWS Cloud Club Captain',
        description: 'Lead an AWS-backed cloud computing club on your campus. One of the more selective student programs globally. Perks: $200 AWS credits + $25 per club member, free AWS certification exam vouchers, QA Learning licence, exclusive swag, resume reviews. Mentorship: Monthly calls with AWS Advocacy team, mentorship from AWS staff. Selectivity: ~87 Captains selected globally per cohort. Alumni have joined AWS as SWEs and Solutions Architects. Commitment: 12 months, students 18+.',
        url: 'https://aws.amazon.com/developer/community/students/cloudclubs/',
        tags: ['No stipend', '$200 credits + cert vouchers', '12 months', 'Students (18+)'],
    },
    {
        name: 'Claude Campus Ambassador',
        description: 'Anthropic\'s paid campus program to build AI communities and provide direct product feedback. Stipend: $1,750 for 10-week program, 8 hours/week. Perks: API credits, coaching from Wasserman Next Gen team, direct access to Anthropic research/product/education teams. Role: Host events with Anthropic support, create content, establish AI builder clubs, provide product feedback. Tracks: Campus Ambassador (broader outreach) and Builder Club (technical).',
        url: 'https://claude.com/programs/campus',
        tags: ['Paid', '$1,750', '10 weeks', 'Students only'],
    },
    {
        name: 'Notion Campus Leaders',
        description: 'Build a Notion community on campus through workshops, templates, and resources. Perks: Notion swag, event budget, early access to features, direct feedback channel to product team. Top Benefit: Invitation to Make with Notion conference (SF, travel covered for top leaders). Role: Host Notion workshops, create templates/resources, build campus community, provide product feedback. Commitment: 1 year, students only.',
        url: 'https://notionup.typeform.com/campusleaders',
        tags: ['No stipend', 'Swag + Config trip', '1 year', 'Students only'],
    },
    {
        name: 'Figma Campus Leader',
        description: 'Lead design events and workshops on campus with Figma\'s support. One of the best perks packages for student programs. Perks: Free ticket to Config (~$500+ value), monthly gift card incentives, budget for campus events, exclusive access to Figma leadership. Top performers win all-expenses-paid trip to Figma SF HQ. Role: Organize design events, lead workshops, host multi-campus hackathons. Commitment: 1 year, students only. Past leaders have transitioned to roles at Figma.',
        url: 'https://www.instagram.com/figmacampusleaders/',
        tags: ['No stipend', 'Gift cards + Config + HQ trip', '1 year', 'Students only'],
    },
    {
        name: 'Perplexity Campus Partner',
        description: 'Represent Perplexity AI on campus with direct access to company leadership including the co-founder. Perks: Free Perplexity Pro account (~$200/year), early access to features, marketing budget for campus events, exclusive merch. Top performers get SF HQ trip. Monthly meetings with Perplexity leadership. Commitment: 2\u20133 hours/month minimum, semester term. Max 3 strategists per campus. Past strategists have converted to full-time roles.',
        url: 'https://www.perplexity.ai/campus-partners',
        tags: ['No stipend', 'Pro account + budget + merch', 'Semester', 'Students only'],
    },
    {
        name: 'GitHub Campus Expert',
        description: 'GitHub\'s flagship student leadership program with one of the strongest alumni networks in tech. Perks: Event reimbursement budget, exclusive red hoodie and swag kit, GitHub Education Discord (~230 experts globally). Top Benefit: Travel funding to GitHub Universe, speaking opportunities. Extras: Monthly webinars from GitHub engineers, community leadership training. Eligibility: GitHub account 6+ months, Student Developer Pack verified. Until graduation. Applications: Open February and August.',
        url: 'https://github.com/education/students/campus-expert',
        tags: ['No stipend', 'Event reimbursement + travel + swag', 'Until graduation', 'Students (18+)'],
    },

    {
        name: 'Microsoft Learn Student Ambassador',
        description: 'One of the largest student tech programs with ~2,800+ members in 101+ countries. Milestone-based progression system. Levels: New \u2192 Alpha \u2192 Beta \u2192 Gold. Alpha Perks: $150/month Azure credits (~$1,800/year), Visual Studio Enterprise, Microsoft 365, LinkedIn Learning, free domain, certification vouchers. Beta Perks: Swag box and Summit access. Gold Perks: MVP mentorship pathway. Eligibility: Students 16+, ongoing commitment.',
        url: 'https://mvp.microsoft.com/studentambassadors',
        tags: ['No stipend', '$150/mo Azure + VS Enterprise + certs', 'Ongoing', 'Students (16+)'],
    },
    {
        name: 'Lovable Campus Leaders',
        description: 'Coming soon. Student-led program bringing Lovable to universities through meetups, hackathons, and more. Status: Coming soon \u2014 details not yet announced. Format: Student-led meetups, hackathons, and community events at universities.',
        url: 'https://lovable.dev/community',
        tags: ['Coming soon', 'Students only'],
    },
];

export const studentProgramsSourceUrl = 'https://github.com/SurPathHub/student-programs';
