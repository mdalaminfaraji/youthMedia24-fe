'use client'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material'
import { useState } from 'react'
import useFetchArticlesByCategory from '@/hooks/useArticles'
import { Cover } from '@/store/useArticleStore'
import Link from 'next/link'

// Types
interface NewsItem {
  documentId: string
  description: string
  title: string
  banglaSlug: string
  category: {
    name: string
  }
  cover: Cover[]
}

// Components
const NewsCard = ({
  item,
  isFeatured = false,
}: {
  item: NewsItem
  isFeatured?: boolean
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Link
      href={`/bangla/${item?.category?.name}/${item?.documentId}`}
      passHref
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: isFeatured && isLargeScreen ? 'row' : 'column',
          width: '100%',
          height: '100%',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            height={isFeatured ? 400 : 200}
            animation="wave"
          />
        )}
        {/* ${process.env.NEXT_PUBLIC_API_URL} */}
        <CardMedia
          component="img"
          image={`${item?.cover[0]?.url}`}
          alt={item?.title}
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: isFeatured && isLargeScreen ? '50%' : '100%',
            height: isFeatured ? (isLargeScreen ? 400 : 300) : 200,
            display: imageLoaded ? 'block' : 'none',
            objectFit: 'cover',
          }}
        />
        <CardContent
          sx={{
            flex: 1,
            p: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            {item?.category?.name}
          </Typography>
          <Typography
            variant={isFeatured ? 'h5' : 'h6'}
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            <Link
              href={`/bangla/${item?.category?.name}/${item?.documentId}`}
              passHref
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {item?.title}
            </Link>
          </Typography>
          {item?.description && isFeatured && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item?.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function NewsPage({ category }: { category: string }) {
  console.log(category)
  const specificCategoryArticles = useFetchArticlesByCategory(category)
  console.log(specificCategoryArticles)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'error.main',
            display: 'inline-flex',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Box
            component="span"
            sx={{
              borderBottom: '5px solid',
              borderColor: 'error.main',
              width: '50px',
              height: '10px',
              pb: 1,
              mr: 1,
            }}
          ></Box>{' '}
          {category}
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: '4px',
            backgroundColor: 'divider',
            borderRadius: 15,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '10%',
              height: '4px',
              backgroundColor: 'red',
              borderRadius: 15,
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          my: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 2fr',
            },
            mb: 4,
          }}
        >
          {specificCategoryArticles.length > 0 && (
            <Box sx={{ height: '100%' }}>
              <NewsCard item={specificCategoryArticles[0]} isFeatured={true} />
            </Box>
          )}

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
            }}
          >
            {specificCategoryArticles?.slice(1, 3)?.map((item, index) => (
              <NewsCard key={index} item={item} />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
              lg: '1fr 1fr 1fr 1fr',
            },
          }}
        >
          {specificCategoryArticles?.slice(3)?.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
