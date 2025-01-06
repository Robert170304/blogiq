import { createSession } from '@blogiq/lib/auth';
import { prisma } from '@blogiq/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json(); // Parse request body

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required." },
                { status: 400 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (!user) {
            return NextResponse.json({ message: "User does not exist." }, { status: 404 });
        }

        const existingAccount = user.accounts.find(account => account.provider !== 'email');
        if (existingAccount) {
            return NextResponse.json({ message: `This email is already registered using ${existingAccount.provider}. Please sign in with ${existingAccount.provider}.` }, { status: 400 });
        }

        // Validate the password
        const isValidPassword = await bcrypt.compare(
            password,
            user.accounts[0]?.providerAccountId || ""
        );

        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid password." }, { status: 401 });
        }

        // Create a session for the user
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
        });

        response.cookies.set("sessionToken", session.sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
    } catch (error) {
        console.error("Sign-in error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}
