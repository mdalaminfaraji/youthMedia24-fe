'use client'

import Image from 'next/image'
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Toolbar,
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
      href={`/bangla/${item?.category?.name}/${item?.banglaSlug}`}
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
        <CardMedia
          component="img"
          image={`${process.env.NEXT_PUBLIC_API_URL}${item?.cover[0]?.url}`}
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
              href={`/bangla/${item?.category?.name}/${item?.banglaSlug}`}
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
  const theme = useTheme()
  console.log(category)
  const specificCategoryArticles = useFetchArticlesByCategory(category)
  console.log(specificCategoryArticles)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Image
            src="/placeholder.svg?height=30&width=50"
            alt="Bangladesh Flag"
            width={50}
            height={30}
            priority
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              ml: 2,
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            বাংলাদেশ
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
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
      </Container>
    </Box>
  )
}
