import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronRight, Calendar, Clock, Eye, User, Tag,
  Twitter, Linkedin, Link as LinkIcon, ArrowLeft, ArrowRight,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import BlogCard from '@/components/ui/BlogCard';
import { SITE_NAME } from '@/utils/constants';

// ─── Static blog post data ────────────────────────────────────────────────────

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  views: string;
  imageId: string;
  tags: string[];
  tableOfContents: { id: string; label: string }[];
  content: string;
  relatedSlugs: string[];
}

const POSTS: Record<string, PostData> = {
  'future-of-african-documentary-2024': {
    slug: 'future-of-african-documentary-2024',
    title: 'The Future of African Documentary in the Streaming Age',
    excerpt: 'As Netflix, Prime Video, and Apple TV+ invest billions in African content, what does the streaming era mean for independent documentary filmmakers?',
    category: 'Documentary',
    author: 'Dennis Osei',
    authorRole: 'CEO & Creative Director',
    authorBio: 'Dennis is an award-winning filmmaker with 15+ years of experience. His documentaries have screened at TIFF, Sundance, and FESPACO.',
    authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    date: '2024-05-15',
    readTime: '8 min read',
    views: '4,820',
    imageId: '3379934',
    tags: ['Documentary', 'Streaming', 'Africa', 'Film Industry', 'Netflix', 'Content Creation'],
    tableOfContents: [
      { id: 'intro', label: 'The Streaming Landscape in Africa' },
      { id: 'opportunities', label: 'Unprecedented Opportunities' },
      { id: 'challenges', label: 'The New Challenges' },
      { id: 'model', label: 'A New Production Model' },
      { id: 'future', label: 'What the Future Holds' },
    ],
    content: `
<h2 id="intro">The Streaming Landscape in Africa</h2>
<p>The numbers tell a remarkable story. Netflix invested over $1 billion in African content between 2016 and 2022. Amazon Prime Video has localised its platform in key African markets. Apple TV+ has acquired multiple African-origin projects. And a new generation of pan-African streaming platforms — Showmax, Canal+ Africa, Buni TV — are competing aggressively for local content.</p>
<p>For African documentary filmmakers, this represents both an extraordinary opportunity and a fundamental disruption of the traditional production model. The old pathway — make a film, submit to festivals, secure a broadcast deal, wait — is being replaced by something faster, more commercial, but also potentially more creatively limiting.</p>

<h2 id="opportunities">Unprecedented Opportunities</h2>
<p>The most immediate benefit is simple: there's more money available for African stories than at any point in history. Streaming platforms need volume, they need diversity, and they have discovered that African stories travel remarkably well globally.</p>
<p>Consider the success of "Queen Sono" on Netflix, or the global reach of documentaries like "14 Peaks' and various African wildlife series. These aren't just African success stories — they're proof that global audiences have an appetite for content from and about the African continent.</p>
<blockquote>"We used to wait three years for a distribution deal. Now we can be in 190 countries on day one."</blockquote>
<p>For documentary filmmakers specifically, streaming platforms offer something the traditional model rarely could: a guarantee that your film will actually be seen by a meaningful audience. The tragedy of great documentaries languishing unseen after festival runs is well-documented. Streaming theoretically solves that.</p>

<h2 id="challenges">The New Challenges</h2>
<p>But the streaming era is not without its complications for documentary filmmakers. The first and most significant is creative control. Streaming platforms are not arts councils — they are entertainment businesses with specific audience targets, completion rate benchmarks, and algorithmic priorities.</p>
<p>A documentary that is artistically audacious but alienates viewers in the first twelve minutes is a problem for a platform that measures success in retention metrics. The pressure to deliver compelling narrative hooks, episodic structures, and "watchable" characters is real and persistent.</p>
<p>There is also the issue of rights. Traditional documentary deals often retained certain rights with filmmakers — the ability to screen at festivals, broadcast on national television, use footage for educational purposes. Streaming deals increasingly demand global, exclusive, perpetual rights. For stories about communities, this raises genuine ethical questions about ownership and representation.</p>

<h2 id="model">A New Production Model</h2>
<p>The filmmakers and production companies navigating this landscape most successfully seem to be operating with a hybrid model: developing projects with sufficient commercial appeal to attract streaming interest while maintaining creative control through co-production structures, limited exclusivity windows, and careful rights negotiations.</p>
<p>At Dencast Global, this has meant developing what we call "social documentary' projects — films that address significant social issues with the cinematic quality of feature documentaries but structured around streaming consumption patterns. Three acts. Clear character arcs. Emotional payoffs.</p>
<p>This isn't a betrayal of the documentary form. It's an adaptation to a changed distribution landscape — one that, if navigated well, can get vital African stories in front of fifty times more viewers than the festival circuit ever could.</p>

<h2 id="future">What the Future Holds</h2>
<p>We believe the next five years will see the emergence of a genuinely sustainable independent documentary ecosystem in Africa — one built on a combination of streaming commissions, co-production partnerships, brand partnerships, and impact funding.</p>
<p>The filmmakers who will thrive are those who can speak both languages: the artistic language of authentic documentary storytelling and the commercial language of platforms and their audiences. This is not a compromise. It is a sophisticated professional skill, and it is absolutely teachable and learnable.</p>
<p>Africa's stories are the most compelling on earth. The streaming era has given us the distribution infrastructure to tell those stories to the world. The challenge now is ensuring that as we scale up, we don't lose the authenticity and creative courage that make our work worth watching in the first place.</p>
    `,
    relatedSlugs: ['drone-cinematography-regulations-africa', 'behind-the-lens-voices-of-the-nile', '4k-vs-8k-production-guide'],
  },
  'brand-identity-guide-african-startups': {
    slug: 'brand-identity-guide-african-startups',
    title: 'A Complete Brand Identity Guide for African Startups',
    excerpt: 'Why your startup needs a cohesive brand identity from day one, and how to build one without breaking the bank.',
    category: 'Branding',
    author: 'Abena Korkor',
    authorRole: 'Brand Strategy Lead',
    authorBio: 'Abena is a former TBWA creative strategist who now leads brand strategy for Africa\'s fastest-growing startups.',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    date: '2024-05-08',
    readTime: '6 min read',
    views: '3,210',
    imageId: '2873486',
    tags: ['Branding', 'Startups', 'Brand Identity', 'Logo Design', 'Africa', 'Strategy'],
    tableOfContents: [
      { id: 'why', label: 'Why Brand Identity Matters Early' },
      { id: 'elements', label: 'The Core Elements' },
      { id: 'process', label: 'The Build Process' },
      { id: 'budget', label: 'Budget Reality Check' },
    ],
    content: `
<h2 id="why">Why Brand Identity Matters From Day One</h2>
<p>Most startup founders believe brand identity is something you invest in once you have traction. Get the product working first, then worry about how it looks. This is almost always a mistake.</p>
<p>Brand identity is not decoration — it is communication. From the moment you send your first pitch deck, post your first social media update, or hand over your first business card, you are communicating something about your company. The question is whether that communication is intentional and powerful, or accidental and forgettable.</p>

<h2 id="elements">The Core Elements of Brand Identity</h2>
<p>A complete brand identity system comprises several interconnected elements. Understanding each one — and how they work together — is the foundation of the build process.</p>
<p><strong>Brand Purpose & Values:</strong> Before any visual work, you must articulate why your company exists beyond profit. This is not a marketing exercise — it is a strategic one. Your purpose shapes every subsequent creative decision.</p>
<p><strong>Brand Positioning:</strong> How are you different from competitors? What space in the market's mind do you occupy? Clear positioning makes design briefs infinitely easier to execute.</p>
<p><strong>Logo & Mark:</strong> The visual anchor of your identity. A great logo works at 500 pixels and 5 millimetres. It's distinctive, scalable, and meaningful.</p>
<p><strong>Colour Palette:</strong> Colour is the fastest and most powerful communicator in visual design. Choose deliberately, test in context, and document precisely.</p>

<h2 id="process">The Brand Build Process</h2>
<p>At Dencast Global's brand studio, we follow a five-stage process for every brand we develop. The foundation stage — research, audit, and positioning strategy — is always the longest. Rushing to the visual work without this foundation produces logos that look nice but say nothing meaningful.</p>
<p>Once strategy is locked, visual development follows quickly. We present three distinct creative directions, each representing a genuinely different strategic interpretation of the brief. This isn't about giving clients "options' — it's about exploring the strategic space before committing to a single direction.</p>

<h2 id="budget">Budget Reality Check</h2>
<p>Quality brand identity work has a real cost. A comprehensive brand identity package from a professional agency will cost between $5,000 and $25,000 depending on scope and agency size. For pre-seed startups, there are legitimate ways to do this for less — but be aware of the trade-offs.</p>
<p>The most important investment is always in strategy. You can execute a simple visual identity quite affordably if the strategic foundation is solid. What you cannot afford is an expensive visual identity built on an undefined strategic foundation.</p>
    `,
    relatedSlugs: ['building-pan-african-brand-voice', 'future-of-african-documentary-2024', 'social-media-video-trends-2024'],
  },
};

