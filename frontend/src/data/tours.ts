export type TourDay = { day: string; title: string; body: string };

export type Tour = {
  slug: string;
  name: string;
  tag: string;
  duration: string;
  places: string;
  price: string;
  image: string;
  gallery?: string[];
  dek: string;
  highlights: string[];
  itinerary: TourDay[];
  includes: string[];
  excludes: string[];
};

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const DEFAULT_INCLUDES = [
  "Private air-conditioned vehicle with English-speaking chauffeur-guide",
  "All accommodation in hand-picked boutique hotels & villas",
  "Daily breakfast and three signature dinners",
  "Entrance fees to all listed sites and national parks",
  "24/7 concierge support throughout your journey",
];

const DEFAULT_EXCLUDES = [
  "International flights & visa",
  "Lunches and incidental meals",
  "Personal expenses and gratuities",
  "Optional spa treatments and excursions",
];

function buildItinerary(days: number, places: string[]): TourDay[] {
  const arr: TourDay[] = [];
  for (let i = 0; i < days; i++) {
    const place = places[i % places.length];
    arr.push({
      day: `Day ${i + 1}`,
      title: i === 0 ? `Arrival in ${place}` : i === days - 1 ? `Departure from ${place}` : `Discover ${place}`,
      body:
        i === 0
          ? `Met on arrival by your private chauffeur-guide and transferred to your first boutique hotel. Evening at leisure with a welcome dinner curated by our concierge.`
          : i === days - 1
          ? `A slow morning, final breakfast and a private transfer to the airport in time for your onward flight. We'll already be designing your next trip.`
          : `A considered day across ${place} — a mix of marquee sights and the smaller, quieter places our guides know well. Pace tailored to you, never the brochure.`,
    });
  }
  return arr;
}

