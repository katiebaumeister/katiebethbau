import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Difficulty = "beginner" | "intermediate" | "advanced";

interface CategorySeed {
  code: string;
  name: string;
  display_order: number;
}

interface StyleSeed {
  id: number;
  slug: string;
  style_name: string;
  short_description: string;
  category_code: string;
  category_name: string;
  silhouette_tags: string[];
  fabric_type_default: string;
  fit_intent: string;
  difficulty_level: Difficulty;
  closure_type: string | null;
  thumbnail_image_url: string;
  front_illustration_url: string;
  back_illustration_url: string;
  active: boolean;
}

interface MeasurementTypeSeed {
  code: string;
  label: string;
  body_zone: string;
  unit: "in";
  description: string;
}

interface FabricSeed {
  code: string;
  name: string;
  fabric_family: string;
  stretch_type: "none" | "2_way" | "4_way";
  drape_level: "low" | "medium" | "high";
  structure_level: "soft" | "balanced" | "structured";
  weight_category: "very_light" | "light" | "medium" | "heavy";
  supportiveness: "low" | "medium" | "high";
  recommendation_strength: "ideal" | "good" | "possible" | "avoid";
  reason: string;
}

interface NoDbProfile {
  id: number;
  user_id: string;
  profile_name: string;
  preferred_unit: "in" | "cm";
  body_notes: string | null;
  posture_notes: string | null;
  fitting_preferences: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface NoDbMeasurement {
  profile_id: number;
  code: string;
  label: string;
  value: number;
  entered_method: "manual" | "guided" | "estimated" | "imported";
  confidence_level: "low" | "medium" | "high";
  note: string | null;
}

interface NoDbGenerated {
  id: number;
  generated_at: string;
}

const CATEGORIES: CategorySeed[] = [
  { code: "pants", name: "Pants", display_order: 1 },
  { code: "skirts", name: "Skirts", display_order: 2 },
  { code: "shorts", name: "Shorts", display_order: 3 },
  { code: "tops", name: "Tops", display_order: 4 },
  { code: "tanks", name: "Tanks", display_order: 5 },
  { code: "bras", name: "Bras", display_order: 6 },
  { code: "underwear", name: "Underwear / Short-shorts", display_order: 7 },
  { code: "long_sleeves", name: "Long Sleeves", display_order: 8 },
  { code: "denims", name: "Denims", display_order: 9 },
  { code: "dresses", name: "Dresses", display_order: 10 },
];

const STYLE_TUPLES: Array<
  [string, string, string, string[], string, string, Difficulty, string | null, string]
> = [
  ["pants", "straight_leg_trouser", "Straight-Leg Trouser", ["tailored", "straight", "classic"], "woven suiting", "semi_fitted", "intermediate", "zip", "Classic tailored trouser with straight leg from hip to hem"],
  ["pants", "wide_leg_trouser", "Wide-Leg Trouser", ["tailored", "wide_leg", "fluid"], "woven suiting", "semi_fitted", "intermediate", "zip", "Tailored trouser with fuller volume through the leg"],
  ["pants", "cigarette_pant", "Slim Cigarette Pant", ["tailored", "slim", "cropped"], "woven stretch", "close_fitted", "intermediate", "zip", "Narrow tailored pant with slim ankle line"],
  ["pants", "pleated_trouser", "Pleated Trouser", ["tailored", "pleated", "classic"], "woven suiting", "semi_fitted", "advanced", "zip", "Trouser with front pleats and added thigh ease"],
  ["pants", "elastic_waist_lounge_pant", "Elastic-Waist Lounge Pant", ["casual", "pull_on", "relaxed"], "woven or knit", "relaxed", "beginner", "elastic", "Casual pull-on pant with elasticized waist"],
  ["skirts", "pencil_skirt", "Pencil Skirt", ["fitted", "straight", "classic"], "woven", "close_fitted", "intermediate", "zip", "Straight fitted skirt with waist darts and narrow silhouette"],
  ["skirts", "a_line_skirt", "A-Line Skirt", ["a_line", "classic", "versatile"], "woven", "semi_fitted", "beginner", "zip", "Skirt fitted at waist with gradual flare to hem"],
  ["skirts", "mini_skirt", "Mini Skirt", ["mini", "classic", "fashion"], "woven", "semi_fitted", "beginner", "zip", "Short skirt base for tailored or casual interpretations"],
  ["skirts", "bias_cut_skirt", "Bias-Cut Skirt", ["bias_cut", "fluid", "draped"], "drapey woven", "semi_fitted", "advanced", "pull_on", "Skirt cut on bias for drape and movement"],
  ["skirts", "gathered_skirt", "Gathered Skirt", ["gathered", "full", "romantic"], "woven", "relaxed", "beginner", "zip", "Waist-controlled fullness gathered into waistband"],
  ["shorts", "tailored_short", "Tailored Short", ["tailored", "classic", "structured"], "woven", "semi_fitted", "intermediate", "zip", "Structured short with waistband and clean leg shape"],
  ["shorts", "bermuda_short", "Bermuda Short", ["tailored", "bermuda", "elongated"], "woven", "semi_fitted", "intermediate", "zip", "Longer tailored short ending above or near knee"],
  ["shorts", "elastic_lounge_short", "Elastic Lounge Short", ["casual", "pull_on", "relaxed"], "woven or knit", "relaxed", "beginner", "elastic", "Easy pull-on short with elastic waist"],
  ["shorts", "high_waisted_fitted_short", "High-Waisted Fitted Short", ["high_waist", "fitted", "fashion"], "woven stretch", "close_fitted", "intermediate", "zip", "Short with shaped high waist and close fit through hip"],
  ["shorts", "running_gym_short", "Running / Gym Short", ["athletic", "functional", "lightweight"], "performance woven or knit", "relaxed", "intermediate", "elastic", "Athletic short with movement-focused cut"],
  ["tops", "classic_button_up_shirt", "Classic Button-Up Shirt", ["shirt", "tailored", "classic"], "woven shirting", "semi_fitted", "advanced", "buttons", "Traditional collared shirt with front placket and set-in sleeves"],
  ["tops", "tshirt_block", "T-Shirt Block", ["tee", "knit", "classic"], "jersey knit", "semi_fitted", "beginner", "pull_on", "Basic crewneck knit tee with short sleeves"],
  ["tops", "boxy_woven_shell", "Boxy Woven Shell Top", ["boxy", "minimal", "shell"], "woven", "relaxed", "beginner", "pull_on", "Minimal shell in woven fabric"],
  ["tops", "wrap_top", "Wrap Top", ["wrap", "feminine", "adjustable"], "woven or knit", "semi_fitted", "intermediate", "wrap", "Top crossing over front body and tying at waist"],
  ["tops", "peplum_top", "Peplum Top", ["waist_seam", "peplum", "fitted"], "woven or knit", "close_fitted", "intermediate", "zip", "Fitted upper body with waist seam and flared lower section"],
  ["tanks", "scoop_neck_tank", "Basic Scoop-Neck Tank", ["tank", "scoop_neck", "basic"], "knit", "close_fitted", "beginner", "pull_on", "Essential sleeveless knit tank"],
  ["tanks", "high_neck_tank", "High-Neck Tank", ["tank", "high_neck", "clean"], "knit", "close_fitted", "beginner", "pull_on", "Sleeveless top with high clean neckline"],
  ["tanks", "racerback_tank", "Racerback Tank", ["tank", "racerback", "athletic"], "knit", "close_fitted", "beginner", "pull_on", "Tank with athletic racerback armhole and back shaping"],
  ["tanks", "cami_strap_top", "Camisole with Straps", ["cami", "straps", "lightweight"], "woven or knit", "semi_fitted", "beginner", "pull_on", "Light top with narrow straps and soft body"],
  ["tanks", "square_neck_tank", "Square-Neck Tank", ["tank", "square_neck", "fashion_basic"], "knit or stable woven", "close_fitted", "beginner", "pull_on", "Tank with squared neckline"],
  ["bras", "soft_bralette", "Soft Bralette", ["bralette", "soft", "light_support"], "stretch knit", "close_fitted", "intermediate", "elastic", "Unstructured soft support bra"],
  ["bras", "triangle_bra", "Triangle Bra", ["triangle", "lingerie", "minimal"], "stretch knit or lingerie fabric", "close_fitted", "intermediate", "elastic", "Minimal bra with triangle cups"],
  ["bras", "underwire_bra_basic", "Underwire Bra Basic", ["underwire", "structured", "support"], "lingerie fabric", "close_fitted", "advanced", "hook_and_eye", "Structured bra with underwire support"],
  ["bras", "longline_bra", "Longline Bra", ["longline", "lingerie", "support"], "lingerie fabric", "close_fitted", "advanced", "hook_and_eye", "Bra extending below underbust with longer band"],
  ["bras", "sports_bra", "Sports Bra", ["sports", "compression", "support"], "performance knit", "close_fitted", "intermediate", "pull_on", "Supportive stretch bra for movement"],
  ["underwear", "classic_brief", "Classic Brief", ["brief", "classic", "intimate"], "stretch knit", "close_fitted", "beginner", "elastic", "Standard brief with moderate coverage"],
  ["underwear", "high_waisted_brief", "High-Waisted Brief", ["brief", "high_waist", "retro"], "stretch knit", "close_fitted", "beginner", "elastic", "Brief rising to natural waist or above"],
  ["underwear", "bikini_underwear", "Bikini Underwear", ["bikini", "low_rise", "intimate"], "stretch knit", "close_fitted", "beginner", "elastic", "Lower-rise brief with lighter side profile"],
  ["underwear", "boyshort", "Boyshort", ["boyshort", "short_leg", "intimate"], "stretch knit", "close_fitted", "beginner", "elastic", "Short-legged underwear with more seat coverage"],
  ["underwear", "fitted_short_short", "Fitted Short-Short", ["short_short", "fitted", "active"], "stretch knit", "close_fitted", "beginner", "elastic", "Very short close-fitting bottom"],
  ["long_sleeves", "fitted_long_sleeve_tee", "Classic Fitted Long-Sleeve Tee", ["tee", "long_sleeve", "knit"], "jersey knit", "close_fitted", "beginner", "pull_on", "Close-fitting knit tee with full sleeves"],
  ["long_sleeves", "crewneck_sweatshirt", "Crewneck Sweatshirt", ["sweatshirt", "crewneck", "casual"], "fleece or sweatshirt knit", "relaxed", "beginner", "pull_on", "Relaxed knit pullover with long sleeves"],
  ["long_sleeves", "turtleneck_top", "Turtleneck", ["turtleneck", "knit", "fitted"], "stretch knit", "close_fitted", "intermediate", "pull_on", "Long-sleeve knit top with funnel/turtle neck"],
  ["long_sleeves", "henley_top", "Henley", ["henley", "knit", "placket"], "jersey knit", "semi_fitted", "intermediate", "buttons", "Long-sleeve knit top with partial placket"],
  ["long_sleeves", "buttoned_blouse_cuff", "Buttoned Blouse with Cuff", ["blouse", "woven", "cuff"], "woven blouse fabric", "semi_fitted", "advanced", "buttons", "Woven blouse with full sleeve and cuff finish"],
  ["denims", "straight_jean", "Straight Jean", ["jeans", "straight", "denim"], "denim", "semi_fitted", "advanced", "zip", "Classic denim jean with straight leg"],
  ["denims", "bootcut_jean", "Bootcut Jean", ["jeans", "bootcut", "denim"], "denim", "semi_fitted", "advanced", "zip", "Jean fitted through thigh and flared from knee"],
  ["denims", "wide_leg_jean", "Wide-Leg Jean", ["jeans", "wide_leg", "denim"], "denim", "semi_fitted", "advanced", "zip", "Jean with fuller leg silhouette"],
  ["denims", "denim_skirt", "Denim Skirt", ["skirt", "denim", "structured"], "denim", "semi_fitted", "intermediate", "zip", "Structured denim skirt"],
  ["denims", "denim_jacket", "Denim Jacket", ["jacket", "denim", "classic"], "denim", "semi_fitted", "advanced", "buttons", "Classic denim jacket with collar and placket"],
  ["dresses", "shift_dress", "Shift Dress", ["shift", "clean", "classic"], "woven", "relaxed", "beginner", "zip", "Simple dress falling from shoulder with minimal waist shaping"],
  ["dresses", "sheath_dress", "Sheath Dress", ["sheath", "fitted", "classic"], "woven", "close_fitted", "intermediate", "zip", "Fitted dress shaped through torso and hip"],
  ["dresses", "slip_dress", "Slip Dress", ["slip", "bias", "draped"], "drapey woven", "semi_fitted", "advanced", "pull_on", "Bias or draped dress with narrow straps"],
  ["dresses", "shirt_dress", "Shirt Dress", ["shirt_dress", "classic", "structured"], "woven shirting", "semi_fitted", "advanced", "buttons", "Dress built from shirt block with collar and placket"],
  ["dresses", "wrap_dress", "Wrap Dress", ["wrap", "adjustable", "classic"], "woven or knit", "semi_fitted", "intermediate", "wrap", "Dress crossing over body and adjusting through wrap closure"],
];

const STYLES: StyleSeed[] = STYLE_TUPLES.map((s, index) => {
  const category = CATEGORIES.find((c) => c.code === s[0])!;
  const slug = s[1];
  return {
    id: index + 1,
    category_code: category.code,
    category_name: category.name,
    slug,
    style_name: s[2],
    short_description: s[8],
    silhouette_tags: s[3],
    fabric_type_default: s[4],
    fit_intent: s[5],
    difficulty_level: s[6],
    closure_type: s[7],
    thumbnail_image_url: `/images/styles/${slug}/thumb.svg`,
    front_illustration_url: `/images/styles/${slug}/front.svg`,
    back_illustration_url: `/images/styles/${slug}/back.svg`,
    active: true,
  };
});

const MEASUREMENT_TYPES: MeasurementTypeSeed[] = [
  { code: "shoulder_width", label: "Shoulder Width", body_zone: "upper_body", unit: "in", description: "Across shoulder points" },
  { code: "bust_full", label: "Full Bust", body_zone: "upper_body", unit: "in", description: "Around fullest bust" },
  { code: "bust_high", label: "High Bust", body_zone: "upper_body", unit: "in", description: "Upper chest" },
  { code: "underbust", label: "Underbust", body_zone: "upper_body", unit: "in", description: "Around ribcage under bust" },
  { code: "bust_apex_to_apex", label: "Bust Apex to Apex", body_zone: "upper_body", unit: "in", description: "Apex spacing" },
  { code: "waist_natural", label: "Natural Waist", body_zone: "mid_body", unit: "in", description: "Narrowest waist" },
  { code: "high_hip", label: "High Hip", body_zone: "lower_body", unit: "in", description: "Upper hip" },
  { code: "hip_full", label: "Full Hip", body_zone: "lower_body", unit: "in", description: "Fullest hip" },
  { code: "waist_to_hip", label: "Waist to Hip Depth", body_zone: "mid_body", unit: "in", description: "Vertical waist-to-hip depth" },
  { code: "rise_front", label: "Front Rise", body_zone: "lower_body", unit: "in", description: "Front rise length" },
  { code: "rise_back", label: "Back Rise", body_zone: "lower_body", unit: "in", description: "Back rise length" },
  { code: "inseam", label: "Inseam", body_zone: "lower_body", unit: "in", description: "Crotch to hem" },
  { code: "outseam", label: "Outseam", body_zone: "lower_body", unit: "in", description: "Waist to hem outer leg" },
  { code: "armhole_depth", label: "Armhole Depth", body_zone: "upper_body", unit: "in", description: "Armhole depth for sleeve fit" },
  { code: "bicep_circumference", label: "Bicep Circumference", body_zone: "upper_body", unit: "in", description: "Fullest upper arm" },
  { code: "back_waist_length", label: "Back Waist Length", body_zone: "upper_body", unit: "in", description: "Back neck to waist" },
  { code: "skirt_length_target", label: "Skirt Length Target", body_zone: "lower_body", unit: "in", description: "Desired skirt length" },
  { code: "dress_length_target", label: "Dress Length Target", body_zone: "overall", unit: "in", description: "Desired dress length" },
  { code: "band_size_target", label: "Bra Band Size Target", body_zone: "upper_body", unit: "in", description: "Preferred band size" },
];

const REQUIREMENTS_BY_CATEGORY: Record<string, string[]> = {
  pants: ["waist_natural", "high_hip", "hip_full", "waist_to_hip", "rise_front", "rise_back", "inseam", "outseam"],
  skirts: ["waist_natural", "high_hip", "hip_full", "waist_to_hip", "skirt_length_target"],
  shorts: ["waist_natural", "high_hip", "hip_full", "waist_to_hip", "rise_front", "rise_back", "inseam"],
  tops: ["shoulder_width", "bust_full", "bust_high", "waist_natural", "back_waist_length", "armhole_depth"],
  tanks: ["shoulder_width", "bust_full", "bust_high", "waist_natural", "back_waist_length", "armhole_depth"],
  bras: ["underbust", "bust_full", "bust_apex_to_apex", "band_size_target"],
  underwear: ["waist_natural", "high_hip", "hip_full", "rise_front", "rise_back"],
  long_sleeves: ["shoulder_width", "bust_full", "bust_high", "waist_natural", "back_waist_length", "armhole_depth", "bicep_circumference"],
  denims: ["waist_natural", "high_hip", "hip_full", "waist_to_hip", "rise_front", "rise_back", "inseam", "outseam"],
  dresses: ["shoulder_width", "bust_full", "bust_high", "waist_natural", "high_hip", "hip_full", "waist_to_hip", "dress_length_target"],
};

const FABRIC_RECS_BY_CATEGORY: Record<string, FabricSeed[]> = {
  pants: [
    { code: "wool_suiting", name: "Wool Suiting", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "structured", weight_category: "medium", supportiveness: "medium", recommendation_strength: "ideal", reason: "Classic tailored structure." },
    { code: "cotton_twill", name: "Cotton Twill", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "structured", weight_category: "medium", supportiveness: "medium", recommendation_strength: "good", reason: "Durable with clean shape." },
    { code: "ponte", name: "Ponte Knit", fabric_family: "knit", stretch_type: "2_way", drape_level: "medium", structure_level: "balanced", weight_category: "medium", supportiveness: "medium", recommendation_strength: "good", reason: "Comfort with polish." },
  ],
  skirts: [
    { code: "cotton_poplin", name: "Cotton Poplin", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "balanced", weight_category: "light", supportiveness: "low", recommendation_strength: "ideal", reason: "Versatile skirt base." },
    { code: "rayon_challis", name: "Rayon Challis", fabric_family: "woven", stretch_type: "none", drape_level: "high", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "good", reason: "Fluid movement." },
  ],
  shorts: [
    { code: "cotton_twill", name: "Cotton Twill", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "structured", weight_category: "medium", supportiveness: "medium", recommendation_strength: "ideal", reason: "Strong, wearable shorts fabric." },
    { code: "linen", name: "Linen", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "good", reason: "Cool and breathable." },
  ],
  tops: [
    { code: "cotton_shirting", name: "Cotton Shirting", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "balanced", weight_category: "light", supportiveness: "low", recommendation_strength: "ideal", reason: "Shirts and tailored tops." },
    { code: "jersey_cotton", name: "Cotton Jersey", fabric_family: "knit", stretch_type: "2_way", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "good", reason: "Great for tees." },
  ],
  tanks: [
    { code: "jersey_cotton", name: "Cotton Jersey", fabric_family: "knit", stretch_type: "2_way", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "ideal", reason: "Classic tank knit." },
    { code: "rib_knit", name: "Rib Knit", fabric_family: "knit", stretch_type: "2_way", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "medium", recommendation_strength: "good", reason: "Close fit and recovery." },
  ],
  bras: [
    { code: "lingerie_tricot", name: "Lingerie Tricot", fabric_family: "lingerie", stretch_type: "2_way", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "medium", recommendation_strength: "ideal", reason: "Lingerie-specific behavior." },
    { code: "athletic_knit", name: "Athletic Knit", fabric_family: "knit", stretch_type: "4_way", drape_level: "medium", structure_level: "balanced", weight_category: "medium", supportiveness: "high", recommendation_strength: "good", reason: "Sports support." },
  ],
  underwear: [
    { code: "lingerie_tricot", name: "Lingerie Tricot", fabric_family: "lingerie", stretch_type: "2_way", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "medium", recommendation_strength: "ideal", reason: "Comfort and recovery." },
    { code: "jersey_modal", name: "Modal Jersey", fabric_family: "knit", stretch_type: "2_way", drape_level: "high", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "good", reason: "Soft against skin." },
  ],
  long_sleeves: [
    { code: "jersey_cotton", name: "Cotton Jersey", fabric_family: "knit", stretch_type: "2_way", drape_level: "medium", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "ideal", reason: "Standard long sleeve knit." },
    { code: "fleece_sweatshirt", name: "Sweatshirt Fleece", fabric_family: "knit", stretch_type: "2_way", drape_level: "low", structure_level: "soft", weight_category: "heavy", supportiveness: "medium", recommendation_strength: "good", reason: "Sweatshirt weight option." },
  ],
  denims: [
    { code: "denim_nonstretch", name: "Non-Stretch Denim", fabric_family: "woven", stretch_type: "none", drape_level: "low", structure_level: "structured", weight_category: "heavy", supportiveness: "high", recommendation_strength: "ideal", reason: "Classic denim build." },
    { code: "denim_stretch", name: "Stretch Denim", fabric_family: "woven", stretch_type: "2_way", drape_level: "low", structure_level: "structured", weight_category: "medium", supportiveness: "high", recommendation_strength: "good", reason: "Comfort fit denim." },
  ],
  dresses: [
    { code: "rayon_challis", name: "Rayon Challis", fabric_family: "woven", stretch_type: "none", drape_level: "high", structure_level: "soft", weight_category: "light", supportiveness: "low", recommendation_strength: "ideal", reason: "Flow and drape for dresses." },
    { code: "cotton_poplin", name: "Cotton Poplin", fabric_family: "woven", stretch_type: "none", drape_level: "medium", structure_level: "balanced", weight_category: "light", supportiveness: "low", recommendation_strength: "good", reason: "Structured dress shape." },
  ],
};

const STARTER_RULES = [
  {
    rule_code: "starter_fit_check",
    rule_name: "Starter Fit Check",
    rule_type: "adjustment_recommendation",
    severity: "info",
    output_key: "starter_fit_note",
    formula_json: { note: "MVP baseline rule. Replace with per-style formulas." },
  },
];

type GlobalStore = typeof globalThis & {
  __sc_profiles?: NoDbProfile[];
  __sc_measurements?: NoDbMeasurement[];
  __sc_generated?: NoDbGenerated[];
  __sc_profile_seq?: number;
  __sc_generated_seq?: number;
  __sc_loaded_from_file?: boolean;
};

const NO_DB_FILE = path.join(process.cwd(), "data", "runtime", "sewing-closet-local.json");

interface PersistedNoDbState {
  profiles: NoDbProfile[];
  measurements: NoDbMeasurement[];
  generated: NoDbGenerated[];
  profileSeq: number;
  generatedSeq: number;
}

function store() {
  const g = globalThis as GlobalStore;
  if (!g.__sc_profiles) g.__sc_profiles = [];
  if (!g.__sc_measurements) g.__sc_measurements = [];
  if (!g.__sc_generated) g.__sc_generated = [];
  if (!g.__sc_profile_seq) g.__sc_profile_seq = 1;
  if (!g.__sc_generated_seq) g.__sc_generated_seq = 1;
  return g;
}

async function loadPersistedStateIfNeeded(): Promise<void> {
  const s = store();
  if (s.__sc_loaded_from_file) return;
  s.__sc_loaded_from_file = true;

  try {
    const raw = await readFile(NO_DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as PersistedNoDbState;
    s.__sc_profiles = Array.isArray(parsed.profiles) ? parsed.profiles : [];
    s.__sc_measurements = Array.isArray(parsed.measurements) ? parsed.measurements : [];
    s.__sc_generated = Array.isArray(parsed.generated) ? parsed.generated : [];
    s.__sc_profile_seq = Number.isInteger(parsed.profileSeq) ? parsed.profileSeq : 1;
    s.__sc_generated_seq = Number.isInteger(parsed.generatedSeq) ? parsed.generatedSeq : 1;
  } catch {
    // File missing or invalid JSON; start with empty in-memory state.
  }
}

async function persistState(): Promise<void> {
  const s = store();
  const payload: PersistedNoDbState = {
    profiles: s.__sc_profiles ?? [],
    measurements: s.__sc_measurements ?? [],
    generated: s.__sc_generated ?? [],
    profileSeq: s.__sc_profile_seq ?? 1,
    generatedSeq: s.__sc_generated_seq ?? 1,
  };
  await mkdir(path.dirname(NO_DB_FILE), { recursive: true });
  await writeFile(NO_DB_FILE, JSON.stringify(payload, null, 2), "utf-8");
}

export function hasDatabaseConfig(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getStylesNoDb() {
  return [...STYLES].sort((a, b) => {
    const aOrder = CATEGORIES.find((c) => c.code === a.category_code)?.display_order ?? 999;
    const bOrder = CATEGORIES.find((c) => c.code === b.category_code)?.display_order ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.style_name.localeCompare(b.style_name);
  });
}

export function getStyleNoDb(slug: string) {
  return STYLES.find((s) => s.slug === slug) ?? null;
}

export function getMeasurementsForStyleNoDb(slug: string) {
  const style = getStyleNoDb(slug);
  if (!style) return [];
  const requiredCodes = REQUIREMENTS_BY_CATEGORY[style.category_code] ?? [];
  return requiredCodes
    .map((code, index) => {
      const mt = MEASUREMENT_TYPES.find((m) => m.code === code);
      if (!mt) return null;
      return {
        ...mt,
        required_boolean: true,
        priority_order: index + 1,
        tolerance_note: null,
      };
    })
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
}

export function getFabricsForStyleNoDb(slug: string) {
  const style = getStyleNoDb(slug);
  if (!style) return [];
  return FABRIC_RECS_BY_CATEGORY[style.category_code] ?? [];
}

export async function createProfileNoDb(input: {
  userId: string;
  profileName: string;
  preferredUnit: "in" | "cm";
  bodyNotes: string | null;
  postureNotes: string | null;
  fittingPreferences: Record<string, unknown>;
  isDefault: boolean;
}) {
  await loadPersistedStateIfNeeded();
  const s = store();
  const profile: NoDbProfile = {
    id: s.__sc_profile_seq!,
    user_id: input.userId,
    profile_name: input.profileName,
    preferred_unit: input.preferredUnit,
    body_notes: input.bodyNotes,
    posture_notes: input.postureNotes,
    fitting_preferences: input.fittingPreferences,
    is_default: input.isDefault,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  s.__sc_profile_seq = s.__sc_profile_seq! + 1;
  s.__sc_profiles!.push(profile);
  await persistState();
  return profile;
}

export async function saveMeasurementsNoDb(
  profileId: number,
  measurements: Array<{
    code: string;
    value: number;
    enteredMethod: "manual" | "guided" | "estimated" | "imported";
    confidenceLevel: "low" | "medium" | "high";
    note: string | null;
  }>
) {
  await loadPersistedStateIfNeeded();
  const s = store();
  for (const m of measurements) {
    const mt = MEASUREMENT_TYPES.find((x) => x.code === m.code);
    if (!mt) continue;
    const existing = s.__sc_measurements!.find((x) => x.profile_id === profileId && x.code === m.code);
    if (existing) {
      existing.value = m.value;
      existing.entered_method = m.enteredMethod;
      existing.confidence_level = m.confidenceLevel;
      existing.note = m.note;
    } else {
      s.__sc_measurements!.push({
        profile_id: profileId,
        code: m.code,
        label: mt.label,
        value: m.value,
        entered_method: m.enteredMethod,
        confidence_level: m.confidenceLevel,
        note: m.note,
      });
    }
  }
  const saved = s.__sc_measurements!
    .filter((m) => m.profile_id === profileId)
    .sort((a, b) => a.label.localeCompare(b.label));
  await persistState();
  return saved;
}

export async function generateFitNoDb(input: {
  userId: string;
  profileId: number;
  slug: string;
}) {
  await loadPersistedStateIfNeeded();
  const style = getStyleNoDb(input.slug);
  if (!style) return null;
  const s = store();
  const profileMeasurements = s.__sc_measurements!.filter((m) => m.profile_id === input.profileId);
  const available = new Set(profileMeasurements.map((m) => m.code));
  const required = (REQUIREMENTS_BY_CATEGORY[style.category_code] ?? []).filter(Boolean);
  const missing = required.filter((c) => !available.has(c));
  const generated: NoDbGenerated = {
    id: s.__sc_generated_seq!,
    generated_at: new Date().toISOString(),
  };
  s.__sc_generated_seq = s.__sc_generated_seq! + 1;
  s.__sc_generated!.push(generated);
  await persistState();

  return {
    generatedVariantId: generated.id,
    generatedAt: generated.generated_at,
    style: { slug: style.slug, name: style.style_name },
    missingRequiredMeasurements: missing,
    rules: STARTER_RULES,
    computedValues: {
      styleSlug: style.slug,
      styleName: style.style_name,
      requiredMeasurementCount: required.length,
      providedMeasurementCount: profileMeasurements.length,
      missingRequiredMeasurementCount: missing.length,
      generatedAt: generated.generated_at,
      mode: "no_db_mvp",
    },
    fitNotes:
      missing.length === 0
        ? ["All required measurements are present. Fit generation can proceed."]
        : ["Some required measurements are missing. Add them for higher-confidence fit outputs."],
    fitWarnings: missing.length ? [`Missing required measurements: ${missing.join(", ")}`] : [],
  };
}

