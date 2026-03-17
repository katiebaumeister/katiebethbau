# V1 Schema + Feature Architecture Spec

Personal garment intelligence app: measurements, coloring, preferences, references, technical garment interpretations, fit logic, fabric logic, and final build guidance.

The database supports three realities at once:

1. **Personalization** — your body, coloring, climate, comfort, preferences  
2. **Reference intelligence** — archival/runway/vintage looks and their metadata  
3. **Technical output** — fit adjustments, fabric recommendations, yardage, sewing guidance, pressing order  

---

## 1. System Goal

For any saved design or reference, the app should eventually answer:

- Is this a good candidate for me? Why or why not?
- What exact fit adjustments are likely needed?
- What fabrics should I use?
- How much fabric do I need?
- How do I cut and sew it?
- What should I press, stabilize, interface, and finish?

**Pipeline:** user profile → reference → garment interpretation → fit engine → fabric engine → construction output

---

## 2. Core Architecture — Main Domains

- auth + users  
- personal profiles  
- measurements + derived metrics  
- color profile  
- preferences  
- references library  
- garment interpretations  
- fabric library  
- fit rules + pattern logic  
- recommendation runs / outputs  
- saved projects / makes  
- media and source links  

---

## 3. Database Schema

### A. users

```sql
create table users (
  id uuid primary key,
  email text unique,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### B. Personal Profile Layer

**user_profiles** — A user may have multiple profiles (current body, historical, dress form, client).

```sql
create table user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  profile_name text not null,
  is_default boolean default false,

  height_in numeric(5,2),
  weight_lbs numeric(6,2),

  body_frame text,           -- petite, narrow, average, broad, tall, etc.
  style_expression numeric(4,2),  -- e.g. 0 masculine to 1 feminine, or -1 to +1
  sewing_skill_level text,   -- beginner/intermediate/advanced
  fit_precision_level text,  -- relaxed / standard / exacting

  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Recommended enum-like values:**

- body_frame: petite, narrow, average, broad, tall, elongated  
- sewing_skill_level: beginner, improving, intermediate, advanced, professional  
- fit_precision_level: low, standard, high, couture  

### C. Raw Measurement Layer

**measurement_types**

```sql
create table measurement_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  unit text not null default 'in',
  category text not null,
  description text,
  sort_order integer default 0
);
```

**profile_measurements**

```sql
create table profile_measurements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,
  measurement_type_id uuid not null references measurement_types(id),
  value numeric(8,3) not null,
  entered_method text,
  confidence numeric(4,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id, measurement_type_id)
);
```

**Suggested seed measurement_types:** bust, high_bust, underbust, waist, high_hip, full_hip, shoulder_width, back_width, chest_width, neck, front_waist_length, back_waist_length, bust_point_to_bust_point, bust_point_depth, shoulder_to_floor, waist_to_floor, inseam, outseam, crotch_depth, rise_front, rise_back, thigh, knee, calf, bicep, wrist, arm_length, torso_girth.

### D. Derived Body Metrics

**derived_metric_types**

```sql
create table derived_metric_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  category text not null,
  description text
);
```

**profile_derived_metrics**

```sql
create table profile_derived_metrics (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,
  derived_metric_type_id uuid not null references derived_metric_types(id),
  value numeric(10,4),
  value_text text,
  computed_at timestamptz default now(),
  unique(profile_id, derived_metric_type_id)
);
```

**Suggested derived metrics:** waist_to_hip_ratio, shoulder_to_hip_ratio, bust_to_waist_ratio, front_back_waist_balance, torso_to_leg_ratio, rise_balance, bust_projection_index, hip_projection_index, shoulder_slope_index, waist_definition_index, vertical_proportion_index, likely_fba_needed, likely_swayback, likely_forward_shoulder, likely_full_thigh, likely_long_torso, likely_short_waist. (Some numeric, some text/flag.)

### E. Body Traits / Fit Flags

**body_trait_types**

```sql
create table body_trait_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  category text not null
);
```

**profile_body_traits**

```sql
create table profile_body_traits (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,
  body_trait_type_id uuid not null references body_trait_types(id),
  strength numeric(4,2),
  source text,
  created_at timestamptz default now(),
  unique(profile_id, body_trait_type_id)
);
```

**Examples:** broad_shoulders, narrow_shoulders, full_bust, small_bust, defined_waist, straight_waist, full_hip, flat_seat, prominent_seat, full_thigh, long_torso, short_torso, petite_vertical, elongated_vertical, long_arms, forward_shoulder, swayback.

