import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "@/lib/prismadb"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Invalid credentials")
                    }

                    console.log("[AUTH] Attempting login for:", credentials.email)
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string,
                        },
                    })

                    if (!user) {
                        console.log("[AUTH] User not found")
                        throw new Error("Invalid credentials")
                    }

                    if (!user.passwordHash) {
                        console.log("[AUTH] No password hash set for user")
                        throw new Error("Invalid credentials")
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash
                    )

                    if (!isCorrectPassword) {
                        console.log("[AUTH] Password mismatch")
                        throw new Error("Invalid credentials")
                    }

                    console.log("[AUTH] Login successful")
                    return user
                } catch (error) {
                    console.error("[AUTH] Error in authorize:", error)
                    throw error
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
})
