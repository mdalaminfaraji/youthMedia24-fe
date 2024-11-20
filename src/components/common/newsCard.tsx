import * as React from 'react'
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Box,
} from '@mui/material'
import Link from 'next/link'
import { calculateTimeSince } from '../../../utils/calculateTime'
import Image from 'next/image'

interface Article {
  documentId?: string
  title: string
  category: {
    name: string
  }
  cover?: { url?: string }
  createdAt: string
}

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${article?.cover?.url}`
  const timeSinceCreated = article ? calculateTimeSince(article.createdAt) : ''
  console.log(imageUrl)
  console.log(article?.title)
  return (
    <Card
      sx={{
        width: { xs: '100%', md: 320, lg: 300, xl: 345 }, // Dynamically adjusts based on screen size
        mx: 'auto',
        boxShadow: 'none',
        borderRadius: { xs: 2, sm: 3 },
        backgroundColor: 'white',
      }}
    >
      <Link
        href={`/articles/${article?.documentId}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
        passHref
      >
        <CardActionArea>
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              pt: '56.25%', // 16:9 aspect ratio
            }}
          >
            {article && (
              <Image
                src={imageUrl}
                fill
                alt={article.title}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
              />
            )}
          </Box>

          <CardContent
            sx={{
              textAlign: 'center',
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              maxHeight: '8rem', // Limits height to 6rem
              overflow: 'hidden', // Ensures content does not extend beyond this height
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3, // Show up to 3 lines of text, wrapping as needed
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                fontSize: { xs: '1.2rem' },
                fontWeight: 'bold',
              }}
            >
              {article?.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>

      <CardActions sx={{ justifyContent: 'center', pb: { xs: 1, sm: 2 } }}>
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Adjust caption size based on screen
            pl: 2,
          }}
        >
          {timeSinceCreated} ago |{' '}
          <Link
            href={`/articles/${article?.category?.name}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {article?.category?.name}
          </Link>
        </Typography>
      </CardActions>
    </Card>
  )
}
