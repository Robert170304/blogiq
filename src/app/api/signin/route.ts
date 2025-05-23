import { createSession } from '@blogiq/lib/auth';
import { prisma } from '@blogiq/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { addMinutes } from "date-fns";

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
        if (!user.verifiedEmail) {

            // Generate a verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const expires = addMinutes(new Date(), 30);  // Token expires in 30 minutes

            await prisma.verificationToken.create({
                data: {
                    identifier: email,
                    token: verificationToken,
                    expires,
                },
            });

            // send verification email
            const link = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}&identifier=${encodeURIComponent(email)}`;
            const transporter = nodemailer.createTransport({
                host: process.env.BREVO_SERVER_HOST,
                port: 587,
                auth: {
                    user: process.env.BREVO_SERVER_USER,
                    pass: process.env.BREVO_SERVER_PASS,
                },
            });

            await transporter.sendMail({
                from: `BlogIQ <${process.env.BREVO_EMAIL_FROM}>`,
                to: email,
                subject: 'Verify your email - BlogIQ',
                html: `<p>Click the link to verify your email to continue using BlogIQ: <a href="${link}">Verify Email</a></p>`,
            });
            return NextResponse.json({ message: 'Email unverified, Check your email inbox for a verification link to activate your account.', success: true }, { status: 403 });

        } else {
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
        }


    } catch (error) {
        console.error("Sign-in error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}
