import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Database Type Stub ─────────────────────────────────────────────────────
// Replace with generated types once `supabase gen types typescript` is run.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Utility: make Insert/Update types lenient (allow `updated_at` + extra cols) */
type FlexInsert<T extends { id: string; created_at: string }> =
  Omit<T, 'id' | 'created_at'> & { id?: string; created_at?: string };

type FlexUpdate<T> = Partial<T & { [key: string]: unknown }>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'editor' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['profiles']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['profiles']['Row']>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['site_settings']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['site_settings']['Row']>;
      };
      hero_content: {
        Row: {
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
          /** Extended field used by admin editor */
          description?: string | null;
        };
        Insert: FlexInsert<Database['public']['Tables']['hero_content']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['hero_content']['Row']>;
      };
      clients: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          website_url: string | null;
          industry: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['clients']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['clients']['Row']>;
      };
      testimonials: {
        Row: {
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
        };
        Insert: FlexInsert<Database['public']['Tables']['testimonials']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['testimonials']['Row']>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          avatar_url: string | null;
          social_links: Json | null;
          sort_order: number;
          is_active: boolean;
          is_leadership: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['team_members']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['team_members']['Row']>;
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['service_categories']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['service_categories']['Row']>;
      };
      services: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          tagline: string | null;
          description: string | null;
          icon: string | null;
          cover_image_url: string | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['services']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['services']['Row']>;
      };
      project_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['project_categories']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['project_categories']['Row']>;
      };
      projects: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          slug: string;
          tagline: string | null;
          description: string | null;
          content: string | null;
          cover_image_url: string | null;
          video_url: string | null;
          client_name: string | null;
          is_featured: boolean;
          is_active: boolean;
          published_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['projects']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['projects']['Row']>;
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['blog_categories']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['blog_categories']['Row']>;
      };
      blog_posts: {
        Row: {
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
        };
        Insert: FlexInsert<Database['public']['Tables']['blog_posts']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['blog_posts']['Row']>;
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['faqs']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['faqs']['Row']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          service_interest: string | null;
          status: 'new' | 'read' | 'replied' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['contact_messages']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['contact_messages']['Row']>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          is_active: boolean;
          subscribed_at: string;
          unsubscribed_at: string | null;
          created_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['newsletter_subscribers']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['newsletter_subscribers']['Row']>;
      };
      media_files: {
        Row: {
          id: string;
          name: string;
          url: string;
          type: string;
          size: number;
          alt_text: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['media_files']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['media_files']['Row']>;
      };
      statistics: {
        Row: {
          id: string;
          label: string;
          value: number;
          suffix: string | null;
          prefix: string | null;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['statistics']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['statistics']['Row']>;
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['social_links']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['social_links']['Row']>;
      };
      seo_metadata: {
        Row: {
          id: string;
          page_slug: string;
          title: string | null;
          description: string | null;
          keywords: string[] | null;
          og_title: string | null;
          og_description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          robots: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: FlexInsert<Database['public']['Tables']['seo_metadata']['Row']>;
        Update: FlexUpdate<Database['public']['Tables']['seo_metadata']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'admin' | 'editor' | 'viewer';
      message_status: 'new' | 'read' | 'replied' | 'archived';
    };
  };
}

// ─── Singleton Client ────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in your .env file.'
  );
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-application-name': 'dencast-global',
      },
    },
  }
);

export default supabase;
