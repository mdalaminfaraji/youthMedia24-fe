'use client'
import { useState } from 'react'
import {
  auth,
  googleProvider,
  facebookProvider,
  createUserWithEmailAndPassword,
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
  Link,
} from '@mui/material'
const strapiLoginWithFirebase = async (idToken: string) => {
  try {
    const response = await fetch(
      'http://localhost:1337/api/auth/firebase/callback',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: idToken }),
      }
    )

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Strapi login failed.')
    console.log('Strapi Login Response:', data)
    return data
  } catch (error) {
    console.error('Strapi Login Error:', error)
    return null
  }
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
      const idToken = await user.getIdToken()
      if (!idToken) throw new Error('Failed to get ID token from Firebase.')

      // Send Firebase token to Strapi
      const strapiResponse = await strapiLoginWithFirebase(idToken)

      if (!strapiResponse || !strapiResponse.jwt) {
        throw new Error('Strapi authentication failed.')
      }

      // Set user cookie with Strapi JWT
      setCookie(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          jwt: strapiResponse.jwt, // Store Strapi JWT for authentication
        }),
        {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        }
      )

      console.log('User registered and logged in:', strapiResponse)
      router.push('/') // Redirect to homepage
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Sign up failed. Please try again.')
      }
      setLoading(false)
    }
  }

  const handleSocialSignup = async (
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
        setError('Social sign up failed. Please try again.')
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
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleEmailSignup}>
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
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => handleSocialSignup(googleProvider)}
          sx={{ mb: 2 }}
        >
          Sign up with Google
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => handleSocialSignup(facebookProvider)}
          sx={{ mb: 2 }}
        >
          Sign up with Facebook
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link href="/signin" color="primary">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
