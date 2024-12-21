'use client'

import React, { useState, useEffect } from 'react'
import { Fab, Zoom, useScrollTrigger } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  })

  useEffect(() => {
    setIsVisible(trigger)
  }, [trigger])

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="small"
        aria-label="scroll back to top"
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  )
}

export default ScrollToTopButton
