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
        description: 'Formerly Google Developer Student Clubs. Volunteer leadership role with access to Google resources, technical mentorship, Google Cloud credits, swag, and networking with Google engineers. Leads can attend Google I/O Extended and DevFest. Solution Challenge is a global hackathon solving UN SDGs. Very active in Malaysia with chapters at UM, UTM, USM, MMU, APU, Sunway, Monash.',
        url: 'https://gdg.community.dev/',
        tags: ['No stipend', 'Perks + credits', '1 year', 'Students only'],
    },
    {
        name: 'Google Summer of Code (GSoC)',
        description: 'Paid open-source coding program. Stipend based on country PPP: Small projects (~90 hrs) $750-$1,650, Medium (~175 hrs) $1,500-$3,300, Large (~350 hrs) $3,000-$6,600. For Malaysia, expect ~$1,500-$3,000 for medium projects. Payment in two installments. 8-22 weeks, fully remote. ~10-20% acceptance rate.',
        url: 'https://summerofcode.withgoogle.com/',
        tags: ['Paid', '$750-$6,600', '8-22 weeks', '18+ (not student-only)'],
    },
    {
        name: 'AWS Cloud Club Captain',
        description: '$200 in AWS credits + $25 per club member, free AWS certification exam vouchers, QA Learning licence, exclusive swag, resume reviews, mentorship from AWS Advocacy team, monthly calls with AWS staff. ~87 Captains selected globally per cohort. Alumni have joined AWS as SWEs and Solutions Architects.',
        url: 'https://aws.amazon.com/developer/community/students/cloudclubs/',
        tags: ['No stipend', '$200 credits + cert vouchers', '12 months', 'Students (18+)'],
    },
    {
        name: 'Claude Campus Ambassador',
        description: '$1,750 stipend for 10-week program, 8 hours/week. Host events with Anthropic support, create content, establish AI builder clubs, provide product feedback. Direct access to Anthropic research/product/education teams, API credits, coaching from Wasserman Next Gen team. Two tracks: Campus Ambassador (broader outreach) and Builder Club (technical).',
        url: 'https://claude.ai/programs/campus',
        tags: ['Paid', '$1,750', '10 weeks', 'Students only'],
    },
    {
        name: 'Notion Campus Leaders',
        description: 'Host Notion workshops, create templates/resources, build campus community, provide product feedback. Benefits include Notion swag, invitation to Make with Notion conference (SF, travel covered for top leaders), early access to features, event budget, direct feedback channel to product team.',
        url: 'https://notionup.typeform.com/campusleaders',
        tags: ['No stipend', 'Swag + Config trip', '1 year', 'Students only'],
    },
    {
        name: 'Figma Campus Leader',
        description: 'Organize design events, lead workshops, host multi-campus hackathons. Free ticket to Config (~$500+ value), monthly gift card incentives, top performers win all-expenses-paid trip to Figma SF HQ, exclusive access to Figma leadership, budget for campus events. Past leaders have transitioned to roles at Figma.',
        url: 'https://friends.figma.com/become-a-leader/',
        tags: ['No stipend', 'Gift cards + Config + HQ trip', '1 year', 'Students only'],
    },
    {
        name: 'Perplexity Campus Partner',
        description: 'Free Perplexity Pro account (~$200/year), early access to features, marketing budget for campus events, monthly meetings with Perplexity leadership including co-founder, exclusive merch, top performers get SF HQ trip. 2-3 hours/month minimum, max 3 strategists per campus. Past strategists have converted to full-time roles.',
        url: 'https://www.perplexity.ai/campus-partners',
        tags: ['No stipend', 'Pro account + budget + merch', 'Semester', 'Students only'],
    },
    {
        name: 'GitHub Campus Expert',
        description: 'Event reimbursement budget for workshops/hackathons, travel funding to GitHub Universe, exclusive red hoodie and swag kit, GitHub Education Discord with ~230 experts globally, monthly webinars from GitHub engineers, speaking opportunities, community leadership training. Must have GitHub account 6+ months and Student Developer Pack verified. Applications open February and August.',
        url: 'https://education.github.com/campus_experts',
        tags: ['No stipend', 'Event reimbursement + travel + swag', 'Until graduation', 'Students (18+)'],
    },
    {
        name: 'Microsoft Learn Student Ambassador',
        description: 'Milestone progression system (New → Alpha → Beta → Gold). Alpha unlocks $150/month Azure credits (~$1,800/year), Visual Studio Enterprise, Microsoft 365, LinkedIn Learning, free domain, certification vouchers. Beta adds swag box and Summit access. Gold offers MVP mentorship pathway. One of the largest student tech programs with ~2,800+ members in 101+ countries.',
        url: 'https://mvp.microsoft.com/studentambassadors',
        tags: ['No stipend', '$150/mo Azure + VS Enterprise + certs', 'Ongoing', 'Students (16+)'],
    },
    {
        name: 'Lovable Campus Leaders',
        description: 'Global program for students building on Lovable (AI app builder). In partnership with OpenAI, the top 3 schools with most votes each win 1 year of Lovable for ALL students and faculty ($100,000 value per school). Nominate your school and share the link to climb the leaderboard. 50% student discount on Lovable Pro also available.',
        url: 'https://lovable.dev/students',
        tags: ['No stipend', '$100k value per school', 'Competition', 'Students only'],
    },
];

export const studentProgramsSourceUrl = 'https://github.com/SurPathHub/student-programs';
