-- Dencast Global: schema sync + starter seed
-- Run this AFTER bootstrap.sql in Supabase SQL Editor.
-- It aligns column names/types to what the React app expects and inserts starter rows.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) Ensure missing CMS tables exist (some were not present in bootstrap.sql)
-- ---------------------------------------------------------------------------

create table if not exists public.hero_content (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text,
  cta_primary_text text,
  cta_primary_url text,
  cta_secondary_text text,
  cta_secondary_url text,
  background_video_url text,
  background_image_url text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.hero_content enable row level security;
drop policy if exists hero_anon_select on public.hero_content;
create policy hero_anon_select on public.hero_content for select to anon, authenticated using (true);
drop policy if exists hero_auth_insert on public.hero_content;
create policy hero_auth_insert on public.hero_content for insert to authenticated with check (true);
drop policy if exists hero_auth_update on public.hero_content;
create policy hero_auth_update on public.hero_content for update to authenticated using (true) with check (true);
drop policy if exists hero_auth_delete on public.hero_content;
create policy hero_auth_delete on public.hero_content for delete to authenticated using (true);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_title text,
  client_company text,
  client_avatar_url text,
  content text not null,
  rating integer,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.testimonials enable row level security;
drop policy if exists testimonials_anon_select on public.testimonials;
create policy testimonials_anon_select on public.testimonials for select to anon, authenticated using (true);
drop policy if exists testimonials_auth_insert on public.testimonials;
create policy testimonials_auth_insert on public.testimonials for insert to authenticated with check (true);
drop policy if exists testimonials_auth_update on public.testimonials;
create policy testimonials_auth_update on public.testimonials for update to authenticated using (true) with check (true);
drop policy if exists testimonials_auth_delete on public.testimonials;
create policy testimonials_auth_delete on public.testimonials for delete to authenticated using (true);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  avatar_url text,
  social_links jsonb,
  sort_order integer default 0,
  is_active boolean default true,
  is_leadership boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.team_members enable row level security;
drop policy if exists team_anon_select on public.team_members;
create policy team_anon_select on public.team_members for select to anon, authenticated using (is_active = true);
drop policy if exists team_auth_select on public.team_members;
create policy team_auth_select on public.team_members for select to authenticated using (true);
drop policy if exists team_auth_insert on public.team_members;
create policy team_auth_insert on public.team_members for insert to authenticated with check (true);
drop policy if exists team_auth_update on public.team_members;
create policy team_auth_update on public.team_members for update to authenticated using (true) with check (true);
drop policy if exists team_auth_delete on public.team_members;
create policy team_auth_delete on public.team_members for delete to authenticated using (true);

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.service_categories enable row level security;
drop policy if exists svccat_anon_select on public.service_categories;
create policy svccat_anon_select on public.service_categories for select to anon, authenticated using (true);
drop policy if exists svccat_auth_insert on public.service_categories;
create policy svccat_auth_insert on public.service_categories for insert to authenticated with check (true);
drop policy if exists svccat_auth_update on public.service_categories;
create policy svccat_auth_update on public.service_categories for update to authenticated using (true) with check (true);
drop policy if exists svccat_auth_delete on public.service_categories;
create policy svccat_auth_delete on public.service_categories for delete to authenticated using (true);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.service_categories(id),
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  icon text,
  cover_image_url text,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.services enable row level security;
drop policy if exists services_anon_select on public.services;
create policy services_anon_select on public.services for select to anon, authenticated using (is_active = true);
drop policy if exists services_auth_select on public.services;
create policy services_auth_select on public.services for select to authenticated using (true);
drop policy if exists services_auth_insert on public.services;
create policy services_auth_insert on public.services for insert to authenticated with check (true);
drop policy if exists services_auth_update on public.services;
create policy services_auth_update on public.services for update to authenticated using (true) with check (true);
drop policy if exists services_auth_delete on public.services;
create policy services_auth_delete on public.services for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 2) Align existing tables to app-expected columns
-- ---------------------------------------------------------------------------

