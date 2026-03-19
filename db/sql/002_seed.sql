-- Sewing Closet MVP seed data (50 styles + starter rules/fabrics)

insert into garment_categories (code, name, display_order, description) values
('pants', 'Pants', 1, 'Full-length lower-body garments including tailored and casual styles'),
('skirts', 'Skirts', 2, 'Waist-to-leg garments with varying fullness and length'),
('shorts', 'Shorts', 3, 'Short lower-body garments from tailored to lounge and athletic'),
('tops', 'Tops', 4, 'Upper-body garments including shirts, tees, wraps, and fashion tops'),
('tanks', 'Tanks', 5, 'Sleeveless knit or woven tops'),
('bras', 'Bras', 6, 'Support garments ranging from bralettes to structured bras'),
('underwear', 'Underwear / Short-shorts', 7, 'Intimate bottoms and fitted short underlayers'),
('long_sleeves', 'Long Sleeves', 8, 'Long-sleeve knit and woven upper-body garments'),
('denims', 'Denims', 9, 'Denim-specific garments including jeans, skirts, and jackets'),
('dresses', 'Dresses', 10, 'One-piece garments in fitted, relaxed, and wrap silhouettes');

insert into measurement_types (code, label, body_zone, unit, description) values
('height_total', 'Total Height', 'overall', 'in', 'Overall body height from head to floor'),
('neck_circumference', 'Neck Circumference', 'upper_body', 'in', 'Around base of neck'),
('shoulder_width', 'Shoulder Width', 'upper_body', 'in', 'Across shoulder points, shoulder tip to shoulder tip'),
('shoulder_to_bust', 'Shoulder to Bust Point', 'upper_body', 'in', 'Vertical distance from shoulder high point to bust apex'),
('shoulder_to_waist_front', 'Front Shoulder to Waist', 'upper_body', 'in', 'From shoulder high point over bust to natural waist'),
('back_waist_length', 'Back Waist Length', 'upper_body', 'in', 'From base of neck to natural waist at back'),
('bust_full', 'Full Bust', 'upper_body', 'in', 'Around fullest part of bust'),
('bust_high', 'High Bust', 'upper_body', 'in', 'Around upper chest above fullest bust'),
('underbust', 'Underbust', 'upper_body', 'in', 'Around ribcage directly under bust'),
('bust_apex_to_apex', 'Bust Apex to Apex', 'upper_body', 'in', 'Horizontal distance between bust points'),
('waist_natural', 'Natural Waist', 'mid_body', 'in', 'Around narrowest part of waist'),
('waist_to_hip', 'Waist to Hip Depth', 'mid_body', 'in', 'Vertical distance from natural waist to fullest hip'),
('hip_full', 'Full Hip', 'lower_body', 'in', 'Around fullest part of hip/seat'),
('high_hip', 'High Hip', 'lower_body', 'in', 'Around upper hip, about 3-4 inches below waist'),
('rise_front', 'Front Rise', 'lower_body', 'in', 'From front waist through crotch level seating reference'),
('rise_back', 'Back Rise', 'lower_body', 'in', 'From back waist through crotch level seating reference'),
('inseam', 'Inseam', 'lower_body', 'in', 'From crotch to desired hem along inner leg'),
('outseam', 'Outseam', 'lower_body', 'in', 'From waist to hem along outer leg'),
('thigh_circumference', 'Thigh Circumference', 'lower_body', 'in', 'Around fullest thigh'),
('knee_circumference', 'Knee Circumference', 'lower_body', 'in', 'Around knee at intended shaping point'),
('calf_circumference', 'Calf Circumference', 'lower_body', 'in', 'Around fullest calf'),
('ankle_circumference', 'Ankle Circumference', 'lower_body', 'in', 'Around ankle at hem level'),
('armhole_depth', 'Armhole Depth', 'upper_body', 'in', 'Vertical depth used for sleeve and bodice shaping'),
('bicep_circumference', 'Bicep Circumference', 'upper_body', 'in', 'Around fullest upper arm'),
('wrist_circumference', 'Wrist Circumference', 'upper_body', 'in', 'Around wrist'),
('sleeve_length', 'Sleeve Length', 'upper_body', 'in', 'From shoulder point to desired sleeve hem'),
('torso_girth', 'Torso Girth', 'overall', 'in', 'Loop from shoulder through crotch and back to shoulder'),
('upper_torso_length', 'Upper Torso Length', 'upper_body', 'in', 'Shoulder to underbust/waist control length'),
('seat_depth', 'Seat Depth', 'lower_body', 'in', 'Waist to seated plane depth used for rise balance'),
('leg_opening_target', 'Leg Opening Target', 'lower_body', 'in', 'Desired finished hem circumference for shorts/pants'),
('dress_length_target', 'Dress Length Target', 'overall', 'in', 'Desired finished dress length from shoulder or waist reference'),
('skirt_length_target', 'Skirt Length Target', 'lower_body', 'in', 'Desired finished skirt length from waist'),
('shorts_length_target', 'Shorts Length Target', 'lower_body', 'in', 'Desired finished shorts length from waist'),
('band_size_target', 'Bra Band Size Target', 'upper_body', 'in', 'Preferred finished bra band size / tension reference');

