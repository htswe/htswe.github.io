import type { APIRoute } from 'astro';
import { getPosts } from '../lib/posts';
import { SITE } from '../consts';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? SITE.url).replace(/\/$/, '');
  const posts = (await getPosts()).slice(0, 30);

  const items = posts
    .map((post) => {
      const url = `${base}${post.url}`;
      return [
        '    <item>',
        `      <title>${escape(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${post.date.toUTCString()}</pubDate>`,
        post.primaryCategory
          ? `      <category>${escape(post.primaryCategory)}</category>`
          : '',
        `      <description>${escape(post.excerpt)}</description>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.title)}</title>
    <link>${base}/</link>
    <description>${escape(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${posts[0]?.date.toUTCString() ?? new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
