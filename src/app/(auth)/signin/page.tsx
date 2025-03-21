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
import { authenticateWithStrapi } from '@/utils/strapi'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Container,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assests/youth24Logo.png'

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleEmailSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user

      // Authenticate with Strapi
      const strapiAuth = await authenticateWithStrapi({
        email: user.email!,
        uid: user.uid,
        username: user.email!.split('@')[0],
      })

      setCookie(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          jwt: strapiAuth.jwt,
          documentId: strapiAuth.user.documentId,
          username: user.email!.split('@')[0],
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
    provider: GoogleAuthProvider | FacebookAuthProvider,
    providerName: string
  ) => {
    try {
      setLoading(true)
      setError('')
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Authenticate with Strapi
      const strapiAuth = await authenticateWithStrapi({
        email: user.email!,
        uid: user.uid,
        username: user.displayName || user.email!.split('@')[0],
      })

      setCookie(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          jwt: strapiAuth.jwt,
          documentId: strapiAuth.user.documentId,
          username: user.displayName || user.email!.split('@')[0],
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
        setError(`${providerName} sign in failed. Please try again.`)
      }
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Box sx={{}}>
        <IconButton
          component={Link}
          href="/"
          sx={{
            color: '#fff',
            backgroundColor: 'black',
            '&:hover': {
              color: '#ff4d4d',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header with logo */}
          <Box
            sx={{
              bgcolor: '#00141A',
              color: 'white',
              p: 3,
              textAlign: 'center',
              borderBottom: '4px solid #ff4d4d',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
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
            <Typography variant="h5" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Sign in to continue to your account
            </Typography>
          </Box>

          {/* Form content */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleEmailSignin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 1,
                  mb: 2,
                }}
              >
                <MuiLink
                  component={Link}
                  href="/forgot-password"
                  underline="hover"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#ff4d4d',
                  '&:hover': {
                    backgroundColor: '#e60000',
                  },
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialSignin(googleProvider, 'Google')}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#4285F4',
                  color: '#4285F4',
                  '&:hover': {
                    borderColor: '#4285F4',
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                  },
                  textTransform: 'none',
                }}
              >
                Sign in with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialSignin(facebookProvider, 'Facebook')}
                disabled={loading}
                startIcon={<FacebookIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#3b5998',
                  color: '#3b5998',
                  '&:hover': {
                    borderColor: '#3b5998',
                    backgroundColor: 'rgba(59, 89, 152, 0.04)',
                  },
                  textTransform: 'none',
                }}
              >
                Sign in with Facebook
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <MuiLink
                  component={Link}
                  href="/signup"
                  underline="hover"
                  sx={{ fontWeight: 'bold', color: '#ff4d4d' }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
