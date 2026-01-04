import type { NextAuthConfig, DefaultSession } from "next-auth";
import "next-auth/jwt";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "editor";
      username: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "editor";
    username?: string;
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "editor";
    id?: string;
    username?: string;
    isActive?: boolean;
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");

      if (!isLoggedIn && !isOnLoginPage) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
        token.isActive = user.isActive;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "editor";
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
};
