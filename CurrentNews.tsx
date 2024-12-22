'use client'
import React, { useEffect } from 'react'
import { useArticleStore } from '@/store/useArticleStore'
import { Container, Box, Typography, Skeleton } from '@mui/material'
import NewsCard from '@/components/common/newsCard'
import Link from 'next/link'

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
  console.log(articles)
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
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
                    flex: '1 1 calc(33.333% - 16px)',
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
              <Box>
                {articles.map((article, index) => {
                  console.log(article)
                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      {article?.category?.name &&
                        article.banglaSlug &&
                        article?.isTreanding && (
                          <Link
                            href={`/bangla/${article?.category?.name}/${article.banglaSlug}`}
                            passHref
                          >
                            {article?.title}
                          </Link>
                        )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default CurrentNews
