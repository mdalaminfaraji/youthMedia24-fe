'use client'
import React, { useEffect } from 'react'
import { useArticleStore } from '@/store/useArticleStore'
import { Container, Grid2, Box, Typography, Skeleton } from '@mui/material'
import NewsCard from '../common/newsCard'

const LoadingSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Box key={item} sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1, mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={20} />
      </Box>
    ))}
  </Box>
)

const CurrentNews = () => {
  const { articles, fetchArticles, loading } = useArticleStore()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Grid2
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          position: 'relative',
        }}
      >
        <Grid2
          container
          spacing={{ xs: 2, sm: 3 }}
          size={{ xs: 12, md: 9 }}
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '1px',
              borderRight: '1px dashed',
              borderColor: 'divider',
              display: { xs: 'none', md: 'block' }
            }
          }}
        >
          {loading ? (
            <Grid2 size={12}>
              <LoadingSkeleton />
            </Grid2>
          ) : (
            <>
              {articles.map((article, index) => (
                <Grid2
                  size={{ xs: 12, sm: 6, lg: 4 }}
                  key={index}
                  sx={{
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
                    pb: { xs: 2, sm: 3 },
                    '&:last-of-type': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <NewsCard article={article} />
                </Grid2>
              ))}
            </>
          )}
        </Grid2>

        <Grid2
          size={{ xs: 12, md: 3 }}
          sx={{
            pl: { md: 3 },
            position: 'relative'
          }}
        >
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} />
            </Box>
          ) : (
            <Box 
              sx={{ 
                position: 'sticky',
                top: 20,
                p: { xs: 2, sm: 3 },
                backgroundColor: 'grey.50',
                borderRadius: 2
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 }
                }}
              >
                Trending News
              </Typography>
              {/* Add your sidebar content here */}
            </Box>
          )}
        </Grid2>
      </Grid2>
    </Container>
  )
}

export default CurrentNews
