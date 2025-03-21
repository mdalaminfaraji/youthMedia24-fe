'use client'

import { Box, Button, Container, Typography } from '@mui/material'
// import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const NotFound = () => {
  const router = useRouter()

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        {/* <Image
          src="/404.svg"
          alt="404 Not Found"
          width={400}
          height={300}
          style={{ marginBottom: '2rem' }}
        /> */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxWidth: '600px',
          }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.back()}
            sx={{ px: 4 }}
          >
            Go Back
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            href="/"
            sx={{ px: 4 }}
          >
            Home Page
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default NotFound