alter table public.projects add column if not exists content text;
alter table public.projects add column if not exists cover_image_url text;
alter table public.projects add column if not exists video_url text;
alter table public.projects add column if not exists is_active boolean default true;
alter table public.projects add column if not exists published_at timestamptz;
alter table public.projects add column if not exists updated_at timestamptz default now();

-- Map legacy columns to app columns if needed
update public.projects
set cover_image_url = coalesce(cover_image_url, cover_image)
where cover_image_url is null and cover_image is not null;

update public.projects
set is_active = coalesce(is_active, true),
    published_at = coalesce(published_at, created_at),
    updated_at = coalesce(updated_at, now());

alter table public.blog_posts add column if not exists is_published boolean default false;
alter table public.blog_posts add column if not exists cover_image_url text;
alter table public.blog_posts add column if not exists updated_at timestamptz default now();

alter table public.blog_categories add column if not exists updated_at timestamptz default now();
update public.blog_categories set updated_at = coalesce(updated_at, created_at);

update public.blog_posts
set cover_image_url = coalesce(cover_image_url, cover_image)
where cover_image_url is null and cover_image is not null;

update public.blog_posts
set is_published = case
  when is_published is not null then is_published
  when status = 'published' then true
  else false
end,
updated_at = coalesce(updated_at, now());

alter table public.contact_messages add column if not exists updated_at timestamptz default now();
alter table public.contact_messages add column if not exists reply_message text;
alter table public.contact_messages add column if not exists replied_at timestamptz;
update public.contact_messages set updated_at = coalesce(updated_at, created_at);

alter table public.media_files add column if not exists url text;
alter table public.media_files add column if not exists type text;
alter table public.media_files add column if not exists size bigint;
alter table public.media_files add column if not exists updated_at timestamptz default now();

update public.media_files
set url = coalesce(url, file_url),
    type = coalesce(type, file_type),
    size = coalesce(size, file_size),
    updated_at = coalesce(updated_at, created_at);

-- statistics.value may be text in older schema; app expects number
alter table public.statistics alter column value type numeric using
  case
    when value is null then null
    when trim(value::text) = '' then null
    else nullif(regexp_replace(value::text, '[^0-9.-]', '', 'g'), '')::numeric
  end;

alter table public.statistics add column if not exists prefix text;
alter table public.statistics add column if not exists updated_at timestamptz default now();
update public.statistics set updated_at = coalesce(updated_at, created_at);

-- ---------------------------------------------------------------------------
-- 3) Starter seed so admin dashboards are not empty
-- ---------------------------------------------------------------------------

insert into public.project_categories (name, slug, description, sort_order)
values
  ('Corporate', 'corporate', 'Corporate productions', 1),
  ('Events', 'events', 'Event coverage', 2),
  ('Documentary', 'documentary', 'Documentary storytelling', 3)
on conflict (slug) do nothing;

insert into public.projects (
  category_id, title, slug, tagline, description, content,
  cover_image_url, client_name, is_featured, is_active, published_at, sort_order
)
select
  c.id,
  'Sasini Annual Report',
  'sasini-annual-report',
  'Corporate storytelling at scale',
  'A flagship annual report production.',
  'Full campaign production for annual communications.',
  '/dencast_images/sasini_conference.jpg',
  'Sasini PLC',
  true,
  true,
  now(),
  1
from public.project_categories c
where c.slug = 'corporate'
on conflict (slug) do nothing;

insert into public.blog_categories (name, slug, description)
values ('Insights', 'insights', 'Company insights and stories')
on conflict (slug) do nothing;

insert into public.blog_posts (
  category_id, title, slug, excerpt, content, cover_image_url,
  is_featured, is_published, views, published_at
)
select
  bc.id,
  'How Visual Storytelling Builds Brand Trust',
  'visual-storytelling-builds-brand-trust',
  'Why film and documentary formats increase brand trust.',
  'Long-form and short-form visuals shape audience memory and trust.',
  '/dencast_images/DSC_3798-scaled.jpg',
  true,
  true,
  0,
  now()
