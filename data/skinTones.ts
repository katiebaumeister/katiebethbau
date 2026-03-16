/**
 * 30-shade skin tone system — real data for color/fabric coordination.
 * Name, base_hex, and palette from provided shade system.
 * Used by SkinToneSelector and recommendation engine for best fabric colors.
 */

import type { SkinTone, Undertone, Depth } from "@/lib/types";

interface RawShade {
  name: string;
  base_hex: string;
  palette: string[];
}

/** Derive undertone from shade name (e.g. "Golden – fair" → warm) */
function undertoneFromName(name: string): Undertone {
  const n = name.toLowerCase();
  if (n.includes("golden olive") || n.includes("olive")) return "olive";
  if (n.includes("rosy") && !n.includes("neutral")) return "cool";
  if (n.includes("rich red")) return "cool";
  if (n.includes("golden") && !n.includes("neutral")) return "warm";
  if (n.includes("peach") && !n.includes("neutral")) return "warm";
  return "neutral";
}

/** Derive depth from shade name */
function depthFromName(name: string): Depth {
  const n = name.toLowerCase();
  if (n.includes("fair")) return "fair";
  if (n.includes("light")) return "light";
  if (n.includes("medium")) return "medium";
  if (n.includes("tan")) return "tan";
  if (n.includes("dark")) return "dark";
  if (n.includes("deep") && !n.includes("rich")) return "deep";
  if (n.includes("rich")) return "rich";
  return "medium";
}

