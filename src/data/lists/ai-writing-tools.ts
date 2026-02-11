export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiWritingTools: ResourceItem[] = [
    {
        name: 'ChatGPT',
        description: 'Conversational AI for writing, code, and ideas. Free tier available.',
        url: 'https://chatgpt.com/',
        tags: ['Chatbot', 'Free Tier'],
    },
    {
        name: 'Gemini',
        description: 'Google\'s multimodal AI. Free with Google account.',
        url: 'https://gemini.google.com/',
        tags: ['Chatbot', 'Free'],
    },
    {
        name: 'Claude',
        description: 'Best for long-form reasoning and analysis. Free tier available.',
        url: 'https://claude.ai/',
        tags: ['Chatbot', 'Free Tier'],
    },
    {
        name: 'Perplexity',
        description: 'AI search engine with real-time citations. Free tier available.',
        url: 'https://perplexity.ai/',
        tags: ['Search', 'Free Tier'],
    },
    {
        name: 'DeepSeek',
        description: 'Open-source reasoning model. Free and open-source.',
        url: 'https://chat.deepseek.com/',
        tags: ['Open Source', 'Free'],
    },
    {
        name: 'Qwen',
        description: 'Multilingual AI model by Alibaba. Open-source.',
        url: 'https://chat.qwen.ai/',
        tags: ['Open Source', 'Multilingual'],
    },
    {
        name: 'Cleve',
        description: 'AI-powered notes app for organizing ideas and content creation. Malaysia-based.',
        url: 'https://cleve.ai/',
        tags: ['Notes', 'Malaysia'],
    },
];
