/**
 * Load blog posts from markdown files
 * This uses Vite's glob import to load all markdown files at build time
 */

// Import all markdown files from content/blog
const postFiles = import.meta.glob('/content/blog/*.md', { 
  eager: true, 
  query: '?raw',
  import: 'default'
});

// Import stats
const statsFile = import.meta.glob('/content/settings/stats.json', {
  eager: true,
  import: 'default'
});

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const frontmatterStr = match[1];
  const body = match[2];
  
  // Simple YAML parser for our use case
  const data = {};
  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let inArray = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check for array item
    if (trimmed.startsWith('- ') && inArray && currentKey) {
      if (!data[currentKey]) data[currentKey] = [];
      data[currentKey].push(trimmed.slice(2).trim());
      continue;
    }
    
    // Check for key-value pair
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();
      
      if (value === '') {
        // This might be an array
        currentKey = key;
        inArray = true;
        data[key] = [];
      } else {
        inArray = false;
        // Remove quotes if present
        data[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }
  
  return { data, content: body };
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts() {
  const posts = [];
  
  for (const [path, content] of Object.entries(postFiles)) {
    const { data, content: body } = parseFrontmatter(content);
    const filename = path.split('/').pop().replace('.md', '');
    
    posts.push({
      id: filename,
      title: data.title || filename,
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      content: body
    });
  }
  
  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by ID
 */
export function getPostById(id) {
  const posts = getAllPosts();
  return posts.find(post => post.id === id);
}

/**
 * Get challenge stats
 */
export function getStats() {
  const statsPath = Object.keys(statsFile)[0];
  if (statsPath && statsFile[statsPath]) {
    return statsFile[statsPath];
  }
  return { starting: 1000, current: 1000, goal: 10000 };
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  const posts = getAllPosts();
  const tags = new Set();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags);
}
