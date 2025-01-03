import CurrentNews from '@/components/home/CurrentNews'
import Feature from '@/components/home/Feature'

import { Box } from '@mui/material'

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return (
    <Box sx={{ mx: 'auto' }}>
      <Box sx={{ backgroundColor: '#e9e6d9', mt: 3 }}>
        <Feature />
      </Box>
      <CurrentNews />
    </Box>
  )
}
