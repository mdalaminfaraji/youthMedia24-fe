'use client'
import { Container, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Image from 'next/image'
import { useArticleStore } from '@/store/useArticleStore'
import { useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Helper function to calculate hours since creation
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

  useEffect(() => {
    fetchArticles() // Fetch only once on mount
  }, [fetchArticles])

  if (loading) return <p>Loading....</p>
  const article = articles[0]
  const coverUrl =
    article && article.cover ? `${API_URL}${article.cover.url}` : null
  const timeSinceCreated = article ? calculateTimeSince(article.createdAt) : ''
  return (
    <Container maxWidth="xl" sx={{ marginTop: 3, py: 3 }}>
      <Grid
        container
        spacing={2}
        sx={{ direction: { xs: 'column', md: 'row' } }}
      >
        <Grid size={{ xs: 12, md: 7 }} sx={{ position: 'relative' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            {article?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}
          >
            {article?.description}
          </Typography>
          <Box sx={{ position: 'absolute', bottom: '0' }}>
            {timeSinceCreated} | {article?.category?.name}
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', lg: 'flex-end' },
          }}
        >
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={article?.title || 'Image'}
              width={600}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Feature
