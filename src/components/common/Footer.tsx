'use client'
import React from 'react'
import {
  Box,
  Container,
  Typography,
  IconButton,
  Grid,
  Link,
  Divider,
  List,
  ListItem,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Image from 'next/image'
import logo from '@/assests/youth24Logo.png'
const Footer = () => {
  const [mounted, setMounted] = React.useState(false)
  const [currentYear, setCurrentYear] = React.useState('2024')
  React.useEffect(() => {
    setMounted(true)
    setCurrentYear(new Date().getFullYear().toString())
  }, [])
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  const categories = [
    'Bangladesh',
    'World',
    'Business',
    'Sports',
    'Entertainment',
    'Tech',
    'Lifestyle',
  ]

  const quickLinks = [
    'About Us',
    'Contact',
    'Advertise',
    'Privacy Policy',
    'Terms of Service',
  ]

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#00141A',
        color: 'white',
        pt: 6,
        pb: 3,
        borderTop: '3px solid #ff4d4d',
      }}
    >
      <Container maxWidth="xl">
        {/* Top Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Logo and About */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Image
                src={logo}
                alt="YouthMedia24 Logo"
                width={50}
                height={50}
                style={{ borderRadius: '8px' }}
              />
              <Typography
                variant="h5"
                sx={{
                  ml: 2,
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                YOUTHMEDIA24
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}
            >
              Your trusted source for the latest news and updates. We bring you
              comprehensive coverage of local and international events, ensuring
              you stay informed about what matters most.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#1976d2',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#1DA1F2',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#E1306C',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#FF0000',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Categories
            </Typography>
            <List dense sx={{ p: 0 }}>
              {categories.map((category) => (
                <ListItem
                  key={category}
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      color: '#ff4d4d',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    {category}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <List dense sx={{ p: 0 }}>
              {quickLinks.map((link) => (
                <ListItem
                  key={link}
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      color: '#ff4d4d',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    {link}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#ff4d4d' }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  123 News Street, Dhaka, Bangladesh
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#ff4d4d' }} />
                <Link
                  href="mailto:contact@youthmedia24.com"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ff4d4d' },
                  }}
                >
                  contact@youthmedia24.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#ff4d4d' }} />
                <Link
                  href="tel:+8801847416158"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ff4d4d' },
                  }}
                >
                  +880 1847416158
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsAppIcon sx={{ color: '#ff4d4d' }} />
                <Link
                  href="https://wa.me/8801847416158"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: '#ff4d4d' },
                  }}
                >
                  WhatsApp Us
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            &copy; {currentYear} YouthMedia24. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            A trusted source of news and entertainment
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
