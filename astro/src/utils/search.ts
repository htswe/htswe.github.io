export interface SearchItem {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  content: string
}

/** Prefer title matches, then tags, descriptions and full article text. */
export function searchPosts(items: SearchItem[], value: string): SearchItem[] {
  const query = value.trim().toLowerCase()
  if (!query) return []
  return items
    .map((item) => {
      const score = item.title.toLowerCase().includes(query)
        ? 4
        : item.tags.some((tag) => tag.toLowerCase().includes(query))
          ? 3
          : item.description.toLowerCase().includes(query)
            ? 2
            : item.content.toLowerCase().includes(query)
              ? 1
              : 0
      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.item.date) - Date.parse(a.item.date))
    .map(({ item }) => item)
}
