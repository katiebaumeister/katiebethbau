# Personalized Garment Intelligence System — Vision & Build Order

This is not just a fashion reference site. It is a **personalized garment intelligence system** with five layers.

---

## The Five Layers

1. **Identity / preferences layer**  
   Your measurements, proportions, coloring, climate, comfort, durability, style lean, masculine/feminine preference, desired silhouette, etc.

2. **Reference layer**  
   Archival looks, runway looks, vintage patterns, museum garments, designer examples.

3. **Translation layer**  
   Turning a visual reference into a structured garment description: silhouette, seam logic, support points, shaping strategy, likely fabric behavior, closure type, construction difficulty, etc.

4. **Adaptation layer**  
   Pattern adjustment math based on your measurements and proportions.

5. **Execution layer**  
   Fabric specs, yardage, notions, cut plan, stitch/pressing order, seam finishes, assembly instructions.

---

## Best Build Order

The right order is **not** “collect references first.” It is:

### Phase 1 — Build the personal engine first

This is the most important phase, because otherwise all archival/runway data is just inspirational browsing.

**A. User profile / saved identity**

Store:

- measurements  
- derived body ratios  
- body shape flags  
- coloring profile  
- climate preferences  
- comfort preferences  
- durability preferences  
- silhouette preferences  
- masculine ↔ feminine style scale  
- preferred garment categories  
- sewing skill level  
- fit tolerance level  
- preferred fibers / avoided fibers  

This should be a **real persisted profile**, not localStorage.

**B. Measurement math + fit logic**

This is the core moat.

Structured derived fields:

- bust–waist ratio  
- waist–hip ratio  
- front/back balance  
- shoulder-to-bust relationship  
- torso proportion  
- leg proportion  
- rise proportion  
- vertical breakpoints  
- ease requirements by garment type  
- likely fitting risks  

Rule outputs:

- add FBA  
- raise/lower waistline  
- redistribute dart intake  
- shift side seam forward/back  
- increase back shoulder width  
- reduce armhole depth  
- require swayback adjustment  
- likely muslin required  
- avoid cut-on sleeve for this reference  
- recommend bias support stay tape in X region  

**C. Garment schema**

Before adding lots of looks, define the exact structured garment object. Each design/reference should eventually resolve into fields like:

- garment type  
- silhouette  
- era  
- designer / source  
- masculine/feminine expression  
- fittedness  
- construction complexity  
- neckline  
- sleeve type  
- waist treatment  
- skirt/pant volume  
- closure type  
- support strategy  
- probable pattern block  
- ease profile  
- fabric requirements  
- lining/interfacing needs  
- best body-type affinities  
- difficult fit zones  
- alteration friendliness  

Without this schema, archive mining becomes messy fast.

---

### Phase 2 — Build the output experience

Once the personal engine exists, build the thing you actually want to use.

For any design, the system should produce:

**“Should this work for me?”** — A decision layer:

- strong fit candidate  
- possible with adjustments  
- risky / major redrafting needed  
- avoid unless recreating editorially  

**“What changes would I need?”** — Concrete adjustment outputs:

- lengthen bodice 1.25"  
- lower bust point 0.5"  
- add hip width 1.75" total  
- shift waist shaping up 0.75"  
- broaden shoulder line 0.375"  
- add bicep ease  
- change skirt release point  
- reduce crotch extension or deepen rise, etc.  

**“How should I make it?”** — Execution outputs:

- recommended fabrics  
- recommended weights  
- drape/crispness/stretch requirements  
- yardage estimate  
- interfacings  
- seam finish suggestions  
- stitch length guidance  
- pressing sequence  
- order of assembly  
- whether toile/muslin is recommended  
- skill difficulty  

That is the real product.

---

### Phase 3 — Add a smaller but high-quality reference library

Do not try to ingest the universe first.

Start with maybe **50–100 references total**:

- highly structured  
- hand-tagged  
- chosen to cover many silhouette families  

A better initial set:

- 15 dresses  
- 15 tops / jackets  
- 15 skirts / pants  
- 15 historical references  
- 15 runway/editorial references  
- 15 vintage sewing pattern examples  

That is enough to test the system. The goal early on is **taxonomy quality**, not breadth.

---

### Phase 4 — Add image/AI analysis later

AI should come after your schema and math are stable.

- Image analysis without a strong structured schema will output vague fluff.  
- AI-generated pattern logic is only useful if you already know how your pattern system represents seams, darts, blocks, ease, shaping, and construction steps.  
- Otherwise you get pretty-looking but unreliable suggestions.  

For now, a **manual workflow** is enough:

- save design  
- link source  
- manually tag design  
- manually enter inferred construction fields  
- run your fit engine on top of that  

That is a much smarter MVP.

---

## What to Build Next (Specifically)

### 1. Real database schema for profiles + references + garments + fit outputs

Core tables (skeleton):

