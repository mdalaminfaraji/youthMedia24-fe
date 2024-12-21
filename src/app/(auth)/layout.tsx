import { Box, Container } from '@mui/material'

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
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
