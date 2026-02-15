import NextAuth from "next-auth";
import authConfig from "./auth.config";

// MOCK AUTH for development/debug
// Always return a session with an Admin user
export const auth = () => {
    return Promise.resolve({
        user: {
            id: "mock-admin-id",
            name: "Admin User",
            email: "admin@example.com",
            image: null
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
};

export const handlers = {
    GET: () => new Response("Mock Auth GET"),
    POST: () => new Response("Mock Auth POST"),
};

export const signIn = () => Promise.resolve();
export const signOut = () => Promise.resolve();

// Original export commented out
/*
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    providers: [ ... ]
})
*/