- **users** — id, name, email  
- **user_measurement_profiles** — id, user_id, profile_name, bust, waist, high_hip, full_hip, shoulder_width, back_width, front_waist_length, back_waist_length, rise, inseam, height, etc.  
- **user_derived_body_metrics** — profile_id, waist_hip_ratio, shoulder_hip_ratio, torso_balance, leg_torso_ratio, bust_projection_index, hip_projection_index, vertical_proportion_type, fit_risk_flags (JSON)  
- **user_color_profiles** — user_id, skin_tone, undertone, hair_color, eye_color, contrast_level, top_neutrals (JSON), accent_colors (JSON), best_metals (JSON), avoid_colors (JSON)  
- **user_preferences** — user_id, climate_profile, preferred_fibers, avoided_fibers, comfort_priority, durability_priority, masculine_feminine_scale, preferred_silhouettes, avoided_details, sewing_skill_level  
- **references** — id, source_type (runway / vintage_pattern / museum / archival / editorial), title, designer, year, era, source_name, source_url, image_url, notes, is_verified  
- **reference_tags** — reference_id, garment_type, silhouette_family, masculine_feminine_expression, body_type_affinity, decade, formality, structure_level, difficulty  
- **garment_interpretations** — A reference is the source; an interpretation is your structured technical read. id, reference_id, probable_block, closure_type, support_strategy, shaping_methods, seam_map (JSON), fabric_requirements (JSON), construction_notes, alteration_notes  
- **fit_rules** — id, garment_type, condition_expression, recommendation_text, severity, requires_muslin, formula_reference  
- **fabric_profiles** — id, name, fiber_content, weight, drape, stretch, opacity, sheen, tailoring_score, breathability_score, climate_scores (JSON), stitch_guidance (JSON), pressing_guidance (JSON)  
- **garment_output_recipes** — The final generated deliverable. id, user_profile_id, garment_interpretation_id, recommended_fabrics (JSON), adjustment_plan (JSON), cut_plan (JSON), sewing_order (JSON), pressing_order (JSON), notes  

### 2. Masculine/feminine and body-type metadata (done carefully)

Do not use a simplistic binary filter. Model as multiple axes.

**Masculine/feminine** — Scale or tag bundle:

- strongly masculine  
- masculine-leaning  
- balanced / androgynous  
- feminine-leaning  
- strongly feminine  

Separate from: structure level, ornament level, body emphasis zones, waist emphasis, shoulder emphasis, softness vs severity. A garment can read feminine through line, not ornament; or masculine through proportion, not literally menswear construction.

**Body types** — Keep as secondary browsing/filtering aid, not the primary fitting engine. Prefer fields like:

- shoulder dominant / bust dominant / waist defined / straight / hip dominant  
- long torso / short torso  
- long leg / short leg  
- broad shoulder / narrow shoulder  
- fuller upper arm / fuller thigh  
- petite / tall  
- high contrast verticality vs width emphasis  

### 3. Reference-to-garment translation UI

When you save a look, open a structured form:

**Design intake panel** — source link, source image, title, year/era, designer, category, notes  

**Technical interpretation panel** — likely garment block, silhouette family, seam logic, support points, likely closure, likely interfacing, probable fabric types, likely lining, construction difficulty, likely fit-sensitive areas, visual emphasis zones  

**Personal relevance panel** — good for my coloring? good for my climate? good for my proportions? what needs changing? is this worth recreating?  

That is the bridge between inspiration and production.

### 4. Build formulas before AI

At least four math layers:

**A. Derived proportion calculations** — Ratios and deltas from raw measurements.  

**B. Ease and shaping calculations** — Per garment type: fitted woven dress, tailored jacket, bias dress, trouser, skirt, corseted bodice, relaxed shirt. Each needs its own ease logic.  

**C. Pattern adjustment calculations** — Translate body measurements into block alterations: dart redistribution, slash-and-spread values, line shifting, balance adjustments, armhole/sleeve changes, crotch/rise modifications, hem sweep recalculation.  

**D. Fabric behavior modifiers** — The same body adjustment should not behave identically in silk charmeuse, rigid denim, wool suiting, linen, bias satin, ponte, organza overlay. The engine should account for fabric behavior when recommending final ease and construction methods.  

This is the real intelligence layer, even before AI.

---

## What NOT to Do Yet

1. **Massive archive scraping** — You’ll drown in badly tagged data.  
2. **Full AI pattern generation** — Too early unless your internal garment schema is stable.  
3. **Super polished public-facing UI** — Prioritize utility over presentation for your own use first.  
4. **Over-reliance on generic body-type categories** — Useful for inspiration browsing, not reliable enough for exact cut instructions.  

---

## Sprint Roadmap

**Sprint 1**

- Move measurement/color/preferences from localStorage to real database.  
- Add saved user profile system.  
- Add derived body metrics computation.  
- Expand fit rules substantially.  
- Wire color profile into fabric scoring.  

**Sprint 2**

- Build structured reference intake flow.  
- Build reference metadata filters: masculine/feminine expression, body emphasis, silhouette family, era, garment type, climate relevance, structure level.  
- Create 25–50 hand-entered references.  

**Sprint 3**

- Build “interpret this design” page.  
- Connect reference → garment interpretation.  
- Connect garment interpretation → personal fit analysis.  
- Output: recommended fabric, adjustments needed, muslin/no muslin, sewing difficulty.  

**Sprint 4**

- Generate first version of: yardage hints, cut instructions, seam/stitch suggestions, pressing order (even if partly templated at first).  

**Sprint 5**

- Add search/filter library for your own ongoing use.  
- Save favorites, compare references, save “make later” queue.  

Only after this would you start heavy archive ingestion or computer vision.

---

*Saved for reference. Next: concrete database schema + feature architecture spec.*
