import supabase from '../lib/supabase';
import db from '../lib/db';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';
import type {
  HeroContent,
  SiteSettings,
  SocialLink,
  Client,
  Testimonial,
  TeamMember,
  Statistic,
  Service,
  ServiceCategory,
  ProjectCategory,
  Project,
  BlogCategory,
  BlogPost,
  FAQ,
  ContactFormData,
  ContactMessage,
  NewsletterSubscriber,
  ApiResponse,
  PaginatedResponse,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ok<T>(data: T): ApiResponse<T> {
  return { data, error: null, status: 'success' };
}

function fail<T>(message: string): ApiResponse<T> {
  console.error('[SupabaseService]', message);
  return { data: null, error: message, status: 'error' };
}

function paginatedOk<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / pageSize);
  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    error: null,
    status: 'success',
  };
}

function paginatedFail<T>(message: string): PaginatedResponse<T> {
  console.error('[SupabaseService]', message);
  return {
    data: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    error: message,
    status: 'error',
  };
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export async function getHeroContent(): Promise<ApiResponse<HeroContent>> {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return fail(error.message);
  return ok(data as unknown as HeroContent);
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<ApiResponse<SiteSettings[]>> {
  const { data, error } = await supabase.from('site_settings').select('*');

  if (error) return fail(error.message);
  return ok(data as SiteSettings[]);
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export async function getSocialLinks(): Promise<ApiResponse<SocialLink[]>> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as SocialLink[]);
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export async function getClients(featured?: boolean): Promise<ApiResponse<Client[]>> {
  let query = supabase.from('clients').select('*').order('sort_order', { ascending: true });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data as Client[]);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(featured?: boolean): Promise<ApiResponse<Testimonial[]>> {
  let query = supabase.from('testimonials').select('*').order('sort_order', { ascending: true });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data as Testimonial[]);
}

// ─── Team Members ─────────────────────────────────────────────────────────────

export async function getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as TeamMember[]);
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export async function getStatistics(): Promise<ApiResponse<Statistic[]>> {
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as Statistic[]);
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getServiceCategories(): Promise<ApiResponse<ServiceCategory[]>> {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as ServiceCategory[]);
}

export async function getServices(featured?: boolean): Promise<ApiResponse<Service[]>> {
  let query = supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .order('sort_order', { ascending: true });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data as Service[]);
}

export async function getServiceBySlug(slug: string): Promise<ApiResponse<Service>> {
  const { data, error } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) return fail(error.message);
  if (!data) return fail(`Service not found: ${slug}`);
  return ok(data as Service);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjectCategories(): Promise<ApiResponse<ProjectCategory[]>> {
  const { data, error } = await supabase
    .from('project_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as ProjectCategory[]);
}

export interface GetProjectsOptions {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}

export async function getProjects(
  options: GetProjectsOptions = {}
): Promise<ApiResponse<Project[]>> {
  const { categorySlug, featured, limit } = options;

  let query = supabase
    .from('projects')
    .select('*, category:project_categories(*)')
    .not('published_at', 'is', null)
    .order('sort_order', { ascending: true });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  if (categorySlug) {
    // Join filter via the relationship
    query = query.eq('category.slug', categorySlug);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data as Project[]);
}

export async function getProjectBySlug(slug: string): Promise<ApiResponse<Project>> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:project_categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) return fail(error.message);
  if (!data) return fail(`Project not found: ${slug}`);
  return ok(data as Project);
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as BlogCategory[]);
}

export interface GetBlogPostsOptions {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}

export async function getBlogPosts(
  options: GetBlogPostsOptions = {}
): Promise<PaginatedResponse<BlogPost>> {
  const { categorySlug, featured, limit = DEFAULT_PAGE_SIZE, page = 1 } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*), author:profiles(*)', { count: 'exact' })
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  if (categorySlug) {
    query = query.eq('category.slug', categorySlug);
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return paginatedFail(error.message);
  return paginatedOk(data as BlogPost[], count ?? 0, page, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*), author:profiles(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) return fail(error.message);
  if (!data) return fail(`Blog post not found: ${slug}`);

  // Increment view count (fire-and-forget — don't block the response)
  db
    .from('blog_posts')
    .update({ views: (data as BlogPost).views + 1 })
    .eq('id', (data as BlogPost).id)
    .then(() => undefined);

  return ok(data as BlogPost);
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFAQs(): Promise<ApiResponse<FAQ[]>> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return fail(error.message);
  return ok(data as FAQ[]);
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export async function submitContactMessage(
  formData: ContactFormData
): Promise<ApiResponse<ContactMessage>> {
  const { data, error } = await db
    .from('contact_messages')
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone ?? null,
      subject: formData.subject ?? null,
      message: formData.message,
      service_interest: formData.service_interest ?? null,
      status: 'new',
    })
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data as ContactMessage);
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(
  email: string,
  name?: string
): Promise<ApiResponse<NewsletterSubscriber>> {
  // Upsert so re-subscribing reactivates an existing record
  const { data, error } = await db
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        name: name ?? null,
        is_active: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data as NewsletterSubscriber);
}
