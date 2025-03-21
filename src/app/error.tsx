'use client'

import { Box, Button, Container, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  React.useEffect(() => {
    // Log the error to your error reporting service
    console.error(error)
  }, [error])

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
        <Image
          src="/error.svg"
          alt="Error Occurred"
          width={400}
          height={300}
          style={{ marginBottom: '2rem' }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '4rem' },
            fontWeight: 700,
            color: 'error.main',
            mb: 2,
          }}
        >
          Oops! Something went wrong
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          We apologize for the inconvenience
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxWidth: '600px',
          }}
        >
          An unexpected error has occurred. Our team has been notified and is
          working to fix the issue.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={reset}
            sx={{ px: 4 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            href="/"
            sx={{ px: 4 }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Error