from public.blog_categories bc
where bc.slug = 'insights'
on conflict (slug) do nothing;

insert into public.statistics (label, value, suffix, prefix, description, sort_order, is_active)
select * from (
  values
    ('Projects Delivered'::text, 120::numeric, '+'::text, null::text, 'Completed productions'::text, 1::int, true),
    ('Countries Reached'::text, 20::numeric, '+'::text, null::text, 'Regional footprint'::text, 2::int, true),
    ('Years Experience'::text, 10::numeric, '+'::text, null::text, 'Industry experience'::text, 3::int, true)
) as v(label, value, suffix, prefix, description, sort_order, is_active)
where not exists (
  select 1 from public.statistics s where s.label = v.label
);

insert into public.media_files (
  name,
  file_url,
  file_type,
  file_size,
  url,
  type,
  size,
  alt_text
)
select
  'Sasini Conference',
  '/dencast_images/sasini_conference.jpg',
  'image',
  0,
  '/dencast_images/sasini_conference.jpg',
  'image',
  0,
  'Conference coverage'
where not exists (
  select 1 from public.media_files where name = 'Sasini Conference'
);

insert into public.contact_messages (name, email, subject, message, status)
select
  'Jane Doe', 'jane@example.com', 'Documentary Inquiry', 'We need support for a documentary campaign.', 'new'
where not exists (
  select 1
  from public.contact_messages
  where email = 'jane@example.com' and subject = 'Documentary Inquiry'
);

update public.hero_content
set
  headline = 'We Tell Stories That Move the World',
  subheadline = 'Premium Creative Media & Film Production',
  description = 'We are a world-class creative media and film production company dedicated to crafting cinematic stories that captivate audiences, elevate brands, and leave a lasting impression on the global stage.',
  cta_primary_text = 'Explore Our Work',
  cta_primary_url = '/portfolio',
  cta_secondary_text = 'Get In Touch',
  cta_secondary_url = '/contact',
  background_video_url = '/videos/background.mp4',
  background_image_url = '/dencast_images/Virtual-livestreaming-scaled.jpg',
  updated_at = now()
where is_active = true;

insert into public.hero_content (
  headline,
  subheadline,
  description,
  cta_primary_text,
  cta_primary_url,
  cta_secondary_text,
  cta_secondary_url,
  background_video_url,
  background_image_url,
  is_active
)
select
  'We Tell Stories That Move the World',
  'Premium Creative Media & Film Production',
  'We are a world-class creative media and film production company dedicated to crafting cinematic stories that captivate audiences, elevate brands, and leave a lasting impression on the global stage.',
  'Explore Our Work',
  '/portfolio',
  'Get In Touch',
  '/contact',
  '/videos/background.mp4',
  '/dencast_images/Virtual-livestreaming-scaled.jpg',
  true
where not exists (
  select 1 from public.hero_content where is_active = true
);

insert into public.service_categories (name, slug, description, sort_order)
values ('Production', 'production', 'Media production services', 1)
on conflict (slug) do nothing;

insert into public.services (
  category_id, name, slug, tagline, description, cover_image_url, is_featured, is_active, sort_order
)
select
  sc.id,
  'Documentary Production',
  'documentary-production',
  'Authentic stories with cinematic impact',
  'End-to-end documentary production services.',
  '/dencast_images/event1.jpg',
  true,
  true,
  1
from public.service_categories sc
where sc.slug = 'production'
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 4) Frontend parity seed (static datasets -> CMS tables)
-- ---------------------------------------------------------------------------

insert into public.project_categories (name, slug, description, sort_order)
values
  ('Photography', 'photography', 'Photography work', 4),
  ('Streaming', 'streaming', 'Live streaming projects', 5),
  ('Commercial', 'commercial', 'Commercial productions', 6),
  ('Graphics Design', 'graphics-design', 'Graphic design portfolio', 7)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.projects (
  category_id, title, slug, tagline, description, content,
  cover_image_url, client_name, is_featured, is_active, published_at, sort_order, updated_at
)
select
  c.id,
  v.title,
  v.slug,
  v.tagline,
  v.description,
  v.content,
  v.cover_image_url,
  v.client_name,
  v.is_featured,
  true,
  now(),
  v.sort_order,
  now()
