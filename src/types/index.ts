// ─── Auth / User ─────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

// ─── Site Config ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, unknown> | unknown[];
  created_at: string;
  updated_at: string;
}

export interface SeoMetadata {
  id: string;
  page_slug: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  og_image_url: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export interface HeroContent {
  id: string;
  headline: string;
  subheadline: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
  background_video_url: string | null;
  background_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Clients & Social Proof ───────────────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  client_avatar_url: string | null;
  content: string;
  rating: number | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMemberSocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: TeamMemberSocialLinks | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  /** Joined relation — present when fetched with category */
  category?: ServiceCategory;
}

// ─── Portfolio / Projects ─────────────────────────────────────────────────────

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  client_name: string | null;
  is_featured: boolean;
  published_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  /** Joined relation — present when fetched with category */
  category?: ProjectCategory;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  category_id: string | null;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  /** Joined relations */
  category?: BlogCategory;
  author?: Profile;
}

// ─── FAQs & Contact ───────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  service_interest: string | null;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  service_interest?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  prefix: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Generic API Responses ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  error: string | null;
  status: 'success' | 'error';
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavLink {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

// ─── Services (static constants types) ───────────────────────────────────────

export interface ServiceEntry {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  tagline: string;
}

export interface SocialPlatformEntry {
  id: string;
  name: string;
  icon: string;
  baseUrl: string;
}
