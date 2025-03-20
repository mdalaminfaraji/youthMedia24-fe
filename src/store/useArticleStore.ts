/* eslint-disable @typescript-eslint/no-explicit-any */

import { CREATE_COMMENT_MUTATION } from '@/graphql/mutation/comment'
import {
  DELETE_ARTICLE_MUTATION,
  PUBLISH_ARTICLE_MUTATION,
  UNPUBLISH_ARTICLE_MUTATION,
} from '@/graphql/mutation/article'
import {
  GET_ALL_ARTICLES,
  GET_ARTICLES_BY_BANGLA_SLUG,
  GET_ARTICLES_WITH_SPECIFIC_CATEGORY,
  GET_MOST_VIEWED_ARTICLES,
  GET_SINGLE_ARTICLES,
} from '@/graphql/queries/articles'
import apolloClient from '@/lib/apolloClient'
import { create } from 'zustand'
import { gql } from '@apollo/client'

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
  newsContent: any
  category: {
    name: string
    documentId?: string
  }
  comments: Comment[]
  cover: Cover[]
  createdAt: string
  updatedAt: string
  newsStatus?: string
  isTreanding?: boolean
  locale?: string
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
  adminArticles: AdminArticle[]
  comments: Comment[]
  loading: boolean
  error: string | null
  locale: string
  fetchArticles: (locale?: string) => Promise<void>
  fetchArticleByCategory: (category: string) => Promise<void>
  fetchNewsDetails: (slug: string) => Promise<void>
  fetchArticleByDocumentId: (documentId: string) => Promise<void>
  fetchMostViewsArticles: () => Promise<void>
  fetchAdminArticles: (locale?: string) => Promise<void>
  deleteArticle: (documentId: string) => Promise<boolean>
  publishArticle: (documentId: string) => Promise<boolean>
  unpublishArticle: (documentId: string) => Promise<boolean>
  createComment: (data: CreateCommentInput, locale: string) => Promise<void>
}

export interface AdminArticle {
  documentId: string
  title: string
  description: string
  newsStatus: string
  createdAt: string
  updatedAt: string
  locale: string
  views: number
  category: {
    name: string
    documentId: string
  }
  cover: Cover[]
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  specificCategoryArticles: [],
  newsDetails: [],
  loading: false,
  error: null,
  specificArticle: null,
  mostViewsArticles: [],
  adminArticles: [],
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
      await apolloClient.mutate({
        mutation: CREATE_COMMENT_MUTATION,
        variables: { data, locale },
      })

      // Refetch the article to get updated comments
      if (data.article) {
        await get().fetchArticleByDocumentId(data.article)
      }

      set({ loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  
  fetchAdminArticles: async (locale?: string) => {
    set({ loading: true, error: null })
    const currentLocale = locale || get().locale

    try {
      const { data } = await apolloClient.query({
        query: gql`
          query AdminArticles($locale: I18NLocaleCode) {
            articles(locale: $locale) {
              documentId
              title
              description
              newsStatus
              createdAt
              updatedAt
              locale
              views
              category {
                name
                documentId
              }
              cover {
                url
              }
            }
          }
        `,
        variables: { locale: currentLocale },
        fetchPolicy: 'network-only', // Don't use cache for admin operations
      })
      set({ adminArticles: data.articles, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  
  deleteArticle: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      await apolloClient.mutate({
        mutation: DELETE_ARTICLE_MUTATION,
        variables: { documentId },
      })
      
      // Update the admin articles list after deletion
      const updatedArticles = get().adminArticles.filter(
        article => article.documentId !== documentId
      )
      
      set({ adminArticles: updatedArticles, loading: false })
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  },
  
  publishArticle: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      await apolloClient.mutate({
        mutation: PUBLISH_ARTICLE_MUTATION,
        variables: { documentId },
      })
      
      // Update the article status in the local state
      const updatedArticles = get().adminArticles.map(article => {
        if (article.documentId === documentId) {
          return { ...article, newsStatus: 'published' }
        }
        return article
      })
      
      set({ adminArticles: updatedArticles, loading: false })
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  },
  
  unpublishArticle: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      await apolloClient.mutate({
        mutation: UNPUBLISH_ARTICLE_MUTATION,
        variables: { documentId },
      })
      
      // Update the article status in the local state
      const updatedArticles = get().adminArticles.map(article => {
        if (article.documentId === documentId) {
          return { ...article, newsStatus: 'draft' }
        }
        return article
      })
      
      set({ adminArticles: updatedArticles, loading: false })
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  }
}))
