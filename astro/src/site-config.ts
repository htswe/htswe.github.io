/**
 * astro-theme-ink · site configuration
 * Everything the theme needs in one typed object — no virtual modules,
 * just import { config } from '@/site-config' where needed.
 */

export interface NavItem {
  title: string
  link: string
}

export interface FriendLink {
  name: string
  desc: string
  url: string
  avatar?: string
}

export interface EducationItem {
  school: string
  major?: string
  degree?: string
  date: string
}

export interface SkillGroup {
  title: string
  items: string[]
}

export interface HomeHeroConfig {
  tagline?: string
  location?: string
  about: string
  summary?: string
  buttons?: { title: string; link: string }[]
}

export interface HomeConfig {
  hero: HomeHeroConfig
  recentPosts: number
  education?: EducationItem[]
  skills?: SkillGroup[]
  showTags: boolean
  showFriends: boolean
}

export interface Config {
  site: {
    title: string
    author: string
    description: string
    lang: string
    favicon: string
    avatar: string
    ogImage: string
    since: number
    palette: 'ink' | 'fresh'
    theme: 'light' | 'dark' | 'system'
    titleDelimiter: string
  }
  header: {
    menu: NavItem[]
  }
  pageview: {
    server: string
    siteWide: boolean
  }
  footer: {
    showQuote?: boolean
    copyright?: string
    links?: { title: string; url: string }[]
    social?: Record<string, { label: string; url: string }>
  }
  blog: {
    pageSize: number
  }
  home: HomeConfig
  search: {
    enabled: boolean
  }
  comment: {
    provider: 'waline'
    server: string
  }
  friends: FriendLink[]
}

export const config: Config = {
  site: {
    title: 'Byte-sized learner',
    author: 'Henry TSwe',
    description:
      'Father of two, educator, life-long learner, pragmatic programmer, footballer',
    lang: 'en',
    favicon: '/favicon/favicon.ico',
    avatar: '/assets/images/bio-photo.jpg',
    ogImage: '/og-card.svg',
    since: 2021,
    palette: 'ink',
    theme: 'system',
    titleDelimiter: ' · '
  },

  header: {
    menu: [
      { title: 'Blog', link: '/blog' },
      { title: 'Archives', link: '/archives' },
      { title: 'Tags', link: '/tags' },
      { title: 'About', link: '/about' }
    ]
  },

  // Article page views + site-wide visit counter. Left empty — no Waline
  // server is configured for this blog, so both counters stay disabled.
  pageview: {
    server: '',
    siteWide: false
  },

  footer: {
    showQuote: true,
    copyright: `© 2021 - ${new Date().getFullYear()} Henry TSwe`,
    links: [{ title: 'RSS', url: '/rss.xml' }],
    social: {
      github: { label: 'GitHub', url: 'https://github.com/4tee' },
      linkedin: { label: 'Linkedin', url: 'https://sg.linkedin.com/in/henrythetswe' }
    }
  },

  blog: {
    pageSize: 8
  },

  home: {
    hero: {
      tagline: 'Educator / Pragmatic programmer / Life-long learner',
      location: 'Singapore',
      about:
        'Father of two, educator, life-long learner, pragmatic programmer, footballer.\n\nI am not sure what I should write here. This is a personal site where I noted down things that interest me. It could be anything or everything I learn from my humble experiences.\n\nFinally, growth to me is not about the age, it is rather the colorful experiences that garnered over our lifetime. Have fun!',
      buttons: [{ title: 'More about me', link: '/about' }]
    },
    recentPosts: 5,
    education: [],
    skills: [],
    showTags: false,
    showFriends: false
  },

  search: {
    enabled: true
  },

  comment: {
    provider: 'waline',
    // No Waline server — comments stay disabled.
    server: ''
  },

  friends: []
}
