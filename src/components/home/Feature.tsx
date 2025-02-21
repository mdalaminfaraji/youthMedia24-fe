'use client'
import { Container, Typography, Box, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Image from 'next/image'
import { useArticleStore } from '@/store/useArticleStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Helper function to calculate time since creation
const calculateTimeSince = (createdAt: string): string => {
  const createdDate = new Date(createdAt)
  const currentDate = new Date()
  const differenceInMs = currentDate.getTime() - createdDate.getTime()

  const seconds = Math.floor((differenceInMs / 1000) % 60)
  const minutes = Math.floor((differenceInMs / (1000 * 60)) % 60)
  const hours = Math.floor((differenceInMs / (1000 * 60 * 60)) % 24)
  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24))

  if (days > 0) return `${days}d ${hours}h ago`
  if (hours > 0) return `${hours}h ${minutes}m ago`
  if (minutes > 0) return `${minutes}m ${seconds}s ago`
  return `${seconds}s ago`
}

const Feature = () => {
  const { articles, fetchArticles, loading } = useArticleStore()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    fetchArticles() // Fetch only once on mount
  }, [fetchArticles])

  const article = articles[0]
  console.log(API_URL)
  const coverUrl = article && article.cover ? `${article.cover[0].url}` : null
  const timeSinceCreated = article ? calculateTimeSince(article.createdAt) : ''

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}
      >
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton
              variant="text"
              sx={{ fontSize: '3rem', width: '80%', mb: 2 }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: '1.1rem', width: '100%' }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: '1.1rem', width: '90%' }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: '1.1rem', width: '95%' }}
            />
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="text" sx={{ width: '200px' }} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton
              variant="rectangular"
              sx={{
                width: '100%',
                height: { xs: '200px', sm: '300px' },
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        // minHeight: { xs: '400px', sm: '500px', md:"auto" }
        boxShadow: { xs: 'none', sm: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          flexDirection: { xs: 'column-reverse', md: 'row' },
          alignItems: 'stretch',
        }}
      >
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              lineHeight: { xs: 1.3, sm: 1.2 },
              mb: { xs: 2, sm: 3 },
              cursor: 'pointer',
              opacity: 1,
              '&:hover': { opacity: 0.8 },
            }}
          >
            <Link
              href={`/bangla/${article?.category?.name}/${article?.documentId}`}
              passHref
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {' '}
              {article?.title}
            </Link>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: 1.8,
              mb: { xs: 3, sm: 4 },
              flex: 1,
            }}
          >
            {article?.description}
          </Typography>
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              // color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {timeSinceCreated} |{' '}
            <Link
              href={`/bangla/${article?.category?.name}`}
              passHref
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {article?.category?.name}
            </Link>
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {!imageLoaded && coverUrl && (
            <Skeleton
              variant="rectangular"
              sx={{
                width: '100%',
                height: { xs: '200px', sm: '300px' },
                borderRadius: 1,
              }}
            />
          )}
          {coverUrl && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '200px', sm: '300px' },
                borderRadius: 1,
                overflow: 'hidden',
                display: imageLoaded ? 'block' : 'none',
              }}
            >
              <Image
                src={coverUrl}
                alt={article?.title || 'Feature Image'}
                fill
                style={{
                  objectFit: 'cover',
                  maxWidth: '100%',
                  height: '100%',
                }}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Feature
