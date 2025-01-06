import { createSession } from "@blogiq/lib/auth";
import { prisma } from "@blogiq/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token, identifier } = await req.json();

        const tokenRecord = await prisma.verificationToken.findUnique({
            where: {
                identifier_token: { identifier, token },
            },
        });

        if (!tokenRecord || tokenRecord.expires < new Date()) {
            return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { email: identifier },
            data: { verifiedEmail: true },
        });

        await prisma.verificationToken.delete({
            where: {
                identifier_token: { identifier, token },
            },
        });

        // Save session in database
        const session = await createSession(user.id);

        // Set a session cookie
        const response = NextResponse.json({
            message: "Email verified successfully!",
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
    catch (error) {
        console.error("🚀 ~ error", error);
        return NextResponse.json({ message: "Something went wrong! Please refresh the page." }, { status: 500 });

    }
};
