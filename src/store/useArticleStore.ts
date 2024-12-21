/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GET_ALL_ARTICLES,
  GET_ARTICLES_WITH_SPECIFIC_CATEGORY,
} from '@/graphql/queries/articles'
import apolloClient from '@/lib/apolloClient'
import { create } from 'zustand'

export interface Cover {
  url: string
}

interface Article {
  documentId: string
  description: string
  cover: Cover[]
  createdAt: string
  title: string
  category: {
    name: string
  }
}
interface SpecificArticleByCategory {
  documentId: string
  description: string
  banglaSlug: string
  title: string
  category: {
    name: string
  }
  cover: Cover[]
}

interface ArticleStore {
  articles: Article[]
  specificCategoryArticles: SpecificArticleByCategory[]
  loading: boolean
  error: string | null
  locale: string
  fetchArticles: (locale?: string) => Promise<void>
  fetchArticleByCategory: (category: string) => Promise<void>
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  specificCategoryArticles: [],
  loading: false,
  error: null,
  locale: 'bn',

  fetchArticles: async (locale?: string) => {
    set({ loading: true, error: null })
    const currentLocale = locale || get().locale

    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_ARTICLES,
        variables: { locale: currentLocale },
      })
      set({ articles: data.articles, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  fetchArticleByCategory: async (category: string) => {
    set({ loading: true, error: null })

    try {
      const { data } = await apolloClient.query({
        query: GET_ARTICLES_WITH_SPECIFIC_CATEGORY,
        variables: {
          locale: get().locale,
          filters: {
            category: {
              name: {
                containsi: category,
              },
            },
          },
        },
      })
      const articles = data.articles
      set({ specificCategoryArticles: articles, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
}))
