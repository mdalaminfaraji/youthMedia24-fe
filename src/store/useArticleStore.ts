/* eslint-disable @typescript-eslint/no-explicit-any */

import { CREATE_COMMENT_MUTATION } from '@/graphql/mutation/comment'
import {
  GET_ALL_ARTICLES,
  GET_ARTICLES_BY_BANGLA_SLUG,
  GET_ARTICLES_WITH_SPECIFIC_CATEGORY,
  GET_MOST_VIEWED_ARTICLES,
  GET_SINGLE_ARTICLES,
} from '@/graphql/queries/articles'
import apolloClient from '@/lib/apolloClient'
import { create } from 'zustand'

export interface Cover {
  url: string
}

interface CreateCommentInput {
  article: string
  content: string
  user: string
}

interface Article {
  documentId: string
  description: string
  banglaSlug: string
  isTreanding: boolean
  cover: Cover[]
  createdAt: string
  title: string
  category: {
    name: string
  }
}
export interface SpecificArticleByCategory {
  documentId: string
  description: string
  banglaSlug: string
  title: string
  category: {
    name: string
  }
  cover: Cover[]
}

export interface Comment {
  documentId: string
  content: string
  createdAt: string
  user: {
    username: string
  }
}
export interface NewsDetails {
  documentId: string
  description: string
  banglaSlug: string
  title: string
  likes: number
  content: any
  category: {
    name: string
  }
  comments: Comment[]
  cover: Cover[]
  createdAt: string
  updatedAt: string
}
interface MostViewsArticles {
  documentId: string
  title: string
  banglaSlug: string

  views: number
  category: {
    name: string
  }
}
interface ArticleStore {
  articles: Article[]
  specificCategoryArticles: SpecificArticleByCategory[]
  newsDetails: NewsDetails[]
  specificArticle: NewsDetails | null
  mostViewsArticles: MostViewsArticles[]
  comments: Comment[]
  loading: boolean
  error: string | null
  locale: string
  fetchArticles: (locale?: string) => Promise<void>
  fetchArticleByCategory: (category: string) => Promise<void>
  fetchNewsDetails: (slug: string) => Promise<void>
  fetchArticleByDocumentId: (documentId: string) => Promise<void>
  fetchMostViewsArticles: () => Promise<void>
  createComment: (data: CreateCommentInput, locale: string) => Promise<void>
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  specificCategoryArticles: [],
  newsDetails: [],
  loading: false,
  error: null,
  specificArticle: null,
  mostViewsArticles: [],
  comments: [],
  locale: 'bn',
  fetchMostViewsArticles: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await apolloClient.query({
        query: GET_MOST_VIEWED_ARTICLES,
        variables: { locale: get().locale },
      })
      const mostViewsData = data.articles
      set({ mostViewsArticles: mostViewsData, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  fetchArticleByDocumentId: async (documentId: string) => {
    set({ loading: true, error: null })

    try {
      const { data } = await apolloClient.query({
        query: GET_SINGLE_ARTICLES,
        variables: { documentId },
      })
      const article = data.article
      set({
        specificArticle: article,
        comments: article?.comments,
        loading: false,
      })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  fetchNewsDetails: async (slug: string) => {
    set({ loading: true, error: null })

    console.log('slug:', slug)

    try {
      const { data } = await apolloClient.query({
        query: GET_ARTICLES_BY_BANGLA_SLUG,
        variables: {
          locale: get().locale,
          filters: {
            banglaSlug: {
              contains: slug,
            },
          },
        },
      })
      const articles = data.articles
      console.log(data.articles)
      set({ newsDetails: articles, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

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
  createComment: async (data: CreateCommentInput, locale: string) => {
    set({ loading: true, error: null })

    try {
      const response = await apolloClient.mutate({
        mutation: CREATE_COMMENT_MUTATION,
        variables: { data, locale },
      })
      console.log(response)
      const commentData = response.data.createComment

      set({ comments: [...get().comments, commentData], loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
}))
