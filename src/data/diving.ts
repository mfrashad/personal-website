export type SizeCategory = 'mini' | 'small' | 'mid' | 'big' | 'giant';

export interface MarineAnimal {
  name: string;
  slug: string;
  size: SizeCategory;
}

export interface DiveSpot {
  name: string;
  note?: string;
}

export interface DiveLocation {
  country: string;
  flag: string;
  spots: DiveSpot[];
}

export interface DiveAccomplishment {
  label: string;
  detail?: string;
  category: 'certification' | 'experience' | 'record';
}

export interface WishlistItem {
  target: string;
  location: string;
}

export const sizeConfig: Record<SizeCategory, { px: number; label: string }> = {
  mini:  { px: 48,  label: 'Mini' },
  small: { px: 72,  label: 'Small' },
  mid:   { px: 100, label: 'Mid' },
  big:   { px: 150, label: 'Big' },
  giant: { px: 300, label: 'Giant' },
};

export const marineAnimals: MarineAnimal[] = [
  // Giant
  { name: 'Whale Shark',           slug: 'Whale_Shark',           size: 'giant' },
  { name: 'Manta Ray',             slug: 'Manta_Ray',             size: 'big' },
  { name: 'Sardine Bait Ball',     slug: 'Sardine_bait_ball',     size: 'giant' },
  // Big
  { name: 'Giant Clam',            slug: 'Giant_Clam',            size: 'big' },
  // Mid
  { name: 'Blacktip Reef Shark',   slug: 'Blacktip_Reef_Shark',   size: 'big' },
  { name: 'Whitetip Reef Shark',   slug: 'Whitetip_Reef_Shark',   size: 'big' },
  { name: 'Moray Eel',             slug: 'Moray_eel',             size: 'mid' },
  { name: 'Sea Turtle',            slug: 'Sea_turtle',            size: 'mid' },
  { name: 'Barracudas',            slug: 'Barracudas',            size: 'mid' },
  { name: 'Octopus',               slug: 'Octopus',               size: 'mid' },
  { name: 'Cuttlefish',            slug: 'Cuttlefish',            size: 'mid' },
  { name: 'Crab',                  slug: 'Crab',                  size: 'mid' },
  { name: 'Parrotfish',            slug: 'Parrotfish',            size: 'mid' },
  { name: 'Triggerfish',           slug: 'Triggerfish',           size: 'mid' },
  { name: 'Blue Tang',             slug: 'Bluetang',              size: 'mid' },
  { name: 'Lionfish',              slug: 'Lionfish',              size: 'mid' },
  { name: 'Stonefish',             slug: 'Stonefish',             size: 'mid' },
  { name: 'Blue Spotted Stingray', slug: 'Blue_spotted_stingray', size: 'mid' },
  { name: 'Sea Cucumber',          slug: 'Sea_cucumber',          size: 'small' },
  // Small
  { name: 'Clownfish',             slug: 'Clownfish',             size: 'small' },
  { name: 'Angelfish',             slug: 'Angelfish',             size: 'small' },
  { name: 'Yellow Boxfish',        slug: 'Yellow_boxfish',        size: 'small' },
  { name: 'Pufferfish',            slug: 'Pufferfish',            size: 'small' },
  { name: 'Pipefish',              slug: 'Pipefish',              size: 'small' },
  { name: 'Sea Urchin',            slug: 'Sea_Urchin',            size: 'small' },
  // Mini
  { name: 'Nudibranch',            slug: 'Nudibranch',            size: 'mini' },
  { name: 'Ghost Shrimp',          slug: 'Ghost_shrimp',          size: 'mini' },
  { name: 'Polychaete Worm',       slug: 'Polychaete_worm',       size: 'mini' },
  { name: 'Jellyfish',             slug: 'Jellyfish',             size: 'mini' },
  { name: 'Sea Horse',             slug: 'Sea_horse',             size: 'mini' },
];

export const diveStats = {
  scubaDives: '20+',
  totalDives: '25+',
};

export const diveLocations: DiveLocation[] = [
  {
    country: 'Malaysia',
    flag: '\u{1F1F2}\u{1F1FE}',
    spots: [
      { name: 'Perhentian Island' },
      { name: 'Tenggol Island', note: 'free diving' },
      { name: 'Tioman Island' },
    ],
  },
  {
    country: 'Indonesia',
    flag: '\u{1F1EE}\u{1F1E9}',
    spots: [
      { name: 'Labuan Bajo', note: 'free diving' },
      { name: 'Sabang, Aceh' },
    ],
  },
  {
    country: 'Philippines',
    flag: '\u{1F1F5}\u{1F1ED}',
    spots: [{ name: 'Moalboal, Cebu' }],
  },
  {
    country: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    spots: [{ name: 'Pattaya' }],
  },
];

export const diveAccomplishments: DiveAccomplishment[] = [
  { label: 'PADI Rescue Diver',         category: 'certification' },
  { label: 'Molchanov Freediver Wave 1', category: 'certification' },
  { label: 'Underwater Volcano Dive',   category: 'experience' },
  { label: 'Night Dive',                category: 'experience' },
  { label: 'Wreck Dive',                category: 'experience' },
  { label: 'Deepest Dive',   detail: '30m',  category: 'record' },
  { label: 'Deepest Freedive', detail: '15m', category: 'record' },
];

export const divingWishlist: WishlistItem[] = [
  { target: 'Stingless Jellyfish', location: 'Kakaban Island' },
  { target: 'Raja Ampat',          location: 'Indonesia' },
  { target: 'Barracuda Vortex',    location: 'Sipadan / Semporna' },
  { target: 'Humpback Whale',      location: 'Tonga / Polynesia' },
  { target: 'Blue Whale',          location: 'Sri Lanka' },
  { target: 'Orca',                location: '' },
  { target: 'Tiger Shark',         location: '' },
  { target: 'Great White Shark / Bull Shark', location: '' },
  { target: 'Hammerhead Shark',    location: '' },
  { target: 'Belize Blue Hole',    location: 'Belize' },
  { target: 'Maldives',            location: 'Maldives' },
];
