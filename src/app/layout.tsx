import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/home/navbar'
import ApolloProvider from '@/providers/clientProvider/apolloProvider'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import ThemeProvider from '@/providers/clientProvider/themeProvider'
import Footer from '@/components/common/Footer'

export const metadata: Metadata = {
  title: 'Youth Media 24',
  description: 'Youth Media 24 - Your trusted source for news',
  icons: {
    icon: '/youth24Logo.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="">
        <AppRouterCacheProvider>
          <ApolloProvider>
            <ThemeProvider>
              {' '}
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
          </ApolloProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
