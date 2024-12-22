'use client'
import Image from 'next/image'
import {
  Box,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material'
import { Facebook, Twitter, WhatsApp, Email } from '@mui/icons-material'
import CommentsSection from '@/components/news/CommentsSection'
import { useArticleStore } from '@/store/useArticleStore'
import { useEffect } from 'react'

import BlockRendererClient from '@/components/BlockRenderer'
interface NewsParams {
  newsSlug: string
  newsCategory: string
}

export default function NewsPage({ newsSlug, newsCategory }: NewsParams) {
  // console.log('News Slug:', newsSlug)
  console.log('News Category:', newsCategory)
  const { newsDetails, fetchNewsDetails, loading } = useArticleStore()
  useEffect(() => {
    fetchNewsDetails(newsSlug)
  }, [fetchNewsDetails, newsSlug])
  // console.log(newsDetails)
  const shareButtons = [
    { icon: <Facebook />, color: '#3b5998', label: 'Share on Facebook' },
    { icon: <Twitter />, color: '#1DA1F2', label: 'Share on Twitter' },
    { icon: <WhatsApp />, color: '#25D366', label: 'Share on WhatsApp' },
    { icon: <Email />, color: '#EA4335', label: 'Share via Email' },
  ]

  const relatedNews = [
    'বিমানবন্দরে সামরিক প্রধানের ওপর আইসিসির প্রেফেরারি পরোয়ানা কি প্রভাব ফেলবে?',
    'আমাকে রক্ষণশীল ইসলামি দেশের প্রধানমন্ত্রী হিসেবে বিবেচনা করুন: আব্দুল্লাহ',
    'বিএনপির সেনাখাতের ওপর প্রেফেরারি পরোয়ানা বিষয়ক প্রেস বিজ্ঞপ্তি কি প্রভাব ফেলবে?',
    'কিছু দেশ সেনা আদালতের ফায়দা তুলে প্রেফেরারি পরোয়ানা জারি করে না: এসা মনাই',
    'নেতাজিহাদ কমিটির এক তাজা বিবৃতি প্রেফেরারি পরোয়ানা নিয়ে কি বলল?',
  ]

  const mostViewed = [
    {
      title: 'উইঘুরে আইনজীবী হত্যার করা হয়েছে?',
      image: '/images/ict.jpg?height=60&width=60',
    },
    {
      title: 'পোশাকশিল্পের পর বাংলাদেশের পরবর্তী ',
      image: '/images/ict.jpg?height=60&width=60',
    },
    {
      title:
        'আত্মসমর্পণ করে জামিন পেলেন সামরিক সরবাহ হওয়া নির্বাহী ম্যাজিস্ট্রেট তাবাসসুম',
      image: '/images/ict.jpg?height=60&width=60',
    },
    {
      title: 'কুমিল্লা থেকে ঢেকার পথে এবার ফটিকছার শিকার হামলাত আন্তঃনগর পাড়ি',
      image: '/images/ict.jpg?height=60&width=60',
    },
    {
      title: 'বেনাপোলে স্বাভাবিক ভাবে-বাংলাদেশ বাণিজ্য ও যাতায়াত',
      image: '/images/ict.jpg?height=60&width=60',
    },
  ]

  if (loading) {
    return <Box>Loading.....</Box>
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 3 },
      }}
    >
      {/* Left Column */}
      <Box
        sx={{
          flex: { md: '0 0 25%' },
          order: { xs: 2, md: 1 },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="overline"
            component="div"
            sx={{ color: 'error.main', fontWeight: 'bold', mb: 1 }}
          >
            টিডিএস রিপোর্ট
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'error.main',
              borderBottom: '2px solid',
              borderColor: 'error.main',
              pb: 1,
            }}
          >
            RELATED NEWS
          </Typography>
          <List sx={{ p: 0 }}>
            {relatedNews.map((item, index) => (
              <>
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    mb: 1.5,
                    '&:last-child': { mb: 0 },
                  }}
                >
                  <ListItemText
                    primary={item}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 'medium',
                        color: 'text.primary',
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main',
                          cursor: 'pointer',
                        },
                      },
                    }}
                  />
                </ListItem>
                {index < mostViewed.length - 1 && (
                  <Divider variant="fullWidth" component="li" />
                )}
              </>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Middle Column (Main Content) */}
      <Box
        sx={{
          flex: { md: '0 0 50%' },
          order: { xs: 1, md: 2 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'error.main',
              display: 'inline-flex',
              alignItems: 'center',
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
              }}
            ></Box>
            Bangladesh
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            {newsDetails[0]?.title}
          </Typography>

          <Box
            sx={{
              my: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              27 November, 2024, 10:35 pm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last modified: 27 November, 2024, 11:15 pm
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              my: 2,
              flexWrap: 'wrap',
            }}
          >
            {shareButtons.map((button, index) => (
              <IconButton
                key={index}
                aria-label={button.label}
                sx={{
                  backgroundColor: button.color,
                  color: 'white',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: button.color,
                    opacity: 0.9,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {button.icon}
              </IconButton>
            ))}
          </Box>
          {newsDetails[0]?.cover[0].url && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 250, sm: 350, md: 400 },
                my: 3,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${newsDetails[0]?.cover[0].url}`}
                alt="News article main image"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 75vw, 1200px"
              />
            </Box>
          )}

          {newsDetails[0]?.content && (
            <Box
              sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}
            >
              <BlockRendererClient content={newsDetails[0]?.content} />
            </Box>
          )}
        </Paper>
        <CommentsSection />
      </Box>

      {/* Right Column */}
      <Box
        sx={{
          flex: { md: '0 0 25%' },
          order: { xs: 3, md: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
            mr: { xs: 0, md: 6 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'error.main',
              fontWeight: 'bold',
              mb: 2,
              borderBottom: '2px solid',
              borderColor: 'error.main',
              pb: 1,
            }}
          >
            MOST VIEWED
          </Typography>
          <List sx={{ width: '100%', p: 0 }}>
            {mostViewed.map((item, index) => (
              <Box key={index}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: 'medium',
                        lineHeight: 1.4,
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </ListItem>
                {index < mostViewed.length - 1 && (
                  <Divider variant="fullWidth" component="li" />
                )}
              </Box>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  )
}
