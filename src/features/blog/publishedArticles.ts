import { useQuery } from '@tanstack/react-query';
import type { BlogArticle } from './articlesData';

interface SqlBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  views: number;
  read_time?: number;
  tags?: string[] | string | null;
  published_at: string | null;
  created_at: string;
  category?: { name?: string } | null;
  author?: { full_name?: string | null; avatar_url?: string | null } | null;
}

interface SqlResponse<T> {
  data: T;
  error: { message: string } | null;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const ARTICLE_COLUMNS = '*, category:blog_categories(*), author:profiles(*)';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toParagraphs(content: string | null): string {
  return (content ?? '')
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function mapPost(post: SqlBlogPost): BlogArticle {
  const date = post.published_at ?? post.created_at;
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === 'string'
      ? post.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    category: post.category?.name ?? 'Insights',
    author: post.author?.full_name ?? 'Dencast Global Team',
    authorRole: 'Dencast Global',
    authorBio: 'Stories and insights from the Dencast Global team.',
    authorAvatar: post.author?.avatar_url ?? '/dencast_images/team.jpg',
    date,
    readTime: `${post.read_time ?? 1} min read`,
    views: String(post.views ?? 0),
    coverImage: post.cover_image_url ?? '/dencast_images/stories.png',
    featured: post.is_featured,
    tags,
    tableOfContents: [],
    content: toParagraphs(post.content),
    relatedSlugs: [],
  };
}

async function queryPosts(body: Record<string, unknown>): Promise<SqlBlogPost[]> {
  const response = await fetch(`${API_BASE}/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json() as SqlResponse<SqlBlogPost[] | SqlBlogPost | null>;
  if (!response.ok || result.error) throw new Error(result.error?.message ?? 'Could not load articles.');
  if (Array.isArray(result.data)) return result.data;
  return result.data ? [result.data] : [];
}

export async function getPublishedArticles(): Promise<BlogArticle[]> {
  try {
    const posts = await queryPosts({
      table: 'blog_posts',
      action: 'select',
      columns: ARTICLE_COLUMNS,
      filters: [
        { column: 'is_published', operator: 'eq', value: true },
        { column: 'published_at', operator: 'not_is_null' },
      ],
      orders: [{ column: 'published_at', ascending: false }],
      limit: 500,
    });
    return posts.map(mapPost);
  } catch {
    return [];
  }
}

export async function getPublishedArticle(slug: string): Promise<BlogArticle | null> {
  try {
    const posts = await queryPosts({
      table: 'blog_posts',
      action: 'select',
      columns: ARTICLE_COLUMNS,
      filters: [
        { column: 'slug', operator: 'eq', value: slug },
        { column: 'is_published', operator: 'eq', value: true },
        { column: 'published_at', operator: 'not_is_null' },
      ],
      limit: 1,
      single: 'maybeSingle',
    });
    return posts[0] ? mapPost(posts[0]) : null;
  } catch {
    return null;
  }
}

export function usePublishedArticles() {
  return useQuery({
    queryKey: ['publishedSqlArticles'],
    queryFn: getPublishedArticles,
    staleTime: 0,
    refetchInterval: 30_000,
  });
}

export function usePublishedArticle(slug: string) {
  return useQuery({
    queryKey: ['publishedSqlArticle', slug],
    queryFn: () => getPublishedArticle(slug),
    enabled: Boolean(slug),
    staleTime: 30_000,
  });
}