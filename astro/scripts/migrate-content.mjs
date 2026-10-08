/**
 * Migrate Jekyll markdown posts into the Ink theme's `blog` content collection.
 *
 * Source:  <repo>/_posts/*.md                  (published Jekyll posts)
 * Output:  <astro>/src/content/blog/*.md       (astro-theme-ink schema)
 *
 * Per post it:
 *  - maps Jekyll frontmatter to the theme schema:
 *      title / categories / tags / header.image
 *      -> title / description / publishDate / tags / heroImage / slug / category / permalink
 *  - rewrites Liquid link tags to the URLs the new routes emit:
 *      {% post_url 2021-10-14-set-in-kotlin %}          -> /tech/set-in-kotlin/
 *      {{ site.baseurl }}{% link _posts/<file>.md %}    -> /<cat>/<slug>/
 *  - converts the one `{% include video ... %}` tag to an <iframe>
 *  - strips kramdown inline attribute lists such as `{: .align-center}`
 *  - copies assets/ -> public/assets/
 *
 * Also writes src/content/blog/.migration-map.json with every post's original
 * Jekyll URL so the build can be diffed against the old _site/ output.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASTRO_ROOT = path.resolve(__dirname, '..');
const SITE_ROOT = path.resolve(ASTRO_ROOT, '..');

const SRC_POSTS = path.join(SITE_ROOT, '_posts');
const OUT_BLOG = path.join(ASTRO_ROOT, 'src', 'content', 'blog');
const MAP_FILE = path.join(OUT_BLOG, '.migration-map.json');

/** Split off the frontmatter block. */
function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: null, body: raw };
  return { fm: m[1], body: raw.slice(m[0].length) };
}

