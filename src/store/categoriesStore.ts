/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET_ALL_CATEGORIES } from '@/graphql/queries/categories'
import apolloClient from '@/lib/apolloClient'
import { create } from 'zustand'

interface Category {
  documentId: string
  name: string
  description: string
  locale: string
}

interface CategoryStore {
  categories: Category[]
  loading: boolean
  error: string | null
  locale?: string
  fetchCategories: (locale?: string) => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  locale: 'bn',
  fetchCategories: async (locale?: string) => {
    set({ loading: true, error: null })
    const currentLocale = locale || get().locale
    console.log(currentLocale)
    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_CATEGORIES,
        variables: { locale },
      })
      set({ categories: data.categories, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
}))
