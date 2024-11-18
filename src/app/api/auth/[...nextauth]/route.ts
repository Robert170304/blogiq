import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            },
        },
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            console.log("🚀 ~ jwt ~ token, user:", token, user)
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            console.log("🚀 ~ session ~ session, token:", session, token)
            if (token) {
                session.user.id = token.sub; // Ensure `session.user.id` is populated
            }
            return session;
        },
    },
});

export { handler as POST, handler as GET }; // App Router requires explicit HTTP methods
