'use client'
import React, { useEffect } from 'react'
import { useArticleStore } from '@/store/useArticleStore'
import { Container, Box, Typography, Skeleton } from '@mui/material'
import NewsCard from '../common/newsCard'

const LoadingSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Box key={item} sx={{ mb: 3 }}>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: 1, mb: 1 }}
        />
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
        // px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 75%' },
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
              display: { xs: 'none', md: 'block' },
            },
          }}
        >
          {loading ? (
            <Box>
              <LoadingSkeleton />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              {articles.map((article, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: {
                      xs: '1 1 100%', // 1 card per row on extra small screens
                      sm: '1 1 calc(50% - 16px)', // 2 cards per row on small screens
                      md: '1 1 calc(33.333% - 16px)', // 3 cards per row on medium and larger screens
                    },
                    boxSizing: 'border-box',
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
                    paddingBottom: '16px',
                    '&:last-of-type': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <NewsCard article={article} />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 25%' },
            pl: { md: 3 },
            position: 'relative',
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
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, sm: 3 },
                }}
              >
                Trending News
              </Typography>
              {/* Add your sidebar content here */}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default CurrentNews
