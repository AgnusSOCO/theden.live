import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Glass from "../components/Glass";
import { getAllPosts, getPostById } from "../utils/loadPosts";

export default function BlogPost() {
  const { id } = useParams();
  const post = getPostById(id);

    // Sort posts by date for navigation
    const sortedPosts = getAllPosts();
  
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
                    className="blog-content text-zinc-300 leading-relaxed
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-200 [&_h2]:lowercase [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-zinc-200 [&_h3]:lowercase [&_h3]:mt-6 [&_h3]:mb-3
                      [&_p]:mb-4 [&_p]:text-zinc-300
                      [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc
                      [&_li]:my-1 [&_li]:text-zinc-300
                      [&_strong]:text-emerald-400 [&_strong]:font-semibold
                      [&_a]:text-emerald-400 [&_a]:no-underline hover:[&_a]:underline
                    "
                  >
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
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
