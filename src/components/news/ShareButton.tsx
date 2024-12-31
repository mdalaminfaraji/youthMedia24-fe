'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from '@mui/material'
import React from 'react'

const ShareButton = ({ key, button }: any) => {
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  return (
    <IconButton
      key={key}
      aria-label={button.label}
      onClick={() => handleShare(button.url)}
      sx={{
        backgroundColor: button.color,
        color: 'white',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: button.color,
          opacity: 0.9,
          transform: 'scale(1.05)',
        },
      }}
    >
      {button.icon}
    </IconButton>
  )
}

export default ShareButton
