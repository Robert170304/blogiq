import { getServerSession, type NextAuthOptions, } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";

export const authConfig: NextAuthOptions = {
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            // authorization: {
            //     params: {
            //         prompt: "consent",
            //         access_type: "offline",
            //         response_type: "code",
            //     },
            // },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    // callbacks: {
    //     async session({ session, token }) {
    //         session.user.id = token.id;
    //         return session;
    //     },
    //     async jwt({ token, user }: { token: JWT; user?: User }) {
    //         console.log("🚀 ~ jwt ~ token, user:", token, user)
    //         return token;
    //     },
    // },
    // cookies: {
    //     sessionToken: {
    //         name: process.env.NODE_ENV === "production"
    //             ? "__Secure-next-auth.session-token"
    //             : "next-auth.session-token",
    //         options: {
    //             httpOnly: true,
    //             sameSite: "lax",
    //             path: "/",
    //             secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    //         },
    //     },
    // },
    // useSecureCookies: process.env.NODE_ENV === "production",
    pages: {
        signIn: "/",
        error: "/",
    },
}

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("/")
}