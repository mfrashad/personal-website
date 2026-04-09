export type SizeCategory = 'mini' | 'small' | 'mid' | 'big' | 'giant';

export interface MarineAnimal {
  name: string;
  slug: string;
  size: SizeCategory;
  scientificName?: string;
  description?: string;
  funFact?: string;
  note?: string;
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
  {
    name: 'Whale Shark', slug: 'Whale_Shark', size: 'giant',
    scientificName: 'Rhincodon typus',
    description: 'The largest living fish species, reaching up to 12m long. Despite their size, they are gentle filter feeders that eat plankton and small fish.',
    funFact: 'Each whale shark has a unique pattern of spots, like a fingerprint.',
    note: 'Saw these gentle giants at Oslob, Moalboal in the Philippines. Absolutely surreal swimming next to something that massive.',
  },
  {
    name: 'Manta Ray', slug: 'Manta_Ray', size: 'big',
    scientificName: 'Mobula birostris',
    description: 'Graceful ocean giants with wingspans up to 7m. They are highly intelligent and have the largest brain-to-body ratio of any fish.',
    funFact: 'Mantas can recognize themselves in mirrors — one of the few animals that can.',
    note: 'Encountered while freediving at Labuan Bajo, Indonesia. Watching them glide effortlessly through the water was magical.',
  },
  {
    name: 'Sardine Bait Ball', slug: 'Sardine_bait_ball', size: 'giant',
    scientificName: 'Sardina pilchardus',
    description: 'Thousands of sardines form a tight spherical formation as a defense mechanism against predators, creating a mesmerizing underwater spectacle.',
    funFact: 'A single bait ball can contain millions of fish moving in perfect synchronization.',
    note: 'Witnessed the famous sardine run at Moalboal, Cebu, Philippines. An endless tornado of silver right off the shore.',
  },
  // Big
  {
    name: 'Giant Clam', slug: 'Giant_Clam', size: 'big',
    scientificName: 'Tridacna gigas',
    description: 'The largest living bivalve mollusc, capable of reaching over 1m in length and weighing over 200kg. They can live for over 100 years.',
    funFact: 'Giant clams get their vibrant colors from symbiotic algae living in their tissue.',
  },
  {
    name: 'Blacktip Reef Shark', slug: 'Blacktip_Reef_Shark', size: 'big',
    scientificName: 'Carcharhinus melanopterus',
    description: 'Easily identified by the black tips on their fins. One of the most common sharks found on tropical coral reefs, usually growing to about 1.6m.',
    funFact: 'They are timid and rarely pose a threat to humans, often fleeing when approached.',
  },
  {
    name: 'Whitetip Reef Shark', slug: 'Whitetip_Reef_Shark', size: 'big',
    scientificName: 'Triaenodon obesus',
    description: 'A slender shark with distinctive white tips on dorsal and tail fins. They are nocturnal hunters and often rest in caves during the day.',
    funFact: 'Unlike most sharks, whitetip reef sharks can pump water over their gills while stationary.',
  },
  // Mid
  {
    name: 'Moray Eel', slug: 'Moray_eel', size: 'mid',
    scientificName: 'Muraenidae',
    description: 'Snake-like fish that hide in crevices with their mouths constantly opening and closing to breathe. There are about 200 species worldwide.',
    funFact: 'They have a second set of jaws (pharyngeal jaws) in their throat that spring forward to pull prey in.',
  },
  {
    name: 'Sea Turtle', slug: 'Sea_turtle', size: 'mid',
    scientificName: 'Cheloniidae',
    description: 'Ancient reptiles that have been swimming the oceans for over 100 million years. They can hold their breath for up to 5 hours while sleeping.',
    funFact: 'The temperature of the sand where eggs are laid determines whether hatchlings are male or female.',
  },
  {
    name: 'Barracudas', slug: 'Barracudas', size: 'mid',
    scientificName: 'Sphyraena',
    description: 'Sleek, torpedo-shaped predators known for their fearsome appearance and lightning-fast strikes. They can reach speeds of 58 km/h.',
    funFact: 'They are attracted to shiny objects, which they mistake for the flash of fish scales.',
  },
  {
    name: 'Octopus', slug: 'Octopus', size: 'mid',
    scientificName: 'Octopoda',
    description: 'Highly intelligent invertebrates with three hearts, blue blood, and eight arms lined with suckers. Masters of camouflage and escape.',
    funFact: 'They have been observed using coconut shells as portable shelters — a rare example of tool use in invertebrates.',
  },
  {
    name: 'Cuttlefish', slug: 'Cuttlefish', size: 'mid',
    scientificName: 'Sepiida',
    description: 'Often called the "chameleons of the sea," they can change color and texture in milliseconds. They have W-shaped pupils and green-blue blood.',
    funFact: 'They have one of the largest brain-to-body ratios of any invertebrate.',
  },
  {
    name: 'Crab', slug: 'Crab', size: 'mid',
    scientificName: 'Brachyura',
    description: 'Crustaceans with a thick exoskeleton and a pair of claws. Over 7,000 species exist, from tiny pea crabs to the massive Japanese spider crab.',
    funFact: 'Crabs walk sideways because of the way their legs bend — it\'s actually their most efficient form of movement.',
  },
  {
    name: 'Parrotfish', slug: 'Parrotfish', size: 'mid',
    scientificName: 'Scaridae',
    description: 'Colorful reef fish with fused teeth that form a beak-like structure. They bite and scrape algae off coral, playing a vital role in reef health.',
    funFact: 'They produce up to 90kg of sand per year by pooping out the coral they eat. Most tropical white sand beaches are parrotfish poop.',
  },
  {
    name: 'Triggerfish', slug: 'Triggerfish', size: 'mid',
    scientificName: 'Balistidae',
    description: 'Named for the spine on their dorsal fin that locks upright like a trigger. They are territorial and known to be aggressive, especially titan triggerfish.',
    funFact: 'When fleeing a triggerfish, swim horizontally — their territory is cone-shaped upward, not outward.',
  },
  {
    name: 'Blue Tang', slug: 'Bluetang', size: 'mid',
    scientificName: 'Paracanthurus hepatus',
    description: 'A vibrant blue surgeonfish with a yellow tail, famously known as "Dory" from Finding Nemo. They have a sharp spine near their tail for defense.',
    funFact: 'Young blue tangs are actually bright yellow and turn blue as they mature.',
  },
  {
    name: 'Lionfish', slug: 'Lionfish', size: 'mid',
    scientificName: 'Pterois',
    description: 'Strikingly beautiful but venomous fish with elaborate fan-like fins. Native to the Indo-Pacific, they are an invasive species in the Atlantic.',
    funFact: 'Their venomous spines are purely defensive — they hunt by cornering prey with their wide pectoral fins.',
  },
  {
    name: 'Stonefish', slug: 'Stonefish', size: 'mid',
    scientificName: 'Synanceia',
    description: 'The most venomous fish in the world. They are masters of disguise, looking exactly like rocks or coral on the ocean floor.',
    funFact: 'Their sting is excruciatingly painful and can be fatal. Hot water (45°C) helps break down the venom protein.',
  },
  {
    name: 'Blue Spotted Stingray', slug: 'Blue_spotted_stingray', size: 'mid',
    scientificName: 'Neotrygon kuhlii',
    description: 'A beautiful stingray with electric blue spots on its body. They are commonly found resting on sandy bottoms near coral reefs.',
    funFact: 'Unlike most rays, they rarely bury themselves in sand, preferring to rest in the open.',
  },
  {
    name: 'Electric Disco Clam', slug: 'Electric_Disco_Clam', size: 'mini',
    scientificName: 'Ctenoides ales',
    description: 'A small bivalve mollusc famous for its dazzling light display. The flashing is not bioluminescence — it reflects ambient light off silica nanospheres packed in its tissue.',
    funFact: 'It flashes at a rate of about twice per second, making it the fastest light display in the ocean. Scientists believe it may deter predators.',
  },
  {
    name: 'Sea Cucumber', slug: 'Sea_cucumber', size: 'small',
    scientificName: 'Holothuroidea',
    description: 'Sausage-shaped echinoderms that play a crucial role in ocean ecosystems by recycling nutrients on the sea floor.',
    funFact: 'When threatened, some species can expel their internal organs to distract predators, then regenerate them later.',
  },
  // Small
  {
    name: 'Clownfish', slug: 'Clownfish', size: 'small',
    scientificName: 'Amphiprioninae',
    description: 'Small, brightly colored fish famous for their symbiotic relationship with sea anemones. The mucus on their skin makes them immune to the anemone\'s sting.',
    funFact: 'All clownfish are born male. The dominant fish in a group becomes female — if she dies, the next dominant male changes sex.',
  },
  {
    name: 'Angelfish', slug: 'Angelfish', size: 'small',
    scientificName: 'Pomacanthidae',
    description: 'Colorful, disc-shaped reef fish with vibrant patterns. Juveniles often have completely different coloration from adults.',
    funFact: 'Some species can live up to 15 years and are known to make a thumping sound when threatened.',
  },
  {
    name: 'Yellow Boxfish', slug: 'Yellow_boxfish', size: 'small',
    scientificName: 'Ostracion cubicum',
    description: 'A cube-shaped fish covered in bright yellow with black spots when young. Their unique box shape is actually a highly efficient form for swimming.',
    funFact: 'Mercedes-Benz designed a concept car based on the boxfish\'s shape for its aerodynamic efficiency.',
  },
  {
    name: 'Pufferfish', slug: 'Pufferfish', size: 'small',
    scientificName: 'Tetraodontidae',
    description: 'Famous for inflating into a ball when threatened. Many species contain tetrodotoxin, one of the most potent toxins found in nature.',
    funFact: 'Male pufferfish create elaborate circular sand patterns on the ocean floor to attract mates — underwater crop circles.',
  },
  {
    name: 'Pipefish', slug: 'Pipefish', size: 'small',
    scientificName: 'Syngnathinae',
    description: 'Slender, elongated relatives of seahorses. They are masters of camouflage, often swaying with seagrass to blend in perfectly.',
    funFact: 'Like seahorses, it\'s the male pipefish that carries and gives birth to the young.',
  },
  {
    name: 'Sea Urchin', slug: 'Sea_Urchin', size: 'small',
    scientificName: 'Echinoidea',
    description: 'Spiny, globe-shaped echinoderms found on the ocean floor. Their spines provide protection and help with movement.',
    funFact: 'They have tiny tube feet among their spines and a mouth with five teeth on the underside called "Aristotle\'s lantern."',
  },
  // Mini
  {
    name: 'Nudibranch', slug: 'Nudibranch', size: 'mini',
    scientificName: 'Nudibranchia',
    description: 'Soft-bodied sea slugs known for their extraordinary colors and forms. Over 3,000 species exist in every color imaginable.',
    funFact: 'Some species can incorporate stinging cells from the jellyfish they eat into their own skin for defense.',
  },
  {
    name: 'Ghost Shrimp', slug: 'Ghost_shrimp', size: 'mini',
    scientificName: 'Palaemonetes',
    description: 'Nearly transparent shrimp that are almost invisible in the water. They are important cleaners that eat parasites off larger fish.',
    funFact: 'Their transparent bodies let you see their internal organs, including food being digested in real time.',
  },
  {
    name: 'Polychaete Worm', slug: 'Polychaete_worm', size: 'mini',
    scientificName: 'Polychaeta',
    description: 'Segmented marine worms with bristle-like appendages. Christmas tree worms are the most photographed variety, with colorful spiral crowns.',
    funFact: 'Christmas tree worms retract into their tube in milliseconds at the slightest shadow or vibration.',
  },
  {
    name: 'Jellyfish', slug: 'Jellyfish', size: 'mini',
    scientificName: 'Scyphozoa',
    description: 'Ancient creatures that have been drifting through oceans for over 500 million years — predating dinosaurs. They are 95% water.',
    funFact: 'The immortal jellyfish (Turritopsis dohrnii) can revert to its juvenile form, making it biologically immortal.',
  },
  {
    name: 'Sea Horse', slug: 'Sea_horse', size: 'mini',
    scientificName: 'Hippocampus',
    description: 'Unique fish that swim upright, have prehensile tails, and move their eyes independently like chameleons.',
    funFact: 'Males carry the eggs in a pouch and give birth to live young — one of the only species where the male gets pregnant.',
  },
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
