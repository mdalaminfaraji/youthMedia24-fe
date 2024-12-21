import { Box, Container } from '@mui/material'
import Navbar from '@/components/home/navbar'
import Footer from '@/components/common/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box component="header">
        <Navbar />
      </Box>
      <Container
        maxWidth="xl"
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        {children}
      </Container>
      <Box component="footer">
        <Footer />
      </Box>
    </Box>
  )
}