from (
  values
    ('corporate', 'Sasini Annual Report', 'voices-of-the-nile', 'Sasini Annual Report', 'Sasini Annual Report production.', 'Sasini Annual Report production.', '/dencast_images/sasini_conference.jpg', 'Sasini PLC', true, 1),
    ('streaming', 'The Amakowe Wala Show', 'mtn-brand-relaunch', 'The Amakowe Wala Show', 'Streaming show production.', 'Streaming show production.', '/dencast_images/amakowe.jpg', 'The Amakowe Wala Show', false, 2),
    ('events', 'Amplifying Africa''s Voice', 'accra-fashion-week', 'Amplifying Africa''s Voice', 'Event coverage project.', 'Event coverage project.', '/dencast_images/africatalyst.jpg', 'Africatalyst', false, 3),
    ('corporate', 'Europe Day Football Kenya', 'corporate-summit-2024', 'Europe Day Football Kenya', 'Corporate and event campaign coverage.', 'Corporate and event campaign coverage.', '/dencast_images/DSC_3798-scaled.jpg', 'European Union', false, 4),
    ('commercial', 'Building Leaders Through Story', 'kasapreko-commercial', 'Building Leaders Through Story', 'Commercial storytelling production.', 'Commercial storytelling production.', '/dencast_images/elf.png', 'Emerging Leaders Foundation', false, 5),
    ('photography', 'African Development Bank Forum', 'golden-stool-portrait-series', 'African Development Bank Forum', 'Photography coverage.', 'Photography coverage.', '/dencast_images/event1.jpg', 'African Development Bank', false, 6),
    ('events', 'RHNK Conference 2024', 'tech-innovators-doc', 'RHNK Conference 2024', 'Conference media production.', 'Conference media production.', '/dencast_images/rhnk.jpg', 'RHNK', false, 7),
    ('streaming', 'Live Streaming', 'harvest-time-film', 'Live Streaming', 'Multi-platform live streaming.', 'Multi-platform live streaming.', '/dencast_images/Virtual-livestreaming-scaled.jpg', 'VWT', false, 8),
    ('commercial', 'Hotel Photography', 'stanbic-investor-day', 'Hotel Photography', 'Commercial hospitality photography.', 'Commercial hospitality photography.', '/dencast_images/White-Beach-Palace.jpg', 'White Beach Palace', false, 9),
    ('events', 'Basketball Event', 'ghana-music-awards', 'Basketball Event', 'Sports event coverage.', 'Sports event coverage.', '/dencast_images/basketball.jpg', 'Michezo Africa', false, 10),
    ('events', 'Conference Coverage', 'nestle-product-launch', 'Conference Coverage', 'Conference video and photo coverage.', 'Conference video and photo coverage.', '/dencast_images/rhnk.jpg', 'Conference Client', false, 11),
    ('graphics-design', 'Graphics Design', 'makola-market-story', 'Graphics Design', 'Design-focused media work.', 'Design-focused media work.', '/dencast_images/image.png', 'Dencast Creative', false, 12)
) as v(category_slug, title, slug, tagline, description, content, cover_image_url, client_name, is_featured, sort_order)
join public.project_categories c on c.slug = v.category_slug
on conflict (slug) do update
set category_id = excluded.category_id,
    title = excluded.title,
    tagline = excluded.tagline,
    description = excluded.description,
    content = excluded.content,
    cover_image_url = excluded.cover_image_url,
    client_name = excluded.client_name,
    is_featured = excluded.is_featured,
    is_active = true,
    published_at = coalesce(public.projects.published_at, now()),
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.clients (name, logo_url, industry, is_featured, sort_order, updated_at)
select
  v.name,
  '/dencast_images/sasini_conference.jpg',
  v.industry,
  true,
  v.sort_order,
  now()