insert into garment_styles (
  category_id, slug, style_name, short_description, silhouette_tags,
  fabric_type_default, fit_intent, difficulty_level, closure_type,
  thumbnail_image_url, front_illustration_url, back_illustration_url
)
select c.id, v.slug, v.style_name, v.short_description, v.silhouette_tags,
       v.fabric_type_default, v.fit_intent, v.difficulty_level, v.closure_type,
       '/images/styles/' || v.slug || '/thumb.svg',
       '/images/styles/' || v.slug || '/front.svg',
       '/images/styles/' || v.slug || '/back.svg'
from garment_categories c
join (
  values
  ('pants','straight_leg_trouser','Straight-Leg Trouser','Classic tailored trouser with straight leg from hip to hem', array['tailored','straight','classic']::text[], 'woven suiting','semi_fitted','intermediate','zip'),
  ('pants','wide_leg_trouser','Wide-Leg Trouser','Tailored trouser with fuller volume through the leg', array['tailored','wide_leg','fluid'], 'woven suiting','semi_fitted','intermediate','zip'),
  ('pants','cigarette_pant','Slim Cigarette Pant','Narrow tailored pant with slim ankle line', array['tailored','slim','cropped'], 'woven stretch','close_fitted','intermediate','zip'),
  ('pants','pleated_trouser','Pleated Trouser','Trouser with front pleats and added thigh ease', array['tailored','pleated','classic'], 'woven suiting','semi_fitted','advanced','zip'),
  ('pants','elastic_waist_lounge_pant','Elastic-Waist Lounge Pant','Casual pull-on pant with elasticized waist', array['casual','pull_on','relaxed'], 'woven or knit','relaxed','beginner','elastic'),
  ('skirts','pencil_skirt','Pencil Skirt','Straight fitted skirt with waist darts and narrow silhouette', array['fitted','straight','classic'], 'woven','close_fitted','intermediate','zip'),
  ('skirts','a_line_skirt','A-Line Skirt','Skirt fitted at waist with gradual flare to hem', array['a_line','classic','versatile'], 'woven','semi_fitted','beginner','zip'),
  ('skirts','mini_skirt','Mini Skirt','Short skirt base for tailored or casual interpretations', array['mini','classic','fashion'], 'woven','semi_fitted','beginner','zip'),
  ('skirts','bias_cut_skirt','Bias-Cut Skirt','Skirt cut on bias for drape and body-skimming movement', array['bias_cut','fluid','draped'], 'drapey woven','semi_fitted','advanced','pull_on'),
  ('skirts','gathered_skirt','Gathered Skirt','Waist-controlled fullness gathered into waistband', array['gathered','full','romantic'], 'woven','relaxed','beginner','zip'),
  ('shorts','tailored_short','Tailored Short','Structured short with waistband and clean leg shape', array['tailored','classic','structured'], 'woven','semi_fitted','intermediate','zip'),
  ('shorts','bermuda_short','Bermuda Short','Longer tailored short ending above or near knee', array['tailored','bermuda','elongated'], 'woven','semi_fitted','intermediate','zip'),
  ('shorts','elastic_lounge_short','Elastic Lounge Short','Easy pull-on short with elastic waist', array['casual','pull_on','relaxed'], 'woven or knit','relaxed','beginner','elastic'),
  ('shorts','high_waisted_fitted_short','High-Waisted Fitted Short','Short with shaped high waist and close fit through hip', array['high_waist','fitted','fashion'], 'woven stretch','close_fitted','intermediate','zip'),
  ('shorts','running_gym_short','Running / Gym Short','Athletic short with active ease and movement-focused cut', array['athletic','functional','lightweight'], 'performance woven or knit','relaxed','intermediate','elastic'),
  ('tops','classic_button_up_shirt','Classic Button-Up Shirt','Traditional collared shirt with front placket and set-in sleeves', array['shirt','tailored','classic'], 'woven shirting','semi_fitted','advanced','buttons'),
  ('tops','tshirt_block','T-Shirt Block','Basic crewneck knit tee with short sleeves', array['tee','knit','classic'], 'jersey knit','semi_fitted','beginner','pull_on'),
  ('tops','boxy_woven_shell','Boxy Woven Shell Top','Minimal sleeveless or simple-sleeve shell in woven fabric', array['boxy','minimal','shell'], 'woven','relaxed','beginner','pull_on'),
  ('tops','wrap_top','Wrap Top','Top crossing over front body and tying or fastening at waist', array['wrap','feminine','adjustable'], 'woven or knit','semi_fitted','intermediate','wrap'),
  ('tops','peplum_top','Peplum Top','Fitted upper body with waist seam and flared lower section', array['waist_seam','peplum','fitted'], 'woven or knit','close_fitted','intermediate','zip'),
  ('tanks','scoop_neck_tank','Basic Scoop-Neck Tank','Essential sleeveless knit tank with scoop front/back necklines', array['tank','scoop_neck','basic'], 'knit','close_fitted','beginner','pull_on'),
  ('tanks','high_neck_tank','High-Neck Tank','Sleeveless top with high clean neckline', array['tank','high_neck','clean'], 'knit','close_fitted','beginner','pull_on'),
  ('tanks','racerback_tank','Racerback Tank','Tank with athletic racerback armhole and back shaping', array['tank','racerback','athletic'], 'knit','close_fitted','beginner','pull_on'),
  ('tanks','cami_strap_top','Camisole with Straps','Light top with narrow straps and soft body', array['cami','straps','lightweight'], 'woven or knit','semi_fitted','beginner','pull_on'),
  ('tanks','square_neck_tank','Square-Neck Tank','Tank with squared neckline and structured visual line', array['tank','square_neck','fashion_basic'], 'knit or stable woven','close_fitted','beginner','pull_on'),
  ('bras','soft_bralette','Soft Bralette','Unstructured soft support bra with simple cup shapes', array['bralette','soft','light_support'], 'stretch knit','close_fitted','intermediate','elastic'),
  ('bras','triangle_bra','Triangle Bra','Minimal bra with triangle cups and straps', array['triangle','lingerie','minimal'], 'stretch knit or lingerie fabric','close_fitted','intermediate','elastic'),
  ('bras','underwire_bra_basic','Underwire Bra Basic','Structured bra with underwire support and shaped cups', array['underwire','structured','support'], 'lingerie fabric','close_fitted','advanced','hook_and_eye'),
  ('bras','longline_bra','Longline Bra','Bra extending below underbust with longer band', array['longline','lingerie','support'], 'lingerie fabric','close_fitted','advanced','hook_and_eye'),
  ('bras','sports_bra','Sports Bra','Supportive stretch bra for movement and compression', array['sports','compression','support'], 'performance knit','close_fitted','intermediate','pull_on'),
  ('underwear','classic_brief','Classic Brief','Standard brief with moderate coverage and shaped leg openings', array['brief','classic','intimate'], 'stretch knit','close_fitted','beginner','elastic'),
  ('underwear','high_waisted_brief','High-Waisted Brief','Brief rising to natural waist or above', array['brief','high_waist','retro'], 'stretch knit','close_fitted','beginner','elastic'),
  ('underwear','bikini_underwear','Bikini Underwear','Lower-rise brief with lighter side profile', array['bikini','low_rise','intimate'], 'stretch knit','close_fitted','beginner','elastic'),
  ('underwear','boyshort','Boyshort','Short-legged underwear with more seat and hip coverage', array['boyshort','short_leg','intimate'], 'stretch knit','close_fitted','beginner','elastic'),
  ('underwear','fitted_short_short','Fitted Short-Short','Very short close-fitting bottom for lounge, dance, or layering', array['short_short','fitted','active'], 'stretch knit','close_fitted','beginner','elastic'),
  ('long_sleeves','fitted_long_sleeve_tee','Classic Fitted Long-Sleeve Tee','Close-fitting knit tee with full sleeves', array['tee','long_sleeve','knit'], 'jersey knit','close_fitted','beginner','pull_on'),
  ('long_sleeves','crewneck_sweatshirt','Crewneck Sweatshirt','Relaxed knit pullover with long sleeves and rib finishes', array['sweatshirt','crewneck','casual'], 'fleece or sweatshirt knit','relaxed','beginner','pull_on'),
  ('long_sleeves','turtleneck_top','Turtleneck','Long-sleeve knit top with close or soft funnel/turtle neck', array['turtleneck','knit','fitted'], 'stretch knit','close_fitted','intermediate','pull_on'),
  ('long_sleeves','henley_top','Henley','Long-sleeve knit top with partial front placket', array['henley','knit','placket'], 'jersey knit','semi_fitted','intermediate','buttons'),
  ('long_sleeves','buttoned_blouse_cuff','Buttoned Blouse with Cuff','Woven blouse with full sleeve and cuff finish', array['blouse','woven','cuff'], 'woven blouse fabric','semi_fitted','advanced','buttons'),
  ('denims','straight_jean','Straight Jean','Classic denim jean with straight leg and jean construction', array['jeans','straight','denim'], 'denim','semi_fitted','advanced','zip'),
  ('denims','bootcut_jean','Bootcut Jean','Jean fitted through thigh and slightly flared from knee', array['jeans','bootcut','denim'], 'denim','semi_fitted','advanced','zip'),
  ('denims','wide_leg_jean','Wide-Leg Jean','Jean with fuller leg silhouette and denim structure', array['jeans','wide_leg','denim'], 'denim','semi_fitted','advanced','zip'),
  ('denims','denim_skirt','Denim Skirt','Structured denim skirt using jean-style construction details', array['skirt','denim','structured'], 'denim','semi_fitted','intermediate','zip'),
  ('denims','denim_jacket','Denim Jacket','Classic denim jacket with collar, placket, yokes, and sleeves', array['jacket','denim','classic'], 'denim','semi_fitted','advanced','buttons'),
  ('dresses','shift_dress','Shift Dress','Simple dress falling from shoulder with minimal waist shaping', array['shift','clean','classic'], 'woven','relaxed','beginner','zip'),
  ('dresses','sheath_dress','Sheath Dress','Fitted dress shaped with darts or seams through torso and hip', array['sheath','fitted','classic'], 'woven','close_fitted','intermediate','zip'),
  ('dresses','slip_dress','Slip Dress','Bias or draped dress with narrow straps and fluid line', array['slip','bias','draped'], 'drapey woven','semi_fitted','advanced','pull_on'),
  ('dresses','shirt_dress','Shirt Dress','Dress built from shirt block with collar and front placket', array['shirt_dress','classic','structured'], 'woven shirting','semi_fitted','advanced','buttons'),
  ('dresses','wrap_dress','Wrap Dress','Dress crossing over the body and adjusting through wrap closure', array['wrap','adjustable','classic'], 'woven or knit','semi_fitted','intermediate','wrap')
) as v(category_code, slug, style_name, short_description, silhouette_tags, fabric_type_default, fit_intent, difficulty_level, closure_type)
on c.code = v.category_code;

