
/*
  Fix RLS: replace always-true write policies with admin-role-gated policies.

  The helper function is_admin() checks that the calling user has an active
  profile with role IN ('admin', 'super_admin'), preventing any authenticated
  user from mutating CMS data — only designated admins can write.

  Tables affected (write policies only — public SELECT policies are unchanged):
    blog_categories, blog_posts, clients, contact_messages, faqs,
    hero_content, media_files, newsletter_subscribers, project_categories,
    projects, seo_metadata, service_categories, services, site_settings,
    social_links, statistics, team_members, testimonials

  Special cases:
    contact_messages  / newsletter_subscribers anon INSERT — kept permissive
      (public submission forms; no row-ownership predicate is sensible here).
*/

-- ─── Helper: is the current user an active admin? ─────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
      AND is_active = true
  );
$$;

-- ─── blog_categories ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS blogcat_auth_delete ON public.blog_categories;
DROP POLICY IF EXISTS blogcat_auth_insert ON public.blog_categories;
DROP POLICY IF EXISTS blogcat_auth_update ON public.blog_categories;

CREATE POLICY blogcat_auth_insert ON public.blog_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY blogcat_auth_update ON public.blog_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY blogcat_auth_delete ON public.blog_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── blog_posts ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS blog_auth_delete ON public.blog_posts;
DROP POLICY IF EXISTS blog_auth_insert ON public.blog_posts;
DROP POLICY IF EXISTS blog_auth_update ON public.blog_posts;

CREATE POLICY blog_auth_insert ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY blog_auth_update ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY blog_auth_delete ON public.blog_posts
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── clients ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS clients_auth_delete ON public.clients;
DROP POLICY IF EXISTS clients_auth_insert ON public.clients;
DROP POLICY IF EXISTS clients_auth_update ON public.clients;

CREATE POLICY clients_auth_insert ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY clients_auth_update ON public.clients
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY clients_auth_delete ON public.clients
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── contact_messages ────────────────────────────────────────────────────────
-- anon INSERT stays permissive (public contact form)
-- admin UPDATE/DELETE require admin role

DROP POLICY IF EXISTS contact_anon_insert   ON public.contact_messages;
DROP POLICY IF EXISTS contact_auth_delete   ON public.contact_messages;
DROP POLICY IF EXISTS contact_auth_update   ON public.contact_messages;

CREATE POLICY contact_anon_insert ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY contact_auth_update ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY contact_auth_delete ON public.contact_messages
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── faqs ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS faqs_auth_delete ON public.faqs;
DROP POLICY IF EXISTS faqs_auth_insert ON public.faqs;
DROP POLICY IF EXISTS faqs_auth_update ON public.faqs;

CREATE POLICY faqs_auth_insert ON public.faqs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY faqs_auth_update ON public.faqs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY faqs_auth_delete ON public.faqs
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── hero_content ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS hero_auth_delete ON public.hero_content;
DROP POLICY IF EXISTS hero_auth_insert ON public.hero_content;
DROP POLICY IF EXISTS hero_auth_update ON public.hero_content;

CREATE POLICY hero_auth_insert ON public.hero_content
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY hero_auth_update ON public.hero_content
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY hero_auth_delete ON public.hero_content
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── media_files ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS media_auth_delete ON public.media_files;
DROP POLICY IF EXISTS media_auth_insert ON public.media_files;
DROP POLICY IF EXISTS media_auth_update ON public.media_files;

CREATE POLICY media_auth_insert ON public.media_files
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY media_auth_update ON public.media_files
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY media_auth_delete ON public.media_files
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── newsletter_subscribers ───────────────────────────────────────────────────
-- anon INSERT stays permissive (public subscribe form)

DROP POLICY IF EXISTS newsletter_anon_insert ON public.newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_auth_delete  ON public.newsletter_subscribers;
DROP POLICY IF EXISTS newsletter_auth_update  ON public.newsletter_subscribers;