const ARTICLES_LOOKUP: Record<string, { title: string; excerpt: string; category: string; imageId: string; author: string; date: string; readTime: string }> = {
  'drone-cinematography-regulations-africa': { title: 'Drone Cinematography: Navigating Regulations Across Africa', excerpt: 'Our licensed aerial team breaks down what filmmakers need to know.', category: 'Technology', imageId: '1884577', author: 'Kwame Mensah', date: '2024-04-30', readTime: '5 min read' },
  'behind-the-lens-voices-of-the-nile': { title: 'Behind the Lens: Making Voices of the Nile', excerpt: 'The six-month journey of embedding with Nile communities.', category: 'Behind the Scenes', imageId: '7247399', author: 'Dennis Osei', date: '2024-04-08', readTime: '12 min read' },
  '4k-vs-8k-production-guide': { title: '4K vs. 8K: What Resolution Actually Matters', excerpt: "When does resolution matter — and when doesn't it?", category: 'Technology', imageId: '3756132', author: 'Kwame Mensah', date: '2024-03-28', readTime: '6 min read' },
  'building-pan-african-brand-voice': { title: 'Building a Pan-African Brand Voice', excerpt: 'Messaging that resonates across diverse African markets.', category: 'Branding', imageId: '3866149', author: 'Abena Korkor', date: '2024-03-20', readTime: '9 min read' },
  'social-media-video-trends-2024': { title: 'Social Media Video Trends 2024', excerpt: 'The formats driving organic reach on every platform.', category: 'Industry', imageId: '3379932', author: 'Efua Boateng', date: '2024-03-12', readTime: '5 min read' },
};