insert into pattern_blocks (
  garment_style_id, base_block_name, block_type, intended_fit, closure_type, notes
)
select
  gs.id,
  gs.style_name || ' Base Block',
  case
    when gc.code in ('pants','shorts','denims') then 'lower_body'
    when gc.code = 'skirts' then 'skirt'
    when gc.code in ('tops','tanks','long_sleeves') then 'upper_body'
    when gc.code = 'bras' then 'bra'
    when gc.code = 'underwear' then 'intimate_bottom'
    when gc.code = 'dresses' then 'dress'
    else 'other'
  end,
  gs.fit_intent,
  gs.closure_type,
  'Starter metadata block'
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id;

-- Starter measurement requirements by category
insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id
join (
  values
    ('waist_natural', 1, 'Primary waist measure'),
    ('hip_full', 2, 'Primary hip measure'),
    ('waist_to_hip', 3, 'Vertical balance'),
    ('rise_front', 4, 'Lower-body rise'),
    ('rise_back', 5, 'Lower-body rise'),
    ('inseam', 6, 'Leg length'),
    ('outseam', 7, 'Outer leg length')
) as x(code, priority_order, note) on gc.code in ('pants','shorts','underwear')
join measurement_types mt on mt.code = x.code;

insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id
join (
  values
    ('waist_natural', 1, 'Waist'),
    ('hip_full', 2, 'Hip'),
    ('skirt_length_target', 3, 'Target skirt length')
) as x(code, priority_order, note) on gc.code = 'skirts'
join measurement_types mt on mt.code = x.code;

insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id
join (
  values
    ('shoulder_width', 1, 'Shoulder frame'),
    ('bust_full', 2, 'Primary bust'),
    ('waist_natural', 3, 'Waist shaping'),
    ('back_waist_length', 4, 'Back vertical'),
    ('armhole_depth', 5, 'Armhole')
) as x(code, priority_order, note) on gc.code in ('tops','tanks','long_sleeves')
join measurement_types mt on mt.code = x.code;

insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id
join (
  values
    ('underbust', 1, 'Band'),
    ('bust_full', 2, 'Cup volume'),
    ('bust_apex_to_apex', 3, 'Cup spacing'),
    ('band_size_target', 4, 'Preferred support')
) as x(code, priority_order, note) on gc.code = 'bras'
join measurement_types mt on mt.code = x.code;

insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id
join (
  values
    ('shoulder_width', 1, 'Upper frame'),
    ('bust_full', 2, 'Bust'),
    ('waist_natural', 3, 'Waist'),
    ('hip_full', 4, 'Hip'),
    ('dress_length_target', 5, 'Target dress length')
) as x(code, priority_order, note) on gc.code = 'dresses'
join measurement_types mt on mt.code = x.code;

-- denims: map jeans/skirt/jacket
insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join (
  values
    ('waist_natural', 1, 'Waist'),
    ('hip_full', 2, 'Hip'),
    ('inseam', 3, 'Inseam'),
    ('outseam', 4, 'Outseam')
) as x(code, priority_order, note) on gs.slug in ('straight_jean','bootcut_jean','wide_leg_jean')
join measurement_types mt on mt.code = x.code;

insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join (
  values
    ('waist_natural', 1, 'Waist'),
    ('hip_full', 2, 'Hip'),
    ('skirt_length_target', 3, 'Length')
) as x(code, priority_order, note) on gs.slug = 'denim_skirt'
join measurement_types mt on mt.code = x.code;

insert into garment_measurement_requirements (garment_style_id, measurement_type_id, required_boolean, priority_order, tolerance_note)
select gs.id, mt.id, true, x.priority_order, x.note
from garment_styles gs
join (
  values
    ('shoulder_width', 1, 'Shoulder'),
    ('bust_full', 2, 'Bust'),
    ('armhole_depth', 3, 'Armhole'),
    ('bicep_circumference', 4, 'Sleeve fit')
) as x(code, priority_order, note) on gs.slug = 'denim_jacket'
join measurement_types mt on mt.code = x.code;

insert into fabric_types (
  code, name, fabric_family, stretch_type, drape_level, structure_level,
  weight_category, supportiveness, breathable, notes
) values
('cotton_poplin','Cotton Poplin','woven','none','medium','balanced','light','low',true,'Great for shirts and dresses'),
('linen','Linen','woven','none','medium','soft','light','low',true,'Great for summer garments'),
('wool_suiting','Wool Suiting','woven','none','medium','structured','medium','medium',true,'Tailored garments'),
('denim_nonstretch','Non-Stretch Denim','woven','none','low','structured','heavy','high',true,'Denim core'),
('denim_stretch','Stretch Denim','woven','2_way','low','structured','medium','high',true,'Slim denim'),
('jersey_cotton','Cotton Jersey','knit','2_way','medium','soft','light','low',true,'Tees and tanks'),
('athletic_knit','Athletic Knit','knit','4_way','medium','balanced','medium','high',true,'Sports and movement'),
('lingerie_tricot','Lingerie Tricot','lingerie','2_way','medium','soft','light','medium',true,'Bras and underwear'),
('rayon_challis','Rayon Challis','woven','none','high','soft','light','low',true,'Drapey garments'),
('ponte','Ponte Knit','knit','2_way','medium','balanced','medium','medium',true,'Fitted skirts and dresses');

