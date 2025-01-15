import { prisma } from '@blogiq/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { addMinutes } from "date-fns";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true }
        });

        if (existingUser) {
            // Check if the user has already signed up with Google or any other provider
            const existingAccount = existingUser.accounts.find(account => account.provider !== 'email');
            if (existingAccount) {
                return NextResponse.json(
                    {
                        message: `This email is already registered using ${existingAccount.provider === "email" ? "credentials" : existingAccount.provider}. Please use that method to sign in.`
                    }, { status: 400 });
            }
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        await prisma.user.create({
            data: {
                firstName,
                lastName,
                verifiedEmail: false, // Default false
                name: `${firstName} ${lastName}`,
                email,
                accounts: {
                    create: {
                        type: 'credentials',
                        provider: 'email',
                        providerAccountId: hashedPassword,
                        refresh_token: null,
                        access_token: null,
                    },
                },
            },
        });

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
            html: `<p>Welcome to BlogIQ! Click the link to verify your email and complete your registration successfully: <a href="${link}">Verify Email</a></p>`,
        });

        return NextResponse.json({ message: 'User registered. Check your email for verification link.', success: true }, { status: 200 });

    } catch (err) {
        console.error("Sign up error:", err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
