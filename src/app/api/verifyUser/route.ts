import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@blogiq/lib/prisma';

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return NextResponse.json({ message: 'Unauthorized, token missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized, token missing' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User verified', isVerified: true }, { status: 200 });
    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json({ message: 'Token is invalid or expired', tokenExpired: true }, { status: 401 });
    }
}