/** Read a YAML list key (`tags:`) into a string[] as written. */
function listItems(fm, key) {
  const re = new RegExp(`^${key}:[ \\t]*\\n((?:[ \\t]*-[ \\t]*.+\\n?)+)`, 'm');
  const m = fm.match(re);
  if (!m) return [];
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^[ \t]*-[ \t]*/, '').trim())
    .filter(Boolean)
    .map((s) => s.replace(/^["']|["']$/g, ''));
}

/** Read a scalar `key: value` from frontmatter. */
function scalar(fm, key) {
  const m = fm.match(new RegExp(`^${key}:[ \\t]*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

/** Nested `header:\n  image: ...` -> value. */
function headerImage(fm) {
  const m = fm.match(/^header:[ \t]*\n(?:[ \t]+.+\n)*?[ \t]+image:[ \t]*(.+)$/m);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

/** Plain-text snippet from the first real paragraph of the markdown body. */
function makeDescription(body, max = 200) {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~]/g, '');
  const para = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .find((p) => p.length > 40);
  const text = para ?? cleaned.replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** filename (no .md) -> { date, slug, category, url } */
function buildIndex() {
  const index = new Map();
  for (const file of fs.readdirSync(SRC_POSTS).filter((f) => f.endsWith('.md'))) {
    const { fm } = splitFrontmatter(fs.readFileSync(path.join(SRC_POSTS, file), 'utf8'));
    const id = file.replace(/\.md$/, '');
    const dateMatch = id.match(/^(\d{4}-\d{2}-\d{2})-/);
    const date = dateMatch ? dateMatch[1] : null;
    const slug = id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const category = fm ? listItems(fm, 'categories')[0] ?? null : null;
    const url = category ? `/${category.toLowerCase()}/${slug}/` : `/${slug}/`;
    index.set(id, { id, slug, date, category, url });
  }
  return index;
}

const index = buildIndex();
const missingLinks = [];

function resolveLink(ref) {
  const id = ref.replace(/^_posts\//, '').replace(/\.md$/, '');
  const found = index.get(id);
  if (!found) {
    missingLinks.push(ref);
    return `#missing-${ref}`;
  }
  return found.url;
}

function migrateBody(body) {
  let out = body;

  out = out.replace(
    /\{\{\s*site\.baseurl\s*\}\}\s*\{%\s*link\s+(_posts\/[^\s%]+)\s*%\}/g,
    (_m, ref) => resolveLink(ref),
  );
  out = out.replace(/\{%\s*link\s+(_posts\/[^\s%]+)\s*%\}/g, (_m, ref) => resolveLink(ref));

  out = out.replace(/\{%\s*post_url\s+([0-9]{4}-[0-9]{2}-[0-9]{2}-[^\s%]+)\s*%\}/g, (_m, ref) =>
    resolveLink(ref),
  );

  out = out.replace(
    /\{%\s*include\s+video\s+id=["']([^"']+)["'](?:\s+provider=["']([^"']+)["'])?\s*%\}/g,
    (_m, id, provider) => {
      if (provider && provider !== 'youtube') return `[Video: ${id}]`;
      return [
        `<div class="video-embed">`,
        `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" `,
        `loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" `,
        `allowfullscreen></iframe></div>`,
      ].join('');
    },
  );

  out = out.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');
  out = out.replace(/\{:\s*\.[^}]*\}/g, '');

  return out;
}

if (fs.existsSync(OUT_BLOG)) {
  fs.rmSync(OUT_BLOG, { recursive: true, force: true });
}
fs.mkdirSync(OUT_BLOG, { recursive: true });

let count = 0;
const map = [];
for (const file of fs.readdirSync(SRC_POSTS).filter((f) => f.endsWith('.md')).sort()) {
  const raw = fs.readFileSync(path.join(SRC_POSTS, file), 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  if (!fm) {
    console.warn(`! ${file}: no frontmatter, skipped`);
    continue;
  }

  const meta = index.get(file.replace(/\.md$/, ''));
  const title = scalar(fm, 'title') ?? meta.slug;
  const image = headerImage(fm);
  const tags = listItems(fm, 'tags').flatMap((t) => t.split(',').map((x) => x.trim())).filter(Boolean);

  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(makeDescription(body))}`,
    `publishDate: ${JSON.stringify(meta.date ?? '1970-01-01')}`,
  ];
  if (tags.length) {
    lines.push('tags:');
    for (const t of tags) lines.push(`  - ${JSON.stringify(t)}`);
  } else {
    lines.push('tags: []');
  }
  if (image) {
    lines.push('heroImage:');
    lines.push(`  src: ${JSON.stringify(image)}`);
  }
  if (meta.slug) lines.push(`slug: ${JSON.stringify(meta.slug)}`);
  if (meta.category) lines.push(`category: ${JSON.stringify(meta.category)}`);
  lines.push(`permalink: ${JSON.stringify(meta.url)}`);
  lines.push('---');

  fs.writeFileSync(path.join(OUT_BLOG, file), `${lines.join('\n')}\n${migrateBody(body)}`);
  map.push({ file, slug: meta.slug, category: meta.category, url: meta.url });
  count++;
}

fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));

// Copy static assets served from the site root (/assets/...).
const srcAssets = path.join(SITE_ROOT, 'assets');
const outAssets = path.join(ASTRO_ROOT, 'public', 'assets');
if (fs.existsSync(srcAssets)) {
  fs.rmSync(outAssets, { recursive: true, force: true });
  fs.cpSync(srcAssets, outAssets, { recursive: true });
}

console.log(`Migrated ${count} posts -> src/content/blog/`);
console.log(`Wrote ${map.length} URL mappings -> src/content/blog/.migration-map.json`);
if (fs.existsSync(srcAssets)) console.log('Copied assets/ -> public/assets/');
if (missingLinks.length) {
  console.warn(`\n${missingLinks.length} unresolved link target(s):`);
  for (const l of [...new Set(missingLinks)]) console.warn(`  - ${l}`);
} else {
  console.log('All liquid link tags resolved.');
}
console.log('Categories:', [...new Set(map.map((m) => m.category))].join(', '));