from (
  values
    ('Sasini2 PLC', 'Agriculture', 1),
    ('Afreximbank', 'Finance', 2),
    ('Africatalyst', 'Development', 3),
    ('European Union', 'International Organization', 4),
    ('White Beach Palace', 'Hospitality', 5),
    ('Knowledge Empowering Youth', 'Education', 6),
    ('RHNK', 'Health', 7),
    ('VWT', 'Media', 8),
    ('Michezo Africa', 'Sports', 9),
    ('Emerging Leaders Foundation', 'NGO', 10),
    ('ibac', 'Corporate', 11),
    ('Bible Society of Kenya', 'Non-profit', 12)
) as v(name, industry, sort_order)
where not exists (
  select 1 from public.clients c where c.name = v.name
);

insert into public.testimonials (
  client_name, client_title, client_company, content, rating, is_featured, sort_order, updated_at
)
select
  v.client_name,
  v.client_title,
  v.client_company,
  v.content,
  5,
  v.is_featured,
  v.sort_order,
  now()
from (
  values
    ('Amara Bobb', 'Chief Marketing Officer', 'Emerging Leaders Foundation (ELF) Africa', 'Dencast amplifies Africa''s development voices through impactful storytelling, partnering with Africatalyst and ELF to produce documentaries, livestreams, and content that sparks dialogue and inspires lasting change.', true, 1),
    ('Dr. Fatima Rashid', 'Director of Communications', 'European Union Conference', 'Dencast documented the EU in Kenya''s first Europe Day Football Tournament across five counties and livestreamed key transformation events, capturing unity, youth spirit, and lasting impact.', true, 2),
    ('Wendy Boit', 'Head of Sustainability and ESG', 'Sasini PLC', 'For three years, Dencast has partnered with Sasini PLC to document its sustainability journey across tea, coffee, macadamia, and avocado value chains, turning farm-to-factory impact into powerful visual stories.', true, 3),
    ('Sophia Achieng', 'Special Advisor', 'Africatalyst', 'Dencast partnered with Africatalyst for two years to amplify high-impact Nairobi events through strategic storytelling, event coverage, and content that sparks conversations and drives change across Africa.', true, 4),
    ('Priscilla Ngare', 'Event Manager', 'Reproductive Health Network Kenya (RHNK)', 'Dencast delivered full 360 conference coverage for RHNK 2024 in Mombasa, including videography, photography, livestreams, and breakout recordings for 800+ delegates with exceptional clarity and impact.', false, 5),
    ('Wanjiku Mwenda', 'Founder & CEO', 'The Amakove Wala Show', 'We partnered with The Amakove Wala Show from ideation to post-production, shaping authentic, socially driven episodes with expert guests to spark honest conversations that uplift and challenge.', false, 6)
) as v(client_name, client_title, client_company, content, is_featured, sort_order)
where not exists (
  select 1 from public.testimonials t where t.client_name = v.client_name and t.client_company = v.client_company
);

insert into public.service_categories (name, slug, description, sort_order)
values
  ('Live & Events', 'live-events', 'Livestream and event production', 2),
  ('Visual Production', 'visual-production', 'Photography and videography services', 3),
  ('Brand & Strategy', 'brand-strategy', 'Brand and communications strategy', 4),
  ('Digital & Creative', 'digital-creative', 'Digital creative and media execution', 5)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.services (
  category_id, name, slug, tagline, description, cover_image_url, is_featured, is_active, sort_order, updated_at
)
select
  sc.id,
  v.name,
  v.slug,
  v.tagline,
  v.description,
  v.cover_image_url,
  v.is_featured,
  true,
  v.sort_order,
  now()
