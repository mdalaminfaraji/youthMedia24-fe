import * as React from 'react'
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Skeleton,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { calculateTimeSince } from '@/utils/calculateTime'
import { Cover } from '@/store/useArticleStore'

interface Article {
  documentId?: string
  title: string
  banglaSlug: string
  category: {
    name: string
  }
  cover?: Cover[]
  createdAt: string
}

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const imageUrl =
    article && article.cover
      ? `${process.env.NEXT_PUBLIC_API_URL}${article.cover[0].url}`
      : ''
  const timeSinceCreated = article ? calculateTimeSince(article.createdAt) : ''
  console.log('Image URL:', imageUrl)

  const handleImageLoad = () => {
    console.log('Image loaded successfully')
    setImageLoaded(true)
  }

  const handleImageError = () => {
    console.log('Image failed to load')
    setImageError(true)
    setImageLoaded(true) // Hide skeleton on error
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        mx: 'auto',
        boxShadow: 'none',
        borderRadius: { xs: 1, sm: 2 },
        backgroundColor: 'white',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <Link
        href={`/bangla/${article?.category?.name}/${article?.banglaSlug}?documentId=${article?.documentId}`}
        passHref
        style={{
          textDecoration: 'none',
          color: 'inherit',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardActionArea
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              pt: '56.25%', // 16:9 aspect ratio
              backgroundColor: 'grey.100',
              borderRadius: { xs: 1, sm: 2 },
            }}
          >
            {!imageLoaded && (
              <Skeleton
                variant="rectangular"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 'inherit',
                }}
                animation="wave"
              />
            )}
            {imageUrl && !imageError && (
              <Image
                src={imageUrl}
                fill
                alt={article?.title || 'News Image'}
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                priority={false}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: { xs: 1.5, sm: 2 },
              '&:last-child': { pb: { xs: 1.5, sm: 2 } },
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                fontWeight: 600,
                lineHeight: 1.4,
                mb: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                minHeight: { xs: '2.8em', sm: '3em' },
              }}
            >
              {article?.title}
            </Typography>

            <Box sx={{ mt: 'auto' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                {timeSinceCreated} • {article?.category?.name}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}
