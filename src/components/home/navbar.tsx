'use client'
import * as React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useCategoryStore } from '@/store/categoriesStore'
import Image from 'next/image'
import logo from '@/assests/youth24Logo.png'
import Link from 'next/link'
import { useAuth } from '@/providers/clientProvider/authProvider'
import { useRouter } from 'next/navigation'
import LoginIcon from '@mui/icons-material/Login'
import CustomDropdown from '@/components/common/CustomDropdown'
import CustomAvatar from '@/components/common/CustomAvatar'
import CustomMobileMenu from '@/components/common/CustomMobileMenu'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const ResponsiveAppBar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const { categories, fetchCategories, loading } = useCategoryStore()
  const { user, logout } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    fetchCategories('bn')
  }, [fetchCategories])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget)
  const handleCloseNavMenu = () => setAnchorElNav(null)
  const handleCloseUserMenu = () => {}

  const handleLogout = async () => {
    await logout()
    router.push('/signin')
  }

  const handleSignIn = () => {
    router.push('/signin')
  }

  // Create dropdown menu items
  const dropdownItems = settings.map((setting) => ({
    label: setting,
    onClick: setting === 'Logout' ? handleLogout : handleCloseUserMenu,
    isLogout: setting === 'Logout',
  }))

  if (loading) {
    return (
      <AppBar position="sticky" sx={{ backgroundColor: '#00141A' }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: '70px', md: '80px' }, gap: 2 }}
          >
            <Skeleton
              variant="rectangular"
              width={50}
              height={50}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
            <Skeleton
              variant="text"
              width={200}
              height={40}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {[1, 2, 3, 4].map((item) => (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  width={100}
                  height={40}
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </Box>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
          </Toolbar>
        </Container>
      </AppBar>
    )
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#00141A',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: '60px', md: '80px' },
            justifyContent: 'space-between',
          }}
        >
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="medium"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo Section - Responsive */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 },
              justifyContent: { xs: 'center', md: 'flex-start' },
              ml: { xs: -4, md: 0 },
              textDecoration: 'none',
            }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={isMobile ? 35 : 50}
              height={isMobile ? 35 : 50}
              style={{ borderRadius: '8px' }}
            />
            <Typography
              variant={isMobile ? 'subtitle1' : 'h5'}
              sx={{
                ml: { xs: 1, md: 2 },
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
              }}
            >
              YOUTHMEDIA24
            </Typography>
          </Box>

          {/* Mobile Menu */}
          <CustomMobileMenu
            isOpen={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            categories={categories}
            anchorEl={anchorElNav}
          />

          {/* Desktop Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category?.documentId}
                href={`/bangla/${category?.name}`}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    color: 'white',
                    display: 'block',
                    textTransform: 'capitalize',
                    py: 1,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {category?.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <CustomDropdown
                items={dropdownItems}
                trigger={
                  <CustomAvatar
                    alt={user.displayName || 'User'}
                    src={user.photoURL || ''}
                    size={isMobile ? 'small' : 'medium'}
                  />
                }
                mobileView={isMobile}
              />
            ) : (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleSignIn}
                sx={{
                  backgroundColor: '#ff4d4d',
                  '&:hover': {
                    backgroundColor: '#e60000',
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 2,
                  py: 1,
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
