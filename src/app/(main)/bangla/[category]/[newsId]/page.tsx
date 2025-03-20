/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import {
  Box,
  Typography,
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

import BlockRendererClient from '@/components/BlockRenderer'
import ShareButton from '@/components/news/ShareButton'
import { Container } from '@mui/material'
import apolloClient from '@/lib/apolloClient'
import {
  GET_ARTICLES_WITH_SPECIFIC_CATEGORY,
  GET_MOST_VIEWED_ARTICLES,
  GET_SINGLE_ARTICLES,
} from '@/graphql/queries/articles'
import {
  Cover,
  NewsDetails,
  SpecificArticleByCategory,
} from '@/store/useArticleStore'
import Link from 'next/link'
import { formateDate } from '@/utils/urlHelper'
import { Metadata } from 'next'

type PageParams = {
  category: string
  newsId: string
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  params: Promise<PageParams>
  searchParams?: Promise<SearchParams>
}

type PageProps = Props
interface MostViewsArticles {
  documentId: string
  views: number
  banglaSlug: string
  title: string
  category: {
    name: string
  }
  cover: Cover[]
}
const RelatedNews = async (category: string) => {
  const { data } = await apolloClient.query({
    query: GET_ARTICLES_WITH_SPECIFIC_CATEGORY,
    variables: {
      locale: 'bn',
      filters: {
        category: {
          name: {
            containsi: category,
          },
        },
      },
    },
  })
  return data.articles
}
const newsDetailsData = async (documentId: string) => {
  const { data } = await apolloClient.query({
    query: GET_SINGLE_ARTICLES,
    variables: { documentId },
  })
  return data?.article
}
const MostViewsArticles = async () => {
  const { data } = await apolloClient.query({
    query: GET_MOST_VIEWED_ARTICLES,
    variables: {
      locale: 'bn',
    },
  })
  return data.articles
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const documentId = resolvedParams.newsId
  const data: any = await newsDetailsData(documentId as string)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  const fullUrl = `${baseUrl}/bangla/${data?.category?.name}/${data?.banglaSlug}`

  return {
    title: data?.title,
    description: data?.description,
    openGraph: {
      title: data?.title,
      description: data?.description,
      url: fullUrl,
    },
  }
}

const NewsDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params
  const { category, newsId } = resolvedParams
  const decodedCategory = decodeURIComponent(category)
  const decodedNewsId = decodeURIComponent(newsId)
  console.log(decodedNewsId)
  const relatedNewsData: SpecificArticleByCategory[] = await RelatedNews(
    decodedCategory
  )
  const newsData: NewsDetails = await newsDetailsData(decodedNewsId)
  console.log(newsData)

  const mostViewsData: MostViewsArticles[] = await MostViewsArticles()

  const getNewsUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}`
    }
    return ''
  }
  const newsUrl = getNewsUrl()

  const shareButtons = [
    {
      icon: <Facebook />,
      color: '#3b5998',
      label: 'Share on Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        newsUrl
      )}`,
    },
    {
      icon: <Twitter />,
      color: '#1DA1F2',
      label: 'Share on Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        newsUrl
      )}&text=${encodeURIComponent(newsData?.title)}`,
    },
    {
      icon: <WhatsApp />,
      color: '#25D366',
      label: 'Share on WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(
        newsData?.title
      )}%20${encodeURIComponent(newsUrl)}`,
    },
    {
      icon: <Email />,
      color: '#EA4335',
      label: 'Share via Email',
      url: `mailto:?subject=${encodeURIComponent(
        newsData?.title
      )}&body=${encodeURIComponent(newsUrl)}`,
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 } }}>
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
              {relatedNewsData.map((item, index) => {
                if (item.documentId === newsData.documentId) {
                  return null
                }
                return (
                  <Link
                    key={index}
                    href={`/bangla/${item?.category?.name}/${item.documentId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem
                      disablePadding
                      sx={{
                        mb: 1.5,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <ListItemText
                        primary={item.title}
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
                    {index < relatedNewsData.length - 1 && (
                      <Divider variant="fullWidth" component="li" />
                    )}
                  </Link>
                )
              })}
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
                  mr: 1,
                }}
              ></Box>{' '}
              {newsData?.category?.name}
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
              {newsData?.title}
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
                {formateDate(newsData?.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last modified: {formateDate(newsData?.updatedAt)}
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
                <ShareButton key={index} button={button} />
              ))}
            </Box>
            {newsData?.cover[0].url && (
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
                {/* ${process.env.NEXT_PUBLIC_API_URL} */}
                <Image
                  src={`${newsData?.cover[0].url}`}
                  alt="News article main image"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 75vw, 1200px"
                />
              </Box>
            )}

            {newsData?.content ? (
              <Box
                sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}
              >
                <BlockRendererClient content={newsData?.content} />
              </Box>
            ) : newsData?.newsContent ? (
              <Box
                sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: newsData.newsContent }}
              />
            ) : null}
          </Paper>
          <CommentsSection newsData={newsData} />
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
              {mostViewsData.slice(0, 6).map((item, index) => {
                if (item.documentId === newsData.documentId) {
                  return null
                }
                return (
                  <Link
                    href={`/bangla/${item?.category?.name}/${item.documentId}`}
                    key={index}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
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
                          {/* ${process.env.NEXT_PUBLIC_API_URL} */}
                          <Image
                            src={`${item.cover[0].url}`}
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
                    {index < mostViewsData.length - 1 && (
                      <Divider variant="fullWidth" component="li" />
                    )}
                  </Link>
                )
              })}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  )
}

export default NewsDetailsPage
