/// <reference types="next-auth" />
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/database";
import { users } from "@repo/database/schema";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const result = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.username, username),
          });

          if (!user || !user.password) return null;
          if (!user.isActive) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              username: user.username as string,
              role: user.role as "admin" | "editor",
              isActive: user.isActive,
            };
          }
        }

        return null;
      },
    }),
  ],
});

export const auth: any = result.auth;
export const signIn: any = result.signIn;
export const signOut: any = result.signOut;
export const handlers: any = result.handlers;
