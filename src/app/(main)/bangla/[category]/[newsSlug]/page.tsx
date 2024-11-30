import Head from 'next/head'
import NewsPage from './_NewsDetails'
import { Container } from '@mui/material'

interface NewsDetailsPageProps {
  params: {
    category: string
    newsSlug: string
  }
}

const NewsDetailsPage = ({ params }: NewsDetailsPageProps) => {
  const { category, newsSlug } = params

  // Decode the encoded newsSlug
  const decodedSlug = decodeURIComponent(newsSlug)

  console.log('Encoded Slug:', newsSlug)
  console.log('Decoded Slug:', decodedSlug)
  console.log('Category:', category)
  return (
    <>
      <Head>
        <title>{`News: ${decodedSlug.replace(/-/g, ' ')}`}</title>
        <meta name="description" content={`Read more about ${decodedSlug}`} />
        <meta property="og:title" content={decodedSlug.replace(/-/g, ' ')} />
        <meta
          property="og:description"
          content={`Detailed news about ${decodedSlug}`}
        />
      </Head>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 } }}>
        <NewsPage />
      </Container>
    </>
  )
}

export default NewsDetailsPage
