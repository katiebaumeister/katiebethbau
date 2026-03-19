-- Sewing Closet MVP schema (API-compatible baseline)

drop table if exists generated_pattern_variants cascade;
drop table if exists style_fit_rule_conditions cascade;
drop table if exists style_fit_rules cascade;
drop table if exists style_variants cascade;
drop table if exists style_fabric_recommendations cascade;
drop table if exists fabric_types cascade;
drop table if exists user_measurements cascade;
drop table if exists user_measurement_profiles cascade;
drop table if exists garment_measurement_requirements cascade;
drop table if exists pattern_blocks cascade;
drop table if exists garment_styles cascade;
drop table if exists garment_categories cascade;
drop table if exists measurement_types cascade;

create table garment_categories (
  id bigserial primary key,
  code text unique not null,
  name text not null,
  display_order int not null default 0,
  description text
);

create table measurement_types (
  id bigserial primary key,
  code text unique not null,
  label text not null,
  body_zone text not null,
  unit text not null default 'in',
  description text not null,
  guide_image_url text
);

create table garment_styles (
  id bigserial primary key,
  category_id bigint not null references garment_categories(id) on delete cascade,
  slug text unique not null,
  style_name text not null,
  short_description text not null,
  silhouette_tags text[] not null default '{}',
  fabric_type_default text not null,
  fit_intent text not null,
  difficulty_level text not null check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  closure_type text,
  thumbnail_image_url text,
  front_illustration_url text,
  back_illustration_url text,
  active boolean not null default true
);

create table pattern_blocks (
  id bigserial primary key,
  garment_style_id bigint not null references garment_styles(id) on delete cascade,
  base_block_name text not null,
  block_type text not null,
  intended_fit text not null,
  closure_type text,
  waistline text,
  sleeve_type text,
  leg_shape text,
  neckline_type text,
  support_level text,
  notes text
);

create table garment_measurement_requirements (
  id bigserial primary key,
  garment_style_id bigint not null references garment_styles(id) on delete cascade,
  measurement_type_id bigint not null references measurement_types(id) on delete cascade,
  required_boolean boolean not null default true,
  priority_order int not null default 1,
  tolerance_note text,
  unique (garment_style_id, measurement_type_id)
);

create table user_measurement_profiles (
  id bigserial primary key,
  user_id uuid not null,
  profile_name text not null,
  preferred_unit text not null default 'in' check (preferred_unit in ('in','cm')),
  body_notes text,
  posture_notes text,
  fitting_preferences jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_measurements (
  id bigserial primary key,
  profile_id bigint not null references user_measurement_profiles(id) on delete cascade,
  measurement_type_id bigint not null references measurement_types(id) on delete cascade,
  value numeric(10,2) not null,
  entered_method text not null default 'manual' check (entered_method in ('manual','guided','estimated','imported')),
  confidence_level text not null default 'high' check (confidence_level in ('low','medium','high')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, measurement_type_id)
);

create table fabric_types (
  id bigserial primary key,
  code text unique not null,
  name text not null,
  fabric_family text not null,
  stretch_type text not null default 'none' check (stretch_type in ('none','2_way','4_way')),
  drape_level text not null check (drape_level in ('low','medium','high')),
  structure_level text not null check (structure_level in ('soft','balanced','structured')),
  weight_category text not null check (weight_category in ('very_light','light','medium','heavy')),
  supportiveness text not null check (supportiveness in ('low','medium','high')),
  breathable boolean not null default true,
  notes text
);

create table style_fabric_recommendations (
  id bigserial primary key,
  garment_style_id bigint not null references garment_styles(id) on delete cascade,
  fabric_type_id bigint not null references fabric_types(id) on delete cascade,
  recommendation_strength text not null default 'good' check (recommendation_strength in ('ideal','good','possible','avoid')),
  reason text not null,
  unique (garment_style_id, fabric_type_id)
);

create table style_variants (
  id bigserial primary key,
  garment_style_id bigint not null references garment_styles(id) on delete cascade,
  variant_code text not null,
  variant_name text not null,
  variant_type text not null,
  design_changes jsonb not null default '{}'::jsonb,
  front_illustration_url text,
  back_illustration_url text,
  is_default boolean not null default false,
  unique (garment_style_id, variant_code)
);

create table style_fit_rules (
  id bigserial primary key,
  garment_style_id bigint not null references garment_styles(id) on delete cascade,
  rule_code text not null,
  rule_name text not null,
  rule_type text not null check (
    rule_type in (
      'base_ease',
      'derived_dimension',
      'adjustment_recommendation',
      'balance_check',
      'support_rule',
      'fit_warning'
    )
  ),
  based_on_measurement_codes text[] not null default '{}',
  formula_json jsonb not null default '{}'::jsonb,
  output_key text not null,
  severity text not null default 'info' check (severity in ('info','warning','critical')),
  active boolean not null default true,
  unique (garment_style_id, rule_code)
);

create table style_fit_rule_conditions (
  id bigserial primary key,
  style_fit_rule_id bigint not null references style_fit_rules(id) on delete cascade,
  condition_order int not null default 1,
  left_operand text not null,
  operator text not null check (operator in ('>','>=','<','<=','=','!=','between','contains')),
  right_operand jsonb not null,
  logical_group text not null default 'and' check (logical_group in ('and','or'))
);

create table generated_pattern_variants (
  id bigserial primary key,
  user_id uuid not null,
  garment_style_id bigint not null references garment_styles(id) on delete cascade,
  profile_id bigint not null references user_measurement_profiles(id) on delete cascade,
  selected_variant_id bigint references style_variants(id) on delete set null,
  size_basis text,
  computed_values_json jsonb not null default '{}'::jsonb,
  fit_notes_json jsonb not null default '[]'::jsonb,
  fit_warnings_json jsonb not null default '[]'::jsonb,
  preview_image_url text,
  generated_at timestamptz not null default now()
);

create index idx_garment_styles_category_id on garment_styles(category_id);
create index idx_garment_styles_slug on garment_styles(slug);
create index idx_measurement_types_code on measurement_types(code);
create index idx_gmr_style_id on garment_measurement_requirements(garment_style_id);
create index idx_gmr_measurement_type_id on garment_measurement_requirements(measurement_type_id);
create index idx_user_measurement_profiles_user_id on user_measurement_profiles(user_id);
create index idx_user_measurements_profile_id on user_measurements(profile_id);
create index idx_style_fabric_recommendations_style_id on style_fabric_recommendations(garment_style_id);
create index idx_style_variants_style_id on style_variants(garment_style_id);
create index idx_style_fit_rules_style_id on style_fit_rules(garment_style_id);
create index idx_style_fit_rule_conditions_rule_id on style_fit_rule_conditions(style_fit_rule_id);
create index idx_generated_pattern_variants_user_id on generated_pattern_variants(user_id);
create index idx_generated_pattern_variants_style_id on generated_pattern_variants(garment_style_id);

