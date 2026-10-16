-- Dencast Global Supabase bootstrap
-- Run this in the Supabase SQL editor for project nxqocqmfwxdandzzdlpz.
-- It creates the public CMS schema expected by the app and seeds the admin user.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'editor' check (role in ('super_admin', 'admin', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  type text default 'text' check (type in ('text', 'json', 'boolean', 'number', 'image')),
  label text,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;
drop policy if exists settings_anon_select on public.site_settings;
create policy settings_anon_select on public.site_settings for select to anon, authenticated using (true);
drop policy if exists settings_auth_insert on public.site_settings;
create policy settings_auth_insert on public.site_settings for insert to authenticated with check (true);
drop policy if exists settings_auth_update on public.site_settings;
create policy settings_auth_update on public.site_settings for update to authenticated using (true) with check (true);
drop policy if exists settings_auth_delete on public.site_settings;
create policy settings_auth_delete on public.site_settings for delete to authenticated using (true);

create table if not exists public.seo_metadata (
  id uuid primary key default gen_random_uuid(),
  page_slug text unique not null,
  title text,
  description text,
  og_title text,
  og_description text,
  og_image text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  canonical_url text,
  robots text default 'index, follow',
  schema_markup jsonb,
  updated_at timestamptz default now()
);

alter table public.seo_metadata enable row level security;
drop policy if exists seo_anon_select on public.seo_metadata;
create policy seo_anon_select on public.seo_metadata for select to anon, authenticated using (true);
drop policy if exists seo_auth_insert on public.seo_metadata;
create policy seo_auth_insert on public.seo_metadata for insert to authenticated with check (true);
drop policy if exists seo_auth_update on public.seo_metadata;
create policy seo_auth_update on public.seo_metadata for update to authenticated using (true) with check (true);
drop policy if exists seo_auth_delete on public.seo_metadata;
create policy seo_auth_delete on public.seo_metadata for delete to authenticated using (true);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.social_links enable row level security;
drop policy if exists social_anon_select on public.social_links;
create policy social_anon_select on public.social_links for select to anon, authenticated using (true);
drop policy if exists social_auth_insert on public.social_links;
create policy social_auth_insert on public.social_links for insert to authenticated with check (true);
drop policy if exists social_auth_update on public.social_links;
create policy social_auth_update on public.social_links for update to authenticated using (true) with check (true);
drop policy if exists social_auth_delete on public.social_links;
create policy social_auth_delete on public.social_links for delete to authenticated using (true);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  industry text,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.clients enable row level security;
drop policy if exists clients_anon_select on public.clients;
create policy clients_anon_select on public.clients for select to anon, authenticated using (true);
drop policy if exists clients_auth_insert on public.clients;
create policy clients_auth_insert on public.clients for insert to authenticated with check (true);
drop policy if exists clients_auth_update on public.clients;
create policy clients_auth_update on public.clients for update to authenticated using (true) with check (true);
drop policy if exists clients_auth_delete on public.clients;
create policy clients_auth_delete on public.clients for delete to authenticated using (true);

create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.project_categories enable row level security;
drop policy if exists projcat_anon_select on public.project_categories;
create policy projcat_anon_select on public.project_categories for select to anon, authenticated using (true);
drop policy if exists projcat_auth_insert on public.project_categories;
create policy projcat_auth_insert on public.project_categories for insert to authenticated with check (true);
drop policy if exists projcat_auth_update on public.project_categories;
create policy projcat_auth_update on public.project_categories for update to authenticated using (true) with check (true);
drop policy if exists projcat_auth_delete on public.project_categories;
create policy projcat_auth_delete on public.project_categories for delete to authenticated using (true);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.project_categories(id),
  client_id uuid references public.clients(id),
  title text not null,
  slug text unique not null,
  tagline text,
  description text,
  challenge text,
  solution text,
  results text,
  cover_image text,
  hero_image text,
  gallery_images jsonb default '[]',
  videos jsonb default '[]',
  technologies jsonb default '[]',
  services_provided jsonb default '[]',
  client_name text,
  client_logo text,
  project_date date,
  project_url text,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order integer default 0,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;
drop policy if exists projects_anon_select on public.projects;
create policy projects_anon_select on public.projects for select to anon, authenticated using (true);
drop policy if exists projects_auth_insert on public.projects;
create policy projects_auth_insert on public.projects for insert to authenticated with check (true);
drop policy if exists projects_auth_update on public.projects;
create policy projects_auth_update on public.projects for update to authenticated using (true) with check (true);
drop policy if exists projects_auth_delete on public.projects;
create policy projects_auth_delete on public.projects for delete to authenticated using (true);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  color text default '#0056A6',
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.blog_categories enable row level security;
drop policy if exists blogcat_anon_select on public.blog_categories;
create policy blogcat_anon_select on public.blog_categories for select to anon, authenticated using (true);
drop policy if exists blogcat_auth_insert on public.blog_categories;
create policy blogcat_auth_insert on public.blog_categories for insert to authenticated with check (true);
drop policy if exists blogcat_auth_update on public.blog_categories;
create policy blogcat_auth_update on public.blog_categories for update to authenticated using (true) with check (true);
drop policy if exists blogcat_auth_delete on public.blog_categories;
create policy blogcat_auth_delete on public.blog_categories for delete to authenticated using (true);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.blog_categories(id),
  author_id uuid references public.profiles(id),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  tags jsonb default '[]',
  meta_title text,
  meta_description text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  views integer default 0,
  read_time integer default 5,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blog_posts enable row level security;
drop policy if exists blog_anon_select on public.blog_posts;
create policy blog_anon_select on public.blog_posts for select to anon, authenticated using (status = 'published');
drop policy if exists blog_auth_select_all on public.blog_posts;
create policy blog_auth_select_all on public.blog_posts for select to authenticated using (true);
drop policy if exists blog_auth_insert on public.blog_posts;
create policy blog_auth_insert on public.blog_posts for insert to authenticated with check (true);
drop policy if exists blog_auth_update on public.blog_posts;
create policy blog_auth_update on public.blog_posts for update to authenticated using (true) with check (true);
drop policy if exists blog_auth_delete on public.blog_posts;
create policy blog_auth_delete on public.blog_posts for delete to authenticated using (true);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.faqs enable row level security;
drop policy if exists faqs_anon_select on public.faqs;
create policy faqs_anon_select on public.faqs for select to anon, authenticated using (true);
drop policy if exists faqs_auth_insert on public.faqs;
create policy faqs_auth_insert on public.faqs for insert to authenticated with check (true);
drop policy if exists faqs_auth_update on public.faqs;
create policy faqs_auth_update on public.faqs for update to authenticated using (true) with check (true);
drop policy if exists faqs_auth_delete on public.faqs;
create policy faqs_auth_delete on public.faqs for delete to authenticated using (true);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service_interest text,
  subject text,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  reply_message text,
  replied_at timestamptz,
  ip_address text,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;
drop policy if exists contact_anon_insert on public.contact_messages;
create policy contact_anon_insert on public.contact_messages for insert to anon, authenticated with check (true);
drop policy if exists contact_auth_select on public.contact_messages;
create policy contact_auth_select on public.contact_messages for select to authenticated using (true);
drop policy if exists contact_auth_update on public.contact_messages;
create policy contact_auth_update on public.contact_messages for update to authenticated using (true) with check (true);
drop policy if exists contact_auth_delete on public.contact_messages;
create policy contact_auth_delete on public.contact_messages for delete to authenticated using (true);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  is_active boolean default true,
  source text default 'website',
  subscribed_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;
drop policy if exists newsletter_anon_insert on public.newsletter_subscribers;
create policy newsletter_anon_insert on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists newsletter_auth_select on public.newsletter_subscribers;
create policy newsletter_auth_select on public.newsletter_subscribers for select to authenticated using (true);
drop policy if exists newsletter_auth_update on public.newsletter_subscribers;
create policy newsletter_auth_update on public.newsletter_subscribers for update to authenticated using (true) with check (true);
drop policy if exists newsletter_auth_delete on public.newsletter_subscribers;
create policy newsletter_auth_delete on public.newsletter_subscribers for delete to authenticated using (true);

create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  original_name text,
  file_url text not null,
  thumbnail_url text,
  file_type text not null check (file_type in ('image', 'video', 'document', 'pdf')),
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  duration integer,
  alt_text text,
  caption text,
  tags jsonb default '[]',
  folder text default 'general',
  cloudinary_id text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

alter table public.media_files enable row level security;
drop policy if exists media_anon_select on public.media_files;
create policy media_anon_select on public.media_files for select to anon, authenticated using (true);
drop policy if exists media_auth_insert on public.media_files;
create policy media_auth_insert on public.media_files for insert to authenticated with check (true);
drop policy if exists media_auth_update on public.media_files;
create policy media_auth_update on public.media_files for update to authenticated using (true) with check (true);
drop policy if exists media_auth_delete on public.media_files;
create policy media_auth_delete on public.media_files for delete to authenticated using (true);

create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  suffix text default '+',
  description text,
  icon text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.statistics enable row level security;
drop policy if exists stats_anon_select on public.statistics;
create policy stats_anon_select on public.statistics for select to anon, authenticated using (true);
drop policy if exists stats_auth_insert on public.statistics;
create policy stats_auth_insert on public.statistics for insert to authenticated with check (true);
drop policy if exists stats_auth_update on public.statistics;
create policy stats_auth_update on public.statistics for update to authenticated using (true) with check (true);
drop policy if exists stats_auth_delete on public.statistics;
create policy stats_auth_delete on public.statistics for delete to authenticated using (true);

create index if not exists idx_projects_category on public.projects(category_id);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_blog_posts_category on public.blog_posts(category_id);
create index if not exists idx_contact_messages_status on public.contact_messages(status);
create index if not exists idx_media_files_type on public.media_files(file_type);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'editor',
    true
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        is_active = true,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- IMPORTANT:
-- Create the admin auth user in Supabase Dashboard > Authentication > Users,
-- or via the Supabase Admin API. Do not seed auth.users directly in SQL.
-- After creating the auth user, run:
--   update public.profiles
--   set role = 'super_admin', full_name = 'Super Admin', is_active = true
--   where email = 'admin@dencastglobal.com';