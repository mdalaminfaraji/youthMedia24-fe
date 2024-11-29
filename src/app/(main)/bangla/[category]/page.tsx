import React from 'react'
import NewsPage from './_NewsCategorey'

const NewsCategoryHomePage = ({ params }: { params: { category: string } }) => {
  console.log(params)
  return <div><NewsPage/>
  </div>
}

export default NewsCategoryHomePage
