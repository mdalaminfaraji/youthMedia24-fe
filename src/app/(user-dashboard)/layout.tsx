'use client'
import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
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
import PostAddIcon from '@mui/icons-material/PostAdd'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import CommentIcon from '@mui/icons-material/Comment'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import { Container, useMediaQuery } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/clientProvider/authProvider'
import Navbar from '@/components/home/navbar'
import Footer from '@/components/common/Footer'

const drawerWidth = 240

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const menuItems = [
  { text: 'Create News', icon: <PostAddIcon />, path: '/create-news' },
  { text: 'Manage News', icon: <NewspaperIcon />, path: '/user-news' },
  { text: 'My Comments', icon: <CommentIcon />, path: '/my-comments' },
  { text: 'Saved News', icon: <BookmarkIcon />, path: '/saved-news' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { text: 'Home', icon: <HomeIcon />, path: '/' },
]

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  const drawer = (
    <>
      <DrawerHeader>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 2 }}>
          <Avatar
            src={user?.photoURL || ''}
            alt={user?.displayName || ''}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="subtitle1" noWrap>
            {user?.displayName || 'User'}
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        })}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box component="header">
        <Navbar />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          mt: 2,
        }}
      >
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            anchor="left"
            open={isMobile ? open : false}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                position: 'relative',
                height: 'calc(100vh - 64px)', // Adjust for navbar height
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Box sx={{ display: 'flex', mb: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerOpen}
              sx={{
                mr: 2,
                display: { sm: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {children}
        </Container>
      </Box>

      <Box component="footer" sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  )
}
