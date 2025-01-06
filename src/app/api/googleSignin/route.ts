import { createSession } from '@blogiq/lib/auth';
import { prisma } from '@blogiq/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const { id, email, name, picture, given_name, family_name, verified_email } = await req.json();
        // Check if user exists
        const findUser = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (!findUser) {
            // Create new user
            const user = await prisma.user.create({
                data: {
                    googleId: id,
                    email,
                    name: name,
                    firstName: given_name,
                    lastName: family_name,
                    verifiedEmail: verified_email, // Google verifies emails
                    image: picture,
                    accounts: {
                        create: {
                            id: id,
                            type: 'oauth',
                            provider: 'google',
                            providerAccountId: id,
                            refresh_token: null,
                            access_token: null, // Can add accessToken if needed
                            expires_at: null,
                            token_type: null,
                            scope: null,
                            id_token: null,
                            session_state: null,
                        },
                    },
                },
                include: { accounts: true }, // Ensure accounts are included
            });
            // Create session
            const session = await createSession(user.id);

            // Set a session cookie
            const response = NextResponse.json({
                message: "Sign-in successful",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    verifiedEmail: user.verifiedEmail, // Default false
                    image: user.image,
                },
                token: session.sessionToken,
            }, { status: 200 });

            response.cookies.set("sessionToken", session.sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return response;
        } else {
            // Check if the user has already signed up with Google or any other provider
            const existingAccount = findUser.accounts.find(account => account.provider !== 'google');
            if (existingAccount) {
                return NextResponse.json(
                    {
                        message: `This email is already registered using ${existingAccount.provider === "email" ? "email credentials" : existingAccount.provider}. Please use that method to sign in.`
                    }, { status: 400 });
            }
            // Optionally update user info if it changes
            const user = await prisma.user.update({
                where: { email },
                data: {
                    name: name,
                    image: picture,
                    firstName: given_name,
                    lastName: family_name,
                },
            });

            // Create session
            const session = await createSession(user.id);

            // Set a session cookie
            const response = NextResponse.json({
                message: "Sign-in successful",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    verifiedEmail: user.verifiedEmail, // Default false
                    image: user.image,
                },
                token: session.sessionToken,
            }, { status: 200 });

            response.cookies.set("sessionToken", session.sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return response;

        }

    } catch (error) {
        console.error('Google Sign-In Error:', error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}
