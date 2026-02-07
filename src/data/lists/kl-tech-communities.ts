export interface CommunityItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
}

export const klTechCommunities: CommunityItem[] = [
    {
        name: 'Developer Kaki',
        description: "Malaysia's largest developer community (67K+ members). Job board, salary surveys, meetups, and anonymous discussions.",
        url: 'https://developerkaki.my/',
        image: '/communities/developerkaki-logo.png',
    },
    {
        name: 'Kracked Devs',
        description: 'Community focused on leveling up developers through bounties, bootcamps, hackathons, and apprenticeships (~120+ members).',
        url: 'https://krackeddevs.com/',
        image: '/communities/krackeddevs-logo.png',
    },
    {
        name: 'Women in Tech Malaysia',
        description: 'International NPO aiming to close the gender gap in STEM and help women embrace technology. Part of the global Women in Tech movement targeting 5M by 2030.',
        url: 'https://linktr.ee/womenintechmy',
        image: '/communities/womenintechmy-logo.png',
    },
    {
        name: 'Females in Tech Malaysia',
        description: 'Empower to thrive. Tech for all. A community empowering women in the Malaysian tech industry.',
        url: 'https://www.instagram.com/femalesintech.my/',
    },
    // Language/Framework-Specific
    {
        name: 'Flutter KL',
        description: 'Flutter, Firebase, and Dart developers in Klang Valley.',
        url: 'https://www.meetup.com/flutter-kl/',
    },
    {
        name: 'KualaLumpurJS',
        description: 'Monthly JavaScript meetups.',
        url: 'https://www.facebook.com/groups/kualalumpurjs',
    },
    {
        name: 'Laravel Malaysia',
        description: 'PHP/Laravel community.',
        url: 'https://www.facebook.com/groups/laravel.my/',
    },
    {
        name: 'Python User Group Malaysia',
        description: 'Python community.',
        url: 'https://www.facebook.com/groups/python.malaysia/',
    },
    {
        name: 'KL Ruby Brigade',
        description: 'Monthly Ruby meetups.',
        url: 'https://www.facebook.com/groups/klxrb',
    },
    // DevOps/Cloud
    {
        name: 'DevOps Malaysia',
        description: 'Meetups on DevOps, cloud, CI/CD, and security.',
        url: 'https://www.meetup.com/devopsmalaysia/',
    },
    {
        name: 'Cloud Native KL (CNCF)',
        description: 'Monthly meetups on Kubernetes, containers, and cloud-native tech.',
        url: 'https://www.meetup.com/cloud-native-kuala-lumpur/',
    },
    {
        name: 'AWS User Group Malaysia',
        description: '4,400+ members, regular meetups on AWS and cloud computing.',
        url: 'https://www.meetup.com/awsugmy/',
    },
    {
        name: 'GDG Kuala Lumpur',
        description: 'Google Developer Group with meetups, hackathons, DevFest covering Android, Web, Cloud, ML.',
        url: 'https://gdg.community.dev/gdg-kuala-lumpur/',
    },
];