### F. Color Profile

**user_color_profiles**

```sql
create table user_color_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,

  skin_tone_label text,
  skin_hex text,
  undertone text,
  contrast_level text,
  saturation_level text,

  hair_color_label text,
  hair_hex text,
  eye_color_label text,
  eye_hex text,

  season_guess text,
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id)
);
```

**color_recommendation_sets**

```sql
create table color_recommendation_sets (
  id uuid primary key default gen_random_uuid(),
  color_profile_id uuid not null references user_color_profiles(id) on delete cascade,
  set_type text not null,
  values_json jsonb not null,
  created_at timestamptz default now()
);
```

set_type: top_neutrals, accents, metals, avoid, lipstick, contrast_guidance.

### G. User Preferences

**user_preferences**

```sql
create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,

  climate_min_temp_f numeric(5,2),
  climate_max_temp_f numeric(5,2),
  humidity_preference text,
  layering_preference text,

  comfort_priority numeric(4,2),
  durability_priority numeric(4,2),
  maintenance_tolerance numeric(4,2),
  structure_preference numeric(4,2),
  softness_preference numeric(4,2),

  masculine_feminine_preference numeric(4,2),
  ornament_preference numeric(4,2),
  drama_preference numeric(4,2),

  preferred_fibers jsonb,
  avoided_fibers jsonb,
  avoided_sensations jsonb,
  preferred_garment_types jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id)
);
```

---

## 4. Reference Library Schema

### A. references

