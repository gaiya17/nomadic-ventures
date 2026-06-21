export type Resort = {
  slug: string;
  name: string;
  atoll: string;
  tag: string;
  duration: string;
  price: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  dek: string;
  highlights: string[];
  experiences: { title: string; body: string }[];
  villaTypes: { name: string; size: string; from: string; note: string }[];
  includes: string[];
  excludes: string[];
};

export function slugifyResort(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const DEFAULT_INCLUDES = [
  "Return seaplane or speedboat transfers from Malé",
  "Daily breakfast at signature overwater restaurant",
  "Welcome champagne and in-villa fruit & canapés",
  "Unlimited use of non-motorised watersports",
  "Daily housekeeping and 24/7 villa butler",
];

const DEFAULT_EXCLUDES = [
  "International flights and visa fees",
  "Lunches, à la carte dinners and beverages",
  "Spa treatments and motorised watersports",
  "Personal expenses and gratuities",
];

function defaultExperiences(name: string, atoll: string) {
  return [
    {
      title: "Sandbank breakfast at sunrise",
      body: `A private dhoni glides you to an uninhabited sandbank for a chef-set breakfast — only you, the reef and the morning light over ${atoll}.`,
    },
    {
      title: "House-reef snorkel with the marine biologist",
      body: "An unhurried hour with the resident biologist, learning to read the corals and spot the resident turtles a metre below the villa deck.",
    },
    {
      title: "Underwater or sandbank dining",
      body: `${name}'s most-requested table — set for two, with a tasting menu from the executive chef and a sommelier-paired wine flight.`,
    },
    {
      title: "Sunset dhoni cruise",
      body: "Traditional Maldivian sailing boat at golden hour, with chilled rosé and the island shrinking behind you. Often joined by dolphins.",
    },
  ];
}

function defaultVillas(price: string) {
  const base = parseInt(price.replace(/,/g, ""));
  return [
    {
      name: "Beach Villa with Pool",
      size: "180 m²",
      from: `$${(base * 0.85).toFixed(0)}`,
      note: "Direct beach access, private plunge pool, outdoor day-bed",
    },
    {
      name: "Overwater Villa",
      size: "210 m²",
      from: `$${base.toLocaleString()}`,
      note: "Glass-floor panel, lagoon steps, sunset or sunrise aspect",
    },
    {
      name: "Two-Bedroom Reserve",
      size: "380 m²",
      from: `$${(base * 1.9).toFixed(0)}`,
      note: "Two ensuite bedrooms, infinity pool, private chef on request",
    },
  ];
}

const RESORTS_DATA: Omit<Resort, "slug">[] = [
  {
    name: "Soneva Jani",
    atoll: "Noonu Atoll",
    tag: "Signature",
    duration: "5 – 10 Nights",
    price: "1,899",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    gallery: [
      "https://images.unsplash.com/photo-1698726654908-834d3a5330d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1620483829312-71b2ec172fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    amenities: ["Overwater Villa", "Private Pool", "Slide to Lagoon"],
    dek: "Soneva Jani is a five-island reserve in the remote Noonu Atoll — overwater retreats with retractable roofs, an open-air observatory, and the famed water slide that drops you straight into the lagoon.",
    highlights: [
      "Retractable bedroom roofs for sleeping under the stars",
      "An on-island observatory with resident astronomer",
      "The Maldives' most-photographed water slide",
      "Cinema Paradiso — outdoor films on the lagoon",
    ],
    experiences: [
      { title: "Stargazing with the resident astronomer", body: "Roof retracts at the touch of a button; the astronomer joins you for an hour at the in-villa telescope, naming the southern constellations." },
      { title: "Castaway sandbank picnic", body: "A private boat drops you on a moving sandbank with a wicker hamper and a satellite phone. We collect you when you call." },
      { title: "Soneva Spa over the lagoon", body: "Couples' pavilions floating above coral. A four-handed massage timed to the sunset." },
      { title: "Out of the Blue, underwater dining", body: "Their newest signature — a four-course tasting menu six metres below the surface." },
    ],
    villaTypes: defaultVillas("1899"),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Baros Maldives",
    atoll: "North Malé Atoll",
    tag: "Honeymoon",
    duration: "5 – 10 Nights",
    price: "1,499",
    image:
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    amenities: ["Romantic Dining", "Reef House", "Sunset Cruise"],
    dek: "A small, intimate island twenty-five minutes by speedboat from Malé — known for the quietest house reef in the country and a fleet of restored dhonis at your disposal.",
    highlights: [
      "Lighthouse Restaurant over the reef at sunset",
      "Piano Deck Sandbank — private dinner for two",
      "Diving Centre with PADI 5-star rating",
      "Open Air Spa with twin reef-view pavilions",
    ],
    experiences: defaultExperiences("Baros", "North Malé"),
    villaTypes: defaultVillas("1499"),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Emerald Maldives",
    atoll: "Raa Atoll",
    tag: "All-Inclusive",
    duration: "7 Nights",
    price: "1,699",
    image:
      "https://images.unsplash.com/photo-1746131272871-6058227a3f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    amenities: ["All-Inclusive", "Spa Sanctuary", "Underwater Dining"],
    dek: "A deluxe all-inclusive in the lush Raa Atoll, with an underwater restaurant, eight dining concepts and one of the most generous spa villas in the country.",
    highlights: [
      "Amazónico underwater restaurant",
      "Premium all-inclusive across all eight venues",
      "Award-winning spa with hammam ritual",
      "Excellent in-house diving programme",
    ],
    experiences: defaultExperiences("Emerald", "Raa"),
    villaTypes: defaultVillas("1699"),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "OZEN Reserve Bolifushi",
    atoll: "South Malé Atoll",
    tag: "Family",
    duration: "5 – 14 Nights",
    price: "2,099",
    image:
      "https://images.unsplash.com/photo-1596746698204-d69844da956d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    amenities: ["Family Villas", "Premium All-In", "Kids Club"],
    dek: "A modern family-first reserve in South Malé with two-bedroom overwater retreats, a marine programme for children, and a chef's table-style restaurant on the lagoon.",
    highlights: [
      "Two-bedroom overwater & beach reserves",
      "Premium all-inclusive plan across all venues",
      "INDULGENCE kids club with marine biology",
      "M6m underwater fine-dining experience",
    ],
    experiences: defaultExperiences("OZEN", "South Malé"),
    villaTypes: defaultVillas("2099"),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
];

const LONG_TAIL: Array<{
  name: string;
  atoll: string;
  tag: string;
  duration?: string;
  price: string;
  image: string;
  amenities?: string[];
}> = [
  { name: "Conrad Rangali", atoll: "South Ari", tag: "Signature", price: "1,599", image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Overwater Villa", "Ithaa Undersea", "Whale Submarine"] },
  { name: "Gili Lankanfushi", atoll: "North Malé", tag: "Signature", price: "2,199", image: "https://images.unsplash.com/photo-1746131272871-6058227a3f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["No-shoes policy", "Crusoe Residences", "Reef Library"] },
  { name: "COMO Cocoa", atoll: "South Malé", tag: "Honeymoon", price: "1,799", image: "https://images.unsplash.com/photo-1675657144361-98ae33e6b6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Romantic Dining", "Yoga Pavilion", "Spa Sanctuary"] },
  { name: "Velaa Private", atoll: "Noonu Atoll", tag: "Honeymoon", price: "2,499", image: "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Golf Academy", "Romantic Tower Villa", "Cigar Lounge"] },
  { name: "Velaa Private Island", atoll: "Noonu Atoll", tag: "Private Island", price: "8,500", image: "https://images.unsplash.com/photo-1595184979141-090792f6b578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Exclusive Use", "Private Chef", "Watercraft Fleet"] },
  { name: "Coco Privé Kuda Hithi", atoll: "North Malé", tag: "Private Island", price: "12,000", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["6-Bedroom Island", "Private Staff", "Personal Dhoni"] },
  { name: "Soneva Secret", atoll: "Haa Dhaalu", tag: "Private Island", price: "6,800", image: "https://images.unsplash.com/photo-1746131272871-6058227a3f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Castaway Privacy", "Barefoot Butler", "Observatory"] },
  { name: "Six Senses Laamu", atoll: "Laamu Atoll", tag: "Diving", price: "1,650", image: "https://images.unsplash.com/photo-1535507568891-fd46651fe8c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Reef Quarter", "Surf Breaks", "Marine Biologist"] },
  { name: "Anantara Kihavah", atoll: "Baa Atoll", tag: "Diving", price: "2,100", image: "https://images.unsplash.com/photo-1593665840592-8c662655fb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Sea.Fire.Salt.Sky", "Underwater Cellar", "Hanifaru Bay"] },
  { name: "Vakkaru Maldives", atoll: "Baa Atoll", tag: "Diving", price: "1,450", image: "https://images.unsplash.com/photo-1628371217613-714161455f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["UNESCO Biosphere", "Manta Snorkel", "Coral Restoration"] },
  { name: "Four Seasons Landaa", atoll: "Baa Atoll", tag: "Family", price: "1,850", image: "https://images.unsplash.com/photo-1620483829312-71b2ec172fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Marine Discovery Centre", "Kuda Velaa Kids", "Ayurvedic Retreat"] },
  { name: "Niyama Private Islands", atoll: "Dhaalu Atoll", tag: "Family", price: "1,720", image: "https://images.unsplash.com/photo-1698726654908-834d3a5330d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Subsix Underwater Club", "Surf Break", "Two Islands"] },
  { name: "Joali Being", atoll: "Raa Atoll", tag: "Wellness", price: "2,800", image: "https://images.unsplash.com/photo-1535507903430-1d1b9ce3bcb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Wellbeing Resort", "Hydrotherapy Hall", "Sound Bath"] },
  { name: "Como Maalifushi", atoll: "Thaa Atoll", tag: "Wellness", price: "1,580", image: "https://images.unsplash.com/photo-1746138623166-67fbd00f343e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["COMO Shambhala", "Surf Discovery", "Yoga Pavilion"] },
  { name: "Amilla Maldives", atoll: "Baa Atoll", tag: "Wellness", price: "1,520", image: "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800", amenities: ["Residence Villas", "Javvu Spa", "Reef Conservation"] },
];

function expand(d: typeof LONG_TAIL[number]): Omit<Resort, "slug"> {
  return {
    name: d.name,
    atoll: d.atoll,
    tag: d.tag,
    duration: d.duration ?? "5 – 10 Nights",
    price: d.price,
    image: d.image,
    amenities: d.amenities ?? ["Private Villa", "House Reef", "Spa Sanctuary"],
    dek: `${d.name} sits in the ${d.atoll}, a considered stay where the architecture, service and house reef have been shaped around the rhythm of the lagoon.`,
    highlights: [
      `Direct seaplane access from Malé`,
      `Signature dining over the lagoon`,
      `Award-winning house reef and dive centre`,
      `Resident marine biologist and reef programme`,
    ],
    experiences: defaultExperiences(d.name, d.atoll),
    villaTypes: defaultVillas(d.price.replace(/,/g, "")),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  };
}

const ALL: Omit<Resort, "slug">[] = [...RESORTS_DATA, ...LONG_TAIL.map(expand)];

export const RESORTS: Record<string, Resort> = Object.fromEntries(
  ALL.map((r) => [slugifyResort(r.name), { ...r, slug: slugifyResort(r.name) }])
);

export function getResort(slug: string): Resort | null {
  return RESORTS[slug] ?? null;
}
