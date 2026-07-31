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
import { BLOG_ARTICLES, BLOG_ARTICLES_LOOKUP } from './articlesData';
const DEFAULT_POST = BLOG_ARTICLES[0];

// ─── BlogPostPage ─────────────────────────────────────────────────────────────

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState('');

  const post = (slug && BLOG_ARTICLES_LOOKUP[slug]) ? BLOG_ARTICLES_LOOKUP[slug] : DEFAULT_POST;

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
        <meta property="og:image" content={post.coverImage} />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
          style={{ backgroundImage: `url(${post.coverImage})` }}
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
            <span className="inline-block px-3 py-1 bg-[#25408F] text-white text-xs font-bold uppercase tracking-widest rounded-md mb-4">
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
          <Link to="/blog" className="flex items-center gap-2 text-sm text-[#25408F] font-semibold hover:underline">
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
                          ? 'border-[#D3232E] text-[#25408F] font-semibold bg-[#25408F]/5'
                          : 'border-transparent text-slate-500 hover:text-[#25408F] hover:border-slate-200'
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
              <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-[#25408F] pl-6">
                {post.excerpt}
              </p>

              <div
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:font-black prose-headings:text-slate-900
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-slate-800
                  prose-blockquote:border-[#D3232E] prose-blockquote:bg-[#D3232E]/5 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:text-slate-700 prose-blockquote:font-semibold prose-blockquote:text-xl prose-blockquote:not-italic"
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
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#25408F] hover:text-white text-slate-600 text-sm rounded-full font-medium cursor-pointer transition-colors"
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
                  <p className="text-xs text-[#D3232E] font-bold uppercase tracking-wider mb-1">Written by</p>
                  <h3 className="text-xl font-black text-slate-900 mb-0.5">{post.author}</h3>
                  <p className="text-sm text-[#25408F] font-semibold mb-3">{post.authorRole}</p>
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
              const related = BLOG_ARTICLES_LOOKUP[relSlug];
              if (!related) return null;
              return (
                <BlogCard
                  key={relSlug}
                  title={related.title}
                  excerpt={related.excerpt}
                  category={related.category}
                  coverImage={related.coverImage}
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
              <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#25408F] text-[#25408F] font-semibold rounded-xl hover:bg-[#25408F] hover:text-white transition-all duration-200">
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
