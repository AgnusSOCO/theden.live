/**
 * Blog Posts Data
 * 
 * Easy to maintain - just add new posts to this array.
 * Posts are displayed newest first (by date).
 * 
 * Each post has:
 * - id: unique identifier (used in URL)
 * - title: post title
 * - date: publication date
 * - excerpt: short preview text
 * - content: full post content (supports basic HTML)
 * - tags: array of tags for categorization
 */

export const blogPosts = [
  {
    id: "the-beginning",
    title: "the beginning — $1,000 to $10,000",
    date: "2025-01-29",
    excerpt: "Starting the challenge. The rules, the mindset, and why I'm doing this publicly.",
    tags: ["challenge", "mindset"],
    content: `
      <p>Welcome to the 1-10k challenge. The goal is simple: turn $1,000 into $10,000 through trading, documented publicly for accountability and education.</p>
      
      <h3>the rules</h3>
      <ul>
        <li>Starting capital: $1,000</li>
        <li>No additional deposits</li>
        <li>All trades documented with entries and exits</li>
        <li>Risk management: max 2% per trade</li>
        <li>No revenge trading</li>
      </ul>
      
      <h3>why public?</h3>
      <p>Accountability changes everything. When you know others are watching, you think twice before making emotional decisions. This isn't about showing off wins — it's about showing the real journey, including the losses.</p>
      
      <h3>current status</h3>
      <p>Account balance: <strong>$1,000.00</strong></p>
      <p>Let's see where this goes.</p>
    `
  },
  {
    id: "week-1-recap",
    title: "week 1 recap — finding my footing",
    date: "2025-01-28",
    excerpt: "First week in the books. Small gains, important lessons learned about patience.",
    tags: ["weekly", "recap"],
    content: `
      <p>Week 1 is done. Here's how it went.</p>
      
      <h3>the trades</h3>
      <p>Took 3 trades this week. Two winners, one small loss. Net result: +$47.50</p>
      
      <h3>what worked</h3>
      <ul>
        <li>Waiting for clear setups instead of forcing trades</li>
        <li>Sticking to my risk rules</li>
        <li>Taking profits when the setup played out</li>
      </ul>
      
      <h3>what didn't</h3>
      <ul>
        <li>Hesitated on one entry that would have been a winner</li>
        <li>Held one position too long, gave back some gains</li>
      </ul>
      
      <h3>account update</h3>
      <p>Starting: $1,000.00</p>
      <p>Current: <strong>$1,047.50</strong></p>
      <p>Progress: +4.75%</p>
    `
  }
];

export function getPostById(id) {
  return blogPosts.find(post => post.id === id);
}

export function getPostsByTag(tag) {
  return blogPosts.filter(post => post.tags.includes(tag));
}

export function getAllTags() {
  const tags = new Set();
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags);
}