const rawShades: Record<string, RawShade> = {
  "1": { name: "Golden – fair with golden undertones", base_hex: "#F3D4C4", palette: ["porcelain sand", "buttercream", "light oat", "pale khaki", "linen beige", "blonde camel", "warm driftwood", "light greige", "honey sand", "wheat dust", "soft olive sand", "muted champagne", "pale clay", "light caramel", "ivory taupe"] },
  "2": { name: "Rosy – fair with rosy undertones", base_hex: "#F1CFCB", palette: ["rose ivory", "powder pink beige", "shell taupe", "blush sand", "soft mauve grey", "pink clay", "antique rose", "mushroom pink", "dusty taupe", "rosewood ash", "soft plum taupe", "lavender stone", "faded cranberry", "cool driftwood", "rose beige"] },
  "3": { name: "Rosy Neutral – fair", base_hex: "#EBC9C3", palette: ["soft petal beige", "shell grey", "muted rose clay", "cool taupe", "faded coral sand", "blush stone", "pale mauve beige", "rosewood dust", "light plum grey", "powdered berry", "soft cocoa rose", "stone mauve", "mushroom blush", "ash rosewood", "cool greige"] },
  "4": { name: "Golden – fair", base_hex: "#EED1B5", palette: ["warm ivory", "oat milk", "barley sand", "light wheat", "golden taupe", "camel dust", "sunlit khaki", "pale honey", "beige linen", "champagne clay", "warm stone", "golden driftwood", "butterscotch beige", "light adobe", "faded straw"] },
  "5": { name: "Golden Neutral – fair", base_hex: "#E6C4A8", palette: ["soft almond", "cream khaki", "warm greige", "camel sand", "faded wheat", "oyster taupe", "muted caramel", "beige clay", "dry grass", "stone sand", "soft olive dust", "linen tan", "honey driftwood", "pale cinnamon", "warm pebble"] },
  "6": { name: "Neutral – light", base_hex: "#E2C1AE", palette: ["mushroom beige", "oyster stone", "soft clay", "muted camel", "driftwood", "taupe sand", "pale cocoa", "warm greige", "ash beige", "dry clay", "soft olive taupe", "muted copper sand", "stone camel", "pale espresso", "weathered wood"] },
  "7": { name: "Peachy Neutral – light", base_hex: "#E3B79C", palette: ["apricot sand", "peach clay", "coral beige", "terracotta dust", "muted cinnamon", "warm adobe", "burnt peach", "light paprika", "rosewood clay", "soft caramel", "clay taupe", "faded rust", "sunbaked sand", "light chestnut", "warm driftwood"] },
  "8": { name: "Golden – light", base_hex: "#E1B78C", palette: ["wheat", "golden camel", "honey beige", "light ochre", "barley brown", "camel taupe", "pale saffron", "soft bronze", "golden clay", "dry grass", "light olive sand", "warm stone", "faded caramel", "sunlit driftwood", "amber sand"] },
  "9": { name: "Golden – light", base_hex: "#DDAE82", palette: ["camel", "wheat brown", "sunlit clay", "honey tan", "light terracotta", "amber camel", "muted saffron", "golden driftwood", "soft olive clay", "light cinnamon", "warm adobe", "dry hay", "burnished bronze", "caramel beige", "sandstone brown"] },
  "10": { name: "Neutral – light", base_hex: "#D9A98E", palette: ["rose taupe", "soft cinnamon", "light mocha", "stone clay", "muted rust", "soft cocoa", "warm greige", "faded terracotta", "taupe brown", "driftwood brown", "mushroom brown", "light umber", "rosewood taupe", "soft espresso", "burnt almond"] },
  "11": { name: "Golden – medium", base_hex: "#D39A6E", palette: ["caramel", "golden camel", "honey brown", "amber clay", "sunbaked terracotta", "burnt saffron", "soft bronze", "toasted almond", "warm khaki", "muted paprika", "light mahogany", "copper clay", "dry grass brown", "burnt honey", "camel driftwood"] },
  "12": { name: "Peach – medium", base_hex: "#D4936E", palette: ["peach clay", "burnt apricot", "paprika sand", "muted coral clay", "rosewood brown", "terracotta", "rust sand", "warm adobe", "soft cinnamon", "burnt sienna", "clay brown", "warm chestnut", "copper sand", "muted brick", "peach umber"] },
  "13": { name: "Olive – medium", base_hex: "#C8A074", palette: ["olive khaki", "moss taupe", "lichen", "sage clay", "muted olive brown", "khaki sand", "olive driftwood", "eucalyptus brown", "olive umber", "soft moss", "fern dust", "bay leaf brown", "olive camel", "dry moss", "muted pistachio earth"] },
  "14": { name: "Golden – medium", base_hex: "#C98758", palette: ["burnt caramel", "amber brown", "cinnamon", "terracotta clay", "burnt sugar", "golden mahogany", "bronze clay", "warm chestnut", "copper brown", "sunbaked adobe", "dry paprika", "golden umber", "caramel rust", "burnt honey", "amber driftwood"] },
  "15": { name: "Golden Neutral – medium", base_hex: "#C89466", palette: ["camel brown", "caramel taupe", "warm stone brown", "muted copper", "light cocoa", "driftwood brown", "soft mahogany", "burnt almond", "clay brown", "warm umber", "amber taupe", "rust beige", "bronze taupe", "dry earth", "muted sienna"] },
  "16": { name: "Peachy Neutral – tan", base_hex: "#C78357", palette: ["burnt peach", "rust clay", "muted copper", "cinnamon brown", "terracotta", "burnt caramel", "rosewood brown", "warm mahogany", "rust umber", "burnt sienna", "copper brown", "soft paprika", "sunbaked clay", "faded brick", "deep caramel"] },
  "17": { name: "Golden Peach – tan", base_hex: "#C87D4C", palette: ["amber rust", "burnt honey", "golden terracotta", "copper clay", "paprika brown", "burnt amber", "sunset clay", "muted bronze", "burnt sienna", "cinnamon rust", "warm mahogany", "deep caramel", "golden umber", "dry adobe", "bronze earth"] },
  "18": { name: "Golden Neutral – tan", base_hex: "#BE7A4E", palette: ["camel brown", "caramel rust", "bronze brown", "amber clay", "burnt cinnamon", "mahogany tan", "dry paprika", "burnt umber", "copper earth", "rust brown", "warm driftwood", "deep honey", "sunbaked clay", "burnt sugar", "earth brown"] },
  "19": { name: "Golden – tan", base_hex: "#B46F3F", palette: ["burnt caramel", "deep amber", "rust brown", "bronze", "mahogany", "paprika", "burnt sienna", "deep cinnamon", "warm umber", "burnt honey", "copper brown", "sunbaked terracotta", "deep adobe", "dry rust", "burnished bronze"] },
  "20": { name: "Golden – tan", base_hex: "#A85F33", palette: ["deep caramel", "burnt amber", "rust umber", "mahogany", "copper brown", "deep cinnamon", "burnt sienna", "bronze earth", "sunbaked clay", "warm cocoa", "burnt terracotta", "deep paprika", "burnished rust", "dry adobe", "dark honey"] },
  "21": { name: "Neutral – dark", base_hex: "#8F5536", palette: ["walnut", "espresso", "bitter chocolate", "burnt umber", "deep cocoa", "mahogany brown", "tobacco", "dark chestnut", "oak brown", "charcoal brown", "warm graphite", "deep driftwood", "burnt bark", "dark adobe", "coffee bean"] },
  "22": { name: "Golden Olive – dark", base_hex: "#8C5C33", palette: ["olive brown", "moss brown", "deep khaki", "olive umber", "fern brown", "deep lichen", "bay leaf brown", "dark olive clay", "moss driftwood", "olive espresso", "dark sage brown", "earth olive", "forest taupe", "olive bark", "moss charcoal"] },
  "23": { name: "Golden Neutral – dark", base_hex: "#8A4F2F", palette: ["tobacco", "burnt chestnut", "dark cinnamon", "mahogany", "deep caramel", "espresso brown", "bitter chocolate", "burnt umber", "oak brown", "deep driftwood", "rust umber", "dark adobe", "burnt bark", "warm charcoal", "coffee bean"] },
  "24": { name: "Neutral – dark", base_hex: "#7C4932", palette: ["dark walnut", "espresso", "deep cocoa", "burnt bark", "charcoal brown", "mahogany", "coffee bean", "dark oak", "deep umber", "warm graphite", "deep driftwood", "bitter chocolate", "burnt sienna", "dark rust", "charred cedar"] },
  "25": { name: "Golden Olive – dark", base_hex: "#7C4F28", palette: ["dark olive", "moss umber", "olive espresso", "deep khaki", "fern bark", "earth olive", "olive charcoal", "deep lichen", "bay leaf umber", "forest taupe", "olive driftwood", "moss charcoal", "olive bark", "deep sage brown", "earth moss"] },
  "26": { name: "Neutral – deep", base_hex: "#6C3E2C", palette: ["dark espresso", "black coffee", "deep umber", "bitter chocolate", "dark mahogany", "charred wood", "charcoal brown", "burnt bark", "smoked walnut", "deep cocoa", "dark driftwood", "warm graphite", "burnt cedar", "deep oak", "ink brown"] },
  "27": { name: "Neutral – deep", base_hex: "#5C3526", palette: ["midnight cocoa", "black walnut", "dark espresso", "burnt umber", "charcoal brown", "deep mahogany", "charred cedar", "coffee bean", "deep oak", "ink brown", "black driftwood", "smoked chocolate", "burnt bark", "dark graphite", "deep rust brown"] },
  "28": { name: "Golden – deep", base_hex: "#6C3A22", palette: ["burnt caramel", "dark amber", "mahogany", "burnt sienna", "deep copper", "rust umber", "dark cinnamon", "burnt honey", "deep adobe", "bronze brown", "dark terracotta", "warm espresso", "burnished bronze", "deep clay", "dark rust"] },
  "29": { name: "Rich Red – deep", base_hex: "#5B2B1F", palette: ["oxblood", "deep burgundy", "mahogany red", "dark garnet", "wine brown", "deep rust", "burnt crimson", "black cherry", "red umber", "dark brick", "copper red", "deep sienna", "burnt maroon", "bloodstone", "rich auburn"] },
  "30": { name: "Rich Neutral – deep", base_hex: "#4A2318", palette: ["black espresso", "dark chocolate", "ink brown", "charcoal black", "deep walnut", "burnt bark", "dark mahogany", "smoked cocoa", "charred oak", "deep umber", "espresso charcoal", "coffee black", "burnt cedar", "shadow brown", "black driftwood"] },
};

export const skinTones: SkinTone[] = Object.entries(rawShades).map(([num, raw]) => {
  const shadeNumber = parseInt(num, 10);
  return {
    id: `st-${num}`,
    shadeNumber,
    name: raw.name,
    description: raw.name,
    baseHex: raw.base_hex,
    undertone: undertoneFromName(raw.name),
    depth: depthFromName(raw.name),
    coordinatingNeutralPalette: raw.palette,
  };
});

export function getSkinToneById(id: string): SkinTone | undefined {
  return skinTones.find((s) => s.id === id);
}
