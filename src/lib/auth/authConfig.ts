import NextAuth from "next-auth";
// import PostgresAdapter from "@auth/pg-adapter"
// import { pool } from "../postgres";
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    // adapter: PostgresAdapter(pool),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    // pages: {
    //     signIn: "/signin"
    // },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        Nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token, id: user.id
                }
            }
            return token
        },
        async session({ session, token }) {
            console.log("session callback", { session, token })
            return {
                ...session, user: { ...session.user, id: token.id as string }
            }
        }
    }
})