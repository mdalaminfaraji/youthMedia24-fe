import { Metadata } from 'next'
import NewsPage from './_NewsDetails'
import { Container } from '@mui/material'
// import apolloClient from '@/lib/apolloClient'
// import { GET_ARTICLES_BY_BANGLA_SLUG } from '@/graphql/queries/articles'

interface NewsDetailsPageProps {
  params: {
    category: string
    newsSlug: string
  }
}

// Generate Metadata
export async function generateMetadata({
  params,
}: NewsDetailsPageProps): Promise<Metadata> {
  const { category, newsSlug } = params

  // Decode the encoded newsSlug and category
  const decodedSlug = decodeURIComponent(newsSlug)
  const decodedCategory = decodeURIComponent(category)

  // Get the base URL on the server side
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  // Create the full URL path
  const fullUrl = `${baseUrl}/bangla/${decodedCategory}/${decodedSlug}`

  return {
    title: `News: ${decodedSlug.replace(/-/g, ' ')}`,
    description: `Read more about ${decodedSlug.replace(/-/g, ' ')}`,
    openGraph: {
      title: decodedSlug.replace(/-/g, ' '),
      description: `Detailed news about ${decodedSlug.replace(/-/g, ' ')}`,
      url: fullUrl,
    },
  }
}

const NewsDetailsPage = async ({ params }: NewsDetailsPageProps) => {
  const { category, newsSlug } = params
  // Decode the encoded newsSlug and category
  const decodedSlug = decodeURIComponent(newsSlug)
  const decodedCategory = decodeURIComponent(category)
  // const { data } = await apolloClient.query({
  //   query: GET_ARTICLES_BY_BANGLA_SLUG,
  //   variables: {
  //     locale: 'bn',
  //     filters: {
  //       banglaSlug: {
  //         contains: decodedSlug,
  //       },
  //     },
  //   },
  // })

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 } }}>
      <NewsPage newsSlug={decodedSlug} newsCategory={decodedCategory} />
    </Container>
  )
}

export default NewsDetailsPage
