import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    try {
        const now = new Date();

        // Delete expired sessions
        const result = await prisma.session.deleteMany({
            where: {
                expires: {
                    lt: now, // Delete where expiration is less than current time
                },
            },
        });

        return NextResponse.json({
            message: `${result.count} expired sessions removed.`,
        });
    } catch (error) {
        console.error("🚀 ~ Cleanup Error:", error);
        return NextResponse.json({ error: "Failed to clean up expired sessions." }, { status: 500 });
    }
}
