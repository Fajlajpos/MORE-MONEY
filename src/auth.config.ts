import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
    providers: [Credentials], // We just list the provider type here, full logic in auth.ts
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
} satisfies NextAuthConfig
