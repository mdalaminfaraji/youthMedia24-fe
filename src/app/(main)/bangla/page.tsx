import CurrentNews from '@/components/home/CurrentNews'
import Feature from '@/components/home/Feature'

import { Box } from '@mui/material'

export default function Home() {
  return (
    <Box sx={{ mx: 'auto' }}>
      <Box sx={{ mt: 3 }}>
        <Feature />
      </Box>
      <CurrentNews />
    </Box>
  )
}
