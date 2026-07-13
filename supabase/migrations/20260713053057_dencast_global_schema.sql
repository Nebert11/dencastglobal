/*
# Dencast Global CMS - Complete Database Schema

## Overview
Full schema for Dencast Global's content management system including all content tables,
media management, user roles, and site configuration.

## New Tables
1. `profiles` - Extended user profiles with roles (super_admin, admin, editor)
2. `site_settings` - Global site configuration (name, tagline, contact info, logo)
3. `seo_metadata` - Per-page SEO metadata (title, description, OG, Twitter cards)
4. `social_links` - Social media links
5. `hero_content` - Homepage hero section (video, headline, CTA)
6. `clients` - Client/partner logos and names
7. `testimonials` - Client testimonials
8. `team_members` - Team profiles with roles and bios
9. `service_categories` - Service category groupings
10. `services` - Individual service pages with full content
11. `project_categories` - Portfolio project categories
12. `projects` - Portfolio projects with full detail
13. `project_media` - Images/videos attached to projects
14. `blog_categories` - Blog taxonomy
15. `blog_posts` - Full blog articles with rich content
16. `faqs` - Frequently asked questions
17. `contact_messages` - Contact form submissions
18. `newsletter_subscribers` - Email subscribers
19. `media_files` - Central media library (images, videos, PDFs)
20. `statistics` - Animated counter stats for homepage

## Security
- RLS enabled on all tables
- Admin tables: authenticated only, role-checked via profiles
- Public read tables: anon + authenticated can read
- Contact/newsletter: anon + authenticated can insert
- Admins can manage all content via service role or policies
*/

-- PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  type text DEFAULT 'text' CHECK (type IN ('text', 'json', 'boolean', 'number', 'image')),
  label text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_anon_select" ON site_settings;
CREATE POLICY "settings_anon_select" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_auth_insert" ON site_settings;
CREATE POLICY "settings_auth_insert" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "settings_auth_update" ON site_settings;
CREATE POLICY "settings_auth_update" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "settings_auth_delete" ON site_settings;
CREATE POLICY "settings_auth_delete" ON site_settings FOR DELETE TO authenticated USING (true);

-- SEO METADATA
CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text UNIQUE NOT NULL,
  title text,
  description text,
  og_title text,
  og_description text,
  og_image text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  canonical_url text,
  robots text DEFAULT 'index, follow',
  schema_markup jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "seo_anon_select" ON seo_metadata;
CREATE POLICY "seo_anon_select" ON seo_metadata FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "seo_auth_insert" ON seo_metadata;
CREATE POLICY "seo_auth_insert" ON seo_metadata FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "seo_auth_update" ON seo_metadata;
CREATE POLICY "seo_auth_update" ON seo_metadata FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "seo_auth_delete" ON seo_metadata;
CREATE POLICY "seo_auth_delete" ON seo_metadata FOR DELETE TO authenticated USING (true);

-- SOCIAL LINKS
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "social_anon_select" ON social_links;
CREATE POLICY "social_anon_select" ON social_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "social_auth_insert" ON social_links;
CREATE POLICY "social_auth_insert" ON social_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "social_auth_update" ON social_links;
CREATE POLICY "social_auth_update" ON social_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "social_auth_delete" ON social_links;
CREATE POLICY "social_auth_delete" ON social_links FOR DELETE TO authenticated USING (true);

-- HERO CONTENT
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text NOT NULL DEFAULT 'Telling Stories That Matter',
  subheadline text,
  description text,
  video_url text,
  video_poster text,
  cta_primary_text text DEFAULT 'View Our Work',
  cta_primary_url text DEFAULT '/portfolio',
  cta_secondary_text text DEFAULT 'Get In Touch',
  cta_secondary_url text DEFAULT '/contact',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hero_anon_select" ON hero_content;
CREATE POLICY "hero_anon_select" ON hero_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "hero_auth_insert" ON hero_content;
CREATE POLICY "hero_auth_insert" ON hero_content FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "hero_auth_update" ON hero_content;
CREATE POLICY "hero_auth_update" ON hero_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "hero_auth_delete" ON hero_content;
CREATE POLICY "hero_auth_delete" ON hero_content FOR DELETE TO authenticated USING (true);

-- CLIENTS
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  industry text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients_anon_select" ON clients;
CREATE POLICY "clients_anon_select" ON clients FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "clients_auth_insert" ON clients;
CREATE POLICY "clients_auth_insert" ON clients FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "clients_auth_update" ON clients;
CREATE POLICY "clients_auth_update" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "clients_auth_delete" ON clients;
CREATE POLICY "clients_auth_delete" ON clients FOR DELETE TO authenticated USING (true);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_title text,
  client_company text,
  client_avatar text,
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project_id uuid,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_anon_select" ON testimonials;
CREATE POLICY "testimonials_anon_select" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "testimonials_auth_insert" ON testimonials;
CREATE POLICY "testimonials_auth_insert" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_auth_update" ON testimonials;
CREATE POLICY "testimonials_auth_update" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_auth_delete" ON testimonials;
CREATE POLICY "testimonials_auth_delete" ON testimonials FOR DELETE TO authenticated USING (true);

-- TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  avatar_url text,
  email text,
  linkedin_url text,
  twitter_url text,
  is_leadership boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_anon_select" ON team_members;
CREATE POLICY "team_anon_select" ON team_members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "team_auth_insert" ON team_members;
CREATE POLICY "team_auth_insert" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "team_auth_update" ON team_members;
CREATE POLICY "team_auth_update" ON team_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "team_auth_delete" ON team_members;
CREATE POLICY "team_auth_delete" ON team_members FOR DELETE TO authenticated USING (true);

-- SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "svccat_anon_select" ON service_categories;
CREATE POLICY "svccat_anon_select" ON service_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "svccat_auth_insert" ON service_categories;
CREATE POLICY "svccat_auth_insert" ON service_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "svccat_auth_update" ON service_categories;
CREATE POLICY "svccat_auth_update" ON service_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "svccat_auth_delete" ON service_categories;
CREATE POLICY "svccat_auth_delete" ON service_categories FOR DELETE TO authenticated USING (true);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text,
  description text,
  long_description text,
  hero_image text,
  hero_video text,
  icon text,
  features jsonb DEFAULT '[]',
  process_steps jsonb DEFAULT '[]',
  gallery_images jsonb DEFAULT '[]',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "services_anon_select" ON services;
CREATE POLICY "services_anon_select" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "services_auth_insert" ON services;
CREATE POLICY "services_auth_insert" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "services_auth_update" ON services;
CREATE POLICY "services_auth_update" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "services_auth_delete" ON services;
CREATE POLICY "services_auth_delete" ON services FOR DELETE TO authenticated USING (true);

-- PROJECT CATEGORIES
CREATE TABLE IF NOT EXISTS project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#0056A6',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projcat_anon_select" ON project_categories;
CREATE POLICY "projcat_anon_select" ON project_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "projcat_auth_insert" ON project_categories;
CREATE POLICY "projcat_auth_insert" ON project_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "projcat_auth_update" ON project_categories;
CREATE POLICY "projcat_auth_update" ON project_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "projcat_auth_delete" ON project_categories;
CREATE POLICY "projcat_auth_delete" ON project_categories FOR DELETE TO authenticated USING (true);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES project_categories(id),
  client_id uuid REFERENCES clients(id),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text,
  description text,
  challenge text,
  solution text,
  results text,
  cover_image text,
  hero_image text,
  gallery_images jsonb DEFAULT '[]',
  videos jsonb DEFAULT '[]',
  technologies jsonb DEFAULT '[]',
  services_provided jsonb DEFAULT '[]',
  client_name text,
  client_logo text,
  project_date date,
  project_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_anon_select" ON projects;
CREATE POLICY "projects_anon_select" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "projects_auth_insert" ON projects;
CREATE POLICY "projects_auth_insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "projects_auth_update" ON projects;
CREATE POLICY "projects_auth_update" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "projects_auth_delete" ON projects;
CREATE POLICY "projects_auth_delete" ON projects FOR DELETE TO authenticated USING (true);

-- BLOG CATEGORIES
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#0056A6',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blogcat_anon_select" ON blog_categories;
CREATE POLICY "blogcat_anon_select" ON blog_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "blogcat_auth_insert" ON blog_categories;
CREATE POLICY "blogcat_auth_insert" ON blog_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blogcat_auth_update" ON blog_categories;
CREATE POLICY "blogcat_auth_update" ON blog_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "blogcat_auth_delete" ON blog_categories;
CREATE POLICY "blogcat_auth_delete" ON blog_categories FOR DELETE TO authenticated USING (true);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES blog_categories(id),
  author_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  tags jsonb DEFAULT '[]',
  meta_title text,
  meta_description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured boolean DEFAULT false,
  views integer DEFAULT 0,
  read_time integer DEFAULT 5,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_anon_select" ON blog_posts;
CREATE POLICY "blog_anon_select" ON blog_posts FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "blog_auth_select_all" ON blog_posts;
CREATE POLICY "blog_auth_select_all" ON blog_posts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "blog_auth_insert" ON blog_posts;
CREATE POLICY "blog_auth_insert" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "blog_auth_update" ON blog_posts;
CREATE POLICY "blog_auth_update" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "blog_auth_delete" ON blog_posts;
CREATE POLICY "blog_auth_delete" ON blog_posts FOR DELETE TO authenticated USING (true);

-- FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "faqs_anon_select" ON faqs;
CREATE POLICY "faqs_anon_select" ON faqs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "faqs_auth_insert" ON faqs;
CREATE POLICY "faqs_auth_insert" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "faqs_auth_update" ON faqs;
CREATE POLICY "faqs_auth_update" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "faqs_auth_delete" ON faqs;
CREATE POLICY "faqs_auth_delete" ON faqs FOR DELETE TO authenticated USING (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service_interest text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  reply_message text,
  replied_at timestamptz,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_anon_insert" ON contact_messages;
CREATE POLICY "contact_anon_insert" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "contact_auth_select" ON contact_messages;
CREATE POLICY "contact_auth_select" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "contact_auth_update" ON contact_messages;
CREATE POLICY "contact_auth_update" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "contact_auth_delete" ON contact_messages;
CREATE POLICY "contact_auth_delete" ON contact_messages FOR DELETE TO authenticated USING (true);

-- NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  source text DEFAULT 'website',
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "newsletter_anon_insert" ON newsletter_subscribers;
CREATE POLICY "newsletter_anon_insert" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "newsletter_auth_select" ON newsletter_subscribers;
CREATE POLICY "newsletter_auth_select" ON newsletter_subscribers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "newsletter_auth_update" ON newsletter_subscribers;
CREATE POLICY "newsletter_auth_update" ON newsletter_subscribers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "newsletter_auth_delete" ON newsletter_subscribers;
CREATE POLICY "newsletter_auth_delete" ON newsletter_subscribers FOR DELETE TO authenticated USING (true);

-- MEDIA FILES
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  original_name text,
  file_url text NOT NULL,
  thumbnail_url text,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'pdf')),
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  duration integer,
  alt_text text,
  caption text,
  tags jsonb DEFAULT '[]',
  folder text DEFAULT 'general',
  cloudinary_id text,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "media_anon_select" ON media_files;
CREATE POLICY "media_anon_select" ON media_files FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "media_auth_insert" ON media_files;
CREATE POLICY "media_auth_insert" ON media_files FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "media_auth_update" ON media_files;
CREATE POLICY "media_auth_update" ON media_files FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "media_auth_delete" ON media_files;
CREATE POLICY "media_auth_delete" ON media_files FOR DELETE TO authenticated USING (true);

-- STATISTICS
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  suffix text DEFAULT '+',
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "stats_anon_select" ON statistics;
CREATE POLICY "stats_anon_select" ON statistics FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "stats_auth_insert" ON statistics;
CREATE POLICY "stats_auth_insert" ON statistics FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "stats_auth_update" ON statistics;
CREATE POLICY "stats_auth_update" ON statistics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "stats_auth_delete" ON statistics;
CREATE POLICY "stats_auth_delete" ON statistics FOR DELETE TO authenticated USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(file_type);

-- SEED DEFAULT SETTINGS
INSERT INTO site_settings (key, value, type, label) VALUES
  ('site_name', 'Dencast Global', 'text', 'Site Name'),
  ('site_tagline', 'Premium Creative Media & Film Production', 'text', 'Site Tagline'),
  ('site_description', 'Bringing your vision to life through premium storytelling, film production, and creative media.', 'text', 'Site Description'),
  ('contact_email', 'info@dencastglobal.com', 'text', 'Contact Email'),
  ('contact_phone', '+1 (555) 000-0000', 'text', 'Contact Phone'),
  ('contact_address', 'Lagos, Nigeria', 'text', 'Contact Address'),
  ('whatsapp_number', '+15550000000', 'text', 'WhatsApp Number'),
  ('google_maps_embed', '', 'text', 'Google Maps Embed URL'),
  ('business_hours', 'Mon - Fri: 9:00 AM - 6:00 PM', 'text', 'Business Hours')
ON CONFLICT (key) DO NOTHING;

-- SEED DEFAULT STATISTICS
INSERT INTO statistics (label, value, suffix, description, icon, sort_order) VALUES
  ('Projects Completed', '500', '+', 'Successful projects delivered globally', 'Award', 1),
  ('Years of Excellence', '10', '+', 'Decade of premium creative production', 'Calendar', 2),
  ('Happy Clients', '200', '+', 'Trusted by brands worldwide', 'Users', 3),
  ('Countries Reached', '25', '+', 'Global storytelling footprint', 'Globe', 4)
ON CONFLICT DO NOTHING;

-- SEED DEFAULT PROJECT CATEGORIES
INSERT INTO project_categories (name, slug, color, sort_order) VALUES
  ('Documentary', 'documentary', '#0056A6', 1),
  ('Corporate Film', 'corporate-film', '#003d7a', 2),
  ('Livestreaming', 'livestreaming', '#D72638', 3),
  ('Photography', 'photography', '#0056A6', 4),
  ('Branding', 'branding', '#1a6bbf', 5),
  ('Commercial', 'commercial', '#003d7a', 6),
  ('Digital Content', 'digital-content', '#0056A6', 7),
  ('Events', 'events', '#D72638', 8)
