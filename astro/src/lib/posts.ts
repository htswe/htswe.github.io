import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../consts';

export interface Post {
  /** Collection entry id, e.g. 2022-07-24-image-compression-part-1 */
  id: string;
  /** URL slug derived from the filename (case preserved, matches Jekyll). */
  slug: string;
  date: Date;
  title: string;
  categories: string[];
  primaryCategory: string | null;
  tags: string[];
  image?: string;
  /** Site URL, matches Jekyll permalink /:categories/:title/ */
  url: string;
  excerpt: string;
  entry: CollectionEntry<'posts'>;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

export function postFromEntry(entry: CollectionEntry<'posts'>): Post {
  const m = entry.id.match(DATE_RE);
  // Prefer the slug persisted in frontmatter (preserves original case).
  const slug = entry.data.slug ?? (m ? m[4] : entry.id);
  const date = m ? new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`) : new Date(0);
  const categories = entry.data.categories ?? [];
  const primaryCategory = categories.length ? categories[0] : null;
  const url = primaryCategory
    ? `/${primaryCategory.toLowerCase()}/${slug}/`
    : `/${slug}/`;

  return {
    id: entry.id,
    slug,
    date,
    title: entry.data.title,
    categories,
    primaryCategory,
    tags: entry.data.tags ?? [],
    image: entry.data.header?.image,
    url,
    excerpt: makeExcerpt(entry.body ?? ''),
    entry,
  };
}

/** Plain-text snippet from the first real paragraph of the markdown body. */
function makeExcerpt(body: string, max = 220): string {
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

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('posts');
  return entries
    .map(postFromEntry)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export interface Page {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  prevUrl: string | null;
  nextUrl: string | null;
}

export function pageUrl(n: number): string {
  return n === 1 ? '/' : `/page${n}/`;
}

export function paginate(posts: Post[], currentPage: number): Page {
  const per = SITE.paginate;
  const totalPages = Math.max(1, Math.ceil(posts.length / per));
  const start = (currentPage - 1) * per;
  return {
    posts: posts.slice(start, start + per),
    currentPage,
    totalPages,
    prevUrl: currentPage > 1 ? pageUrl(currentPage - 1) : null,
    nextUrl: currentPage < totalPages ? pageUrl(currentPage + 1) : null,
  };
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
