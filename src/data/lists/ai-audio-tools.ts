export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiAudioTools: ResourceItem[] = [
    {
        name: 'ElevenLabs',
        description: 'Industry-leading voice cloning, TTS, and conversational AI. Free tier available.',
        url: 'https://elevenlabs.io/',
        tags: ['TTS', 'Voice Cloning', 'Free Tier'],
    },
    {
        name: 'MiniMax Audio',
        description: 'TTS and voice cloning, 300+ voices, 40+ languages. 85% cheaper than ElevenLabs. Free tier available.',
        url: 'https://minimaxi.com/',
        tags: ['TTS', 'Voice Cloning', 'Free Tier'],
    },
    {
        name: 'Vapi',
        description: 'Developer platform for building AI voice agents. API for phone/support bots.',
        url: 'https://vapi.ai/',
        tags: ['Voice Agents', 'API'],
    },
    {
        name: 'PlayHT',
        description: 'Voice generation with large voice library. Acquired by Meta in 2025.',
        url: 'https://play.ht/',
        tags: ['TTS', 'Voice Library'],
    },
    {
        name: 'Murf AI',
        description: 'AI voiceovers with 200+ voices. Small company, much smaller than ElevenLabs.',
        url: 'https://murf.ai/',
        tags: ['Voiceover', 'TTS'],
    },
    {
        name: 'Resemble AI',
        description: 'Voice cloning with deepfake detection. Enterprise-focused.',
        url: 'https://resemble.ai/',
        tags: ['Voice Cloning', 'Enterprise'],
    },
    {
        name: 'Lovo AI',
        description: '100+ languages with emotion control. Small but functional.',
        url: 'https://lovo.ai/',
        tags: ['TTS', 'Multilingual'],
    },
];
