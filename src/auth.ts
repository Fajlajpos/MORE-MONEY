import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prismadb"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    // adapter: PrismaAdapter(prisma), // Disabled for Mock Mode
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                })

                if (!user || !user?.passwordHash) {
                    throw new Error("Invalid credentials")
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                )

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials")
                }

                return user
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
})
