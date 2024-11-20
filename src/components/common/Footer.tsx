// components/Footer.js
import React from 'react'
import {
  Box,
  Container,
  Typography,
  IconButton,
  Grid,
  Link,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ bgcolor: '#00141A', color: 'white', py: 2 }}>
      {/* Top Bar */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            py: 2,
          }}
        >
          <Box>
            <Typography variant="body2">EMAIL US</Typography>
            <Link
              href="mailto:contact@tbsnews.net"
              sx={{
                color: 'white',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              contact@tbsnews.net
            </Link>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">FOLLOW US</Typography>
            <Box>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: '#1976d2' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: '#E1306C' } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', '&:hover': { color: '#FF0000' } }}
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2">WHATSAPP</Typography>
            <Link
              href="tel:+8801847416158"
              sx={{
                color: 'white',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              +880 1847416158
            </Link>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Grid
          container
          spacing={2}
          sx={{
            pt: 2,
            alignItems: 'center',
          }}
        >
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              The Business Standard
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Link
                href="/about-us"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                About Us
              </Link>
              <Link
                href="/contact-us"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Contact us
              </Link>
              <Link
                href="/sitemap"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sitemap
              </Link>
              <Link
                href="/advertisement"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Advertisement
              </Link>
              <Link
                href="/privacy-policy"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/comment-policy"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Comment Policy
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Copyright © {currentYear}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                The Business Standard All rights reserved
              </Typography>
              <Typography variant="body2">
                Technical Partner: RSI Lab
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
