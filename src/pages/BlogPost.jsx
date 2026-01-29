import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import Glass from "../components/Glass";
import { blogPosts, getPostById } from "../data/blogPosts";

export default function BlogPost() {
  const { id } = useParams();
  const post = getPostById(id);

  // Sort posts by date for navigation
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const currentIndex = sortedPosts.findIndex(p => p.id === id);
  const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main
      className="
        relative mx-auto min-h-screen w-full max-w-[1280px]
        bg-black text-zinc-100
        overflow-hidden overflow-x-hidden
        px-4 sm:px-6 md:px-8
        pb-12
      "
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div
        className="
          relative z-20 flex items-center justify-between
          px-2 sm:px-4 md:px-8
          pt-[max(0.75rem,env(safe-area-inset-top))]
          sm:pt-6 md:pt-8
        "
      >
        <Link 
          to="/blog"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">back to journal</span>
        </Link>
      </div>

      {/* Post Content */}
      <article className="relative z-20 mt-8 sm:mt-12 px-2 sm:px-4 md:px-8 max-w-[860px]">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(28px,6vw,48px)] leading-tight font-extrabold tracking-tight lowercase text-zinc-200">
          {post.title}
        </h1>

        {/* Tags */}
        <div className="flex gap-2 mt-4">
          {post.tags.map((tag) => (
            <span 
              key={tag}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white/5 text-zinc-400 border border-white/10"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <Glass className="mt-8 p-6 sm:p-8">
          <div 
            className="prose prose-invert prose-zinc max-w-none
              prose-headings:lowercase prose-headings:font-bold prose-headings:text-zinc-200
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-zinc-300 prose-p:leading-relaxed
              prose-ul:text-zinc-300 prose-ul:my-4
              prose-li:my-1
              prose-strong:text-emerald-400 prose-strong:font-semibold
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Glass>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 gap-4">
          {prevPost ? (
            <Link 
              to={`/blog/${prevPost.id}`}
              className="flex-1 group"
            >
              <Glass className="p-4 hover:bg-white/8 transition">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                  <ChevronLeft className="h-3 w-3" />
                  <span>previous</span>
                </div>
                <div className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition lowercase truncate">
                  {prevPost.title}
                </div>
              </Glass>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          
          {nextPost ? (
            <Link 
              to={`/blog/${nextPost.id}`}
              className="flex-1 group text-right"
            >
              <Glass className="p-4 hover:bg-white/8 transition">
                <div className="flex items-center justify-end gap-2 text-xs text-zinc-500 mb-1">
                  <span>next</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
                <div className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition lowercase truncate">
                  {nextPost.title}
                </div>
              </Glass>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </article>

      {/* Border decoration */}
      <div className="pointer-events-none absolute inset-2 sm:inset-4 rounded-[20px] sm:rounded-[28px] border border-white/8 hidden sm:block" />
    </main>
  );
}
