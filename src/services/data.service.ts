/**
 * Frontend stub for supabase.service.
 *
 * The real implementation lives in backend/services/supabase.service.ts.
 * This file provides the same public API so every existing import continues
 * to work without modification.  Data comes from local static sources or
 * returns graceful empty/success values so every page renders normally.
 */
import { BLOG_ARTICLES } from '@/features/blog/articlesData';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
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
} from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ok<T>(data: T): ApiResponse<T> {
  return { data, error: null, status: 'success' };
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Hero component already has a full FALLBACK object — returning null is fine.

export async function getHeroContent(): Promise<ApiResponse<HeroContent>> {
  return ok(null as unknown as HeroContent);
}

// ─── Site Settings ────────────────────────────────────────────────────────────
// AboutPage uses a buildSettingsMap helper that defaults when empty.

export async function getSiteSettings(): Promise<ApiResponse<SiteSettings[]>> {
  return ok([] as SiteSettings[]);
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export async function getSocialLinks(): Promise<ApiResponse<SocialLink[]>> {
  return ok([] as SocialLink[]);
}

// ─── Clients ─────────────────────────────────────────────────────────────────
// AboutPage falls back to DEFAULT_CLIENTS when the returned array is empty.

export async function getClients(_featured?: boolean): Promise<ApiResponse<Client[]>> {
  return ok([] as Client[]);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(_featured?: boolean): Promise<ApiResponse<Testimonial[]>> {
  return ok([] as Testimonial[]);
}

// ─── Team Members ─────────────────────────────────────────────────────────────

export async function getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
  return ok([] as TeamMember[]);
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export async function getStatistics(): Promise<ApiResponse<Statistic[]>> {
  return ok([] as Statistic[]);
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getServiceCategories(): Promise<ApiResponse<ServiceCategory[]>> {
  return ok([] as ServiceCategory[]);
}

export async function getServices(_featured?: boolean): Promise<ApiResponse<Service[]>> {
  return ok([] as Service[]);
}

export async function getServiceBySlug(_slug: string): Promise<ApiResponse<Service>> {
  return { data: null, error: 'Not available', status: 'error' };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjectCategories(): Promise<ApiResponse<ProjectCategory[]>> {
  return ok([] as ProjectCategory[]);
}

export interface GetProjectsOptions {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}

export async function getProjects(
  _options: GetProjectsOptions = {}
): Promise<ApiResponse<Project[]>> {
  return ok([] as Project[]);
}

export async function getProjectBySlug(_slug: string): Promise<ApiResponse<Project>> {
  return { data: null, error: 'Not available', status: 'error' };
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
  return ok([] as BlogCategory[]);
}

export interface GetBlogPostsOptions {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}

// Map local BlogArticle → BlogPost so LatestNewsTicker and other consumers work.
function articleToPost(a: (typeof BLOG_ARTICLES)[number]): BlogPost {
  return {
    id: a.id,
    category_id: null,
    author_id: null,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? null,
    content: a.content ?? null,
    cover_image_url: a.coverImage ?? null,
    is_featured: a.featured ?? false,
    is_published: true,
    views: 0,
    published_at: a.date ?? null,
    created_at: a.date ?? new Date().toISOString(),
    updated_at: a.date ?? new Date().toISOString(),
  };
}

export async function getBlogPosts(
  options: GetBlogPostsOptions = {}
): Promise<PaginatedResponse<BlogPost>> {
  const { featured, limit = DEFAULT_PAGE_SIZE, page = 1 } = options;

  let articles = [...BLOG_ARTICLES];

  if (featured !== undefined) {
    articles = articles.filter((a) => Boolean(a.featured) === featured);
  }

  const total = articles.length;
  const from = (page - 1) * limit;
  const slice = articles.slice(from, from + limit).map(articleToPost);

  return paginatedOk(slice, total, page, limit);
}

export async function getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { data: null, error: `Blog post not found: ${slug}`, status: 'error' };
  return ok(articleToPost(article));
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFAQs(): Promise<ApiResponse<FAQ[]>> {
  return ok([] as FAQ[]);
}

// ─── Contact ─────────────────────────────────────────────────────────────────
// The form UI shows a success state — simulate a successful submission.

export async function submitContactMessage(
  _formData: ContactFormData
): Promise<ApiResponse<ContactMessage>> {
  return ok({} as ContactMessage);
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(
  _email: string,
  _name?: string
): Promise<ApiResponse<NewsletterSubscriber>> {
  return ok({} as NewsletterSubscriber);
}
