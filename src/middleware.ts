import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

    if (isAuthPage) {
        if (isLoggedIn) {
            // return Response.redirect(new URL("/dashboard", req.url))
            // ALLOW ACCESS TO LOGIN/REGISTER EVEN IF LOGGED IN (To fix loop)
        }
        return
    }

    if (!isLoggedIn) {
        let callbackUrl = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            callbackUrl += req.nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, req.url))
    }
})

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
}
