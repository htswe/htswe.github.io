/**
 * Migrate Jekyll markdown posts into the Astro content collection.
 *
 * Source:  <repo>/_posts/*.md           (published Jekyll posts)
 * Output:  <astro>/src/content/posts/*.md
 *
 * What it does:
 *  - Copies each post verbatim (same filename, so the date + slug survive).
 *  - Rewrites Jekyll/Liquid link tags to the URLs the new Astro routes emit:
 *      {% post_url 2021-10-14-set-in-kotlin %}          -> /tech/set-in-kotlin/
 *      {{ site.baseurl }}{% link _posts/<file>.md %}    -> /<cat>/<slug>/
 *  - Converts the one `{% include video ... %}` tag to a plain <iframe>.
 *  - Strips kramdown inline attribute lists such as `{: .align-center}`.
 *
 * It also writes src/content/posts.migration-map.json listing every post's
 * Jekyll URL so the build output can be diffed against the old _site/ build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASTRO_ROOT = path.resolve(__dirname, '..');
const SITE_ROOT = path.resolve(ASTRO_ROOT, '..');

const SRC_POSTS = path.join(SITE_ROOT, '_posts');
const OUT_POSTS = path.join(ASTRO_ROOT, 'src', 'content', 'posts');

/** Locate the frontmatter block, returning it and the body. */
function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: null, body: raw };
  return { fm: m[1], body: raw.slice(m[0].length) };
}

/** Pull the first entry of a YAML list key out of the frontmatter text. */
function firstListItem(fm, key) {
  const re = new RegExp(`^${key}:\\s*\\n\\s*-\\s*(.+)$`, 'm');
  const m = fm.match(re);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

/** filename (no .md) -> { date, slug, category, url } for every post. */
function buildIndex() {
  const index = new Map();
  for (const file of fs.readdirSync(SRC_POSTS).filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(SRC_POSTS, file), 'utf8');
    const { fm } = splitFrontmatter(raw);
    const id = file.replace(/\.md$/, '');
    const slug = id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const category = fm ? firstListItem(fm, 'categories') : null;
    const url = category ? `/${category.toLowerCase()}/${slug}/` : `/${slug}/`;
    index.set(id, { id, slug, category, url });
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

  // {{ site.baseurl }}{% link _posts/<file>.md %} and bare {% link ... %}
  out = out.replace(
    /\{\{\s*site\.baseurl\s*\}\}\s*\{%\s*link\s+(_posts\/[^\s%]+)\s*%\}/g,
    (_m, ref) => resolveLink(ref),
  );
  out = out.replace(/\{%\s*link\s+(_posts\/[^\s%]+)\s*%\}/g, (_m, ref) => resolveLink(ref));

  // [label]: {% post_url YYYY-MM-DD-slug %}  (reference-style link definitions)
  out = out.replace(/\{%\s*post_url\s+([0-9]{4}-[0-9]{2}-[0-9]{2}-[^\s%]+)\s*%\}/g, (_m, ref) =>
    resolveLink(ref),
  );

  // {% include video id="X" provider="youtube" %}
  out = out.replace(
    /\{%\s*include\s+video\s+id=["']([^"']+)["'](?:\s+provider=["']([^"']+)["'])?\s*%\}/g,
    (_m, id, provider) => {
      if (provider && provider !== 'youtube') {
        return `[Video: ${id}]`;
      }
      return [
        `<div class="video-embed">`,
        `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" `,
        `loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" `,
        `allowfullscreen></iframe></div>`,
      ].join('');
    },
  );

  // Leftover bare liquid (e.g. {{ site.baseurl }}) -> nothing
  out = out.replace(/\{\{\s*site\.baseurl\s*\}\}/g, '');

  // kramdown inline attribute lists: `{: .align-center}` etc.
  out = out.replace(/\{:\s*\.[^}]*\}/g, '');

  return out;
}

if (fs.existsSync(OUT_POSTS)) {
  fs.rmSync(OUT_POSTS, { recursive: true, force: true });
}
fs.mkdirSync(OUT_POSTS, { recursive: true });

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
  // Persist the original filename slug (Astro's glob loader slugifies ids,
  // which would lowercase e.g. `leSS-agile` -> `less-agile` and break URLs).
  const fmOut = /^slug:/m.test(fm) ? fm : `${fm}\nslug: "${meta.slug}"`;
  const migrated = `---\n${fmOut}\n---\n${migrateBody(body)}`;
  fs.writeFileSync(path.join(OUT_POSTS, file), migrated);
  map.push({ file, slug: meta.slug, category: meta.category, url: meta.url });
  count++;
}

fs.writeFileSync(
  path.join(ASTRO_ROOT, 'src', 'content', 'posts.migration-map.json'),
  JSON.stringify(map, null, 2),
);

// Copy static assets served from the site root (/assets/...).
const srcAssets = path.join(SITE_ROOT, 'assets');
const outAssets = path.join(ASTRO_ROOT, 'public', 'assets');
if (fs.existsSync(srcAssets)) {
  fs.rmSync(outAssets, { recursive: true, force: true });
  fs.cpSync(srcAssets, outAssets, { recursive: true });
}

console.log(`Migrated ${count} posts -> src/content/posts/`);
console.log(`Wrote ${map.length} URL mappings -> src/content/posts.migration-map.json`);
if (fs.existsSync(srcAssets)) {
  console.log('Copied assets/ -> public/assets/');
}
if (missingLinks.length) {
  console.warn(`\n${missingLinks.length} unresolved link target(s):`);
  for (const l of [...new Set(missingLinks)]) console.warn(`  - ${l}`);
} else {
  console.log('All liquid link tags resolved.');
}
const cats = [...new Set(map.map((m) => m.category))];
console.log('Categories:', cats.join(', '));
