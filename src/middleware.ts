import NextAuth from "next-auth"
import authConfig from "./auth.config"

// Mock the auth function to always allow access for middleware purposes
// Since we replaced src/auth.ts with a mock, importing from there might be weird if it doesn't return the expected middleware-compatible `auth` property.
// Actually, in src/middleware.ts we are importing from "next-auth" directly in the original code? 
// Original: import NextAuth from "next-auth"; const { auth } = NextAuth(authConfig)
// We can just export a dummy middleware function.

export default function middleware(req: any) {
    return; // Allow request
}

export const config = {
    // Matcher that excludes static files and api routes if needed, but effectively we want to match nothing or allow everything.
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
