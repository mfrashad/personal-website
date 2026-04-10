export type SkillTag = 'Creative' | 'Adventurous' | 'Physical' | 'Sport' | 'Intellectual' | 'Social';
export type SkillXp = 'explored' | 'beginner' | 'hobbyist' | 'passionate';

export interface Skill {
    id: string;
    title: string;
    icon: string;
    tags: SkillTag[];
    parentId?: string;
    duration?: number;
    xp?: SkillXp;
    amount?: number;
    image?: string;
    url?: string;
    description?: string;
    hidden?: boolean;
}

export const skills: Skill[] = [
    // ═══════════════════════════════════════
    // TECH
    // ═══════════════════════════════════════
    {
        id: 'coding',
        title: 'Coding',
        icon: '💻',
        tags: ['Intellectual'],
        duration: 300000,
        xp: 'passionate',
        image: '/skill-images/coding.webp',
        description: 'Built apps, games, AI products, and startups.',
    },



    {
        id: 'ai',
        title: 'AI / Machine Learning',
        icon: '🤖',
        tags: ['Intellectual'],
        parentId: 'coding',
        xp: 'passionate',
        image: '/skill-images/ai.webp',
        description: 'Published MIT research paper at 19. Founded AI consulting company. Built AI startup.',
    },


    {
        id: 'app-dev',
        title: 'App Development',
        icon: '📱',
        tags: ['Intellectual'],
        parentId: 'coding',
        xp: 'passionate',
        image: '/skill-images/app-dev.webp',
        description: 'Published mobile game at 16. Built apps used by 100k+ ppl.',
    },

    {
        id: 'robotics',
        title: 'Robotics / Electronics',
        icon: '🔌',
        tags: ['Intellectual'],
        parentId: 'coding',
        xp: 'beginner',
        image: '/skill-images/robotics.webp',
        description: 'Reperesented uni, Top 16 in robocon. Made my own smart glasses.',
    },


    {
        id: 'hacking',
        title: 'Hacking',
        icon: '🔓',
        tags: ['Intellectual'],
        parentId: 'coding',
        xp: 'hobbyist',
        image: '/skill-images/hacking.webp',
        description: 'WiFi hacking, CTFs, cracking software, social engineering. Mass hacked my classmates FB account when I was 11.',
    },


    // ═══════════════════════════════════════
    // READING
    // ═══════════════════════════════════════
    {
        id: 'reading',
        title: 'Reading',
        icon: '📚',
        tags: ['Intellectual'],
        duration: 240000,
        xp: 'passionate',
        image: '/skill-images/reading.webp',
        url: '/books',
        description: 'Reading almost daily since 14. 100+ books, 200+ webnovels, estimated 40M words / 100k-200k pages.',
    },


    {
        id: 'webnovels',
        title: 'Web Novels',
        icon: '📜',
        tags: ['Intellectual'],
        parentId: 'reading',
        xp: 'passionate',
        amount: 200,
        description: 'Est. 20,000 chapters. Korean 40%, Chinese 30%, Western 20%, Japanese 10%. Sources: novelupdates, royalroad.',
        hidden: true,
    },

    {
        id: 'published-books',
        title: 'Published Books',
        icon: '📖',
        tags: ['Intellectual'],
        parentId: 'reading',
        xp: 'hobbyist',
        amount: 100,
        description: '70+ finished, 30 DNF. Est. 30k pages. Sources: Kindle, uni library.',
        hidden: true,
    },


    // ═══════════════════════════════════════
    // FITNESS & SPORTS
    // ═══════════════════════════════════════
    {
        id: 'working-out',
        title: 'Working Out',
        icon: '🏋️',
        tags: ['Physical'],
        duration: 126000,
        xp: 'hobbyist',
        image: '/skill-images/working-out.webp',
        description: 'Started at 15. Gained 20kg (50→69kg). 2+ years consistent training.',
    },




    {
        id: 'weightlifting',
        title: 'Weightlifting',
        icon: '🦍',
        tags: ['Physical'],
        parentId: 'working-out',
        xp: 'hobbyist',
        image: '/skill-images/weightlifting.webp',
        description: 'PRs: 150kg deadlift, 100kg bench, 60kg OHP.',
    },


    {
        id: 'calisthenics',
        title: 'Calisthenics',
        icon: '🤸',
        tags: ['Physical'],
        parentId: 'working-out',
        xp: 'hobbyist',
        image: '/skill-images/calisthenics.webp',
        description: 'Handstand, HSPU, one arm pushup, back lever, +40kg weighted pullup.',
    },

    {
        id: 'running',
        title: 'Running',
        icon: '🏃',
        tags: ['Physical'],
        duration: 2100,
        xp: 'hobbyist',
        amount: 100,
        image: '/skill-images/running.webp',
        description: '100+ runs. Best pace 5min/km (5K). Est. 300km total. 33-day run streak, 100 run days in 2024.',
    },



    {
        id: 'swimming',
        title: 'Swimming',
        icon: '🏊',
        tags: ['Physical'],
        xp: 'beginner',
        image: '/skill-images/swimming.webp',
    },


    // ═══════════════════════════════════════
    // COMBAT & MARTIAL ARTS
    // ═══════════════════════════════════════
    {
        id: 'fencing',
        title: 'Fencing',
        icon: '🤺',
        tags: ['Sport'],
        xp: 'explored',
        amount: 1,
        image: '/skill-images/fencing.webp',
        description: 'Tried one class.',
    },



    {
        id: 'gymnastics',
        title: 'Gymnastics',
        icon: '🤸‍♂️',
        tags: ['Physical', 'Sport'],
        xp: 'explored',
        amount: 1,
        image: '/skill-images/gymnastics.webp',
        description: 'Took 3-4 classes.',
    },




    // ═══════════════════════════════════════
    // WATER SPORTS
    // ═══════════════════════════════════════
    {
        id: 'diving',
        title: 'Diving',
        icon: '🤿',
        tags: ['Adventurous'],
        duration: 600,
        xp: 'hobbyist',
        amount: 25,
        image: '/skill-images/diving.webp',
        url: '/diving',
        description: 'PADI Rescue Diver certified. 25 dives. Night dives, sharks, whale sharks.',
        hidden: true,
    },




    {
        id: 'scuba-diving',
        title: 'Scuba Diving',
        icon: '🫧',
        tags: ['Adventurous'],
        parentId: 'diving',
        xp: 'hobbyist',
        image: '/skill-images/scuba-diving.webp',
        url: '/diving',
        description: 'Certified PADI Rescue Diver. 20+ dives, night diving, wreck diving, underwater volcano, sardine run.',
    },


    {
        id: 'freediving',
        title: 'Freediving',
        icon: '🤿',
        tags: ['Adventurous', 'Physical'],
        parentId: 'diving',
        xp: 'beginner',
        image: '/skill-images/freediving.webp',
        url: '/diving',
        description: 'Molchanovs Wave 1 Certification. Max Depth 15m.',
    },



    {
        id: 'surfing',
        title: 'Surfing',
        icon: '🏄',
        tags: ['Adventurous', 'Sport'],
        xp: 'explored',
        image: '/skill-images/surfing.webp',
        description: 'Surfed twice at Tioman and Cherating. Went to 3 days surf camp.',
    },


    {
        id: 'flowriding',
        title: 'Flowriding',
        icon: '🌊',
        tags: ['Adventurous', 'Sport'],
        parentId: 'surfing',
        xp: 'beginner',
        amount: 1,
        image: '/skill-images/flowriding.webp',
        description: 'Went 4-5 times.',
    },


    {
        id: 'wakesurfing',
        title: 'Wakesurfing',
        icon: '🚤',
        tags: ['Adventurous', 'Sport'],
        parentId: 'surfing',
        xp: 'explored',
        amount: 1,
        image: '/skill-images/wakesurfing.webp',
        description: 'Tried once in Thailand',
    },


    {
        id: 'windsurfing',
        title: 'Windsurfing / Kite Surfing',
        icon: '🪁',
        tags: ['Adventurous', 'Sport'],
        parentId: 'surfing',
        xp: 'explored',
        amount: 1,
        image: '/skill-images/windsurfing.webp',
        description: 'Tried once at Cherating.',
    },

    {
        id: 'sup',
        title: 'Stand Up Paddle',
        icon: '🛶',
        tags: ['Adventurous'],
        xp: 'explored',
        amount: 1,
        image: '/skill-images/sup.webp',
        description: 'Tried one class.',
    },


    {
        id: 'flyboarding',
        title: 'Flyboarding',
        icon: '🚀',
        tags: ['Adventurous'],
        xp: 'explored',
        amount: 1,
        image: '/skill-images/flyboarding.webp',
        description: 'Tried once.',
    },


    {
        id: 'fishing',
        title: 'Fishing',
        icon: '🎣',
        tags: ['Social'],
        xp: 'explored',
        image: '/skill-images/fishing.webp',
        description: 'Tried once at shrimp indoor fishing.',
    },



    // ═══════════════════════════════════════
    // BOARD SPORTS
    // ═══════════════════════════════════════
    {
        id: 'skateboarding',
        title: 'Skateboarding',
        icon: '🛹',
        tags: ['Sport', 'Adventurous'],
        xp: 'beginner',
        image: '/skill-images/skateboarding.webp',
        description: 'Went 5-7 times. Mainly surfskated.',
    },


    {
        id: 'snowboarding',
        title: 'Snowboarding',
        icon: '🏂',
        tags: ['Adventurous', 'Sport'],
        xp: 'explored',
        image: '/skill-images/snowboarding.webp',
        description: 'Tried in Japan.',
    },

    {
        id: 'skiing',
        title: 'Skiing',
        icon: '⛷️',
        tags: ['Adventurous', 'Sport'],
        xp: 'explored',
        image: '/skill-images/skiing.webp',
        description: 'Tried in Japan.',
    },



    {
        id: 'sandboarding',
        title: 'Sandboarding',
        icon: '🏜️',
        tags: ['Adventurous'],
        xp: 'explored',
        amount: 1,
        image: '/skill-images/sandboarding.webp',
        description: 'Tottori Sand Dunes, Japan.',
    },

    {
        id: 'ice-skating',
        title: 'Ice Skating',
        icon: '⛸️',
        tags: ['Sport'],
        xp: 'explored',
        image: '/skill-images/ice-skating.webp',
        description: 'Tried 3-4 times.',
    },


    {
        id: 'roller-skating',
        title: 'Roller Skating',
        icon: '🛼',
        tags: ['Sport'],
        xp: 'explored',
        image: '/skill-images/roller-skating.webp',
        description: 'Tried 2-3 times.',
    },



    // ═══════════════════════════════════════
    // EXTREME / ADRENALINE
    // ═══════════════════════════════════════
    {
        id: 'skydiving',
        title: 'Skydiving',
        icon: '🪂',
        tags: ['Adventurous'],
        xp: 'explored',
        image: '/skill-images/skydiving.webp',
        description: 'Tried once in Thailand',
    },


    {
        id: 'skydiving-indoor',
        title: 'Indoor Skydiving',
        icon: '💨',
        tags: ['Adventurous'],
        parentId: 'skydiving',
        xp: 'explored',
        amount: 1,
        image: '/skill-images/skydiving-indoor.webp',
        description: 'Tried once.',
    },


    {
        id: 'slacklining',
        title: 'Slacklining',
        icon: '🤹',
        tags: ['Physical', 'Adventurous'],
        xp: 'explored',
        image: '/skill-images/slacklining.webp',
    },

    {
        id: 'obstacle-course',
        title: 'Obstacle Course',
        icon: '🏗️',
        tags: ['Physical', 'Adventurous'],
        xp: 'explored',
        image: '/skill-images/obstacle-course.webp',
        description: 'Took a class once',
    },


    {
        id: 'acroyoga',
        title: 'Acroyoga',
        icon: '🧘',
        tags: ['Physical', 'Social'],
        xp: 'explored',
        image: '/skill-images/acroyoga.webp',
        description: 'Took a class 2-3 times.',
    },


    {
        id: 'paintball',
        title: 'Paintball',
        icon: '🔫',
        tags: ['Social', 'Adventurous'],
        xp: 'explored',
        image: '/skill-images/paintball.webp',
        description: 'Tried once with strangers.',
    },



    // ═══════════════════════════════════════
    // CLIMBING
    // ═══════════════════════════════════════
    {
        id: 'climbing',
        title: 'Climbing',
        icon: '🧗',
        tags: ['Physical', 'Adventurous'],
        duration: 1200,
        xp: 'hobbyist',
        image: '/skill-images/climbing.webp',
        description: 'Indoor 20+ sessions (bouldering 15, top rope 5). 1 outdoor. 8 gyms. Level ~V4/V5/6a.',
    },


    {
        id: 'bouldering',
        title: 'Bouldering',
        icon: '🪨',
        tags: ['Physical', 'Adventurous'],
        parentId: 'climbing',
        xp: 'beginner',
        amount: 15,
        image: '/skill-images/bouldering.webp',
    },



    {
        id: 'top-rope',
        title: 'Top Rope',
        icon: '🧗‍♂️',
        tags: ['Physical', 'Adventurous'],
        parentId: 'climbing',
        xp: 'beginner',
        amount: 5,
        image: '/skill-images/top-rope.webp',
    },




    // ═══════════════════════════════════════
    // HIKING & TRAVEL
    // ═══════════════════════════════════════
    {
        id: 'hiking',
        title: 'Hiking',
        icon: '🥾',
        tags: ['Adventurous', 'Physical'],
        xp: 'beginner',
        image: '/skill-images/hiking.webp',
        description: 'Hiked Rinjani, Bromo, Padar Island, Sylvia hill.',
    },

    {
        id: 'travel',
        title: 'Travel',
        icon: '✈️',
        tags: ['Adventurous', 'Social'],
        xp: 'hobbyist',
        image: '/skill-images/travel.webp',
        description: 'Thailand, Japan, Philippines, Singapore, Indonesia, Malaysia.',
    },


    // ═══════════════════════════════════════
    // ARTS & CRAFTS
    // ═══════════════════════════════════════
    {
        id: 'arts',
        title: 'Arts & Crafts',
        icon: '🎨',
        tags: ['Creative'],
        xp: 'beginner',
        url: '/create',
        description: 'Workshop tourist. Tried 15+ different crafts.',
    },
    {
        id: 'acrylic-painting',
        title: 'Acrylic Painting',
        icon: '🖌️',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/acrylic-painting.webp',
        description: 'Went to 3 class. Painted 4 acrylic paintings.',
    },


    {
        id: 'stained-glass',
        title: 'Stained Glass Painting',
        icon: '🪟',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/stained-glass.webp',
        description: 'Took a class.',
    },



    {
        id: 'resin-craft',
        title: 'Resin Craft',
        icon: '💎',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/resin-craft.webp',
        description: 'Took a resin earring workshop once.',
    },


    {
        id: 'jewelry-making',
        title: 'Jewelry Making',
        icon: '💍',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/jewelry-making.webp',
        description: 'Made earring from resin. ',
    },


    {
        id: 'tie-dye',
        title: 'Tie-dye',
        icon: '👕',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/tie-dye.webp',
        description: 'Did it once during childhood, and took a workshop when i was adult.',
    },


    {
        id: 'face-painting',
        title: 'Face Painting',
        icon: '🎭',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/face-painting.webp',
        description: 'Took a workshop during halloween.',
    },


    {
        id: 'pottery',
        title: 'Pottery',
        icon: '🏺',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/pottery.webp',
        description: 'Took a class. Made 2 cups.',
    },


    {
        id: 'vr-sculpting',
        title: 'VR Sculpting',
        icon: '🥽',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/vr-sculpting.webp',
        description: 'Tried a few times.',
    },


    {
        id: 'graffiti',
        title: 'Graffiti',
        icon: '🎨',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/graffiti.webp',
        description: 'Tried graffiti in VR.',
    },


    {
        id: '3d-art',
        title: '3D Art',
        icon: '🖥️',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/3d-art.webp',
        description: 'Spend a few days learning blender. Made the donut and this tutorial.',
    },



    {
        id: 'pixel-art',
        title: 'Pixel Art',
        icon: '👾',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'beginner',
        image: '/skill-images/pixel-art.webp',
        description: 'Tried animating and making my own pixel art.',
    },


    {
        id: 'crochet',
        title: 'Crochet',
        icon: '🧶',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/crochet.webp',
        description: 'Tried but kinda failed.',
    },

    {
        id: 'cotton-candy',
        title: 'Cotton Candy Making',
        icon: '🍭',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/cotton-candy.webp',
        description: 'Tried once at GMBB.',
    },


    {
        id: 'tufting',
        title: 'Tufting',
        icon: '🧵',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/tufting.webp',
        description: 'Took a class once. Made a Cleve rug.',
    },


    {
        id: 'glassblowing',
        title: 'Glassblowing',
        icon: '🔥',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/glassblowing.webp',
        description: 'Tried once in Japan. Made a cup and a glass shuriken.',
    },


    {
        id: 'terrarium',
        title: 'Terrarium Making',
        icon: '🌿',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/terrarium.webp',
        description: 'Took a workshop.',
    },



    {
        id: 'welding',
        title: 'Welding',
        icon: '👨‍🏭',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        description: 'Took a class once in uni as mechanical engineering student.',
    },

    {
        id: 'leather-craft',
        title: 'Leather Craft',
        icon: '👜',
        tags: ['Creative'],
        parentId: 'arts',
        xp: 'explored',
        image: '/skill-images/leather-craft.webp',
        description: 'Took a workshop once, made leather key chain/strap.',
    },



    // ═══════════════════════════════════════
    // DANCING
    // ═══════════════════════════════════════
    {
        id: 'dancing',
        title: 'Dancing',
        icon: '💃',
        tags: ['Physical', 'Social', 'Creative'],
        xp: 'beginner',
        description: 'Tried 15+ styles. Took intro classes for each.',
    },

    {
        id: 'contemporary',
        title: 'Contemporary',
        icon: '💃',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'hip-hop',
        title: 'Hip-hop',
        icon: '🕺',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'kpop-dance',
        title: 'K-pop',
        icon: '🇰🇷',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'lyrical',
        title: 'Lyrical',
        icon: '🎶',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'street-jazz',
        title: 'Street Jazz',
        icon: '🎷',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'breakdance',
        title: 'Break Dance',
        icon: '🤸',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'west-coast-swing',
        title: 'West Coast Swing',
        icon: '🕺',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'brazilian-zouk',
        title: 'Brazilian Zouk',
        icon: '💃',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'salsa',
        title: 'Salsa',
        icon: '💃',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'bachata',
        title: 'Bachata',
        icon: '💃',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'kizomba',
        title: 'Kizomba',
        icon: '💃',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'urbankiz',
        title: 'UrbanKiz',
        icon: '🕺',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'blues-dance',
        title: 'Blues',
        icon: '🎵',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'tango',
        title: 'Tango',
        icon: '🌹',
        tags: ['Physical', 'Social'],
        parentId: 'dancing',
        hidden: true,
        xp: 'explored',
    },
    {
        id: 'pole-dance',
        title: 'Pole',
        icon: '🩰',
        tags: ['Physical', 'Creative'],
        parentId: 'dancing',
        xp: 'explored',
        image: '/skill-images/pole-dance.webp',
        description: 'Took a calisthenic pole dancing class for men once.',
        hidden: true,
    },



    // ═══════════════════════════════════════
    // MUSIC
    // ═══════════════════════════════════════
    {
        id: 'music',
        title: 'Music',
        icon: '🎵',
        tags: ['Creative'],
        xp: 'beginner',
        description: 'Can play 1-3 songs on guitar/piano. Made music and DJed.',
        hidden: true,
    },

    {
        id: 'guitar',
        title: 'Guitar',
        icon: '🎸',
        tags: ['Creative'],
        parentId: 'music',
        xp: 'beginner',
        image: '/skill-images/guitar.webp',
        description: 'Self taught the chords, learned couple songs in fingerstyle.',
    },



    {
        id: 'piano',
        title: 'Piano / Keyboard',
        icon: '🎹',
        tags: ['Creative'],
        parentId: 'music',
        xp: 'explored',
        image: '/skill-images/piano.webp',
        description: 'Can play 1-2 favorite songs.',
    },


    {
        id: 'music-production',
        title: 'Music Production',
        icon: '🎧',
        tags: ['Creative'],
        parentId: 'music',
        xp: 'explored',
        image: '/skill-images/music-production.webp',
        description: 'Tried making retro songs for game with bosca ceoil.',
    },



    {
        id: 'dj',
        title: 'DJing',
        icon: '🎛️',
        tags: ['Creative', 'Social'],
        parentId: 'music',
        xp: 'explored',
        image: '/skill-images/dj.webp',
        description: 'Was allowed and taught to DJ for 5 min.',
    },



    // ═══════════════════════════════════════
    // CREATIVE & MEDIA
    // ═══════════════════════════════════════
    {
        id: 'photography',
        title: 'Photography',
        icon: '📷',
        tags: ['Creative'],
        xp: 'beginner',
        image: '/skill-images/photography.webp',
        description: 'Bought a camera. Started shooting.',
    },

    {
        id: 'content-creation',
        title: 'Content Creation',
        icon: '📱',
        tags: ['Creative', 'Social'],
        duration: 18000,
        xp: 'hobbyist',
        amount: 100,
        image: '/skill-images/content-creation.webp',
        description: 'Est. 100 posts, 300 hours. 20K+ followers, 5M+ views.',
    },

    {
        id: 'writing',
        title: 'Writing',
        icon: '✍️',
        tags: ['Creative', 'Intellectual'],
        xp: 'hobbyist',
        image: '/skill-images/writing.webp',
        description: 'Blog, journalling, got paid writing.',
    },


    {
        id: 'blogging',
        title: 'Blogging',
        icon: '📝',
        tags: ['Creative', 'Intellectual'],
        parentId: 'writing',
        xp: 'hobbyist',
        description: 'Wrote 10+ AI blog, published at biggest data a science Medium publication, made 8k, blog led to MIT research paper.',
    },


    // ═══════════════════════════════════════
    // PERFORMANCE & SOCIAL
    // ═══════════════════════════════════════
    {
        id: 'public-speaking',
        title: 'Public Speaking',
        icon: '🎤',
        tags: ['Social'],
        xp: 'passionate',
        image: '/skill-images/public-speaking.webp',
        description: 'Valedictorian. 20+ talks. Paid speaker. Government, universities, conferences.',
    },

    {
        id: 'improv',
        title: 'Improv',
        icon: '🎭',
        tags: ['Social', 'Creative'],
        xp: 'explored',
        amount: 1,
        description: 'Took a class once.',
    },

    {
        id: 'cosplay',
        title: 'Cosplay',
        icon: '🦸',
        tags: ['Creative', 'Social'],
        xp: 'explored',
        image: '/skill-images/cosplay.webp',
        description: 'Tried cosplaying as V once and L once.',
    },


    {
        id: 'fashion',
        title: 'Tailoring / Fashion',
        icon: '🧵',
        tags: ['Creative'],
        xp: 'explored',
        image: '/skill-images/fashion.webp',
        description: 'Made my own tshirt. Took a 3-day fashion design class.',
    },



    // ═══════════════════════════════════════
    // COOKING
    // ═══════════════════════════════════════
    {
        id: 'cooking',
        title: 'Cooking',
        icon: '🍳',
        tags: ['Creative'],
        xp: 'beginner',
        image: '/skill-images/cooking.webp',
        description: 'Baking class, baked birthday cake, made pizza. Buttermilk chicken, meal prep, caramel pudding and more.',
    },




    // ═══════════════════════════════════════
    // GAMES & ENTERTAINMENT
    // ═══════════════════════════════════════
    {
        id: 'gaming',
        title: 'Gaming',
        icon: '🎮',
        tags: ['Intellectual'],
        xp: 'passionate',
        amount: 100,
        image: '/skill-images/gaming.webp',
        description: '100+ games played.',
    },

    {
        id: 'movies-anime',
        title: 'Movies & Anime',
        icon: '📺',
        tags: ['Intellectual'],
        duration: 120000,
        xp: 'passionate',
        image: '/skill-images/movies-anime.webp',
        url: '/movies',
        description: '200+ anime. KR/CN/JP drama, US shows, French, German, Spanish, Bollywood, Malay, Indo. Est. 2000 hours.',
    },

    {
        id: 'dnd',
        title: 'Dungeons & Dragons',
        icon: '🐉',
        tags: ['Social', 'Intellectual'],
        xp: 'explored',
        amount: 2,
        image: '/skill-images/dnd.webp',
        description: 'Tried twice with strangers meetup',
    },


    {
        id: 'escape-room',
        title: 'Escape Room',
        icon: '🔐',
        tags: ['Social'],
        xp: 'explored',
        amount: 3,
        image: '/skill-images/escape-room.webp',
        description: 'Tried 3 times',
    },



    // ═══════════════════════════════════════
    // OTHER SPORTS & ACTIVITIES
    // ═══════════════════════════════════════
    {
        id: 'tennis',
        title: 'Tennis',
        icon: '🎾',
        tags: ['Sport', 'Social'],
        xp: 'explored',
        description: 'Took a class once.',
    },

    {
        id: 'golf',
        title: 'Golf',
        icon: '⛳',
        tags: ['Sport', 'Social'],
        xp: 'explored',
        image: '/skill-images/golf.webp',
        description: 'Went to range twice.',
    },


    {
        id: 'bowling',
        title: 'Bowling',
        icon: '🎳',
        tags: ['Sport', 'Social'],
        xp: 'explored',
        image: '/skill-images/bowling.webp',
        description: 'Tried 1-2 times.',
    },


    {
        id: 'shooting',
        title: 'Shooting',
        icon: '🔫',
        tags: ['Adventurous'],
        xp: 'explored',
        image: '/skill-images/shooting.webp',
        description: 'Went to gun range in Thailand',
    },



    {
        id: 'lockpicking',
        title: 'Lockpicking',
        icon: '🔓',
        tags: ['Intellectual'],
        xp: 'explored',
        image: '/skill-images/lockpicking.webp',
        description: 'Bought a training lockpick online and tried learning it for a while.',
    },



    // ═══════════════════════════════════════
    // LIFESTYLE
    // ═══════════════════════════════════════
    {
        id: 'cafe-hopping',
        title: 'Cafe-hopping',
        icon: '☕',
        tags: ['Social'],
        xp: 'beginner',
        amount: 20,
        image: '/skill-images/cafe-hopping.webp',
        description: '20+ documented cafe hops.',
    },

    {
        id: 'flying',
        title: 'Flying',
        icon: '✈️',
        tags: ['Adventurous'],
        duration: 30,
        xp: 'explored',
        amount: 1,
        image: '/skill-images/flying.webp',
        description: 'Co-piloted a small airplane around KL as part of a one day pilot program. Cool experience.',
    },



    {
        id: 'baking',
        title: 'Baking',
        icon: '🎂',
        tags: ['Creative'],
        parentId: 'cooking',
        duration: 180,
        xp: 'beginner',
        amount: 6,
        image: '/skill-images/baking.webp',
        description: 'Went to baking class twice, made caramel pudding 4+ times, went to cake festival, made cookies, made pizza',
    },


    {
        id: 'pizza-making',
        title: 'Pizza Making',
        icon: '🍕',
        tags: [],
        parentId: 'cooking',
        duration: 60,
        xp: 'explored',
        amount: 1,
        image: '/skill-images/pizza-making.webp',
        description: 'Went to pizza making class once',
    },

    {
        id: 'perfume-making',
        title: 'Perfume Making',
        icon: '🥣',
        tags: ['Creative'],
        parentId: 'arts',
        amount: 1,
        image: '/skill-images/perfume-making.webp',
        description: 'Took a workshop once.',
    },


    {
        id: 'chess',
        title: 'Chess',
        icon: '♟️',
        tags: ['Intellectual'],
        xp: 'hobbyist',
        image: '/skill-images/chess.webp',
        description: 'Represented school few times. Won varsity chess between unis in the country.',
    },


    {
        id: 'martial-arts',
        title: 'Martial Arts',
        icon: '🥋',
        tags: ['Physical', 'Sport'],
        xp: 'beginner',
        description: 'Took Silat for a semester, tried BJJ, Taekwondo, Muay Thai, Boxing for a class.',
    },
    {
        id: 'caving',
        title: 'Caving',
        icon: '🔦',
        tags: ['Adventurous', 'Physical'],
        xp: 'explored',
        image: '/skill-images/caving.webp',
        description: 'Went caving once. Had to swim, climb, and crawl in the cave.',
    },

    {
        id: 'activism',
        title: 'Activism',
        icon: '🚫',
        tags: ['Social'],
        xp: 'explored',
        image: '/skill-images/activism.webp',
        description: 'Went to demonstration. Made content about social issues sometimes.',
    },


    {
        id: 'rafting',
        title: 'Whitewater Rafting',
        icon: '🚣',
        tags: ['Adventurous', 'Physical'],
        xp: 'explored',
        image: '/skill-images/rafting.webp',
        description: 'Went rafting once.',
    },

];
