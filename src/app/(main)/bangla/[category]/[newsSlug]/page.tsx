import Head from 'next/head'

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
      <div>
        <h1>News Details</h1>
        <p>Category: {category}</p>
        <p>News Slug: {decodedSlug}</p>
      </div>
    </>
  )
}

export default NewsDetailsPage
