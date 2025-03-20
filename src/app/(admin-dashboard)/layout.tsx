'use client'
import React, { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PostAddIcon from '@mui/icons-material/PostAdd'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import CategoryIcon from '@mui/icons-material/Category'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import { useMediaQuery } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/clientProvider/authProvider'

const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#00141A',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  backgroundColor: '#001f2b',
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#001f2b',
    color: theme.palette.common.white,
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
}))

// Navigation items for the sidebar
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Add News', icon: <PostAddIcon />, path: '/add-news' },
  { text: 'Manage News', icon: <NewspaperIcon />, path: '/manage-news' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Users', icon: <PeopleIcon />, path: '/user-management' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Check if the screen is larger than 'md' breakpoint
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))

  // State for drawer open/close
  const [open, setOpen] = useState(isLargeScreen)

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(isLargeScreen)
  }, [isLargeScreen])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    if (!isLargeScreen) {
      setOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    // Redirect to login page
    window.location.href = '/signin'
  }

  // Function to check if a nav item is active
  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Youth Media 24 Admin
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {user.displayName || 'Admin User'}
              </Typography>
              <Avatar
                alt={user.displayName || 'Admin User'}
                src={user.photoURL || ''}
                sx={{
                  width: 35,
                  height: 35,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <StyledDrawer
        variant={isLargeScreen ? 'permanent' : 'temporary'}
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              ml: 2,
              background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            YOUTHMEDIA24
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <List>
          {navItems.map((item) => (
            <Link
              href={item.path}
              key={item.text}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem
                disablePadding
                onClick={handleDrawerClose}
                sx={{
                  backgroundColor: isActive(item.path)
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemButton>
                  <ListItemIcon
                    sx={{ color: isActive(item.path) ? '#4fc3f7' : '#fff' }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: isActive(item.path) ? '#4fc3f7' : '#fff',
                      '& .MuiTypography-root': {
                        fontWeight: isActive(item.path) ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mt: 'auto' }} />

        <List>
          <ListItem disablePadding onClick={handleLogout}>
            <ListItemButton>
              <ListItemIcon sx={{ color: '#ff4d4d' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#ff4d4d' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          marginTop: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
