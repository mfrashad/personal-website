export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiResearchTools: ResourceItem[] = [
    {
        name: 'NotebookLM',
        description: 'AI notebook that reasons over your uploaded sources. Free. Best for synthesizing documents.',
        url: 'https://notebooklm.google.com/',
        tags: ['Notebook', 'Free'],
    },
    {
        name: 'Semantic Scholar',
        description: 'AI-powered academic search. 200M+ papers indexed. Free.',
        url: 'https://www.semanticscholar.org/',
        tags: ['Academic Search', 'Free'],
    },
    {
        name: 'Jenni AI',
        description: 'AI academic writing assistant with auto-citations. 3M+ users. Free tier available.',
        url: 'https://jenni.ai/',
        tags: ['Academic Writing', 'Free Tier'],
    },
    {
        name: 'Consensus',
        description: 'AI search of scientific papers with evidence-based summaries. Free tier available.',
        url: 'https://consensus.app/',
        tags: ['Academic Search', 'Free Tier'],
    },
    {
        name: 'Elicit',
        description: 'AI research assistant with semantic search. Free tier available.',
        url: 'https://elicit.com/',
        tags: ['Research Assistant', 'Free Tier'],
    },
    {
        name: 'Scite AI',
        description: 'Smart Citations showing supporting/contrasting evidence. Used by 1,200+ institutions.',
        url: 'https://scite.ai/',
        tags: ['Citations', 'Enterprise'],
    },
    {
        name: 'Research Rabbit',
        description: 'Visual mapping of related papers. Free.',
        url: 'https://www.researchrabbit.ai/',
        tags: ['Paper Discovery', 'Free'],
    },
    {
        name: 'Litmaps',
        description: 'Visual citation mapping and literature landscapes. Free tier available.',
        url: 'https://www.litmaps.com/',
        tags: ['Citation Mapping', 'Free Tier'],
    },
];
