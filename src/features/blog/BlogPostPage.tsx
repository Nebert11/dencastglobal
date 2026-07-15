import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronRight, Calendar, Clock, Eye, User, Tag,
  Twitter, Linkedin, Link as LinkIcon, ArrowLeft,
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
    title: 'Capturing the Room and the Stream: Lessons from a High-Stakes Conference Panel in Nairobi',
    excerpt: 'A packed panel at the African Development Bank Annual Meetings in Nairobi shows why modern event coverage is no longer just about recording a stage. It is about building a broadcast-ready experience that works for delegates in the room and viewers online.',
    category: 'Events',
    author: 'Dennis Machio',
    authorRole: 'CEO & Creative Director',
    authorBio: 'Dennis is an award-winning creative director with 15+ years of experience. His event films and livestreams have supported launches, conferences, and brand activations across Africa.',
    authorAvatar: '/dencast_images/Machio-CEO.png',
    date: '2024-05-15',
    readTime: '8 min read',
    views: '4,820',
    imageId: '3756132',
    tags: ['Events', 'Livestreaming', 'Africa', 'Broadcast', 'Production', 'Content Creation'],
    tableOfContents: [
      { id: 'intro', label: 'The Weight of the Room' },
      { id: 'opportunities', label: 'Why the Stakes Are Higher' },
      { id: 'challenges', label: 'What Good Coverage Must Solve' },
      { id: 'model', label: 'Broadcast-Ready Thinking' },
      { id: 'future', label: 'What the Future Looks Like' },
    ],
    content: `
<h2 id="intro">The Weight of the Room</h2>
<p>The image says a lot about where event production is headed. A formal panel sits beneath a large branded backdrop at the African Development Bank Annual Meetings in Nairobi, with a live audience watching closely. It is exactly the kind of setting where coverage has to do more than document what happened. It has to translate the energy, authority, and credibility of the room into something that also works on screen.</p>
<p>That shift matters. High-level conferences like this one are no longer designed only for the people seated in front of the stage. They are built for a wider ecosystem of stakeholders: policymakers, investors, media teams, remote delegates, sponsors, and online audiences who expect to experience the event in real time. For production teams, that means every camera angle, audio feed, and lighting decision carries more weight than ever.</p>

<h2 id="opportunities">Why the Stakes Are Higher</h2>
<p>A panel like this creates a specific challenge. The stage is visually rich, but the message depends on clarity. The backdrop, the flags, the branding, and the line of speakers all need to be captured cleanly without losing the texture of the room. The audience should feel present, not flattened. The conversation should feel immediate, not staged. That balance is what separates basic documentation from strategic event coverage.</p>
<p>Livestreaming raises the bar further. A conference keynote or panel discussion cannot rely on post-production to fix weak audio, poor framing, or missed cues. The live audience and the remote viewer have different needs, but they are consuming the same moment. The production has to serve both. That is why hybrid events demand planning that starts long before the first speaker takes the microphone.</p>

<h2 id="challenges">What Good Coverage Must Solve</h2>
<p>That does not mean the work is simple. The challenge is not just to capture the panel, but to do so without flattening the room. The production has to preserve the seriousness of the meeting, the visual order of the stage, and the human rhythm of the conversation.</p>
<p>At the same time, coverage has to work for a second audience that may never enter the venue. Remote viewers need clean framing, steady pacing, and audio that lets the discussion breathe. In practice, that means event coverage is now part journalism, part broadcast production, and part brand storytelling.</p>
<p>The conference environment also leaves little room for error. A small miss in focus, sound, or timing can weaken the sense of authority that the event is trying to project. In that sense, the production team is not just recording the panel. It is helping define how the panel is remembered.</p>

<h2 id="model">Broadcast-Ready Thinking</h2>
<p>At Dencast Global, this is the kind of production environment that defines our approach. We think of event coverage as a layered deliverable: live broadcast, stills, short-form social content, and a polished recap all coming from the same visual language. When done well, a single conference session can fuel PR, stakeholder communications, digital marketing, and archive footage at once.</p>
<p>The Nairobi panel also highlights another truth: in-person events still matter deeply. The room has gravity. People lean in, listen, and respond in ways that are hard to replicate on a screen. Good event coverage does not try to replace that energy. It makes it visible. It preserves the authority of the room while extending its reach far beyond the venue.</p>

<h2 id="future">What the Future Looks Like</h2>
<p>That is the future of event media in Africa. Not just recording what happened, but making sure the moment can travel. Not just covering the stage, but building a broadcast experience around it. The best productions will be the ones that make a conference panel feel as important online as it does in the room.</p>
    `,
    relatedSlugs: ['hybrid-events-production-guide', 'social-media-video-trends-2024', 'drone-cinematography-regulations-africa'],
  },
  'brand-identity-guide-african-startups': {
    slug: 'brand-identity-guide-african-startups',
    title: 'A Complete Brand Identity Guide for African Startups',
    excerpt: 'Why your startup needs a cohesive brand identity from day one, and how to build one without breaking the bank.',
    category: 'Branding',
    author: 'Austin Lengala',
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
  'drone-cinematography-regulations-africa': { title: 'Drone Cinematography: Navigating Regulations Across Africa', excerpt: 'Our licensed aerial team breaks down what filmmakers need to know.', category: 'Technology', imageId: '1884577', author: 'Joseph Kabogo', date: '2024-04-30', readTime: '5 min read' },
  'behind-the-lens-voices-of-the-nile': { title: 'Behind the Lens: Making Voices of the Nile', excerpt: 'The six-month journey of embedding with Nile communities.', category: 'Behind the Scenes', imageId: '7247399', author: 'Dennis Machio', date: '2024-04-08', readTime: '12 min read' },
  '4k-vs-8k-production-guide': { title: '4K vs. 8K: What Resolution Actually Matters', excerpt: "When does resolution matter — and when doesn't it?", category: 'Technology', imageId: '3756132', author: 'Joseph Kabogo', date: '2024-03-28', readTime: '6 min read' },
  'building-pan-african-brand-voice': { title: 'Building a Pan-African Brand Voice', excerpt: 'Messaging that resonates across diverse African markets.', category: 'Branding', imageId: '3866149', author: 'Austin Lengala', date: '2024-03-20', readTime: '9 min read' },
  'social-media-video-trends-2024': { title: 'Social Media Video Trends 2024', excerpt: 'The formats driving organic reach on every platform.', category: 'Industry', imageId: '3379932', author: 'Emilly Karanja', date: '2024-03-12', readTime: '5 min read' },
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