```sql
create table references (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  title text not null,
  designer text,
  brand text,
  year integer,
  decade text,
  era_label text,

  source_name text,
  source_url text,
  image_url text,
  thumbnail_url text,

  description text,
  notes text,

  is_public boolean default false,
  is_verified boolean default false,

  created_by uuid references users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

source_type: runway, archival, museum, vintage_pattern, editorial, rtw.

### B. reference_tags (tag_types + reference_tags)

**tag_types**

```sql
create table tag_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  category text not null
);
```

**reference_tags**

```sql
create table reference_tags (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null references references(id) on delete cascade,
  tag_type_id uuid not null references tag_types(id),
  tag_value text not null,
  created_at timestamptz default now()
);
```

**Useful categories:** garment_type, silhouette_family, neckline, sleeve_type, waist_treatment, hem_shape, closure_type, structure_level, ornament_level, formality, season, masculine_feminine_expression, body_emphasis_zone, body_type_affinity, era, difficulty.

### C. reference_images

```sql
create table reference_images (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null references references(id) on delete cascade,
  image_url text not null,
  image_role text,
  sort_order integer default 0,
  notes text
);
```

image_role: front, back, side, detail, runway, editorial, pattern_envelope.

### D. reference_sources

```sql
create table reference_sources (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null references references(id) on delete cascade,
  source_label text,
  source_url text not null,
  source_kind text,
  notes text
);
```

source_kind: museum, vogue, ebay, met, designer_site, blog, pinterest.

---

## 5. Garment Interpretation Schema

A **reference** is the source; a **garment_interpretation** is the structured technical read.

### A. garment_interpretations

```sql
create table garment_interpretations (
  id uuid primary key default gen_random_uuid(),
  reference_id uuid not null references references(id) on delete cascade,

  garment_type text not null,
  probable_block text,
  silhouette_family text,
  fit_intent text,
  closure_type text,
  support_strategy text,
  lining_type text,
  interfacing_level text,
  construction_complexity text,

  drape_need numeric(4,2),
  crispness_need numeric(4,2),
  stretch_need numeric(4,2),
  opacity_need numeric(4,2),
  tailoring_need numeric(4,2),

  notes text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### B. garment_structure_components + garment_structure_details

**garment_structure_components**

```sql
create table garment_structure_components (
  id uuid primary key default gen_random_uuid(),
  garment_interpretation_id uuid not null references garment_interpretations(id) on delete cascade,
  component_type text not null,
  label text,
  placement text,
  purpose text,
  notes text,
  sort_order integer default 0
);
```

component_type: seam, dart, pleat, panel, gore, yoke, waistband, collar, lapel, sleeve.  
purpose: shaping, support, decoration, volume, closure.

**garment_structure_details**

```sql
create table garment_structure_details (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references garment_structure_components(id) on delete cascade,
  detail_key text not null,
  detail_value text not null
);
```

### C. garment_fit_zones

```sql
create table garment_fit_zones (
  id uuid primary key default gen_random_uuid(),
  garment_interpretation_id uuid not null references garment_interpretations(id) on delete cascade,
  zone_code text not null,
  importance numeric(4,2),
  sensitivity text,
  notes text
);
```

zone_code: bust, waist, upper_hip, full_hip, thigh, shoulder, bicep, crotch, back_waist, neckline.  
sensitivity: low, medium, high.

---

## 6. Fabric Library Schema

### A. fabric_profiles

```sql
create table fabric_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fiber_content text,
  weave_or_knit text,
  subtype text,

  weight_gsm numeric(6,2),
  stretch_percent numeric(6,2),
  drape_score numeric(4,2),
  crispness_score numeric(4,2),
  recovery_score numeric(4,2),
  opacity_score numeric(4,2),
  sheen_score numeric(4,2),
  warmth_score numeric(4,2),
  breathability_score numeric(4,2),
  abrasion_resistance_score numeric(4,2),
  tailoring_score numeric(4,2),
  press_responsiveness_score numeric(4,2),

  machine_washable boolean,
  steam_tolerant boolean,
  pressing_notes text,
  sewing_notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### B. fabric_climate_scores

```sql
create table fabric_climate_scores (
  id uuid primary key default gen_random_uuid(),
  fabric_id uuid not null references fabric_profiles(id) on delete cascade,
  climate_code text not null,
  suitability_score numeric(4,2) not null,
  notes text,
  unique(fabric_id, climate_code)
);
```

climate_code: hot_dry, hot_humid, mild, cold, variable.

### C. fabric_stitch_profiles

```sql
create table fabric_stitch_profiles (
  id uuid primary key default gen_random_uuid(),
  fabric_id uuid not null references fabric_profiles(id) on delete cascade,
  seam_type text,
  stitch_length_mm numeric(4,2),
  needle_type text,
  needle_size text,
  thread_type text,
  edge_finish text,
  pressing_method text,
  stabilization_notes text,
  notes text
);
```

### D. fabric_color_families

```sql
create table fabric_color_families (
  id uuid primary key default gen_random_uuid(),
  fabric_id uuid not null references fabric_profiles(id) on delete cascade,
  color_family text not null,
  hex text,
  warmth text,
  chroma text,
  depth text
);
```

---

## 7. Fit Rules + Pattern Logic

### A. fit_rules

```sql
create table fit_rules (
  id uuid primary key default gen_random_uuid(),
  rule_code text unique not null,
  rule_name text not null,

  garment_type text,
  probable_block text,
  zone_code text,

  severity text,
  requires_muslin boolean default false,

  condition_json jsonb not null,
  output_json jsonb not null,

  notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

severity: advisory, moderate, major.

**condition_json example:**

```json
{
  "all": [
    { "metric": "waist_to_hip_ratio", "op": "<", "value": 0.72 },
    { "metric": "full_hip", "op": "-", "compare_to": "waist", "min_delta": 10 },
    { "garment_zone": "upper_hip", "importance_gte": 0.7 }
  ]
}
```

**output_json example:**

```json
{
  "adjustments": [
    { "type": "add_width", "zone": "full_hip", "amount_formula": "max((full_hip - base_full_hip), 1.0)" },
    { "type": "raise_waistline_visual_balance", "zone": "waist", "amount_formula": "0.5" }
  ],
  "message": "Hip-dominant profile relative to waist. Add hip shaping and rebalance waist emphasis.",
  "construction_notes": [
    "Prefer side seam plus back dart control over forcing intake entirely at front.",
    "Muslin recommended if using rigid woven."
  ]
}
```

### B. pattern_blocks

```sql
create table pattern_blocks (
  id uuid primary key default gen_random_uuid(),
  block_code text unique not null,
  name text not null,
  garment_type text not null,
  intended_fit text,
  base_size_label text,
  base_measurements_json jsonb not null,
  notes text
);
```

### C. pattern_adjustment_formulas

```sql
create table pattern_adjustment_formulas (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references pattern_blocks(id) on delete cascade,
  adjustment_code text not null,
  zone_code text,
  formula_expression text not null,
  notes text
);
```

---

## 8. Recommendation Runs / Outputs

### A. recommendation_runs

```sql
create table recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references user_profiles(id) on delete cascade,
  reference_id uuid references references(id) on delete set null,
  garment_interpretation_id uuid references garment_interpretations(id) on delete set null,

  run_type text not null,
  status text default 'complete',

  input_snapshot jsonb not null,
  output_snapshot jsonb not null,

  score_fit numeric(5,2),
  score_color numeric(5,2),
  score_climate numeric(5,2),
  score_comfort numeric(5,2),
  score_feasibility numeric(5,2),
  score_overall numeric(5,2),

  created_at timestamptz default now()
);
```

run_type: fit_analysis, fabric_recommendation, build_recipe, full_eval.

### B. construction_recipes

```sql
create table construction_recipes (
  id uuid primary key default gen_random_uuid(),
  recommendation_run_id uuid not null references recommendation_runs(id) on delete cascade,

  recommended_fabrics_json jsonb,
  yardage_json jsonb,
  notions_json jsonb,
  cut_plan_json jsonb,
  sewing_order_json jsonb,
  seam_finish_json jsonb,
  pressing_plan_json jsonb,
  risk_notes_json jsonb,
  muslin_plan_json jsonb,

  created_at timestamptz default now()
);
```

---

## 9. Saved Project / Make Flow

### projects

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  profile_id uuid references user_profiles(id) on delete set null,
  reference_id uuid references references(id) on delete set null,
  garment_interpretation_id uuid references garment_interpretations(id) on delete set null,

  title text not null,
  status text default 'idea',
  target_season text,
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

status: idea, evaluating, sourcing, drafting, muslin, sewing, finished.

### project_materials

```sql
create table project_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  fabric_id uuid references fabric_profiles(id) on delete set null,
  material_type text not null,
  quantity numeric(8,2),
  unit text,
  notes text
);
```

material_type: shell, lining, interfacing, trim, zipper, buttons, understructure.

---

## 10. MVP Feature Architecture (Screens & Flows)

### A. Profile Area

1. **Profile Hub** — default measurement profile, default color profile, saved preferences, body traits, recent evaluated looks, recent projects.  
2. **Measurement Wizard** — quick / full / edit / compare; save raw, compute derived, compute body traits, show fit implications.  
3. **Color Profile Wizard** — skin, hair, eyes, undertone, contrast, saturation → neutrals, accents, metals, avoid.  
4. **Preferences Wizard** — climate, comfort, durability, structure, maintenance, masculine/feminine, silhouettes, avoided sensations.  

### B. Reference Library

1. **Reference Index** — filters: source type, decade, designer, garment type, silhouette, expression, body-emphasis, body-type affinity, structure, difficulty, climate, color. Cards: image, title, year, source, tags, fit score.  
2. **Reference Detail** — images, source links, tags, technical interpretation, “why it may or may not suit you,” similar refs, “evaluate for me,” “save as project.”  

### C. Garment Interpretation Flow

1. **New Interpretation** — garment type, probable block, silhouette, fit intent, structure/support, sensitive fit zones, fabric behavior needs.  
2. **Technical Breakdown** — components, seams, darts, panels, closures, lining/interfacing, risk points.  

### D. Fit Engine Flow

1. **Evaluate for Me** — profile + reference + interpretation (+ optional fabric) → fit candidate score, likely adjustments, zones of concern, muslin rec, realistic vs editorial.  
2. **Adjustment Report** — measurements vs block, recommended pattern changes, visual warnings, difficulty.  

### E. Fabric Engine Flow

1. **Fabric Finder** — interpretation + climate + color + comfort + structure → top fabrics, reasons, behavior, stitch plan, pressing plan.  
2. **Fabric Detail** — properties, climate, sewing notes, seam/stitch, pressing, compatible garments/eras, best colors for user.  

### F. Build Recipe Flow

1. **Build Plan Generator** — profile + interpretation + fabric + size/block → yardage, notions, cut order, seam order, pressing order, fit checkpoints, problem areas.  
2. **Project Workspace** — save reference, evaluation, materials, changes, muslin notes, final build notes.  

---

## 11. Derived Metrics Engine Spec

**Core ratio metrics:**

- waist_to_hip_ratio = waist / full_hip  
- bust_to_waist_ratio = bust / waist  
- shoulder_to_hip_ratio = shoulder_width / full_hip  
- torso_balance = front_waist_length - back_waist_length  
- torso_to_leg_ratio = front_waist_length / inseam  
- rise_balance = rise_front - rise_back  

**Example flag logic:** defined_waist, full_bust, hip_dominant, long_torso, forward_shoulder, full_thigh (from ratios or user override). Store intensity scores, not only binary.  

---

## 12. Rule Engine Spec

Rules read from: raw measurements, derived metrics, body traits, garment type, fit zones, fabric behavior.

**Rule categories:** fit assessment, pattern adjustment, muslin recommendation, fabric compatibility, construction caution, color harmony.

**Example rule families:** fuller hip in fitted skirt/trouser, fuller bust in darted bodice, short waist in waist-seamed dress, long torso in drop-waist/jacket, broad shoulder in strong sleevehead, full thigh in narrow trouser, rigid fabric + curvature mismatch, low stretch + high precision fit zone.  

---

## 13. Data Relationships (Core Joins)

- users → user_profiles  
- user_profiles → profile_measurements, profile_derived_metrics, profile_body_traits, user_color_profiles, user_preferences  
- references → reference_tags, reference_images, reference_sources, garment_interpretations  
- garment_interpretations → garment_structure_components, garment_fit_zones  
- fabric_profiles → fabric_climate_scores, fabric_stitch_profiles, fabric_color_families  
- recommendation_runs → construction_recipes  
- projects → project_materials  

---

## 14. MVP Implementation Order

**Phase 1** — users, user_profiles, measurement_types, profile_measurements, derived metrics computation, body traits computation, color profile, preferences.  

**Phase 2** — references, reference_tags, reference_images, reference_sources, reference filters UI.  

**Phase 3** — garment_interpretations, garment_structure_components, garment_fit_zones.  

**Phase 4** — fit_rules, pattern_blocks, pattern_adjustment_formulas, recommendation_runs.  

**Phase 5** — fabric_profiles, fabric_climate_scores, fabric_stitch_profiles, fabric color harmony.  

**Phase 6** — construction_recipes, projects, project_materials.  

---

## 15. Suggested API Surface

**Profile:** GET/POST /profiles, GET/PATCH /profiles/:id  

**Measurements:** GET/PUT /profiles/:id/measurements, POST /profiles/:id/recompute-derived-metrics  

**Color:** GET/PUT /profiles/:id/color-profile  

**Preferences:** GET/PUT /profiles/:id/preferences  

**References:** GET/POST /references, GET/PATCH /references/:id  

**Interpretations:** POST /references/:id/interpretations, GET/PATCH /interpretations/:id  

**Evaluation:** POST /evaluate/reference/:id, POST /evaluate/interpretation/:id, GET /recommendation-runs/:id  

**Fabrics:** GET /fabrics, GET /fabrics/:id  

**Recipes:** POST /recipes/generate, GET /recipes/:id  

**Projects:** GET/POST /projects, PATCH /projects/:id  

---

## 16. What to Keep Manual for Now

- Technical garment interpretation  
- Source entry  
- Tag assignment  
- Fit zone importance  
- Initial adjustment text  
- Build recipe editing  

---

## 17. What AI Should Do Later, Not Now

Later: image-to-garment interpretation, automatic tag suggestion, silhouette classification, estimated seam map, probable fabric category, draft build recipe from reference image, conversion from visual inspiration to base pattern family. These should write into the existing structured schema, not replace it.  

---

## 18. Metadata: Masculine/Feminine + Body Type

**Expression filters:** strongly masculine, masculine-leaning, balanced/androgynous, feminine-leaning, strongly feminine.  

**Line filters:** shoulder emphasis, waist emphasis, hip emphasis, vertical emphasis, bust emphasis, leg emphasis.  

**Body affinity filters:** full bust friendly, full hip friendly, broad shoulder friendly, petite friendly, long torso friendly, straight waist friendly, high curve friendly.  

---

## 19. Minimal Seed Data (First)

- 1 user, 1 default profile  
- 25 measurement types, 15 derived metric types, 20 body trait types  
- 1 color profile, 1 preference profile  
- 30 references, 30–50 reference tags  
- 15 garment interpretations  
- 20 fabrics  
- 20 fit rules  
- 5 pattern blocks  

---

## 20. Recommended Folder / Domain Structure

```
/src
  /modules
    /auth
    /profiles
      /measurements
      /derived-metrics
      /body-traits
      /color
      /preferences
    /references
      /tags
      /sources
      /images
    /garments
      /interpretations
      /structure
      /fit-zones
      /pattern-blocks
    /fabrics
      /climate
      /stitching
      /colors
    /rules
      /fit-rules
      /pattern-adjustments
    /evaluation
    /recipes
    /projects
```
