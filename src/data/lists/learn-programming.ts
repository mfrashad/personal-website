export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const learnProgramming: ResourceItem[] = [
    {
        name: 'CodeDex.io',
        description: 'A gamified, adventure-style way to learn Python, git, and command line basics. Great for beginners who want a fun entry point.',
        url: 'https://codedex.io/',
        tags: ['Gamified', 'Beginner'],
    },
    {
        name: 'The Odin Project',
        description: 'A free, open-source full-stack curriculum supported by a passionate community. Focuses on getting you career-ready with real development skills.',
        url: 'https://www.theodinproject.com/',
        tags: ['Full Stack', 'Free', 'Open Source'],
    },
    {
        name: 'Bro Code',
        description: 'A YouTube channel featuring full 12-hour courses on languages like Python, C++, and Java. Perfect if you prefer long-form video tutorials over reading.',
        url: 'https://www.youtube.com/@BroCodez',
        tags: ['YouTube', 'Video'],
    },
    {
        name: 'SoloLearn',
        description: 'Offers interactive, hands-on courses for real-world subjects like generative AI and web development. Good for learning on the go with bite-sized lessons.',
        url: 'https://www.sololearn.com/',
        tags: ['Interactive', 'Mobile'],
    },
    {
        name: 'W3Schools',
        description: 'The world\'s largest web developer site for tutorials and references. The go-to place to quickly look up syntax or practice specific concepts.',
        url: 'https://www.w3schools.com/',
        tags: ['Reference', 'Tutorials'],
    },
    {
        name: 'LeetCode',
        description: 'The standard for data structures and technical interview preparation. Use this to drill specific problem types and sharpen your algorithmic thinking.',
        url: 'https://leetcode.com/',
        tags: ['Interview Prep', 'Algorithms'],
    },
    {
        name: 'Codefinity',
        description: 'Provides full hands-on courses and interactive projects. Focuses on practical skills like AI, data, and building a portfolio.',
        url: 'https://codefinity.com/',
        tags: ['Interactive', 'Projects'],
    },
    {
        name: 'freeCodeCamp',
        description: 'Free, open-source 3,000+ hour curriculum with 12 certifications. Covers full-stack web dev, machine learning, and more. 10M+ YouTube subscribers.',
        url: 'https://www.freecodecamp.org/',
        tags: ['Free', 'Full Stack', 'Certifications'],
    },
    {
        name: 'Fireship',
        description: 'Fast-paced developer education by Jeff Delaney. Bite-sized videos that distill complex concepts into under 10 minutes. Covers React, TypeScript, Next.js, and more.',
        url: 'https://fireship.dev/',
        tags: ['YouTube', 'Video', 'JavaScript'],
    },
];
