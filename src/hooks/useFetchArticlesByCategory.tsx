'use client'
import { useEffect } from 'react'
import { useArticleStore } from '@/store/useArticleStore'

const useFetchArticlesByCategory = (category: string) => {
  const { specificCategoryArticles, fetchArticleByCategory } = useArticleStore()

  useEffect(() => {
    fetchArticleByCategory(category)
  }, [category, fetchArticleByCategory])

  return specificCategoryArticles
}

export default useFetchArticlesByCategory
