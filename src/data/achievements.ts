export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'academic' | 'professional' | 'technical' | 'athletic' | 'community' | 'adventure' | 'fitness' | 'skill';
    tags: string[];
    date?: string;
    unlocked: boolean;
    image?: string;
    caption?: string;
}

export interface Metric {
    id: string;
    label: string;
    value: number;
    maxValue?: number;
    unit: string;
    tags: string[];
}

export const achievements: Achievement[] = [
    {
        id: 'hacking-11',
        title: 'Teen Hacker',
        description: 'Started hacking at age 11',
        icon: '💻',
        category: 'technical',
        tags: ['programming', 'early-start'],
        date: '2011',
        unlocked: true
    },
    {
        id: 'entered-uni-15',
        title: 'Early Achiever',
        description: 'Entered university at age 15',
        icon: '🎓',
        category: 'academic',
        tags: ['education', 'prodigy'],
        date: '2015',
        unlocked: true
    },
    {
        id: 'published-game-16',
        title: 'Game Developer',
        description: 'Published first game at age 16',
        icon: '🎮',
        category: 'professional',
        tags: ['game-dev', 'publishing'],
        date: '2016',
        unlocked: true
    },
    {
        id: 'tech-intern-17',
        title: 'Startup Journey Begins',
        description: 'Became a tech intern at a startup at age 17',
        icon: '🚀',
        category: 'professional',
        tags: ['startup', 'internship'],
        date: '2017',
        unlocked: true
    },
    {
        id: 'founded-club-18',
        title: 'Tech Club Founder',
        description: 'Founded a tech club at age 18',
        icon: '👥',
        category: 'community',
        tags: ['leadership', 'community'],
        date: '2018',
        unlocked: true
    },
    {
        id: 'mit-paper-19',
        title: 'Research Contributor',
        description: 'Published research paper with MIT at age 19',
        icon: '📄',
        category: 'academic',
        tags: ['research', 'MIT', 'AI'],
        date: '2019',
        unlocked: true
    },
    {
        id: 'valedictorian-20',
        title: 'Academic Weapon',
        description: 'Graduated as valedictorian at age 20',
        icon: '🏆',
        category: 'academic',
        tags: ['education', 'excellence'],
        date: '2020',
        unlocked: true
    },
    {
        id: 'ai-consulting-21',
        title: 'Entrepreneur',
        description: 'Founded AI consulting company at age 21',
        icon: '💼',
        category: 'professional',
        tags: ['entrepreneurship', 'AI', 'consulting'],
        date: '2021',
        unlocked: true
    },
    {
        id: 'venture-backed-22',
        title: 'VC-Backed Founder',
        description: 'Co-founded venture-backed startup at age 22',
        icon: '🌟',
        category: 'professional',
        tags: ['startup', 'venture-capital', 'co-founder'],
        date: '2022',
        unlocked: true
    },
    {
        id: 'speaker',
        title: 'Public Speaker',
        description: 'Gave 20+ talks on AI, tech, and career',
        icon: '🎤',
        category: 'community',
        tags: ['speaking', 'education'],
        unlocked: true
    },
    {
        id: 'hackathon-winner',
        title: 'Hackathon Champion',
        description: 'Won 5 hackathons',
        icon: '🥇',
        category: 'technical',
        tags: ['hackathon', 'competition'],
        unlocked: true
    },
    {
        id: 'content-creator',
        title: 'Content Creator',
        description: 'Built audience of 20K+ followers',
        icon: '📱',
        category: 'community',
        tags: ['content', 'social-media'],
        unlocked: true
    },
    // Bucket List & Hobbies
    // --- 🌊 WATER (The "I Got Wet" Arc) ---
    {
        "id": "rescue-diver",
        "title": "Rescue Diver",
        "description": "PADI Certified Rescue Diver. Actually qualified to save lives.",
        "icon": "🛟",
        "category": "adventure",
        "tags": ["diving", "certification"],
        "unlocked": true
    },
    {
        "id": "shark-diver",
        "title": "Shark Swimmer",
        "description": "Dived with Sharks & Whale Sharks. Didn't get eaten.",
        "icon": "🦈",
        "category": "adventure",
        "tags": ["diving", "sharks"],
        "unlocked": true
    },
    {
        "id": "surfer-novice",
        "title": "Surfer",
        "description": "Tried surfing, wakesurfing & flowriding once. Mostly fought the water and lost.",
        "icon": "🏄",
        "category": "sports",
        "tags": ["water", "surfing"],
        "unlocked": true
    },
    {
        "id": "wind-surfer",
        "title": "Wind Surfer",
        "description": "Tried it once at Cherating. Managed to stand up without falling immediately.",
        "icon": "🌬️",
        "category": "sports",
        "tags": ["water", "wind"],
        "unlocked": true
    },
    {
        "id": "freediver",
        "title": "Freediver",
        "description": "Tried diving without the tank. Discovered I am not a fish.",
        "icon": "🤿",
        "category": "adventure",
        "tags": ["diving", "breath"],
        "unlocked": true
    },

    // --- ⚡ ADRENALINE (The "I Survived" Arc) ---
    {
        "id": "skydiver-tandem",
        "title": "Tandem Skydiver",
        "description": "Strapped to a pro and fell out of a plane. I just screamed, they did the work.",
        "icon": "🪂",
        "category": "adventure",
        "tags": ["flying", "adrenaline"],
        "unlocked": true
    },
    {
        "id": "pilot-student",
        "title": "One-Day Pilot",
        "description": "Flew a plane once for a day program. Didn't crash.",
        "icon": "✈️",
        "category": "skill",
        "tags": ["flying", "aviation"],
        "unlocked": true
    },
    {
        "id": "climber",
        "title": "Rock Climber",
        "description": "Climbed outdoors once and managed a dyno. Still learning the ropes (literally).",
        "icon": "🧗",
        "category": "sports",
        "tags": ["climbing", "strength"],
        "unlocked": true
    },
        // --- 🌋 ADVENTURE (The Adrenaline Arc) ---
    {
        "id": "ice-climber",
        "title": "Ice Warrior",
        "description": "Quest: Try Ice Climbing. Like rock climbing, but colder and with axes.",
        "icon": "⛏️",
        "category": "adventure",
        "tags": ["nature", "extreme"],
        "unlocked": false
    },
    {
        "id": "aquaman-hunter",
        "title": "Spear Hunter",
        "description": "Quest: Try Spearfishing. Catching your own sushi.",
        "icon": "🔱",
        "category": "adventure",
        "tags": ["ocean", "survival"],
        "unlocked": false
    },
    {
        "id": "volcano-witness",
        "title": "Disaster Tourist",
        "description": "Quest: Witness a Volcano Eruption. Ideally from a safe distance.",
        "icon": "🌋",
        "category": "adventure",
        "tags": ["nature", "rare-event"],
        "unlocked": false
    },
    // --- 🎨 CRAFTS (The "Workshop Tourist" Arc) ---
    {
        "id": "glassblower",
        "title": "Glassblowing Tourist",
        "description": "Tried it once in Japan. Made one piece, didn't burn the shop down.",
        "icon": "🏺",
        "category": "creative",
        "tags": ["art", "fire"],
        "unlocked": true
    },
    {
        "id": "welder",
        "title": "Welding Intro",
        "description": "Took a workshop. Fused metal once. Sparks flew, nothing exploded.",
        "icon": "👨‍🏭",
        "category": "creative",
        "tags": ["metal", "craft"],
        "unlocked": true
    },
    {
        "id": "arts-dabbler",
        "title": "Craft Dabbler",
        "description": "Took one-off workshops in Resin, Tufting, Pottery, & Tie-dye. Jack of all trades, master of none.",
        "icon": "🎨",
        "category": "creative",
        "tags": ["crafts", "hobby-collector"],
        "unlocked": true
    },
    {
        "id": "birthday-baker",
        "title": "Birthday Baker",
        "description": "Baked my own birthday cake. Peak independence or peak loneliness? You decide.",
        "icon": "🎂",
        "category": "skill",
        "tags": ["cooking", "baking", "adulting"],
        "unlocked": true
    },
    {
        "id": "fashion-designer",
        "title": "DIY Tailor",
        "description": "Tried making my own clothes & Cosplay. It's wearable... technically.",
        "icon": "🧵",
        "category": "creative",
        "tags": ["fashion", "sewing"],
        "unlocked": true
    },
        {
        "id": "yc-founder",
        "title": "Orange Box Alum",
        "description": "Quest: Get into Y Combinator. The Hogwarts for founders.",
        "icon": "🟧",
        "category": "career",
        "tags": ["startup", "prestige"],
        "unlocked": false
    },
    {
        "id": "fire-mode",
        "title": "Millionaire",
        "description": "Quest: Save $1M & reach FIRE. Work becomes optional, chaos becomes mandatory.",
        "icon": "🔥",
        "category": "wealth",
        "tags": ["money", "freedom"],
        "unlocked": false
    },
    {
        "id": "dr-rashad",
        "title": "The Doctor",
        "description": "Quest: Get a PhD. Because 'Master' wasn't enough.",
        "icon": "🎓",
        "category": "academic",
        "tags": ["research", "prestige"],
        "unlocked": false
    },
    {
        "id": "runway-model",
        "title": "Face Card",
        "description": "Quest: Become a professional model. Proving intelligence has an aesthetic.",
        "icon": "📸",
        "category": "fame",
        "tags": ["fashion", "vanity"],
        "unlocked": false,
        "notes": "Explicit goal: [Grow to 100k then model](cite:idea:3)."
    },
    {
        "id": "lockpicker",
        "title": "Lockpicking Novice",
        "description": "Picked a practice lock once. Still calling a locksmith in real life.",
        "icon": "🔐",
        "category": "skill",
        "tags": ["stealth", "rogue"],
        "unlocked": true
    },

    // --- 🕺 SKILLS (The "Beginner Class" Arc) ---
    {
        "id": "multi-dancer",
        "title": "Dance Class Hopper",
        "description": "Took intro classes for 15+ styles (Salsa, Kpop, etc). I know the basics of everything.",
        "icon": "💃",
        "category": "art",
        "tags": ["dance", "rhythm"],
        "unlocked": true
    },
    {
        "id": "musician-producer",
        "title": "Campfire Musician",
        "description": "Can play 1-3 songs on Guitar/Piano. Enough to impress people for 5 minutes.",
        "icon": "🎸",
        "category": "art",
        "tags": ["music", "audio"],
        "unlocked": true
    },
    {
        "id": "martial-artist",
        "title": "Martial Arts Trial",
        "description": "Tried a BJJ & Fencing class. Learned how to tap out efficiently.",
        "icon": "🥋",
        "category": "sports",
        "tags": ["combat", "fighting"],
        "unlocked": true
    },
    {
        "id": "calisthenics-athlete",
        "title": "Calisthenics",
        "description": "Can do a handstand and pushup. Working on the rest.",
        "icon": "🤸",
        "category": "sports",
        "tags": ["fitness", "strength"],
        "unlocked": true
    },

    // --- 🌍 TRAVEL (The "I Was There" Arc) ---
    {
        "id": "snow-rider",
        "title": "Snow Tourist",
        "description": "Went skiing & snowboarding in Japan. Managed to get down the hill.",
        "icon": "🏂",
        "category": "sports",
        "tags": ["snow", "travel"],
        "unlocked": true
    },
    {
        "id": "volcano-hiker",
        "title": "Volcano Hiker",
        "description": "Hiked a volcano once. Took the photo. Walked down.",
        "icon": "🌋",
        "category": "adventure",
        "tags": ["hiking", "travel"],
        "unlocked": true
    },
    {
        "id": "indonesia-hiker",
        "title": "Indonesian Mountain Explorer",
        "description": "Hiked Bromo & Rinjani. Conquered Indonesia's volcanic peaks.",
        "icon": "⛰️",
        "category": "adventure",
        "tags": ["hiking", "volcano", "travel", "indonesia"],
        "unlocked": true
    },

    // --- 💻 CAREER (Actually Expert) ---
    {
        "id": "teen-hacker",
        "title": "Teen Hacker",
        "description": "Started hacking at 11. Most kids played tag; you played with firewalls.",
        "icon": "💻",
        "category": "technical",
        "tags": ["programming", "origins"],
        "date": "2011",
        "unlocked": true
    },
    {
        "id": "app-tycoon",
        "title": "App Creator",
        "description": "Built an app with 10k+ users. This one actually scaled.",
        "icon": "📱",
        "category": "technical",
        "tags": ["startup", "coding"],
        "unlocked": true
    },
    {
        "id": "hackathon-champ",
        "title": "Hackathon Winner",
        "description": "Won 5 competitions. Confirmed skill.",
        "icon": "🏆",
        "category": "technical",
        "tags": ["competition", "coding"],
        "unlocked": true
    },
    {
        "id": "public-speaker",
        "title": "Keynote Speaker",
        "description": "Paid speaker & Valedictorian. You don't need slides, you are the visual aid.",
        "icon": "🎤",
        "category": "professional",
        "tags": ["speaking", "leadership"],
        "unlocked": true
    },

    // --- 🔒 QUEST LOG (Goals) ---
    {
        "id": "pilot-license",
        "title": "Private Pilot",
        "description": "Goal: Get PPL. Traffic jams are for peasants.",
        "icon": "👨‍✈️",
        "category": "skill",
        "tags": ["bucket-list", "aviation"],
        "unlocked": false
    },
    {
        "id": "ted-talker",
        "title": "TED Speaker",
        "description": "Goal: Speak at TED. The final boss of public speaking.",
        "icon": "🔴",
        "category": "professional",
        "tags": ["bucket-list", "speaking"],
        "unlocked": false
    },
    {
        "id": "whale-hunter",
        "title": "Leviathan Seeker",
        "description": "Goal: Dive with Humpback & Blue Whales.",
        "icon": "🐋",
        "category": "adventure",
        "tags": ["bucket-list", "diving"],
        "unlocked": false
    },
    {
        "id": "ironman-goal",
        "title": "Ironman",
        "description": "Goal: Complete an Ironman. The ultimate endurance flex.",
        "icon": "🏃",
        "category": "sports",
        "tags": ["bucket-list", "fitness"],
        "unlocked": false
    },
    {
        "id": "book-author",
        "title": "Author",
        "description": "Goal: Write a book. Documentation for your life.",
        "icon": "📖",
        "category": "professional",
        "tags": ["bucket-list", "writing"],
        "unlocked": false
    },
    {
        "id": "everest-base",
        "title": "Himalayan Hiker",
        "description": "Goal: Hike Everest Base Camp.",
        "icon": "🏔️",
        "category": "adventure",
        "tags": ["bucket-list", "hiking"],
        "unlocked": false
    },
    {
        "id": "aurora-hunter",
        "title": "Aurora Hunter",
        "description": "Goal: See Northern Lights.",
        "icon": "🌌",
        "category": "adventure",
        "tags": ["bucket-list", "travel"],
        "unlocked": false
    },
    {
        id: 'public-speaking-100',
        title: 'Give 100 Talks',
        description: 'Goal: 100 public talks',
        icon: '🎤',
        category: 'skill',
        tags: ['speaking', 'goal', 'community'],
        unlocked: false,
        image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
        caption: 'Goal: 100 public talks'
    },
    {
        "id": "sand-boarder",
        "title": "Desert Rider",
        "description": "Sandboarded on the Tottori Sand Dunes. Yes, Japan has a desert. Who knew?",
        "icon": "🐫",
        "category": "adventure",
        "tags": ["japan", "sand"],
        "date": "2023-04",
        "unlocked": true
    },
    {
        "id": "sardine-swimmer",
        "title": "School of Fish",
        "description": "Dived the Sardine Run in Cebu. Surrounded by millions of fish. Claustrophobia test: Passed.",
        "icon": "🐟",
        "category": "adventure",
        "tags": ["diving", "nature"],
        "date": "2023-04",
        "unlocked": true
    },
    {
        "id": "volcano-diver",
        "title": "Subaquatic Geologist",
        "description": "Dived an underwater volcano in Sabang. It was just bubbles and holes, but sounds cool on the resume.",
        "icon": "🌋",
        "category": "adventure",
        "tags": ["diving", "volcano"],
        "date": "2023-04",
        "unlocked": true
    },
    {
        "id": "night-diver",
        "title": "Night Diver",
        "description": "First night dive. Saw bioluminescence and ghost shrimps. The ocean is better in Dark Mode.",
        "icon": "🔦",
        "category": "adventure",
        "tags": ["diving", "night"],
        "date": "2023-05",
        "unlocked": true
    },
    {
        "id": "freedive-injury",
        "title": "Bloodshot",
        "description": "Popped blood vessels in eyes/nose to get the Freediving cert (15m). Looked like a zombie for 2 weeks.",
        "icon": "🩸",
        "category": "adventure",
        "tags": ["injury", "dedication"],
        "date": "2023-05",
        "unlocked": true
    },
    {
        "id": "airport-sleeper",
        "title": "Hobo Tourist",
        "description": "Slept in a Japanese airport and got lost in a village. Embraced the 'walk of shame' photography.",
        "icon": "🛄",
        "category": "travel",
        "tags": ["mishap", "resilience"],
        "date": "2023-04",
        "unlocked": true
    },

    // --- 🏋️ FITNESS & STATS (The "Rebuild Phase") ---
    {
        "id": "home-gym-hero",
        "title": "Home Gym Architect",
        "description": "Built a setup with rings and pull-up bars. Friction to exercise reduced to zero.",
        "icon": "🏠",
        "category": "fitness",
        "tags": ["calisthenics", "setup"],
        "unlocked": true
    },
    {
        "id": "bulking-success",
        "title": "Mass Gainer",
        "description": "Bulked from 50kg to 69kg (+19kg). Successfully grew out of your old shirts.",
        "icon": "🥩",
        "category": "fitness",
        "tags": ["weight-gain", "gym"],
        "date": "2023-12",
        "unlocked": true
    },
    {
        "id": "deadlift-pr-2023",
        "title": "Heavy Lifter",
        "description": "Hit 120kg Deadlift. Picked up two humans worth of weight.",
        "icon": "🏋️",
        "category": "fitness",
        "tags": ["pr", "strength"],
        "date": "2023-12",
        "unlocked": true
    },
    {
        "id": "weighted-pullup-pr",
        "title": "Gravity Defier",
        "description": "Hit +35kg Weighted Pull-up. Lats are now wider than the door frame.",
        "icon": "🦇",
        "category": "fitness",
        "tags": ["pr", "calisthenics"],
        "date": "2023-12",
        "unlocked": true
    },
    {
        "id": "streak-runner",
        "title": "Goggins Mode",
        "description": "Ran 33 days in a row (min 1 mile). Mental toughness stat increased.",
        "icon": "👟",
        "category": "fitness",
        "tags": ["running", "discipline"],
        "date": "2023-12",
        "unlocked": true
    },

    // --- 📉 STRUGGLES & HABITS (The "Character Development") ---
    {
        "id": "medical-survivor",
        "title": "Flesh Wound",
        "description": "Hospitalized with an open wound for a month and lost my job. Learned gratitude the hard way.",
        "icon": "🩹",
        "category": "personal",
        "tags": ["health", "recovery"],
        "date": "2023-02",
        "unlocked": true
    },
    {
        "id": "brand-ambassador",
        "title": "Sponsored Creator",
        "description": "Secured 5 brand deals (Honor, TnG). You are now a walking billboard.",
        "icon": "💰",
        "category": "professional",
        "tags": ["monetization", "business"],
        "date": "2025",
        "unlocked": true
    },
    {
        "id": "media-personality-2025",
        "title": "Media Personality",
        "description": "The Media Quartet: TV (Bernama/TV1), Radio (Era.fm), Newspaper (Kosmo), & Podcast. Mom is proud.",
        "icon": "🎙️",
        "category": "fame",
        "tags": ["pr", "media"],
        "date": "2025",
        "unlocked": true
    },

    // --- 🎤 SPEAKING (The "Professional" Arc) ---
    {
        "id": "diplomatic-advisor",
        "title": "Diplomat Advisor",
        "description": "Taught AI to 100 diplomats at the Foreign Affairs Ministry. International relations stat +10.",
        "icon": "🤝",
        "category": "professional",
        "tags": ["speaking", "government"],
        "date": "2025-11",
        "unlocked": true
    },
    {
        "id": "expert-panelist",
        "title": "Expert Panelist",
        "description": "Appointed UTP Expert Panelist. You are officially 'The Expert' now.",
        "icon": "👨‍⚖️",
        "category": "professional",
        "tags": ["career", "leadership"],
        "date": "2025-10",
        "unlocked": true
    },
    {
        "id": "pro-speaker",
        "title": "Paid Speaker",
        "description": "Earned RM XK from speaking. No more 'exposure' payments.",
        "icon": "🗣️",
        "category": "professional",
        "tags": ["monetization", "speaking"],
        "unlocked": true
    },
    {
        "id": "judge-dredd",
        "title": "Hackathon Judge",
        "description": "Judged 10+ Hackathons. You determine the fate of junior devs.",
        "icon": "⚖️",
        "category": "technical",
        "tags": ["community", "leadership"],
        "unlocked": true
    },

    // --- 🏠 LIFE & LOOKS (The "Glow Up" Arc) ---
    {
        "id": "independent-resident",
        "title": "Head of Household",
        "description": "Moved out. Unlocked 'Pay Rent' and 'Buy Vacuum Cleaner' daily quests.",
        "icon": "🔑",
        "category": "personal",
        "tags": ["adulting", "lifestyle"],
        "date": "2025-04",
        "unlocked": true
    },
    // {
    //     "id": "player-two",
    //     "title": "Taken",
    //     "description": "Got a girlfriend. Successfully exited the single player campaign.",
    //     "icon": "❤️",
    //     "category": "personal",
    //     "tags": ["relationship", "social"],
    //     "unlocked": true
    // },
    // {
    //     "id": "fashion-icon",
    //     "title": "Style Icon",
    //     "description": "Clear skin, styled hair, Charisma stat maxed out.",
    //     "icon": "✨",
    //     "category": "personal",
    //     "tags": ["fashion", "glow-up"],
    //     "unlocked": true
    // },
    {
        "id": "credit-card-owner",
        "title": "Credit Owner",
        "description": "Got a credit card. With great power comes great interest rates.",
        "icon": "💳",
        "category": "personal",
        "tags": ["finance", "adulting"],
        "unlocked": true
    },
    {
        "id": "car-owner",
        "title": "Car Owner",
        "description": "Bought a car with my own money. Level up: Independent adult.",
        "icon": "🚗",
        "category": "personal",
        "tags": ["finance", "adulting", "milestone"],
        "unlocked": true
    },
    {
        "id": "income-10k",
        "title": "Six-Figure Earner",
        "description": "Made $10k/month ($120k/year). Officially left the ramen budget tier.",
        "icon": "💰",
        "category": "professional",
        "tags": ["wealth", "income", "milestone"],
        "unlocked": true
    },
    {
        "id": "multitasker",
        "title": "Corporate Juggler",
        "description": "Worked 2-3 remote jobs at once. Peak efficiency or peak chaos? Yes.",
        "icon": "🤹",
        "category": "professional",
        "tags": ["remote", "hustle", "multitasking"],
        "unlocked": true
    },

    // --- 🧪 EXPERIENCES (The "2025 Side Quests") ---
    {
        "id": "flyboarder",
        "title": "Flyboarder",
        "description": "Hovered on water jets. Basically Iron Man on a budget.",
        "icon": "🌊",
        "category": "adventure",
        "tags": ["water", "tech"],
        "date": "2025-01",
        "unlocked": true
    },
    {
        "id": "cave-explorer-2025",
        "title": "Spelunker",
        "description": "Went caving. Darkness is your old friend.",
        "icon": "🦇",
        "category": "adventure",
        "tags": ["nature", "exploration"],
        "date": "2025-11",
        "unlocked": true
    },
    {
        "id": "rug-maker",
        "title": "Tufter",
        "description": "Went to a tufting workshop. Made a rug. It really ties the room together.",
        "icon": "🧶",
        "category": "creative",
        "tags": ["craft", "art"],
        "date": "2025-01",
        "unlocked": true
    },
    {
        "id": "leather-crafter",
        "title": "Leather Worker",
        "description": "Leather workshop. Crafted gear with +1 Durability.",
        "icon": "👜",
        "category": "creative",
        "tags": ["craft", "art"],
        "date": "2025-04",
        "unlocked": true
    },

    // --- 🔒 QUEST LOG (2026 Goals) ---
    {
        "id": "us-visa-quest",
        "title": "American Dreamer",
        "description": "Quest: Get into the US (O1/Visa/Residency). The final frontier.",
        "icon": "🗽",
        "category": "career",
        "tags": ["2026", "travel"],
        "unlocked": false
    },
    {
        "id": "mrr-10k-quest",
        "title": "Ramen Profitable",
        "description": "Quest: Hit $10K MRR. Sustainable indie hacking.",
        "icon": "🍜",
        "category": "business",
        "tags": ["2026", "startup"],
        "unlocked": false
    },
    {
        "id": "fellowship-winner",
        "title": "Grant Winner",
        "description": "Quest: Win 2 Grants/Awards/Fellowships.",
        "icon": "📜",
        "category": "career",
        "tags": ["2026", "recognition"],
        "unlocked": false
    },
    {
        "id": "daily-blogger",
        "title": "Daily Logger",
        "description": "Quest: Daily blog & journal. Data entry for your own life.",
        "icon": "📝",
        "category": "habits",
        "tags": ["2026", "writing"],
        "unlocked": false
    },
    {
        "id": "influencer-100k",
        "title": "Cult Leader (100k)",
        "description": "Quest: Reach 100k Followers. Verified status pending.",
        "icon": "🌟",
        "category": "social",
        "tags": ["2026", "growth"],
        "unlocked": false
    },
    // --- 🏋️ STRENGTH & POWER (The 2024 Gains) ---
    {
        "id": "deadlift-150",
        "title": "Deadlift Specialist",
        "description": "Pulled 150kg. You can literally pick up two average humans at once.",
        "icon": "🦍",
        "category": "fitness",
        "tags": ["strength", "pr"],
        "date": "2024",
        "unlocked": true
    },
    {
        "id": "bench-100",
        "title": "The 100kg Club",
        "description": "Benced 100kg (2 plates). International Chest Day champion.",
        "icon": "💪",
        "category": "fitness",
        "tags": ["strength", "pr"],
        "date": "2024",
        "unlocked": true
    },
    {
        "id": "ohp-60",
        "title": "Shoulder Presser",
        "description": "Overhead Pressed 60kg. Putting heavy objects on the top shelf is now trivial.",
        "icon": "🏋️‍♂️",
        "category": "fitness",
        "tags": ["strength", "pr"],
        "date": "2024",
        "unlocked": true
    },
    {
        "id": "weighted-pullup-40",
        "title": "Gravity Defier",
        "description": "Did a +40kg Weighted Pull-up. Your lats are legally considered wings.",
        "icon": "🦇",
        "category": "fitness",
        "tags": ["calisthenics", "strength"],
        "date": "2024",
        "unlocked": true
    },
    {
        "id": "hspu-freestanding",
        "title": "Handstand Pusher",
        "description": "3x Freestanding Handstand Push-ups. The world is your gym, even upside down.",
        "icon": "🤸",
        "category": "fitness",
        "tags": ["calisthenics", "skill"],
        "date": "2024",
        "unlocked": true
    },

    // --- 🏃 ENDURANCE ---
    {
        "id": "century-runner",
        "title": "Century Runner",
        "description": "Ran 100 days in a year. Triple digit consistency.",
        "icon": "💯",
        "category": "fitness",
        "tags": ["running", "cardio"],
        "progress": "100/366",
        "date": "2024",
        "unlocked": true
    },

    // --- 🔒 MORE QUEST LOG (Future Goals) ---
    {
        "id": "forbes-30u30",
        "title": "Forbes 30u30",
        "description": "Goal: Make the Forbes 30 Under 30 list. Official validation of overachieving.",
        "icon": "📰",
        "category": "professional",
        "tags": ["bucket-list", "recognition", "prestige"],
        "unlocked": false
    },
    {
        "id": "top-university",
        "title": "Elite Institution",
        "description": "Goal: Get into MIT/Stanford/Harvard/Oxbridge. Join the Ivy League brain trust.",
        "icon": "🎓",
        "category": "academic",
        "tags": ["bucket-list", "education", "prestige"],
        "unlocked": false
    },
    {
        "id": "angel-investor",
        "title": "Angel Investor",
        "description": "Goal: Become an Angel Investor. Fund the next generation of crazy ideas.",
        "icon": "👼",
        "category": "professional",
        "tags": ["bucket-list", "wealth", "startup"],
        "unlocked": false
    },
    {
        "id": "ultra-marathon",
        "title": "Ultra Marathoner",
        "description": "Goal: Complete an Ultra Marathon. Because a regular marathon wasn't masochistic enough.",
        "icon": "🦵",
        "category": "fitness",
        "tags": ["bucket-list", "running", "endurance"],
        "unlocked": false
    },
    {
        "id": "run-100km",
        "title": "Centurion Runner",
        "description": "Goal: Run 100km in one go. The ultimate test of 'am I still sane?'",
        "icon": "🏃",
        "category": "fitness",
        "tags": ["bucket-list", "running", "endurance"],
        "unlocked": false
    },
    {
        "id": "youtuber",
        "title": "YouTuber",
        "description": "Goal: Become a YouTuber. Professional internet personality with a Subscribe button.",
        "icon": "🎥",
        "category": "community",
        "tags": ["bucket-list", "content", "video"],
        "unlocked": false
    },
    {
        "id": "divemaster",
        "title": "Divemaster",
        "description": "Goal: Get Divemaster License. Upgrade from 'knows how to dive' to 'professional fish person'.",
        "icon": "🤿",
        "category": "adventure",
        "tags": ["bucket-list", "diving", "certification"],
        "unlocked": false
    },
    {
        "id": "movie-actor",
        "title": "Screen Actor",
        "description": "Goal: Act in a Movie. IMDB credits incoming.",
        "icon": "🎬",
        "category": "skill",
        "tags": ["bucket-list", "acting", "fame"],
        "unlocked": false
    }
];