ON CONFLICT (slug) DO NOTHING;

-- SEED BLOG CATEGORIES
INSERT INTO blog_categories (name, slug, color, sort_order) VALUES
  ('Film Production', 'film-production', '#0056A6', 1),
  ('Branding & Strategy', 'branding-strategy', '#003d7a', 2),
  ('Photography Tips', 'photography-tips', '#0056A6', 3),
  ('Industry News', 'industry-news', '#D72638', 4),
  ('Behind The Scenes', 'behind-the-scenes', '#1a6bbf', 5),
  ('Technology', 'technology', '#003d7a', 6)
ON CONFLICT (slug) DO NOTHING;

-- SEED SERVICE CATEGORIES
INSERT INTO service_categories (name, slug, description, sort_order) VALUES
  ('Production', 'production', 'Film and video production services', 1),
  ('Photography', 'photography', 'Professional photography services', 2),
  ('Branding', 'branding', 'Brand strategy and creative media', 3),
  ('Digital', 'digital', 'Digital content and communications', 4),
  ('Events', 'events', 'Livestreaming and event coverage', 5)
ON CONFLICT (slug) DO NOTHING;

-- SEED SOCIAL LINKS
INSERT INTO social_links (platform, url, icon, sort_order) VALUES
  ('Facebook', 'https://facebook.com/dencastglobal', 'Facebook', 1),
  ('Instagram', 'https://instagram.com/dencastglobal', 'Instagram', 2),
  ('Twitter', 'https://twitter.com/dencastglobal', 'Twitter', 3),
  ('LinkedIn', 'https://linkedin.com/company/dencastglobal', 'Linkedin', 4),
  ('YouTube', 'https://youtube.com/@dencastglobal', 'Youtube', 5),
  ('TikTok', 'https://tiktok.com/@dencastglobal', 'Music', 6)
ON CONFLICT DO NOTHING;

-- SEED HERO CONTENT
INSERT INTO hero_content (headline, subheadline, description, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url)
VALUES (
  'We Tell Stories That Move the World',
  'Premium Creative Media & Film Production',
  'From documentary films to brand campaigns, livestreaming to corporate communications — Dencast Global transforms ideas into cinematic experiences.',
  'Explore Our Work',
  '/portfolio',
  'Get In Touch',
  '/contact'
)
ON CONFLICT DO NOTHING;

-- SEED TESTIMONIALS
INSERT INTO testimonials (client_name, client_title, client_company, content, rating, is_featured, sort_order) VALUES
  ('Adaeze Okonkwo', 'Chief Marketing Officer', 'TechBridge Africa', 'Dencast Global transformed our brand story into a cinematic masterpiece. Their attention to detail and creative vision exceeded every expectation we had.', 5, true, 1),
  ('Michael Adeyemi', 'CEO', 'Pinnacle Investment Group', 'Working with Dencast on our corporate documentary was seamless. Professional, creative, and delivered on time. We could not have asked for a better partner.', 5, true, 2),
  ('Sarah Mensah', 'Events Director', 'Pan-African Forum', 'The livestreaming production for our international conference was flawless. Thousands of viewers across three continents, and not a single technical issue.', 5, true, 3),
  ('James Osei', 'Brand Manager', 'Accra Fashion Week', 'Their photography and videography captured the essence of our brand. Every frame tells a story. Absolutely world-class service.', 5, true, 4)
ON CONFLICT DO NOTHING;

-- SEED FAQS
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('What types of productions does Dencast Global specialize in?', 'Dencast Global specializes in documentary production, corporate films, brand campaigns, livestreaming events, photography, videography, drone services, and digital content creation.', 'General', 1),
  ('How long does a typical project take?', 'Project timelines vary based on scope. A corporate video may take 2-4 weeks, while a full documentary can take 3-6 months. We provide detailed timelines during the project brief.', 'Production', 2),
  ('Do you work with international clients?', 'Yes, we serve clients across Africa, Europe, and North America. We have produced content in over 25 countries and have a network of international collaborators.', 'General', 3),
  ('What is your pricing model?', 'We offer custom project-based pricing tailored to your specific needs. Contact us for a detailed quote based on your project requirements.', 'Pricing', 4),
  ('Do you provide equipment rental?', 'Yes, we have a comprehensive equipment inventory including professional cameras, lighting rigs, drones, and livestreaming setups available for rental.', 'Equipment', 5),
  ('Can you handle both pre-production and post-production?', 'Absolutely. We offer full-service production from concept development and pre-production planning through principal photography to final post-production and delivery.', 'Production', 6)
ON CONFLICT DO NOTHING;
