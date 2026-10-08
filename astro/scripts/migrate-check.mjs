/**
 * Migration checker: scans the Jekyll collections and reports how many
 * posts/pages/drafts are found and whether their frontmatter looks valid.
 * Run with: npm test
 *
 * This is a sanity check before wiring up the real Astro content routes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const collections = ['_posts', '_drafts', '_old_posts'];
const pagesDir = '_pages';

let totalFiles = 0;
let validFrontmatter = 0;
let issues = [];

function checkFrontmatter(file, content) {
  totalFiles++;
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    issues.push(`${file}: missing frontmatter`);
    return;
  }
  validFrontmatter++;

  // Check for Jekyll-only keys that need mapping
  const fm = fmMatch[1];
  const jekyllKeys = ['permalink', 'layout', 'author_profile', 'read_time', 'comments', 'share', 'related', 'excerpt', 'sitemap', 'header'];
  const found = jekyllKeys.filter(k => fm.includes(`${k}:`));
  if (found.length > 0) {
    issues.push(`${file}: Jekyll keys found: ${found.join(', ')}`);
  }

  // Check for jemoji shortcodes like {{ site.url }}/
  if (/: \{: .*\}/.test(content)) {
    issues.push(`${file}: kramdown attribute syntax found (needs conversion)`);
  }
}

for (const col of collections) {
  const colPath = path.join(ROOT, col);
  if (!fs.existsSync(colPath)) continue;
  for (const f of fs.readdirSync(colPath)) {
    if (!f.endsWith('.md')) continue;
    const p = path.join(colPath, f);
    checkFrontmatter(`${col}/${f}`, fs.readFileSync(p, 'utf8'));
  }
}

const pagesPath = path.join(ROOT, pagesDir);
if (fs.existsSync(pagesPath)) {
  for (const f of fs.readdirSync(pagesPath)) {
    if (!f.endsWith('.md')) continue;
    const p = path.join(pagesPath, f);
    checkFrontmatter(`${pagesDir}/${f}`, fs.readFileSync(p, 'utf8'));
  }
}

const postsCount = fs.readdirSync(path.join(ROOT, '_posts')).filter(f => f.endsWith('.md')).length;
const draftsCount = fs.readdirSync(path.join(ROOT, '_drafts')).filter(f => f.endsWith('.md')).length;
const oldPostsCount = fs.readdirSync(path.join(ROOT, '_old_posts')).filter(f => f.endsWith('.md')).length;
const pagesCount = fs.readdirSync(path.join(ROOT, '_pages')).filter(f => f.endsWith('.md')).length;

console.log('\n=== Jekyll Content Inventory ===\n');
console.log(`  Posts      (_posts):       ${postsCount}`);
console.log(`  Drafts     (_drafts):      ${draftsCount}`);
console.log(`  Old posts  (_old_posts):   ${oldPostsCount}`);
console.log(`  Pages      (_pages):       ${pagesCount}`);
console.log(`  --------------------------------`);
console.log(`  Total markdown files:        ${totalFiles}`);
console.log(`  With valid frontmatter:      ${validFrontmatter}`);
console.log('\n=== Issues / Notes ===\n');
if (issues.length === 0) {
  console.log('  None. All files have frontmatter without Jekyll-specific keys.');
} else {
  // Deduplicate and show a sample
  const unique = [...new Set(issues)];
  console.log(`  ${unique.length} issue(s) found (sample up to 15):`);
  for (const line of unique.slice(0, 15)) {
    console.log(`    - ${line}`);
  }
  if (unique.length > 15) {
    console.log(`    ... and ${unique.length - 15} more`);
  }
}
console.log('\n=== Notes ===');
console.log('  - Jekyll keys will need mapping to Astro props/frontmatter.');
console.log('  - "header.image" will map to "image" in Astro.');
console.log('  - "permalink" / "layout" will be removed or replaced by route logic.');
console.log('  - kramdown attribute syntax ({: .class }) needs a remark-rehype plugin.');
console.log('  - Categories/tags are already in standard frontmatter format.\n');
