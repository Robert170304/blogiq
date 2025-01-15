import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export async function createSession(userId: string) {
    // const expirationTimeInSeconds = 60; // for development purpose
    const sessionToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    const session = await prisma.session.create({
        data: {
            sessionToken,
            userId,
            // expires: new Date(Date.now() + expirationTimeInSeconds * 1000), // 1 minute for development purpose
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
    });

    return session;
}