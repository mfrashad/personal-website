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
        description: 'Reader becomes part of the story he\'s been following',
        tags: ['fantasy', 'korean', 'action']
    },
    {
        name: 'Mother of Learning',
        description: 'Time loop magic school progression',
        tags: ['fantasy', 'progression', 'time-loop']
    },
    {
        name: 'Perfect Run',
        description: 'Time loop superhero adventure',
        tags: ['superhero', 'time-loop', 'action']
    },
    {
        name: 'Shadow Slave',
        description: 'Dark progression fantasy with nightmares',
        tags: ['fantasy', 'progression', 'dark']
    },
    {
        name: 'The Novel\'s Extra',
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
        description: 'Last person on Earth when everyone else levels up',
        tags: ['fantasy', 'korean', 'litrpg']
    },
    {
        name: 'The Tutorial is Too Hard',
        description: 'Trapped in deadly tutorial dungeon',
        tags: ['fantasy', 'korean', 'litrpg']
    },
    {
        name: 'Primal Hunter',
        description: 'System apocalypse with archery focus',
        tags: ['litrpg', 'progression', 'system']
    },
    {
        name: 'Mushoku Tensei',
        description: 'Reincarnation into fantasy world with second chance at life',
        tags: ['fantasy', 'isekai', 'japanese']
    },
    {
        name: 'Coiling Dragon',
        description: 'Classic Chinese cultivation epic',
        tags: ['cultivation', 'chinese', 'epic']
    }
];
