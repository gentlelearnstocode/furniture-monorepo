import NextAuth from 'next-auth';
import type { NextMiddleware } from 'next/server';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);
export const proxy: NextMiddleware = auth as unknown as NextMiddleware;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