from (
  values
    ('production', 'Documentary Production', 'documentary-production', 'Stories that move the world', 'From concept to final cut, we craft compelling documentaries that capture authentic narratives, drive social impact, and connect deeply with global audiences.', '/dencast_images/event1.jpg', true, 1),
    ('live-events', 'Livestreaming & Events', 'livestreaming-events', 'Live, unfiltered, unforgettable', 'Multi-camera live event production and streaming for conferences, concerts, product launches, and hybrid events.', '/dencast_images/Virtual-livestreaming-scaled.jpg', true, 2),
    ('visual-production', 'Photography', 'photography', 'One frame, infinite impact', 'Professional photography across editorial, commercial, portrait, and event genres.', '/dencast_images/White-Beach-Palace.jpg', true, 3),
    ('visual-production', 'Videography', 'videography', 'Motion that resonates', 'High-production-value video content for brands, campaigns, and narratives.', '/dencast_images/DSC_3798-scaled.jpg', false, 4),
    ('brand-strategy', 'Brand Strategy', 'brand-strategy-service', 'Define. Position. Lead.', 'Strategic brand development aligning visual identity, messaging, and positioning.', '/dencast_images/amakowe.jpg', false, 5),
    ('digital-creative', 'Creative Media', 'creative-media', 'Imagination made tangible', 'Motion graphics, animated content, conceptual campaigns, and multimedia storytelling.', '/dencast_images/image.png', false, 6),
    ('visual-production', 'Drone Services', 'drone-services', 'Perspective from above', 'Licensed aerial cinematography and photography for events, real estate, and campaigns.', '/dencast_images/Drone%20.jpg', false, 7),
    ('brand-strategy', 'Corporate Communications', 'corporate-communications', 'Clarity at every level', 'Executive messaging, internal communications, and corporate storytelling.', '/dencast_images/sasini_conference.jpg', false, 8),
    ('brand-strategy', 'Commercial Productions', 'commercial-productions', 'Sell with cinematic power', 'TV commercials, online ads, and product films engineered to convert.', '/dencast_images/elf.png', false, 9),
    ('digital-creative', 'Digital Content Creation', 'digital-content-creation', 'Content that performs', 'Digital-first content tailored for social media, OTT platforms, and websites.', '/dencast_images/9-scaled.jpg', false, 10)
) as v(category_slug, name, slug, tagline, description, cover_image_url, is_featured, sort_order)
join public.service_categories sc on sc.slug = v.category_slug
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    tagline = excluded.tagline,
    description = excluded.description,
    cover_image_url = excluded.cover_image_url,
    is_featured = excluded.is_featured,
    is_active = true,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.blog_categories (name, slug, description, updated_at)
values
  ('Documentary', 'documentary', 'Documentary filmmaking insights', now()),
  ('Branding', 'branding', 'Brand strategy and identity', now()),
  ('Technology', 'technology', 'Production and media technology', now()),
  ('Events', 'events-blog', 'Event production stories', now()),
  ('Industry', 'industry', 'Industry trends and analysis', now()),
  ('Behind the Scenes', 'behind-the-scenes', 'Production diaries and process', now())
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    updated_at = now();

insert into public.blog_posts (
  category_id, title, slug, excerpt, content, cover_image_url,
  is_featured, is_published, views, published_at, updated_at
)
select
  bc.id,
  v.title,
  v.slug,
  v.excerpt,
  v.content,
  v.cover_image_url,
  v.is_featured,
  true,
  0,
  v.published_at,
  now()