const TOURS_DATA: Omit<Tour, "slug">[] = [
  {
    name: "Essence of Sri Lanka",
    tag: "Bestseller",
    duration: "7 Days",
    places: "Colombo · Sigiriya · Kandy · Ella",
    price: "699",
    image:
      "https://images.unsplash.com/photo-1713101335374-59ab9bb1fd54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    gallery: [
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1586753080433-3b98668a4085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1544015759-237f87d55ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    dek: "Our most-loved itinerary — seven unhurried days threading the colonial coast, the cultural triangle, hill country and the legendary Ella train.",
    highlights: [
      "Sunrise climb of Sigiriya, the Lion Rock",
      "Temple of the Tooth in Kandy, after the crowds leave",
      "The Ella → Demodara train, in a private first-class carriage",
      "Tea tasting with a fourth-generation Ceylon estate family",
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Colombo", body: "Met on arrival by your private chauffeur-guide. A short transfer to your Galle Face boutique hotel, an evening tuk-tuk tour of Pettah's spice markets and a welcome dinner at a Dutch-period townhouse." },
      { day: "Day 2", title: "Colombo → Sigiriya", body: "Drive north into the Cultural Triangle (3.5h). Afternoon visit to the Dambulla cave temples and a sunset walk along the village paddy fields surrounding your luxury jungle lodge." },
      { day: "Day 3", title: "Sigiriya at dawn", body: "An early start — climb the Lion Rock before the day-trippers arrive. Return for a long breakfast, then an afternoon village cycle and a private ayurvedic massage at your lodge." },
      { day: "Day 4", title: "Sigiriya → Kandy", body: "A scenic drive south through the spice gardens to Kandy (3h). Late afternoon at the Temple of the Tooth for the evening puja ceremony — accessed via a side entrance with your guide." },
      { day: "Day 5", title: "Kandy → Hill Country", body: "Board the private first-class carriage on the Kandy → Nanu Oya train (4h) — one of the world's great rail journeys. Transferred to your tea-estate bungalow for sunset cocktails on the lawn." },
      { day: "Day 6", title: "Ella & Nine Arches", body: "A guided tea-factory walk, lunch with the planter family, and an afternoon hike to the Nine Arches viaduct timed for the blue-hour train pass." },
      { day: "Day 7", title: "Departure", body: "A slow morning in the hills, then a private transfer down to Colombo or Mattala in time for your onward flight." },
    ],
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Southern Coast Escape",
    tag: "Beaches",
    duration: "5 Days",
    places: "Galle · Mirissa · Bentota",
    price: "499",
    image:
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    dek: "Five barefoot days tracing Sri Lanka's southern coast — Dutch-fort sunsets, whale-watching at first light, and a private stilt-fisher dawn.",
    highlights: [
      "Sunset ramparts walk inside Galle Fort",
      "Blue whale charter from Mirissa (Nov–Apr)",
      "Bentota river safari at golden hour",
      "Private beach dinner under a rattan canopy",
    ],
    itinerary: buildItinerary(5, ["Galle", "Galle", "Mirissa", "Bentota", "Bentota"]),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Wildlife Discovery",
    tag: "Safari",
    duration: "6 Days",
    places: "Yala · Udawalawe",
    price: "599",
    image:
      "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    dek: "Six days inside Sri Lanka's two great parks — Yala for leopards, Udawalawe for the gentle giants — with private camps and quiet, unrushed game drives.",
    highlights: [
      "Two private game drives daily in Yala Block I",
      "Elephant Transit Home at feeding time",
      "Bush dinners by lantern at your tented camp",
      "Birding with a resident ornithologist",
    ],
    itinerary: buildItinerary(6, ["Colombo", "Udawalawe", "Udawalawe", "Yala", "Yala", "Colombo"]),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Hill Country Tea Trails",
    tag: "Scenic",
    duration: "4 Days",
    places: "Nuwara Eliya · Ella",
    price: "449",
    image:
      "https://images.unsplash.com/photo-1578519050142-afb511e518de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    dek: "Four slow days in the cool, blue-green high country — colonial planter bungalows, the Ella train and a tea tasting with the fourth generation of an estate family.",
    highlights: [
      "Stay at a restored 1920s tea-planter bungalow",
      "Walk through working tea fields with a master taster",
      "Private first-class carriage on the Kandy → Ella line",
      "Sunrise hike to Little Adam's Peak",
    ],
    itinerary: buildItinerary(4, ["Kandy", "Nuwara Eliya", "Ella", "Ella"]),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Cultural Triangle",
    tag: "Heritage",
    duration: "5 Days",
    places: "Sigiriya · Polonnaruwa · Kandy",
    price: "549",
    image:
      "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    dek: "Five days inside the heart of ancient Ceylon — Anuradhapura's ruined capitals, Sigiriya's rock fortress, and Kandy's hidden monastic libraries.",
    highlights: [
      "Sunrise at Sigiriya with a private archaeologist",
      "Polonnaruwa by bicycle in the early light",
      "After-hours access to the Temple of the Tooth",
      "Private dinner inside a restored walauwa",
    ],
    itinerary: buildItinerary(5, ["Sigiriya", "Sigiriya", "Polonnaruwa", "Kandy", "Kandy"]),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
  {
    name: "Ultimate Sri Lanka",
    tag: "Signature",
    duration: "10 Days",
    places: "Island Wide Experience",
    price: "999",
    image:
      "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    gallery: [
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    dek: "Ten days, every shade of Sri Lanka — ancient cities, hill country mists, safari leopards and a final week on a quiet southern beach.",
    highlights: [
      "Cultural Triangle with a private archaeologist",
      "Two parks: Wilpattu in the north, Yala in the south",
      "Hill country bungalow stay with planter dinner",
      "Three nights on a private southern beach villa",
    ],
    itinerary: buildItinerary(10, [
      "Colombo",
      "Wilpattu",
      "Sigiriya",
      "Sigiriya",
      "Kandy",
      "Nuwara Eliya",
      "Ella",
      "Yala",
      "Mirissa",
      "Galle",
    ]),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  },
];

// Long-tail tours from category page — minimal data, template filled
const LONG_TAIL: Array<{
  name: string;
  duration: string;
  places: string;
  price: string;
  image: string;
  tag: string;
}> = [
  { name: "Ancient Kingdoms", duration: "8 Days", places: "Anuradhapura · Polonnaruwa · Sigiriya", price: "729", tag: "Heritage", image: "https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Heritage & Spice Trail", duration: "6 Days", places: "Kandy · Matale · Galle", price: "619", tag: "Heritage", image: "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Tea Trails", duration: "5 Days", places: "Nuwara Eliya · Hatton", price: "549", tag: "Scenic", image: "https://images.unsplash.com/photo-1544015759-237f87d55ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Ella & Nine Arch", duration: "4 Days", places: "Ella · Demodara", price: "459", tag: "Scenic", image: "https://images.unsplash.com/photo-1586753080433-3b98668a4085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Hill Country Romance", duration: "6 Days", places: "Kandy · Nuwara Eliya · Ella", price: "699", tag: "Honeymoon", image: "https://images.unsplash.com/photo-1622040256403-313e14cad531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Horton Plains Trek", duration: "3 Days", places: "Horton Plains · World's End", price: "349", tag: "Adventure", image: "https://images.unsplash.com/photo-1580635849262-3161a7c99dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Leopards of Yala", duration: "4 Days", places: "Yala Block I & II", price: "529", tag: "Safari", image: "https://images.unsplash.com/photo-1667323169496-c6a34dd8e293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Elephant Country", duration: "4 Days", places: "Minneriya · Udawalawe", price: "489", tag: "Safari", image: "https://images.unsplash.com/photo-1619183318129-cd95bc882275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Wild Sri Lanka", duration: "9 Days", places: "Wilpattu · Yala · Sinharaja", price: "899", tag: "Safari", image: "https://images.unsplash.com/photo-1509763877072-959eda51e6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Galle & Mirissa", duration: "4 Days", places: "Galle · Mirissa", price: "439", tag: "Beaches", image: "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Bentota Bliss", duration: "5 Days", places: "Bentota River & Coast", price: "519", tag: "Beaches", image: "https://images.unsplash.com/photo-1460627390041-532a28402358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Coastal Odyssey", duration: "8 Days", places: "Negombo · Bentota · Galle · Tangalle", price: "789", tag: "Beaches", image: "https://images.unsplash.com/photo-1567335991483-fc7088c63506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Honeymoon in Paradise", duration: "8 Days", places: "Sigiriya · Kandy · Galle", price: "1199", tag: "Honeymoon", image: "https://images.unsplash.com/photo-1620483829312-71b2ec172fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Romance of Ceylon", duration: "7 Days", places: "Hill Country · South Coast", price: "1049", tag: "Honeymoon", image: "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Tea Hills for Two", duration: "5 Days", places: "Nuwara Eliya · Ella", price: "859", tag: "Honeymoon", image: "https://images.unsplash.com/photo-1746175832129-fddb132c075c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Ultimate Honeymoon", duration: "10 Days", places: "Island Wide · Private Villa", price: "1599", tag: "Honeymoon", image: "https://images.unsplash.com/photo-1698726654908-834d3a5330d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Peaks & Rivers", duration: "6 Days", places: "Kitulgala · Knuckles", price: "649", tag: "Adventure", image: "https://images.unsplash.com/photo-1580635849262-3161a7c99dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Adventure Triangle", duration: "7 Days", places: "Kandy · Kitulgala · Ella", price: "729", tag: "Adventure", image: "https://images.unsplash.com/photo-1559038331-02f4bae92a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Surf & Trek", duration: "8 Days", places: "Arugam Bay · Ella · Hiriketiya", price: "799", tag: "Adventure", image: "https://images.unsplash.com/photo-1567335991483-fc7088c63506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
  { name: "Ultimate Adventure", duration: "10 Days", places: "Island Wide · All Terrains", price: "1099", tag: "Adventure", image: "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800" },
];

function expand(d: typeof LONG_TAIL[number]): Omit<Tour, "slug"> {
  const days = parseInt(d.duration);
  const placeList = d.places.split(/[·,]/).map((p) => p.trim()).filter(Boolean);
  return {
    name: d.name,
    tag: d.tag,
    duration: d.duration,
    places: d.places,
    price: d.price,
    image: d.image,
    dek: `${days} considered days across ${d.places} — designed for travellers who want the icons and the small, quiet places between them.`,
    highlights: placeList.slice(0, 4).map((p) => `A slow, guided day in ${p}`),
    itinerary: buildItinerary(days, placeList),
    includes: DEFAULT_INCLUDES,
    excludes: DEFAULT_EXCLUDES,
  };
}

const ALL: Omit<Tour, "slug">[] = [...TOURS_DATA, ...LONG_TAIL.map(expand)];

export const TOURS: Record<string, Tour> = Object.fromEntries(
  ALL.map((t) => [slugify(t.name), { ...t, slug: slugify(t.name) }])
);

export function getTour(slug: string): Tour | null {
  return TOURS[slug] ?? null;
}
