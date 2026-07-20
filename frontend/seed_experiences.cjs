const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const code = fs.readFileSync('old_page.txt', 'utf16le');
  const match = code.match(/const DESTINATIONS: Destination\[\] = (\[[\s\S]*?\]);\s*\n\s*\/\//);
  
  if (!match) {
    console.log("Could not find DESTINATIONS array");
    return;
  }
  
  const arrayCode = match[1];
  
  // Clean up type annotations if any, though the array is just an object literal array
  let DESTINATIONS;
  try {
    DESTINATIONS = eval('(' + arrayCode + ')');
  } catch(e) {
    console.error("Eval failed", e);
    return;
  }
  
  const prisma = new PrismaClient();
  
  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  console.log(`Found ${DESTINATIONS.length} destinations, seeding to db...`);
  
  for (const dest of DESTINATIONS) {
    const slug = generateSlug(dest.name);
    
    // Parse location
    const parts = dest.location.split(" · ");
    const locationPlace = parts[0] || dest.location;
    const locationCountry = parts[1] || "Sri Lanka";
    
    // Parse bestTime
    const btParts = dest.bestTime.split(" – ");
    const bestTimeStart = btParts[0]?.trim() || "January";
    const bestTimeEnd = btParts[1]?.trim() || btParts[0]?.trim() || "December";
    
    const contentBlocks = dest.description.map(p => ({
      type: "paragraph",
      value: p
    }));
    
    await prisma.experience.create({
      data: {
        title: dest.name,
        slug: slug,
        locationPlace,
        locationCountry,
        tagline: dest.tagline,
        bestTimeStart,
        bestTimeEnd,
        highlights: JSON.stringify(dest.highlights || []),
        contentBlocks: JSON.stringify(contentBlocks),
        gallery: JSON.stringify([dest.hero, ...(dest.gallery || [])]),
        status: "PUBLISHED"
      }
    });
  }
  
  console.log("Done seeding experiences!");
}

main().catch(console.error);
