'use client'
import * as React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fade,
  Skeleton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useCategoryStore } from '@/store/categoriesStore'
import Image from 'next/image'
import logo from '@/assests/youth24Logo.png'
import Link from 'next/link'
import { useAuth } from '@/providers/clientProvider/authProvider'
import { useRouter } from 'next/navigation'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const ResponsiveAppBar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const { categories, fetchCategories, loading } = useCategoryStore()
  const { logout } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    fetchCategories('bn')
  }, [fetchCategories])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget)
  const handleCloseNavMenu = () => setAnchorElNav(null)
  const handleCloseUserMenu = () => setAnchorElUser(null)

  const handleLogout = async () => {
    handleCloseUserMenu()
    await logout()
    router.push('/signin')
  }

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
              '&:hover': {
                opacity: 0.9,
              },
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
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            TransitionComponent={Fade}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiPaper-root': {
                backgroundColor: '#001f2b',
                borderRadius: '8px',
                marginTop: '8px',
                width: '250px',
                maxHeight: '80vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                },
              },
            }}
          >
            <Box
              sx={{
                py: 1,
                px: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: '0.9rem',
                  opacity: 0.7,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Categories
              </Typography>
            </Box>
            {categories.map((category) => (
              <MenuItem
                key={category.documentId}
                onClick={handleCloseNavMenu}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Link
                  href={`/bangla/${category?.name}`}
                  style={{
                    textDecoration: 'none',
                    color: '#fff',
                    width: '100%',
                    padding: '4px 16px',
                    fontSize: '0.95rem',
                  }}
                >
                  {category?.name}
                </Link>
              </MenuItem>
            ))}
          </Menu>

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
          <Box sx={{ ml: { xs: 1, md: 2 } }}>
            <Tooltip title="Open settings" arrow>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Avatar
                  alt="User Avatar"
                  src="/static/images/avatar/2.jpg"
                  sx={{
                    width: { xs: 35, md: 40 },
                    height: { xs: 35, md: 40 },
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  backgroundColor: '#001f2b',
                  borderRadius: '8px',
                  minWidth: '200px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
              }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              TransitionComponent={Fade}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === 'Logout' ? handleLogout : handleCloseUserMenu
                  }
                  sx={{
                    color: '#fff',
                    '&:hover': {
                      backgroundColor:
                        setting === 'Logout'
                          ? 'rgba(255, 0, 0, 0.1)'
                          : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: 'center',
                      color: setting === 'Logout' ? '#ff4d4d' : '#fff',
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
