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
        console.log("🚀 ~ POST ~ existingUser:", existingUser)

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
        const newUser = await prisma.user.create({
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
        console.log("🚀 ~ POST ~ newUser:", newUser)

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
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_PASS,
            },
        });

        await transporter.sendMail({
            from: 'BlogIQ <thefastrobz@gmail.com>',
            to: email,
            subject: 'Verify your email - BlogIQ',
            html: `<p>Click the link to verify your email for successfully registering to BlogIQ: <a href="${link}">Verify Email</a></p>`,
        });

        // // Save session in database
        // const session = await createSession(newUser.id);

        // // Set a session cookie
        // const response = NextResponse.json({
        //     message: "Sign up successful",
        //     user: {
        //         id: newUser.id,
        //         email: newUser.email,
        //         name: newUser.name,
        //         firstName: newUser.firstName,
        //         lastName: newUser.lastName,
        //         verifiedEmail: newUser.verifiedEmail, // Default false
        //         image: newUser.image,
        //     },
        //     token: session.sessionToken,
        // }, { status: 200 });

        // response.cookies.set("sessionToken", session.sessionToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     path: "/",
        //     maxAge: 60 * 60 * 24 * 7, // 1 week
        // });

        // Return token to the client
        // return response;
        return NextResponse.json({ message: 'User registered. Check your email for verification link.', success: true }, { status: 200 });

    } catch (err) {
        console.error("Sign up error:", err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
