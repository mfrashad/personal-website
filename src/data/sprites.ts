export interface SpriteConfig {
  id: string;
  src: string;
  frameCount: number;
  frameDurationMs: number;
  frameWidth: number;
  frameHeight: number;
  label: string;
  messages: string[];
}

export type AnchorPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

export interface SpritePlacement {
  spriteId: string;
  anchor: AnchorPosition;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  flipX?: boolean;
  zIndex?: number;
  hideOnMobile?: boolean;
}

export const SPRITES: Record<string, SpriteConfig> = {
  idle_standing: {
    id: 'idle_standing',
    src: '/sprites/idle_standing_2f_800ms_sprite_114x159.webp',
    frameCount: 2,
    frameDurationMs: 800,
    frameWidth: 114,
    frameHeight: 159,
    label: 'Rashad standing idle',
    messages: ['Hey!', "What's up?", 'Ouch!', 'Stop poking me.', "That's me!", '...really?'],
  },
  waving_hello: {
    id: 'waving_hello',
    src: '/sprites/waving_hello_3f_400ms_sprite_108x139.webp',
    frameCount: 3,
    frameDurationMs: 400,
    frameWidth: 108,
    frameHeight: 139,
    label: 'Rashad waving hello',
    messages: ['Welcome!', 'Hey there!', 'Ouch!', "Don't hit me!", 'Hey, stop that!', 'Rude.', 'Why tho?', 'Bro.', "I'll tell Rashad."],
  },
  reading_a_book: {
    id: 'reading_a_book',
    src: '/sprites/reading_a_book__holding_book__3f_400ms_sprite_99x144.webp',
    frameCount: 3,
    frameDurationMs: 400,
    frameWidth: 99,
    frameHeight: 144,
    label: 'Rashad reading a book',
    messages: ['Shh, reading.', "I'm busy.", 'Be quiet!', 'Good chapter...', 'One more page...', 'Lost the page!', "Can you not?"],
  },
  coding_at_computer: {
    id: 'coding_at_computer',
    src: '/sprites/coding__at_computer_with_monitor__2f_800ms_sprite_154x162.webp',
    frameCount: 2,
    frameDurationMs: 800,
    frameWidth: 154,
    frameHeight: 162,
    label: 'Rashad coding at a computer',
    messages: ['In the zone!', "Don't break my flow!", 'Ship it!', 'One more commit...', 'It works! Wait...', 'Not now.', 'git push --force'],
  },
  content_creating: {
    id: 'content_creating',
    src: '/sprites/content_creating__with_tripod_and_camera_2f_800ms_sprite_154x165.webp',
    frameCount: 2,
    frameDurationMs: 800,
    frameWidth: 154,
    frameHeight: 165,
    label: 'Rashad creating content with a camera',
    messages: ['Smile!', 'Like & subscribe!', 'Rolling!', 'One more take.', "That's a wrap!", "You're in the shot!", 'Not cool.'],
  },
  drinking_coffee: {
    id: 'drinking_coffee',
    src: '/sprites/drinking_coffee__standing_with_mug__3f_400ms_sprite_97x140.webp',
    frameCount: 3,
    frameDurationMs: 400,
    frameWidth: 97,
    frameHeight: 140,
    label: 'Rashad drinking coffee',
    messages: ['Need more coffee.', 'Ahh, caffeine.', "Don't talk to me yet.", '*sip*', 'Coffee break!', 'Excuse me??', '*sigh*'],
  },
  watching_movies: {
    id: 'watching_movies',
    src: '/sprites/watching_movies__sitting_on_couch__3f_400ms_sprite_135x131.webp',
    frameCount: 3,
    frameDurationMs: 400,
    frameWidth: 135,
    frameHeight: 131,
    label: 'Rashad watching movies on a couch',
    messages: ['No spoilers!', "Shhh, it's starting.", 'Pass the popcorn.', 'One more episode...', 'Plot twist!', "You're blocking the screen.", 'Touch grass.'],
  },
  taking_photos: {
    id: 'taking_photos',
    src: '/sprites/taking_photos__holding_camera__2f_800ms_sprite_121x171.webp',
    frameCount: 2,
    frameDurationMs: 800,
    frameWidth: 121,
    frameHeight: 171,
    label: 'Rashad taking photos',
    messages: ['Say cheese!', 'Hold still!', 'Perfect shot!', 'One more!', 'Look this way!', "You broke my lens!", 'What was that for?'],
  },
};