// Fallback for unknown slugs
const DEFAULT_POST = POSTS['future-of-african-documentary-2024'];

// ─── BlogPostPage ─────────────────────────────────────────────────────────────

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState('');

  const post = (slug && POSTS[slug]) ? POSTS[slug] : DEFAULT_POST;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog | {SITE_NAME}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`https://images.pexels.com/photos/${post.imageId}/pexels-photo-${post.imageId}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.pexels.com/photos/${post.imageId}/pexels-photo-${post.imageId}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/50 text-sm mb-6"
          >
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium line-clamp-1">{post.title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-[#0056A6] text-white text-xs font-bold uppercase tracking-widest rounded-md mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
              <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views} views</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Share + back bar ── */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 flex-wrap">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-[#0056A6] font-semibold hover:underline">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg text-xs font-semibold hover:bg-[#1DA1F2] hover:text-white transition-all"
            >
              <Twitter size={13} /> Share
            </a>
            <a
              href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B5]/10 text-[#0077B5] rounded-lg text-xs font-semibold hover:bg-[#0077B5] hover:text-white transition-all"
            >
              <Linkedin size={13} /> Share
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-all"
            >
              <LinkIcon size={13} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar: Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contents</p>
                <nav className="space-y-2">
                  {post.tableOfContents.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveToc(item.id)}
                      className={`block text-sm py-1.5 px-3 rounded-lg transition-colors border-l-2 ${
                        activeToc === item.id
                          ? 'border-[#D72638] text-[#0056A6] font-semibold bg-[#0056A6]/5'
                          : 'border-transparent text-slate-500 hover:text-[#0056A6] hover:border-slate-200'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <article className="lg:col-span-3">
              <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-[#0056A6] pl-6">
                {post.excerpt}
              </p>

              <div
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:font-black prose-headings:text-slate-900
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-slate-800
                  prose-blockquote:border-[#D72638] prose-blockquote:bg-[#D72638]/5 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:text-slate-700 prose-blockquote:font-semibold prose-blockquote:text-xl prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-4">
                  <Tag size={14} /> Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#0056A6] hover:text-white text-slate-600 text-sm rounded-full font-medium cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4 flex-wrap">
                <p className="text-sm font-semibold text-slate-600">Share this article:</p>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm font-semibold hover:bg-[#1a91da] transition-colors"
                >
                  <Twitter size={14} /> Twitter
                </a>
                <a
                  href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg text-sm font-semibold hover:bg-[#006399] transition-colors"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-colors"
                >
                  <LinkIcon size={14} /> {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Author Bio */}
              <div className="mt-10 bg-slate-50 rounded-2xl p-8 border border-slate-100 flex items-start gap-6">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-[#D72638] font-bold uppercase tracking-wider mb-1">Written by</p>
                  <h3 className="text-xl font-black text-slate-900 mb-0.5">{post.author}</h3>
                  <p className="text-sm text-[#0056A6] font-semibold mb-3">{post.authorRole}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{post.authorBio}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Related Posts ── */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <SectionLabel label="Keep Reading" />
            <h2 className="mt-4 text-3xl font-black text-slate-900">Related Articles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {post.relatedSlugs.slice(0, 3).map(relSlug => {
              const related = ARTICLES_LOOKUP[relSlug];
              if (!related) return null;
              return (
                <BlogCard
                  key={relSlug}
                  title={related.title}
                  excerpt={related.excerpt}
                  category={related.category}
                  coverImage={`https://images.pexels.com/photos/${related.imageId}/pexels-photo-${related.imageId}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  slug={relSlug}
                  author={related.author}
                  date={related.date}
                  readTime={related.readTime}
                />
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/blog">
              <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0056A6] text-[#0056A6] font-semibold rounded-xl hover:bg-[#0056A6] hover:text-white transition-all duration-200">
                <ArrowLeft size={15} />
                Back to All Articles
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
