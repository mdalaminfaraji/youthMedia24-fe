import type { Metadata } from 'next'
import './globals.css'
import ApolloProvider from '@/providers/clientProvider/apolloProvider'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import ThemeProvider from '@/providers/clientProvider/themeProvider'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'

export const metadata: Metadata = {
  title: 'Youth Media 24',
  description: 'Youth Media 24 - Your trusted source for news',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
    other: {
      rel: 'apple-touch-icon',
      url: '/favicon.png',
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
              {children}
              <ScrollToTopButton />
            </ThemeProvider>
          </ApolloProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
