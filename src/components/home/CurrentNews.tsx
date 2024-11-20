'use client'
import React, { useEffect } from 'react'
import { useArticleStore } from '@/store/useArticleStore'
import { Container, Grid2 } from '@mui/material'
import NewsCard from '../common/newsCard'

const CurrentNews = () => {
  const { articles, fetchArticles, loading } = useArticleStore()
  useEffect(() => {
    fetchArticles() // Fetch only once on mount
  }, [fetchArticles])

  if (loading) return <p>Loading....</p>

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Grid2
        container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{}}
      >
        <Grid2
          container
          rowSpacing={4}
          columnSpacing={{ xs: 0 }}
          size={{ xs: 12, sm: 9 }}
          sx={{}}
        >
          {articles.map((article, index) => (
            <Grid2
              size={{ xs: 12, md: 6, lg: 4 }}
              key={index}
              sx={{ borderBottom: 'dotted', borderWidth: '1px' }}
            >
              <NewsCard article={article} />
            </Grid2>
          ))}
        </Grid2>

        <Grid2
          size={{ xs: 12, sm: 3 }}
          sx={{ borderInline: 'dotted', borderWidth: '1px' }}
        >
          {' '}
          Sidebar Content
        </Grid2>
      </Grid2>
    </Container>
  )
}

export default CurrentNews