from (
  values
    ('events-blog', 'Capturing the Room and the Stream: Lessons from a High-Stakes Conference Panel in Nairobi', 'future-of-african-documentary-2024', 'A packed panel at the African Development Bank Annual Meetings in Nairobi shows why modern event coverage is no longer just about recording a stage.', 'A packed panel at the African Development Bank Annual Meetings in Nairobi shows why modern event coverage is no longer just about recording a stage.', '/dencast_images/9.png', true, '2024-05-15'::timestamptz),
    ('branding', 'A Complete Brand Identity Guide for African Startups', 'brand-identity-guide-african-startups', 'Why your startup needs a cohesive brand identity from day one, and how to build one without breaking the bank.', 'Why your startup needs a cohesive brand identity from day one, and how to build one without breaking the bank.', '/dencast_images/Dencast-Crew-11.jpg', false, '2024-05-08'::timestamptz),
    ('technology', 'Drone Cinematography: Navigating Regulations Across Africa', 'drone-cinematography-regulations-africa', 'From Ghana to Kenya, drone regulations vary dramatically. Our licensed aerial team breaks down what to know before flying.', 'From Ghana to Kenya, drone regulations vary dramatically. Our licensed aerial team breaks down what to know before flying.', '/dencast_images/Drone%20.jpg', false, '2024-04-30'::timestamptz),
    ('events-blog', 'The Ultimate Guide to Hybrid Event Production in 2024', 'hybrid-events-production-guide', 'In-person meets digital: producing events that deliver for in-room and online audiences.', 'In-person meets digital: producing events that deliver for in-room and online audiences.', '/dencast_images/9.png', false, '2024-04-22'::timestamptz),
    ('industry', 'How Storytelling Increases Commercial Video ROI by 300%', 'storytelling-commercial-video-roi', 'Brands that lead with authentic narrative outperform product-first advertisers across every metric.', 'Brands that lead with authentic narrative outperform product-first advertisers across every metric.', '/dencast_images/DSC_5424-scaled.jpg', false, '2024-04-15'::timestamptz),
    ('behind-the-scenes', 'Behind the Lens: Making Voices of the Nile', 'behind-the-lens-voices-of-the-nile', 'Director Dennis Machio shares the journey of embedding with communities to tell deeper stories.', 'Director Dennis Machio shares the journey of embedding with communities to tell deeper stories.', '/dencast_images/team.jpg', false, '2024-04-08'::timestamptz),
    ('technology', 'Capturing the Room and the Stream: Lessons from a High-Stakes Conference Panel in Nairobi', 'capturing-room-stream-nairobi', 'Why modern event coverage is now a broadcast-ready system, not a single camera setup.', 'Why modern event coverage is now a broadcast-ready system, not a single camera setup.', '/dencast_images/event1.jpg', false, '2024-03-28'::timestamptz),
    ('branding', 'Building a Pan-African Brand Voice That Resonates Everywhere', 'building-pan-african-brand-voice', 'A framework for developing messaging that resonates across diverse African markets.', 'A framework for developing messaging that resonates across diverse African markets.', '/dencast_images/amakowe.jpg', false, '2024-03-20'::timestamptz),
    ('industry', 'Social Media Video Trends to Watch in the Second Half of 2024', 'social-media-video-trends-2024', 'The formats and strategies driving the highest organic reach on every platform.', 'The formats and strategies driving the highest organic reach on every platform.', '/dencast_images/Virtual-livestreaming-scaled.jpg', false, '2024-03-12'::timestamptz)
) as v(category_slug, title, slug, excerpt, content, cover_image_url, is_featured, published_at)
join public.blog_categories bc on bc.slug = v.category_slug
on conflict (slug) do update
set category_id = excluded.category_id,
    title = excluded.title,
    excerpt = excluded.excerpt,
    content = excluded.content,
    cover_image_url = excluded.cover_image_url,
    is_featured = excluded.is_featured,
    is_published = true,
    published_at = excluded.published_at,
    updated_at = now();

insert into public.statistics (label, value, suffix, prefix, description, sort_order, is_active, updated_at)
select
  v.label, v.value, v.suffix, v.prefix, v.description, v.sort_order, v.is_active, now()
from (
  values
    ('Projects Completed'::text, 500::numeric, '+'::text, null::text, 'Across film, photography, branding, and events'::text, 1::int, true),
    ('Years of Excellence'::text, 5::numeric, '+'::text, null::text, 'Serving clients since 2021 with unmatched quality'::text, 2::int, true),
    ('Happy Clients'::text, 100::numeric, '+'::text, null::text, 'From startups to Fortune over 100 companies globally'::text, 3::int, true),
    ('Countries Reached'::text, 20::numeric, '+'::text, null::text, 'Global production experience across five continents'::text, 4::int, true)
) as v(label, value, suffix, prefix, description, sort_order, is_active)
where not exists (
  select 1 from public.statistics s where s.label = v.label
);
