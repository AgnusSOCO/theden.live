import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Glass from "../components/Glass";
import { getAllPosts, getStats } from "../utils/loadPosts";

export default function Blog() {
  // Get posts and stats from markdown files
  const sortedPosts = getAllPosts();
  const stats = getStats();

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
          to="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">back to the den</span>
        </Link>
      </div>

      {/* Title Section */}
      <div className="relative z-20 mt-8 sm:mt-12 px-2 sm:px-4 md:px-8">
        <h1 className="text-[clamp(32px,8vw,64px)] leading-none font-extrabold tracking-tight lowercase text-zinc-200">
          1-10k challenge
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-zinc-400 max-w-2xl">
          documenting the journey from $1,000 to $10,000. every trade, every lesson, every win and loss.
        </p>
      </div>

      {/* Stats Card */}
      <div className="relative z-20 mt-8 px-2 sm:px-4 md:px-8">
        <Glass className="flex flex-wrap gap-6 sm:gap-12 p-5 sm:p-6 max-w-[860px]">
          <div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">starting</div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100">${stats.starting.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">current</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">${stats.current.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">progress</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">+{(((stats.current - stats.starting) / stats.starting) * 100).toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider">goal</div>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-100">${stats.goal.toLocaleString()}</div>
          </div>
        </Glass>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 mt-4 px-2 sm:px-4 md:px-8 max-w-[860px]">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${((stats.current - stats.starting) / (stats.goal - stats.starting)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-zinc-500">
          <span>$1k</span>
          <span>$10k</span>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="relative z-20 mt-12 px-2 sm:px-4 md:px-8">
        <h2 className="text-xl sm:text-2xl font-bold lowercase text-zinc-300 mb-6">
          journal entries
        </h2>
        
        <div className="space-y-4 max-w-[860px]">
          {sortedPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <Glass className="p-5 sm:p-6 hover:bg-white/8 transition cursor-pointer">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-100 lowercase">
                  {post.title}
                </h3>
                <p className="mt-2 text-zinc-400 text-sm sm:text-base">
                  {post.excerpt}
                </p>
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-400"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </Glass>
            </Link>
          ))}
        </div>
      </div>

      {/* Border decoration */}
      <div className="pointer-events-none absolute inset-2 sm:inset-4 rounded-[20px] sm:rounded-[28px] border border-white/8 hidden sm:block" />
    </main>
  );
}