insert into style_fabric_recommendations (garment_style_id, fabric_type_id, recommendation_strength, reason)
select gs.id, ft.id, 'ideal',
  case
    when gc.code in ('tops','tanks','long_sleeves') then 'Stable knit and shirting match.'
    when gc.code in ('pants','skirts','shorts') then 'Balanced woven structure for lower body.'
    when gc.code = 'bras' then 'Stretch support for intimate fit.'
    when gc.code = 'underwear' then 'Soft stretch for comfort.'
    when gc.code = 'dresses' then 'Drape and comfort for dress silhouettes.'
    when gc.code = 'denims' then 'Classic denim recommendation.'
    else 'Starter recommendation.'
  end
from garment_styles gs
join garment_categories gc on gc.id = gs.category_id
join fabric_types ft on
  (gc.code in ('tops','tanks','long_sleeves') and ft.code in ('jersey_cotton','cotton_poplin'))
  or (gc.code in ('pants','skirts','shorts') and ft.code in ('wool_suiting','ponte','linen'))
  or (gc.code = 'bras' and ft.code in ('athletic_knit','lingerie_tricot'))
  or (gc.code = 'underwear' and ft.code in ('lingerie_tricot','athletic_knit'))
  or (gc.code = 'dresses' and ft.code in ('rayon_challis','cotton_poplin','linen','ponte'))
  or (gc.code = 'denims' and ft.code in ('denim_nonstretch','denim_stretch'));

insert into style_variants (
  garment_style_id, variant_code, variant_name, variant_type, design_changes,
  front_illustration_url, back_illustration_url, is_default
)
select
  gs.id,
  'base',
  'Base View',
  'core',
  '{}'::jsonb,
  gs.front_illustration_url,
  gs.back_illustration_url,
  true
from garment_styles gs;

insert into style_fit_rules (
  garment_style_id, rule_code, rule_name, rule_type,
  based_on_measurement_codes, formula_json, output_key, severity
)
select
  gs.id,
  'starter_fit_check',
  'Starter Fit Check',
  'adjustment_recommendation',
  array['waist_natural','hip_full','bust_full'],
  jsonb_build_object(
    'note', 'MVP baseline rule. Replace with category-specific formulas next.',
    'style_slug', gs.slug
  ),
  'starter_fit_note',
  'info'
from garment_styles gs;

