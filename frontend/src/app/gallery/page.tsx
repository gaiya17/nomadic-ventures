"use client";
import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight, X, MapPin, Clock, Calendar, Star,
  Landmark, Mountain, Binoculars, Waves, Heart, Zap, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// ─── Destination data ──────────────────────────────────────────────────────────
type Destination = {
  id: string;
  name: string;
  category: string;
  location: string;
  tagline: string;
  description: string[];
  hero: string;
  gallery: string[];
  highlights: string[];
  bestTime: string;
  duration: string;
  tourTag: string;
};

const DESTINATIONS: Destination[] = [
  // ── Cultural & Heritage ──
  {
    id: "sigiriya",
    name: "Sigiriya",
    category: "Cultural & Heritage",
    location: "Central Province · Sri Lanka",
    tagline: "The Lion Rock — 5th-century fortress in the sky",
    description: [
      "Rising 200 metres above the surrounding jungle, Sigiriya is one of the most dramatic archaeological sites in Asia. Built by King Kashyapa in the 5th century AD, this fortified palace complex crowns a sheer column of volcanic rock — its approach guarded by the famous lion paws carved into the rock face.",
      "The climb rewards with ancient frescoes of the 'cloud maidens', the Mirror Wall covered in centuries-old graffiti, and at the summit, the ruins of a royal palace with views across the entire Cultural Triangle. Early morning visits reveal the rock wreathed in mist and entirely free of crowds.",
      "The surrounding moats, gardens, and boulder caves form one of the most complete examples of ancient urban planning in the world — a UNESCO World Heritage Site that earns every superlative.",
    ],
    hero: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Pre-dawn private access before the crowds", "5th-century frescoes of the Cloud Maidens", "Summit palace ruins & panoramic views", "Water gardens & ancient moat system"],
    bestTime: "January – April",
    duration: "Full day",
    tourTag: "Heritage",
  },
  {
    id: "kandy",
    name: "Kandy",
    category: "Cultural & Heritage",
    location: "Central Province · Sri Lanka",
    tagline: "Sacred city of the last Sinhalese kings",
    description: [
      "Kandy sits in a mountain bowl, its sacred lake reflecting the gilded roofline of the Temple of the Tooth — Sri Lanka's most revered Buddhist shrine, home to a relic of the Buddha himself. The city was the last capital of the Sinhalese kings, and its cultural heartbeat has never faltered.",
      "The evening puja ceremony at the Temple floods the air with drums and the scent of incense offerings. Around the lake, colonial-era bungalows and spice-garden lanes reward leisurely exploration. Kandy is also the launch point for the island's most celebrated rail journey.",
      "Beyond the temple, the Royal Botanical Gardens at Peradeniya — 147 acres of orchids, spice trees, and an avenue of royal palms — is among the finest in Asia.",
    ],
    hero: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1580794749460-76f97b7180d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1544015759-237f87d55ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1622040256403-313e14cad531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Private evening puja at the Temple of the Tooth", "Royal Botanical Gardens, Peradeniya", "Kandyan dance performance", "Colonial lakeside walks"],
    bestTime: "December – March",
    duration: "1–2 days",
    tourTag: "Heritage",
  },
  {
    id: "polonnaruwa",
    name: "Polonnaruwa",
    category: "Cultural & Heritage",
    location: "North Central Province · Sri Lanka",
    tagline: "Ancient royal city of the medieval kingdom",
    description: [
      "Polonnaruwa was the capital of Sri Lanka's greatest medieval kingdom between the 10th and 12th centuries. Today its ruins spread across a vast archaeological park that rewards early-morning cycling — the best way to move between colossal stupas, moonstone doorsteps, and the remarkable Gal Vihara rock sculptures.",
      "The Gal Vihara is Polonnaruwa's masterstroke: four gigantic Buddha figures carved from a single granite face, their expressions of serene detachment unchanged across 800 years. Nearby, the Parakrama Samudra — one of the largest ancient reservoirs in the world — still irrigates the surrounding farmland.",
    ],
    hero: "https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Gal Vihara rock-cut Buddha sculptures", "Bicycle tour of the archaeological park", "Parakrama Samudra ancient reservoir", "Vatadage circular relic house"],
    bestTime: "June – September",
    duration: "Full day",
    tourTag: "Heritage",
  },
  {
    id: "dambulla",
    name: "Dambulla Cave Temples",
    category: "Cultural & Heritage",
    location: "Central Province · Sri Lanka",
    tagline: "2,000-year-old cave temple complex",
    description: [
      "Carved into a granite outcrop that dominates the surrounding plain, the Dambulla Cave Temple complex is Sri Lanka's largest and best-preserved cave temple. Five caves sheltering 157 statues and 2,100 square metres of ceiling paintings have made it a UNESCO World Heritage Site.",
      "The paintings — vibrant reds, yellows, and blues despite their age — depict the life of the Buddha and the history of Sri Lanka. The largest cave stretches 52 metres and houses a 15-metre reclining Buddha of breathtaking scale. Visiting at dusk, when the day-trippers have left and oil lamps are lit, is an experience unlike any other.",
    ],
    hero: "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1612862862126-865765df2ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["157 statues across 5 cave chambers", "2,100 sq m of ancient ceiling frescoes", "15-metre reclining Buddha in Cave 3", "Dusk visit by oil-lamp light"],
    bestTime: "Year-round",
    duration: "Half day",
    tourTag: "Heritage",
  },

  // ── Hill Country Escapes ──
  {
    id: "ella",
    name: "Ella",
    category: "Hill Country Escapes",
    location: "Uva Province · Sri Lanka",
    tagline: "Train journeys, nine arches, and mountain mist",
    description: [
      "Ella is where Sri Lanka slows to its most beautiful. A small hill town cradled between two mountain peaks, it sits at the end of — or beginning of — the world's most scenic train journey. The famous Nine Arch Bridge, a British colonial masterpiece of stone viaduct, is at its most photogenic when a blue train crosses it at golden hour.",
      "The surrounding countryside rewards hikers: Little Adam's Peak is a gentle two-hour trail that ends with panoramic views over a sea of tea; Ella Rock is a harder, wilder climb through cloud forest. Between them, tea-estate lanes and roadside curd-and-treacle stalls make the journey as good as the destination.",
      "The Kandy-to-Ella train — one of the most celebrated rail rides in the world — takes passengers through tunnels, across viaducts, and alongside precipices of emerald green for nearly six hours.",
    ],
    hero: "https://images.unsplash.com/photo-1586753080433-3b98668a4085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1578519050142-afb511e518de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1544015759-237f87d55ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1775479788431-7801d72f6f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1775479788389-76251f360d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Nine Arch Bridge at golden hour", "Kandy–Ella scenic train journey", "Little Adam's Peak sunrise hike", "Ella Rock cloud-forest trail"],
    bestTime: "January – April",
    duration: "2–3 days",
    tourTag: "Scenic",
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    category: "Hill Country Escapes",
    location: "Central Province · Sri Lanka",
    tagline: "Sri Lanka's 'Little England' in the clouds",
    description: [
      "At nearly 2,000 metres above sea level, Nuwara Eliya is a colonial anomaly — a slice of English countryside transplanted to the tropics. Tudor-style bungalows, a racecourse, a golf club, and rose gardens sit surrounded by tea estates that produce some of Ceylon's finest high-grown teas.",
      "The cool air and dramatic highland scenery — rolling emerald hills, misty waterfalls, and the high grasslands of Horton Plains nearby — make Nuwara Eliya a restorative contrast to the heat of the lowlands. Tea-estate walks with a master taster are among the most memorable experiences on the island.",
    ],
    hero: "https://images.unsplash.com/photo-1578519050142-afb511e518de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1775479788431-7801d72f6f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1775479788389-76251f360d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1510473418088-5caae6b2998f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1544015759-237f87d55ef3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Tea-estate walk with a fourth-generation planter", "Gregory Lake at dawn", "Horton Plains & World's End escarpment", "Colonial Hill Club afternoon tea"],
    bestTime: "December – March",
    duration: "2 days",
    tourTag: "Scenic",
  },
  {
    id: "horton-plains",
    name: "Horton Plains",
    category: "Hill Country Escapes",
    location: "Central Province · Sri Lanka",
    tagline: "World's End — a sheer drop into the clouds",
    description: [
      "Horton Plains is Sri Lanka's highest and most dramatic national park — a vast windswept plateau at 2,100 metres surrounded by cloud forest and grassland. The star attraction is World's End: a sheer cliff from which the highland plateau plunges 870 metres to the lowland plains below. On clear mornings, the view stretches to the sea.",
      "The circular walk through the park — about 9 kilometres — passes waterfalls, sambar deer grazing at the forest edge, and endemic birds found nowhere else on earth. The mist rolls in by mid-morning, so an early start is essential for the view. The silence at that elevation is complete.",
    ],
    hero: "https://images.unsplash.com/photo-1559038331-02f4bae92a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1578519050142-afb511e518de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1775479788431-7801d72f6f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1580635849262-3161a7c99dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1559038331-02f4bae92a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["World's End — 870m sheer escarpment", "Baker's Falls waterfall", "Endemic sambar deer & purple-faced langurs", "Pre-dawn entry before the mist"],
    bestTime: "January – March",
    duration: "Full day",
    tourTag: "Scenic",
  },

  // ── Wildlife Safaris ──
  {
    id: "yala",
    name: "Yala National Park",
    category: "Wildlife Safaris",
    location: "Southern Province · Sri Lanka",
    tagline: "Highest leopard density on the planet",
    description: [
      "Yala is Sri Lanka's most famous wildlife reserve and one of the best places on earth to see leopards in the wild. Block I — the park's most wildlife-rich zone — has the highest documented leopard density of any protected area on the planet. An early-morning game drive in an open jeep across Yala's varied terrain of scrub jungle, lagoons, and rocky outcrops is one of Asia's great wildlife encounters.",
      "Beyond the leopards, Yala is home to Sri Lankan elephants, sloth bears, mugger crocodiles, water buffalo, spotted deer, and over 200 bird species. The coastal lagoons at dawn — pink with flamingos and alive with painted storks — are a reminder that Yala is as much a birding destination as a big-cat reserve.",
      "Our private camps at the park boundary allow for predawn departures timed to catch the light and the animals before the day-tripper jeeps arrive.",
    ],
    hero: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1743014118271-415197f9b0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1705936981595-dea87508ce84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1619183318129-cd95bc882275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Highest wild leopard density on earth", "Pre-dawn private game drives in Block I", "Sloth bears, elephants & crocodiles", "Flamingo lagoons at sunrise"],
    bestTime: "February – July",
    duration: "2–3 days",
    tourTag: "Safari",
  },
  {
    id: "udawalawe",
    name: "Udawalawe National Park",
    category: "Wildlife Safaris",
    location: "Sabaragamuwa Province · Sri Lanka",
    tagline: "Sri Lanka's elephant heartland",
    description: [
      "Udawalawe is the best place in Sri Lanka — and one of the best in the world — for guaranteed elephant encounters. The park is home to over 600 wild Sri Lankan elephants, and sightings of large herds drinking, bathing, and grazing in the open scrubland are near-certain on any game drive.",
      "The Elephant Transit Home on the park boundary rehabilitates orphaned calves before releasing them back into the wild. Watching feeding time — dozens of calves drinking from enormous bottles — is one of the most heartwarming wildlife experiences in Asia.",
      "The park's open terrain and reservoir margins also host a remarkable diversity of waterbirds, raptors, and the endemic Sri Lankan junglefowl.",
    ],
    hero: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1619183318129-cd95bc882275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1743014118271-415197f9b0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1667323169496-c6a34dd8e293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["600+ wild elephants in open terrain", "Elephant Transit Home feeding visit", "Tusker sightings at Udawalawe reservoir", "Endemic Sri Lankan junglefowl"],
    bestTime: "June – September",
    duration: "1–2 days",
    tourTag: "Safari",
  },
  {
    id: "minneriya",
    name: "Minneriya National Park",
    category: "Wildlife Safaris",
    location: "North Central Province · Sri Lanka",
    tagline: "Home of the world's largest elephant gathering",
    description: [
      "Each year between June and October, as water levels in the Minneriya Tank drop to reveal fresh grazing, hundreds of wild Sri Lankan elephants converge on the lakebed in one of nature's greatest wildlife spectacles — 'The Gathering'. At its peak, over 300 elephants can be seen in a single view.",
      "Beyond The Gathering, Minneriya's mixed forest and open plains support a healthy population of elephants year-round, along with spotted deer, sambar, wild boar, and one of Sri Lanka's richest assemblages of waterbirds. Its proximity to Sigiriya makes it a natural pairing for a Cultural Triangle itinerary.",
    ],
    hero: "https://images.unsplash.com/photo-1619183318129-cd95bc882275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1743014118271-415197f9b0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1705936981595-dea87508ce84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["'The Gathering' — 300+ elephants at once", "Best combined with Sigiriya day trip", "Endemic purple-faced langur monkeys", "Open-jeep drives at dusk"],
    bestTime: "June – October (Gathering season)",
    duration: "Half day to full day",
    tourTag: "Safari",
  },

  // ── Beach Getaways ──
  {
    id: "mirissa",
    name: "Mirissa",
    category: "Beach Getaways",
    location: "Southern Province · Sri Lanka",
    tagline: "Whale watching capital of Asia",
    description: [
      "Mirissa is a crescent of golden sand backed by swaying palms and facing the open Indian Ocean. Its celebrity attraction is the whale watching — from November to April, blue and sperm whales, spinner dolphins, and occasional orcas frequent the deep waters just offshore. Sunrise departures on a private charter boat, coffee in hand, watching a 30-metre blue whale surface and sound, is an experience that stays with you for life.",
      "Outside whale season, Mirissa is simply one of Sri Lanka's most beautiful beaches — calm in the mornings, livelier at sunset, with excellent fresh seafood and a cluster of boutique guesthouses on the headland above the bay.",
    ],
    hero: "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1724031948257-8b3c68232ccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1628431104736-8f04a50a8f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1567335991483-fc7088c63506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1460627390041-532a28402358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Private blue whale charter (Nov–Apr)", "Coconut Hill panoramic viewpoint", "Spinner dolphin pods at sunrise", "Fresh-catch seafood on the beach"],
    bestTime: "November – April",
    duration: "2–4 days",
    tourTag: "Beaches",
  },
  {
    id: "galle",
    name: "Galle Fort",
    category: "Beach Getaways",
    location: "Southern Province · Sri Lanka",
    tagline: "A living Dutch colonial city inside 17th-century ramparts",
    description: [
      "Galle Fort is one of the best-preserved colonial sea fortresses in Asia — a UNESCO World Heritage Site where 17th-century Dutch ramparts enclose a living town of boutique hotels, art galleries, spice shops, and excellent restaurants. Walking the ramparts at sunset, the Indian Ocean on one side and the red-roofed streets below on the other, is the quintessential Galle experience.",
      "Inside the fort, the streets are a gentle labyrinth of colonial-era buildings — Dutch Reformed Church, the old Dutch warehouse, a lighthouse, and dozens of beautifully restored mansions now operating as guesthouses. The atmosphere is unhurried, the coffee excellent, and the architecture extraordinary.",
      "Galle is also the ideal base for day trips to the nearby stilt fishermen of Koggala, the sea turtle hatcheries of Hikkaduwa, and the wild beaches of Tangalle.",
    ],
    hero: "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1713038948592-5d070e8e8459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1567335991483-fc7088c63506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1460627390041-532a28402358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Sunset walk on the 17th-century ramparts", "Boutique hotels inside the fort walls", "Galle Literary Festival (January)", "Day trips to stilt fishermen & turtle hatcheries"],
    bestTime: "December – April",
    duration: "2–3 days",
    tourTag: "Beaches",
  },
  {
    id: "bentota",
    name: "Bentota",
    category: "Beach Getaways",
    location: "Western Province · Sri Lanka",
    tagline: "River safaris and golden beach on the west coast",
    description: [
      "Bentota sits at the mouth of its own river, which makes it doubly beautiful — a long stretch of golden beach faces the Indian Ocean, while behind it the mangrove-lined river offers boat safaris past monitor lizards, kingfishers, and nesting crocodiles at golden hour.",
      "The beach is calm and swimmable year-round on the western side, sheltered by a lagoon. Water sports — jet-skiing, windsurfing, banana boats — are available for those who want them, while the river safari is ideal for those who prefer their wildlife encounter a little more serene.",
    ],
    hero: "https://images.unsplash.com/photo-1460627390041-532a28402358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1724031948257-8b3c68232ccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1567335991483-fc7088c63506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1704797390682-76479a29dc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Bentota River mangrove safari at dusk", "Calm lagoon beach for families", "Monitor lizard & kingfisher sightings", "Geoffrey Bawa architecture visits"],
    bestTime: "November – April",
    duration: "2–3 days",
    tourTag: "Beaches",
  },

  // ── Luxury Honeymoons ──
  {
    id: "honeymoon-kandy",
    name: "Kandy Hill Retreats",
    category: "Luxury Honeymoons",
    location: "Central Province · Sri Lanka",
    tagline: "Private colonial bungalows above a sacred lake",
    description: [
      "The hills surrounding Kandy are scattered with boutique properties that occupy converted tea-planter bungalows, colonial-era manor houses, and architect-designed villas. Many have private infinity pools that seem to float above the mist-filled valleys below.",
      "For honeymooners, Kandy offers the rare combination of cultural immersion and utter privacy. Days can be spent exploring the temple and city below; evenings returning to your hilltop retreat for a candlelit dinner delivered to the pool terrace, with the lights of the city twinkling far beneath.",
    ],
    hero: "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1557750505-e7b4d1c40410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1615880480595-f5f9b4fb530e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1596746698204-d69844da956d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1622040256403-313e14cad531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Infinity pools above the Kandy valley", "Private ayurvedic couples' spa rituals", "Candlelit dinners on the terrace", "Personally inspected boutique properties"],
    bestTime: "December – March",
    duration: "3–4 nights",
    tourTag: "Honeymoon",
  },
  {
    id: "honeymoon-south",
    name: "South Coast Villas",
    category: "Luxury Honeymoons",
    location: "Southern Province · Sri Lanka",
    tagline: "Private beachfront villas with butler service",
    description: [
      "Sri Lanka's south coast between Galle and Tangalle hosts a string of exceptional private villas — architect-designed retreats where the garden ends at the beach and your own chef prepares every meal. Many can be booked on an exclusive-use basis, making them among the most intimate honeymoon experiences in Asia.",
      "The lifestyle is simple and perfect: breakfast on the verandah, swimming in your own pool, an afternoon snorkelling the reef, a sunset walk on a beach you may share with no one. Evenings bring candle-lit dinners on the sand, the sound of the Indian Ocean the only interruption.",
    ],
    hero: "https://images.unsplash.com/photo-1557750505-e7b4d1c40410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1615880480595-f5f9b4fb530e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1596746698204-d69844da956d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Exclusive-use private villas", "Private chef & in-villa butler", "Beachfront location — Galle to Tangalle", "Candlelit beach dinners"],
    bestTime: "December – April",
    duration: "4–7 nights",
    tourTag: "Honeymoon",
  },

  // ── Adventure Tours ──
  {
    id: "kitulgala",
    name: "Kitulgala",
    category: "Adventure Tours",
    location: "Sabaragamuwa Province · Sri Lanka",
    tagline: "White-water rafting in the rainforest",
    description: [
      "The Kelani River at Kitulgala is Sri Lanka's premier white-water destination — a series of rapids rated Class III and IV that tumble through dense lowland rainforest. Half-day rafting trips, canyoning, cliff-jumping, and multi-pitch abseiling are all available from the cluster of adventure camps at the river bend.",
      "Kitulgala is also where David Lean filmed the iconic river scenes for The Bridge on the River Kwai — the concrete pillar bases of the original bridge set are still visible in the riverbed. The surrounding rainforest is a birding hotspot, with the endangered Serendib scops owl calling from the forest at night.",
    ],
    hero: "https://images.unsplash.com/photo-1636482022093-7e385f69bbce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1709754756130-d108ad5f4025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1580635849262-3161a7c99dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1559038331-02f4bae92a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1709754756130-d108ad5f4025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Class III & IV white-water rapids", "Canyoning & cliff-jumping", "Bridge on the River Kwai film location", "Rainforest birding at night"],
    bestTime: "April – December",
    duration: "1–2 days",
    tourTag: "Adventure",
  },
  {
    id: "knuckles",
    name: "Knuckles Mountain Range",
    category: "Adventure Tours",
    location: "Central Province · Sri Lanka",
    tagline: "Cloud forest trekking through a UNESCO wilderness",
    description: [
      "The Knuckles Range — named for the row of peaks that resembles a clenched fist — is Sri Lanka's second UNESCO World Heritage wilderness, a compact but incredibly biodiverse massif of cloud forest, montane grassland, and plunging river gorges in the island's central highlands.",
      "Multi-day trekking routes thread through remote villages where traditional farming and weaving continue unchanged. The flora is extraordinary: wild orchids, carnivorous pitcher plants, and tree ferns line the trails. Wildlife encounters include the endemic purple-faced langur and, if you're quiet and lucky, the fishing cat.",
    ],
    hero: "https://images.unsplash.com/photo-1580635849262-3161a7c99dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1636482022093-7e385f69bbce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1709754756130-d108ad5f4025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1559038331-02f4bae92a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["Multi-day trekking through cloud forest", "Wild orchids & pitcher plants", "Remote village homestay nights", "Endemic wildlife: fishing cat, langur"],
    bestTime: "January – April",
    duration: "2–4 days",
    tourTag: "Adventure",
  },
  {
    id: "arugam-bay",
    name: "Arugam Bay",
    category: "Adventure Tours",
    location: "Eastern Province · Sri Lanka",
    tagline: "Asia's finest right-hand surf break",
    description: [
      "Arugam Bay is one of Asia's top ten surf destinations and the east coast's most celebrated beach town. The main point break is a long, consistent right-hander that works best from June to September — it hosted a World Surf League event and draws professional surfers from around the world every season.",
      "But Arugam Bay isn't just for surfers. The surrounding coast has several quieter points, a lagoon popular with wading birds, and proximity to Kumana National Park — one of Sri Lanka's least-visited bird sanctuaries. The town itself has a laid-back, end-of-the-road energy that is increasingly hard to find in Sri Lanka.",
    ],
    hero: "https://images.unsplash.com/photo-1567335991483-fc7088c63506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400",
    gallery: [
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1636482022093-7e385f69bbce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1724031948257-8b3c68232ccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
      "https://images.unsplash.com/photo-1460627390041-532a28402358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700",
    ],
    highlights: ["World-class right-hand surf break", "Surf lessons for all levels", "Kumana bird sanctuary day trips", "Lagoon kayaking & sunset point"],
    bestTime: "June – September",
    duration: "3–5 days",
    tourTag: "Adventure",
  },
];

