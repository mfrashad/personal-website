export interface HackathonEngagement {
    id: string;
    date: Date;
    title: string;
    event: string;
    organizer: string;
    description?: string;
    location?: string;
    role: 'judge' | 'mentor' | 'participant' | 'sponsor';
    result?: string;
    topics?: string[];
    logos?: string[];
    featured?: boolean;
}

export const hackathonEngagements: HackathonEngagement[] = [
    // 2025
    {
        id: 'kiyoko-con-game-jam-2025',
        date: new Date('2025-11-15'),
        title: 'Kiyoko-Con Game Jam',
        event: "Kiyoko-Con Game Jam",
        organizer: "Taylor's University",
        role: 'judge',
        topics: ['Game Development'],
        logos: ['/speaking-logos/kiyokocon.png', '/speaking-logos/taylors.svg'],
    },
    {
        id: 'tech-trove-hackathon-judge-2025',
        date: new Date('2025-11-02'),
        title: 'Tech Trove 2.0 Hackathon',
        event: 'Tech Trove 2.0 Hackathon',
        organizer: "Taylor's University",
        role: 'judge',
        description: 'Speaker, Judge, and Sponsor',
        topics: ['Technology'],
        logos: ['/speaking-logos/taylors.svg'],
        featured: true,
    },
    {
        id: 'lovable-hackathon-2025',
        date: new Date('2025-10-18'),
        title: 'Lovable Hackathon',
        event: 'Lovable Hackathon',
        organizer: 'Lovable',
        role: 'mentor',
        description: 'Mentor and Prelim Judge',
        topics: ['AI', 'No-Code'],
    },
    {
        id: 'um-pitchlab-2025',
        date: new Date('2025-06-15'),
        title: 'Pitchlab Competition',
        event: 'Pitchlab Competition',
        organizer: 'University of Malaya',
        role: 'judge',
        topics: ['Entrepreneurship', 'Startups'],
        logos: ['/speaking-logos/um.png'],
        featured: true,
    },
    {
        id: 'um-kitahack-mentoring-2025',
        date: new Date('2025-05-10'),
        title: 'KitaHack Mentoring',
        event: 'KitaHack 2025',
        organizer: 'University of Malaya',
        role: 'mentor',
        topics: ['Technology', 'AI'],
        logos: ['/speaking-logos/um.png'],
    },
    {
        id: 'usm-varsity-hack-2025',
        date: new Date('2025-09-15'),
        title: 'USM Varsity Hack 2025',
        event: 'Varsity Hack 2025',
        organizer: 'Universiti Sains Malaysia',
        role: 'judge',
        topics: ['Technology'],
    },
    {
        id: 'usm-pixel-2025',
        date: new Date('2025-07-20'),
        title: 'USM Pixel 2025',
        event: 'USM Pixel 2025',
        organizer: 'Universiti Sains Malaysia',
        role: 'judge',
        topics: ['Technology'],
    },

    // 2024
    {
        id: 'varsity-hack-2024',
        date: new Date('2024-09-15'),
        title: 'Varsity Hack 2024',
        event: 'Varsity Hack 2024',
        organizer: 'Varsity Hack',
        role: 'judge',
        topics: ['Technology'],
    },
    {
        id: 'usm-pixel-2024',
        date: new Date('2024-07-20'),
        title: 'USM Pixel 2024',
        event: 'USM Pixel 2024',
        organizer: 'Universiti Sains Malaysia',
        role: 'judge',
        topics: ['Technology'],
    },

    // 2023
    {
        id: 'dsc-kitahack-2023',
        date: new Date('2023-05-15'),
        title: 'DSC Kita Hack 2023',
        event: 'DSC Kita Hack 2023',
        organizer: 'University of Malaya',
        role: 'mentor',
        topics: ['Technology'],
        logos: ['/speaking-logos/um.png'],
    },

    // 2021
    {
        id: 'saai-factory-hackathon-2021',
        date: new Date('2021-09-15'),
        title: 'SAAI Factory - Hackathon on Art and AI',
        event: 'SAAI Factory Hackathon',
        organizer: 'SAAI Factory',
        role: 'participant',
        result: 'Winner - Prize of Advanced AI ($2,000 USD)',
        description: 'Won $2,000 "Prize of Advanced AI" award out of 500+ participants globally in an international AI hackathon.',
        topics: ['AI', 'Art'],
        featured: true,
    },

    // 2020
    {
        id: 'utm-open-hackathon-2020',
        date: new Date('2020-11-15'),
        title: 'University Open Virtual Hackathon',
        event: 'University Open Virtual Hackathon',
        organizer: 'UTM',
        role: 'participant',
        result: 'Winner (Top 5)',
        description: 'Consolation prize winner. Developed GANCREATE, a defect detection app using anomaly detection.',
        topics: ['AI', 'Computer Vision'],
    },
    {
        id: 'mlh-local-hack-day-2020',
        date: new Date('2020-04-20'),
        title: 'Local Hack Day: Share',
        event: 'Local Hack Day: Share',
        organizer: 'Major League Hacking',
        role: 'participant',
        result: 'Winner - Best Open Source Project',
        description: 'PhotoSketch project won the Best Open Source Project award out of 85 submissions and 292 participants globally.',
        topics: ['Open Source'],
        featured: true,
    },
    {
        id: 'dsc-kitahack-2020',
        date: new Date('2020-04-15'),
        title: 'DSC Kita Hack 2020',
        event: 'DSC Kita Hack 2020',
        organizer: 'DSC Malaysia & Google Developers',
        role: 'participant',
        result: 'Winner',
        description: 'Developed Food Aid Management system to ease food distribution process and prevent corruption, fraud and food hoarding.',
        topics: ['Social Impact', 'Technology'],
    },
    {
        id: 'ium-disrupt-hackathon-2020',
        date: new Date('2020-03-15'),
        title: 'iUM Disrupt Hackathon 2020',
        event: 'iUM Disrupt Hackathon',
        organizer: 'CREST & University of Malaya',
        role: 'participant',
        result: 'First Runner Up',
        description: 'Developed a COVID-19 app with risk assessment, medical appointment system, and e-medical record.',
        topics: ['Healthcare', 'Technology'],
        logos: ['/speaking-logos/um.png'],
    },

    // 2019
    {
        id: 'sedex-42-2019',
        date: new Date('2019-11-15'),
        title: 'SEDEX 42',
        event: 'Science & Engineering Design Exhibition (SEDEX 42)',
        organizer: 'Universiti Teknologi Petronas',
        role: 'participant',
        result: "Chairman's Award Winner",
        description: 'Aide Glass: Transcribing Smart Glasses for the Deaf won the Chairman\'s Award out of 170 teams.',
        topics: ['Hardware', 'IoT', 'Accessibility'],
        logos: ['/speaking-logos/utp.png'],
        featured: true,
    },
    {
        id: 'apu-battle-of-hackers-2019',
        date: new Date('2019-10-15'),
        title: 'APU Battle of Hackers 2019',
        event: 'APU Battle of Hackers',
        organizer: 'Asia Pacific University',
        role: 'participant',
        result: 'Rank 9, Finalist',
        description: 'Led and mentored 2 students in an intervarsity cybersecurity CTF competition as a UTP representative. Ranked 9 out of 50+ teams in Malaysia.',
        topics: ['Cybersecurity', 'CTF'],
        logos: ['/speaking-logos/apu.png'],
    },
    {
        id: 'reboot-the-earth-2019',
        date: new Date('2019-08-15'),
        title: 'Reboot The Earth Hackathon',
        event: 'Reboot The Earth',
        organizer: 'UN Technology Innovation Labs',
        role: 'participant',
        result: 'Finalist',
        description: 'Developed Zed.ai, an out-of-the-box AI solution dedicated to combat climate change, enabling unskilled individuals to use robust AI tools.',
        topics: ['AI', 'Climate Change'],
    },
    {
        id: 'unblockathon-2019',
        date: new Date('2019-05-15'),
        title: 'Unblockathon 2019',
        event: 'Unblockathon 2019',
        organizer: 'Neuron',
        role: 'participant',
        result: 'Semi Finalist',
        description: 'Developed a donation platform based on Ethereum blockchain to give transparency of where the money is going.',
        topics: ['Blockchain', 'Social Impact'],
    },
    {
        id: '3-days-of-code-2019',
        date: new Date('2019-04-20'),
        title: '3 Days of Code',
        event: '3 Days of Code',
        organizer: 'IT Society MMU',
        role: 'participant',
        result: 'Finalist Top 5',
        description: 'Built Bustime, a real-time bus tracking app that provides live location, routes, and arrival times by tracking the bus driver\'s phone.',
        topics: ['Mobile', 'Transportation'],
    },
    {
        id: 'abcde-hackathon-2019',
        date: new Date('2019-04-15'),
        title: 'AI and Big Data Hackathon (ABCDE)',
        event: 'AI and Big Data Hackathon',
        organizer: 'ASEAN Data Analytics Exchange (ADAX)',
        role: 'participant',
        result: 'Semi Finalist',
        description: 'Developed SNAP, a dashboard application that predicts product sales and gives recommendations on asset management using linear regression.',
        topics: ['AI', 'Big Data'],
    },
];

// Helper functions
export function getHackathonsByYear(): Record<number, HackathonEngagement[]> {
    const byYear: Record<number, HackathonEngagement[]> = {};

    hackathonEngagements.forEach(engagement => {
        const year = engagement.date.getFullYear();
        if (!byYear[year]) {
            byYear[year] = [];
        }
        byYear[year].push(engagement);
    });

    Object.keys(byYear).forEach(year => {
        byYear[parseInt(year)].sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    return byYear;
}