export const metrics: Metric[] = [
    {
        id: 'papers-published',
        label: 'Research Papers',
        value: 1,
        unit: 'papers',
        tags: ['research', 'academic']
    },
    {
        id: 'talks-given',
        label: 'Public Talks',
        value: 20,
        unit: 'talks',
        tags: ['speaking', 'community']
    },
    {
        id: 'hackathons-won',
        label: 'Hackathons Won',
        value: 5,
        unit: 'wins',
        tags: ['hackathon', 'competition']
    },
    {
        id: 'hackathons-judged',
        label: 'Hackathons Judged',
        value: 10,
        unit: 'events',
        tags: ['hackathon', 'mentorship']
    },
    {
        id: 'companies-founded',
        label: 'Companies Founded',
        value: 2,
        unit: 'companies',
        tags: ['entrepreneurship']
    },
    {
        id: 'users-impacted',
        label: 'Users Impacted',
        value: 100000,
        unit: 'users',
        tags: ['impact']
    },
    {
        id: 'social-followers',
        label: 'Social Media Followers',
        value: 16000,
        unit: 'followers',
        tags: ['content', 'social-media']
    },
    {
        id: 'content-views',
        label: 'Content Views',
        value: 5000000,
        unit: 'views',
        tags: ['content', 'social-media']
    }
];
