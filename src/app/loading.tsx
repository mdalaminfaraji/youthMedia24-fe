'use client'

import React from 'react'
import { Box, Typography, keyframes } from '@mui/material'

const wave = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const GlobalLoading = () => {
  const text = 'Youth Media 24'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{
          display: 'flex',
          gap: '4px',
        }}
      >
        {text.split('').map((char, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              display: 'inline-block',
              animation: `${wave} 1s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
              color: getRandomColor(),
            }}
          >
            {char}
          </Box>
        ))}
      </Typography>
    </Box>
  )
}

export default GlobalLoading