// ─── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "All",                 Icon: Sparkles,   accent: "#F4B942" },
  { id: "heritage", label: "Cultural & Heritage",  Icon: Landmark,   accent: "#A78BFA" },
  { id: "scenic",   label: "Hill Country Escapes", Icon: Mountain,   accent: "#86EFAC" },
  { id: "safari",   label: "Wildlife Safaris",     Icon: Binoculars, accent: "#7BC8A4" },
  { id: "beaches",  label: "Beach Getaways",       Icon: Waves,      accent: "#22D3EE" },
  { id: "honeymoon",label: "Luxury Honeymoons",    Icon: Heart,      accent: "#F472B6" },
  { id: "adventure",label: "Adventure Tours",      Icon: Zap,        accent: "#FB923C" },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

const CAT_LABEL_TO_ID: Record<string, CategoryId> = {
  "Cultural & Heritage":  "heritage",
  "Hill Country Escapes": "scenic",
  "Wildlife Safaris":     "safari",
  "Beach Getaways":       "beaches",
  "Luxury Honeymoons":    "honeymoon",
  "Adventure Tours":      "adventure",
};

function metaForDest(dest: Destination) {
  const id = CAT_LABEL_TO_ID[dest.category] ?? "all";
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function DestinationModal({
  dest,
  onClose,
}: {
  dest: Destination;
  onClose: () => void;
}) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [activeImg, setActiveImg] = useState(0);
  const meta = metaForDest(dest);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl max-h-[94vh] lg:max-h-[88vh] overflow-y-auto rounded-t-[28px] lg:rounded-[28px] flex flex-col"
        style={{
          background: "rgba(7,18,14,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero image ── */}
        <div className="relative flex-shrink-0 h-64 lg:h-80 overflow-hidden rounded-t-[28px] lg:rounded-t-[28px]">
          <ImageWithFallback
            src={dest.gallery[activeImg] ?? dest.hero}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(7,18,14,0.85) 100%)" }}
          />

          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <X size={16} color="white" />
          </button>

          {/* category badge */}
          <div className="absolute top-4 left-4">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: `${meta.accent}18`,
                border: `1px solid ${meta.accent}40`,
                color: meta.accent,
                fontSize: 10,
                letterSpacing: "0.16em",
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              <meta.Icon size={10} />
              {dest.category.toUpperCase()}
            </span>
          </div>

          {/* bottom: name + location */}
          <div className="absolute bottom-5 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={12} color="rgba(255,255,255,0.5)" />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>
                {dest.location}
              </p>
            </div>
            <h2
              className="text-white"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(26px, 4vw, 40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              {dest.name}
            </h2>
          </div>

          {/* gallery thumb nav */}
          <div className="absolute bottom-5 right-6 flex gap-1.5">
            {dest.gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                className="rounded-full transition-all"
                style={{
                  width: i === activeImg ? 20 : 6,
                  height: 6,
                  background: i === activeImg ? meta.accent : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0 divide-x" style={{ borderColor: "rgba(255,255,255,0.07)" }}>

            {/* Left: description */}
            <div className="p-6 lg:p-8">
              <p
                className="mb-5 italic"
                style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontStyle: "italic" }}
              >
                {dest.tagline}
              </p>

              <div className="space-y-4">
                {dest.description.map((para, i) => (
                  <p key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.8 }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Gallery grid */}
              <div className="mt-7 grid grid-cols-4 gap-2">
                {dest.gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      height: 72,
                      border: `2px solid ${i === activeImg ? meta.accent : "transparent"}`,
                    }}
                  >
                    <ImageWithFallback
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: details sidebar */}
            <div className="p-6 lg:p-7 flex flex-col gap-6">
              {/* Quick facts */}
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                  QUICK FACTS
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.2)" }}>
                      <Calendar size={13} color="#F4B942" />
                    </div>
                    <div>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>BEST TIME</p>
                      <p style={{ fontSize: 13, color: "white" }}>{dest.bestTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.2)" }}>
                      <Clock size={13} color="#F4B942" />
                    </div>
                    <div>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>IDEAL DURATION</p>
                      <p style={{ fontSize: 13, color: "white" }}>{dest.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                  HIGHLIGHTS
                </p>
                <div className="space-y-2.5">
                  {dest.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${meta.accent}18`, border: `1px solid ${meta.accent}35` }}
                      >
                        <Star size={8} color={meta.accent} />
                      </div>
                      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{h}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/contact")}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${meta.accent}cc, ${meta.accent}88)`,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    fontFamily: "'Clash Display', sans-serif",
                    color: meta.accent === "#F472B6" || meta.accent === "#FB923C" ? "white" : "#07120E",
                  }}
                >
                  PLAN A VISIT
                  <ArrowUpRight size={15} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Destination card ──────────────────────────────────────────────────────────
function DestCard({ dest, index, onOpen }: { dest: Destination; index: number; onOpen: () => void }) {
  const meta = metaForDest(dest);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className="group relative rounded-[22px] overflow-hidden cursor-pointer"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      whileHover={{ y: -5 }}
    >
      {/* image */}
      <div className="relative overflow-hidden" style={{ height: 240 }}>
        <ImageWithFallback
          src={dest.hero}
          alt={dest.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(7,18,14,0.78) 100%)" }}
        />

        {/* category badge */}
        <span
          className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: `${meta.accent}18`,
            border: `1px solid ${meta.accent}40`,
            color: meta.accent,
            fontSize: 9,
            letterSpacing: "0.14em",
            fontFamily: "'Clash Display', sans-serif",
          }}
        >
          <meta.Icon size={9} />
          {dest.category.toUpperCase()}
        </span>

        {/* arrow icon */}
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <ArrowUpRight size={13} color="white" />
        </div>

        {/* name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={10} color="rgba(255,255,255,0.45)" />
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
              {dest.location.split(" · ")[0]}
            </p>
          </div>
          <h3
            className="text-white"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 20,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {dest.name}
          </h3>
        </div>
      </div>

      {/* footer strip */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4, maxWidth: "80%" }}>
          {dest.tagline}
        </p>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <Clock size={10} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{dest.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
// tourTag from URL → categoryId
const TAG_TO_CAT_ID: Record<string, CategoryId> = {
  Heritage:  "heritage",
  Scenic:    "scenic",
  Safari:    "safari",
  Beaches:   "beaches",
  Honeymoon: "honeymoon",
  Adventure: "adventure",
};

function PageContent() {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const initialCategory = (): CategoryId => {
    const tag = searchParams.get("category");
    return tag && TAG_TO_CAT_ID[tag] ? TAG_TO_CAT_ID[tag] : "all";
  };

  const [categoryId, setCategoryId] = useState<CategoryId>(initialCategory);

  // sync when URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setCategoryId(initialCategory());
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (categoryId === "all") return DESTINATIONS;
    const cat = CATEGORIES.find((c) => c.id === categoryId)!;
    return DESTINATIONS.filter((d) => d.category === cat.label);
  }, [categoryId]);

  const selectedDest = DESTINATIONS.find((d) => d.id === selectedId) ?? null;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #07120E 0%, #030A06 100%)" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" solid />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-10" style={{ background: "#F4B942" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#F4B942" }}>
            EXPLORE SRI LANKA
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(40px, 6vw, 76px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              color: "white",
            }}
          >
            Experiences crafted<br />
            <span
              style={{
                background: "linear-gradient(120deg, #F4B942 0%, #ffffff 55%, #7BC8A4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for every traveler.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.75,
              maxWidth: 380,
            }}
          >
            {filtered.length} destination{filtered.length !== 1 ? "s" : ""} —
            click any to read the full story and plan your visit.
          </motion.p>
        </div>
      </section>

      {/* ── Sticky category filter ── */}
      <div
        className="sticky top-[72px] z-30 border-b"
        style={{
          background: "rgba(7,18,14,0.94)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar"
          style={{ maxWidth: 1320 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = categoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive ? `${cat.accent}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? cat.accent + "55" : "rgba(255,255,255,0.1)"}`,
                  color: isActive ? cat.accent : "rgba(255,255,255,0.6)",
                  fontSize: 12.5,
                  letterSpacing: "0.03em",
                }}
              >
                <cat.Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Destinations grid ── */}
      <section className="py-12 pb-28 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            layout
          >
            {filtered.map((dest, i) => (
              <DestCard
                key={dest.id}
                dest={dest}
                index={i}
                onOpen={() => setSelectedId(dest.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <Footer />

      {/* ── Destination detail modal ── */}
      <AnimatePresence>
        {selectedDest && (
          <DestinationModal
            dest={selectedDest}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
