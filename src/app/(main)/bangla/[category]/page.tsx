import React from 'react'
import NewsPage from './_NewsCategorey'

type PageParams = {
  category: string
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  params: Promise<PageParams>
  searchParams?: Promise<SearchParams>
}

type PageProps = Props

const NewsCategoryHomePage = async ({ params }: PageProps) => {
  const resolvedParams = await params
  const { category } = resolvedParams
  const decodedCategory = decodeURIComponent(category)
  console.log(decodedCategory)
  return <NewsPage category={decodedCategory} />
}

export default NewsCategoryHomePage
