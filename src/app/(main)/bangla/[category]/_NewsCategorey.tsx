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

// Types
interface NewsItem {
  category: string
  title: string
  description?: string
  image: string
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
        image={item.image}
        alt={item.title}
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
        <Typography variant="overline" color="primary" sx={{ fontWeight: 600 }}>
          {item.category}
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
          {item.title}
        </Typography>
        {item.description && (
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
            {item.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default function NewsPage() {
  const theme = useTheme()

  const featuredNewsItems = [
    {
      category: 'বাংলাদেশ',
      title:
        'জুলাই গণহত্যায় বিচারে বাংলাদেশ চাইলে সহায়তা দিতে প্রস্তুত আন্তর্জাতিক অপরাধ আদালত',
      description:
        'কোর্ট প্রেফেরারি পরোয়ানা ইস্যু করবে কি-না জানতে চাইলে এসা মনাই এই জানান, "সবই তথ্য-প্রমাণের ভিত্তিতে আবেদন করা হয়। প্রধান কৌশলীর অফিস থেকে আবেদন করা হয়। প্রেফেরারি পরোয়ানা জারি না হওয়ায়...',
      image: '/images/ict.jpg?height=400&width=600',
    },
    {
      category: 'বাংলাদেশ',
      title:
        'যাত্রী সংকটে কাল সেপ্টেম্বরে যাচ্ছে না পটুয়াখালী জাহাজ, ১ ডিসেম্বর থেকে চলবে',
      image: '/images/stmartin.jpg?height=200&width=300',
    },
    {
      category: 'বাংলাদেশ',
      title: 'দেশবাসীকে শুভ শারদীয় আশ্বিন প্রধান উপদেষ্টার',
      image: '/placeholder.svg?height=200&width=300',
    },
  ]

  const newsItems = [
    {
      category: 'বাংলাদেশ',
      title:
        'বিজেপি নেতার হুঙ্কির মধ্যে বেনাপোলে স্বাভাবিক ভাবে-বাংলাদেশ বাণিজ্য ও যাতায়াত',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      category: 'বাংলাদেশ',
      title:
        'নবায়নযোগ্য জ্বালানিভিত্তিক বিদ্যুৎ কোম্পানিকে ১০ বছর শুল্কছাড় কর অব্যাহতি দিলো সরকার',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      category: 'বাংলাদেশ',
      title:
        'আইনজীবী সাইফুল হত্যা: হত্যাকাণ্ডের বিচার ও ইনসাফ নিশ্চিতের দাবিতে দিনভর উত্তাল চট্টগ্রাম',
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      category: 'বাংলাদেশ',
      title:
        'যমুনা নদীর উপর উভয়খণ্ডের অপেক্ষায় থাকা রেল সেতুর নাম পরিবর্তন হচ্ছে',
      image: '/placeholder.svg?height=200&width=300',
    },
  ]

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
          <Box sx={{ height: '100%' }}>
            <NewsCard item={featuredNewsItems[0]} isFeatured={true} />
          </Box>
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
            {featuredNewsItems.slice(1).map((item, index) => (
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
          {newsItems.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}
