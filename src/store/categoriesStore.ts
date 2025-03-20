/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  GET_ALL_CATEGORIES, 
  GET_CATEGORY_BY_ID 
} from '@/graphql/queries/categories'
import { 
  CREATE_CATEGORY_MUTATION, 
  UPDATE_CATEGORY_MUTATION, 
  DELETE_CATEGORY_MUTATION,
  PUBLISH_CATEGORY_MUTATION,
  UNPUBLISH_CATEGORY_MUTATION
} from '@/graphql/mutation/categories'
import apolloClient from '@/lib/apolloClient'
import { create } from 'zustand'

export interface Category {
  documentId: string
  name: string
  description: string
  locale: string
  status?: string
}

interface CategoryInput {
  name: string
  description: string
}

interface CategoryStore {
  categories: Category[]
  selectedCategory: Category | null
  loading: boolean
  error: string | null
  locale?: string
  fetchCategories: (locale?: string) => Promise<void>
  fetchCategoryById: (documentId: string) => Promise<void>
  createCategory: (data: CategoryInput, locale: string) => Promise<boolean>
  updateCategory: (documentId: string, data: CategoryInput, locale: string) => Promise<boolean>
  deleteCategory: (documentId: string) => Promise<boolean>
  publishCategory: (documentId: string) => Promise<boolean>
  unpublishCategory: (documentId: string) => Promise<boolean>
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  locale: 'bn',
  
  fetchCategories: async (locale?: string) => {
    set({ loading: true, error: null })
    const currentLocale = locale || get().locale
    
    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_CATEGORIES,
        variables: { locale: currentLocale },
        fetchPolicy: 'network-only'
      })
      set({ categories: data.categories, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  
  fetchCategoryById: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      const { data } = await apolloClient.query({
        query: GET_CATEGORY_BY_ID,
        variables: { documentId },
        fetchPolicy: 'network-only'
      })
      set({ selectedCategory: data.category, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
  
  createCategory: async (data: CategoryInput, locale: string) => {
    set({ loading: true, error: null })
    
    try {
      const response = await apolloClient.mutate({
        mutation: CREATE_CATEGORY_MUTATION,
        variables: {
          data,
          locale,
          status: 'PUBLISHED'
        }
      })
      
      // Add the new category to the list
      const newCategory = response.data.createCategory
      set({ 
        categories: [...get().categories, newCategory],
        loading: false 
      })
      
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  },
  
  updateCategory: async (documentId: string, data: CategoryInput, locale: string) => {
    set({ loading: true, error: null })
    
    try {
      const response = await apolloClient.mutate({
        mutation: UPDATE_CATEGORY_MUTATION,
        variables: {
          documentId,
          data,
          locale
        }
      })
      
      // Update the category in the list
      const updatedCategory = response.data.updateCategory
      const updatedCategories = get().categories.map(category => 
        category.documentId === documentId ? updatedCategory : category
      )
      
      set({ 
        categories: updatedCategories,
        selectedCategory: updatedCategory,
        loading: false 
      })
      
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  },
  
  deleteCategory: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      await apolloClient.mutate({
        mutation: DELETE_CATEGORY_MUTATION,
        variables: { documentId }
      })
      
      // Remove the category from the list
      const updatedCategories = get().categories.filter(
        category => category.documentId !== documentId
      )
      
      set({ 
        categories: updatedCategories,
        loading: false 
      })
      
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  },
  
  publishCategory: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      await apolloClient.mutate({
        mutation: PUBLISH_CATEGORY_MUTATION,
        variables: { documentId }
      })
      
      // Update the category status in the list
      const updatedCategories = get().categories.map(category => {
        if (category.documentId === documentId) {
          return { ...category, status: 'published' }
        }
        return category
      })
      
      set({ 
        categories: updatedCategories,
        loading: false 
      })
      
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  },
  
  unpublishCategory: async (documentId: string) => {
    set({ loading: true, error: null })
    
    try {
      await apolloClient.mutate({
        mutation: UNPUBLISH_CATEGORY_MUTATION,
        variables: { documentId }
      })
      
      // Update the category status in the list
      const updatedCategories = get().categories.map(category => {
        if (category.documentId === documentId) {
          return { ...category, status: 'draft' }
        }
        return category
      })
      
      set({ 
        categories: updatedCategories,
        loading: false 
      })
      
      return true
    } catch (err: any) {
      set({ error: err.message, loading: false })
      return false
    }
  }
}))
