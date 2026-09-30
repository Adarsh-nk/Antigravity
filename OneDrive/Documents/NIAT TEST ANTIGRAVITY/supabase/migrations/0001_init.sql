-- =====================================================================
-- 0001_init.sql : Agriculture Crop Advisory Assistant
-- =====================================================================
create extension if not exists "pgcrypto";

-- ---------- Utility: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  preferred_language text not null default 'en' check (preferred_language in ('en','hi','mr')),
  state text check (char_length(state) <= 60),
  district text check (char_length(district) <= 60),
  village_or_town text check (char_length(village_or_town) <= 80),
  primary_crops text[] not null default '{}' check (cardinality(primary_crops) <= 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, preferred_language)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Farmer'),
    case when new.raw_user_meta_data ->> 'preferred_language' in ('en','hi','mr')
         then new.raw_user_meta_data ->> 'preferred_language' else 'en' end
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- farms ----------
create table public.farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  area numeric(10,2) not null check (area > 0 and area <= 100000),
  area_unit text not null default 'acre' check (area_unit in ('acre','hectare')),
  state text not null check (char_length(state) between 2 and 60),
  district text not null check (char_length(district) between 2 and 60),
  soil_type text not null check (soil_type in (
    'black_cotton_regur','red','alluvial','laterite','sandy','loamy','clayey','saline_alkaline','not_sure')),
  irrigation_source text not null check (irrigation_source in (
    'rainfed','canal','borewell_tubewell','open_well','drip','sprinkler','farm_pond','river_lift')),
  soil_ph numeric(3,1) check (soil_ph between 3 and 10),
  soil_nitrogen_kg_ha numeric(7,2) check (soil_nitrogen_kg_ha >= 0),
  soil_phosphorus_kg_ha numeric(7,2) check (soil_phosphorus_kg_ha >= 0),
  soil_potassium_kg_ha numeric(7,2) check (soil_potassium_kg_ha >= 0),
  soil_organic_carbon_percent numeric(4,2) check (soil_organic_carbon_percent between 0 and 20),
  soil_ec_ds_m numeric(5,2) check (soil_ec_ds_m >= 0),
  soil_test_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_farms_user on public.farms(user_id);
create trigger trg_farms_updated before update on public.farms
for each row execute function public.set_updated_at();

-- ---------- advisories ----------
create table public.advisories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  advisory_type text not null check (advisory_type in (
    'crop_recommendation','disease_diagnosis','fertilizer_irrigation','pest_management','seasonal_plan')),
  language text not null default 'en' check (language in ('en','hi','mr')),
  title text not null check (char_length(title) <= 160),
  input_payload jsonb not null,
  farm_snapshot jsonb,
  image_path text,
  output_payload jsonb not null,
  confidence text not null check (confidence in ('low','medium','high')),
  escalate_to_expert boolean not null default false,
  model_name text not null,
  latency_ms integer check (latency_ms >= 0),
  prompt_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_advisories_user_created on public.advisories(user_id, created_at desc);
create index idx_advisories_user_type on public.advisories(user_id, advisory_type);
create index idx_advisories_farm on public.advisories(farm_id);
create trigger trg_advisories_updated before update on public.advisories
for each row execute function public.set_updated_at();

-- ---------- advisory_messages (follow-up chat) ----------
create table public.advisory_messages (
  id uuid primary key default gen_random_uuid(),
  advisory_id uuid not null references public.advisories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null check (char_length(content) between 1 and 6000),
  created_at timestamptz not null default now()
);
create index idx_messages_advisory_created on public.advisory_messages(advisory_id, created_at);

-- ---------- advisory_feedback ----------
create table public.advisory_feedback (
  id uuid primary key default gen_random_uuid(),
  advisory_id uuid not null references public.advisories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating in (-1, 1)),
  comment text check (char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  unique (advisory_id, user_id)
);

-- ---------- api_usage_logs ----------
create table public.api_usage_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  endpoint text not null,
  status_code integer not null,
  latency_ms integer,
  created_at timestamptz not null default now()
);
create index idx_usage_user_created on public.api_usage_logs(user_id, created_at desc);

-- ---------- Storage bucket for crop images (private) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('crop-images', 'crop-images', false, 4194304, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