CREATE POLICY newsletter_anon_insert ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY newsletter_auth_update ON public.newsletter_subscribers
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY newsletter_auth_delete ON public.newsletter_subscribers
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── project_categories ──────────────────────────────────────────────────────

DROP POLICY IF EXISTS projcat_auth_delete ON public.project_categories;
DROP POLICY IF EXISTS projcat_auth_insert ON public.project_categories;
DROP POLICY IF EXISTS projcat_auth_update ON public.project_categories;

CREATE POLICY projcat_auth_insert ON public.project_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY projcat_auth_update ON public.project_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY projcat_auth_delete ON public.project_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── projects ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS projects_auth_delete ON public.projects;
DROP POLICY IF EXISTS projects_auth_insert ON public.projects;
DROP POLICY IF EXISTS projects_auth_update ON public.projects;

CREATE POLICY projects_auth_insert ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY projects_auth_update ON public.projects
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY projects_auth_delete ON public.projects
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── seo_metadata ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS seo_auth_delete ON public.seo_metadata;
DROP POLICY IF EXISTS seo_auth_insert ON public.seo_metadata;
DROP POLICY IF EXISTS seo_auth_update ON public.seo_metadata;

CREATE POLICY seo_auth_insert ON public.seo_metadata
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY seo_auth_update ON public.seo_metadata
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY seo_auth_delete ON public.seo_metadata
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── service_categories ──────────────────────────────────────────────────────

DROP POLICY IF EXISTS svccat_auth_delete ON public.service_categories;
DROP POLICY IF EXISTS svccat_auth_insert ON public.service_categories;
DROP POLICY IF EXISTS svccat_auth_update ON public.service_categories;

CREATE POLICY svccat_auth_insert ON public.service_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY svccat_auth_update ON public.service_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY svccat_auth_delete ON public.service_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── services ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS services_auth_delete ON public.services;
DROP POLICY IF EXISTS services_auth_insert ON public.services;
DROP POLICY IF EXISTS services_auth_update ON public.services;

CREATE POLICY services_auth_insert ON public.services
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY services_auth_update ON public.services
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY services_auth_delete ON public.services
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── site_settings ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS settings_auth_delete ON public.site_settings;
DROP POLICY IF EXISTS settings_auth_insert ON public.site_settings;
DROP POLICY IF EXISTS settings_auth_update ON public.site_settings;

CREATE POLICY settings_auth_insert ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY settings_auth_update ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY settings_auth_delete ON public.site_settings
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── social_links ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS social_auth_delete ON public.social_links;
DROP POLICY IF EXISTS social_auth_insert ON public.social_links;
DROP POLICY IF EXISTS social_auth_update ON public.social_links;

CREATE POLICY social_auth_insert ON public.social_links
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY social_auth_update ON public.social_links
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY social_auth_delete ON public.social_links
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── statistics ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS stats_auth_delete ON public.statistics;
DROP POLICY IF EXISTS stats_auth_insert ON public.statistics;
DROP POLICY IF EXISTS stats_auth_update ON public.statistics;

CREATE POLICY stats_auth_insert ON public.statistics
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY stats_auth_update ON public.statistics
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY stats_auth_delete ON public.statistics
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── team_members ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS team_auth_delete ON public.team_members;
DROP POLICY IF EXISTS team_auth_insert ON public.team_members;
DROP POLICY IF EXISTS team_auth_update ON public.team_members;

CREATE POLICY team_auth_insert ON public.team_members
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY team_auth_update ON public.team_members
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY team_auth_delete ON public.team_members
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── testimonials ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS testimonials_auth_delete ON public.testimonials;
DROP POLICY IF EXISTS testimonials_auth_insert ON public.testimonials;
DROP POLICY IF EXISTS testimonials_auth_update ON public.testimonials;

CREATE POLICY testimonials_auth_insert ON public.testimonials
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY testimonials_auth_update ON public.testimonials
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY testimonials_auth_delete ON public.testimonials
  FOR DELETE TO authenticated
  USING (public.is_admin());
