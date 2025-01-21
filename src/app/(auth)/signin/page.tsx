'use client'
import { useState } from 'react'
import {
  auth,
  googleProvider,
  facebookProvider,
  signInWithEmailAndPassword,
} from '../../../../firebase.config'
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user

      setCookie(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        }),
        {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        }
      )

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Sign in failed. Please try again.')
      }
      setLoading(false)
    }
  }

  const handleSocialSignin = async (
    provider: GoogleAuthProvider | FacebookAuthProvider
  ) => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      setCookie(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
        {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        }
      )

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Social sign in failed. Please try again.')
      }
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 1,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleEmailSignin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => handleSocialSignin(googleProvider)}
          sx={{ mb: 2 }}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => handleSocialSignin(facebookProvider)}
        >
          Sign in with Facebook
        </Button>
      </Box>
    </Box>
  )
}
