import { prisma } from "@blogiq/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const headers = req.headers;
    try {

        const authHeader = headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization token is missing', tokenExpired: true },
                { status: 401, }
            );
        }

        const token = authHeader.split(' ')[1];
        let decodedToken: string | object;

        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!); // Ensure JWT_SECRET is set in your env
        } catch {
            return NextResponse.json(
                { message: "Invalid or expired token.", tokenExpired: true },
                { status: 401 }
            );
        }

        // Retrieve user ID from the token
        const userId = (decodedToken as { userId: string }).userId;

        if (!userId) {
            return NextResponse.json(
                { message: "User not found in token.", tokenExpired: true },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { draft } = body;


        if (!draft) {
            return NextResponse.json(
                { message: "Draft data are required." },
                { status: 400 }
            );
        }
        const newDraft = await prisma.draft.create({
            data: {
                userId,
                title: draft.title,
                subtitle: draft.subtitle,
                content: draft.content,
            },
        });

        return NextResponse.json({ message: "Draft saved successfully.", draft: newDraft }, { status: 200 });
    } catch (error) {
        console.error("Error saving draft:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
