'use client'
import { Button } from '@mui/material'
import { useAuth } from '../../providers/clientProvider/authProvider'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/signin')
  }

  return (
    <Button
      onClick={handleLogout}
      sx={{
        color: '#fff',
        '&:hover': {
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
        },
      }}
    >
      Logout
    </Button>
  )
}
