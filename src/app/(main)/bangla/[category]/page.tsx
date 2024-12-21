import React from 'react'
import NewsPage from './_NewsCategorey'

const NewsCategoryHomePage = ({ params }: { params: { category: string } }) => {
  const { category } = params
  const decodedCategory = decodeURIComponent(category)
  console.log(decodedCategory)
  return <NewsPage category={decodedCategory} />
}

export default NewsCategoryHomePage
