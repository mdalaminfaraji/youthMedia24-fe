import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard'] // Add protected routes here
const authRoutes = ['/signin', '/signup']

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value

  // Redirect authenticated users away from auth routes
  if (authRoutes.includes(request.nextUrl.pathname)) {
    if (userCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect routes that require authentication
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!userCookie) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}
