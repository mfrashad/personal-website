export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteWebnovels: ListItem[] = [
    {
        name: 'Omniscient Reader\'s Viewpoint (ORV)',
        url: 'https://hardcover.app/books/omniscient-reader-s-viewpoint-volume-1',
        description: 'Reader becomes part of the story he\'s been following',
        tags: ['fantasy', 'korean', 'action']
    },
    {
        name: 'Mother of Learning',
        url: 'https://hardcover.app/books/mother-of-learning',
        description: 'Time loop magic school progression',
        tags: ['fantasy', 'progression', 'time-loop']
    },
    {
        name: 'Perfect Run',
        url: 'https://hardcover.app/books/the-perfect-run',
        description: 'Time loop superhero adventure',
        tags: ['superhero', 'time-loop', 'action']
    },
    {
        name: 'Shadow Slave',
        url: 'https://hardcover.app/books/shadow-slave',
        description: 'Dark progression fantasy with nightmares',
        tags: ['fantasy', 'progression', 'dark']
    },
    {
        name: 'The Novel\'s Extra',
        url: 'https://hardcover.app/books/the-novels-extra',
        description: 'Author reincarnates as side character in his own novel',
        tags: ['fantasy', 'korean', 'reincarnation']
    },
    {
        name: 'Regression Instruction Manual',
        description: 'Manipulative protagonist in regression setting',
        tags: ['fantasy', 'korean', 'regression']
    },
    {
        name: 'Everyone Else is a Returnee',
        url: 'https://hardcover.app/books/everyone-else-is-a-returnee',
        description: 'Last person on Earth when everyone else levels up',
        tags: ['fantasy', 'korean', 'litrpg']
    },
    {
        name: 'The Tutorial is Too Hard',
        url: 'https://hardcover.app/books/the-tutorial-is-too-hard',
        description: 'Trapped in deadly tutorial dungeon',
        tags: ['fantasy', 'korean', 'litrpg']
    },
    {
        name: 'Primal Hunter',
        url: 'https://hardcover.app/books/the-primal-hunter',
        description: 'System apocalypse with archery focus',
        tags: ['litrpg', 'progression', 'system']
    },
    {
        name: 'Mushoku Tensei',
        url: 'https://hardcover.app/books/mushoku-tensei-2021',
        description: 'Reincarnation into fantasy world with second chance at life',
        tags: ['fantasy', 'isekai', 'japanese']
    },
    {
        name: 'Coiling Dragon',
        url: 'https://hardcover.app/books/coiling-dragon',
        description: 'Classic Chinese cultivation epic',
        tags: ['cultivation', 'chinese', 'epic']
    }
];
