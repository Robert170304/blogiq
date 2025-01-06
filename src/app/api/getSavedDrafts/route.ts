import { prisma } from "@blogiq/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    const headers = req.headers;
    console.log("🚀 ~ GET ~ headers:", headers)
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

        // Fetch drafts from the database
        const drafts = await prisma.draft.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                title: true,
                subtitle: true,
                content: true,
                createdAt: true,
            }
        });

        return NextResponse.json({ message: "Drafts fetched successfully.", drafts }, { status: 200 });
    } catch (error) {
        console.error("Error getting drafts:", error);
        return NextResponse.json({ message: "Internal Se2e2erver Error" }, { status: 500 });
    }
}
