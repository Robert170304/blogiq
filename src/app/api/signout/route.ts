import { prisma } from '@blogiq/lib/prisma';
import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//     try {
//         const { sessionToken } = await req.json(); // Parse the sessionToken from the request body

//         if (!sessionToken) {
//             return NextResponse.json({ error: 'Session token is required' }, { status: 400 });
//         }

//         // Delete the session
//         await prisma.session.delete({
//             where: { sessionToken },
//         });

//         // Clear expired sessions from the database
//         const now = new Date();
//         const cleanupResult = await prisma.session.deleteMany({
//             where: {
//                 expires: {
//                     lt: now, // Delete sessions with expiration time less than the current time
//                 },
//             },
//         });


//         // Clear session cookie (optional, if you're using cookies)
//         const response = NextResponse.json({
//             message: 'Logout successful',
//             cleanupCount: cleanupResult.count, // Optionally include cleanup info
//         });
//         response.cookies.set('sessionToken', '', { httpOnly: true, maxAge: 0 });

//         return response;
//     } catch (error) {
//         console.error('Logout error:', error);
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     }
// }


export async function POST(req: Request) {
    const headers = req.headers;

    try {
        const authHeader = headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authorization token is missing' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Delete the session associated with the authorization token
        await prisma.session.delete({
            where: { sessionToken: token },
        });

        // Cleanup expired sessions
        const now = new Date();
        const cleanupResult = await prisma.session.deleteMany({
            where: {
                expires: {
                    lt: now,
                },
            },
        });

        // Clear session cookie
        const response = NextResponse.json({
            message: 'Logout successful',
            cleanupCount: cleanupResult.count,
        });
        response.cookies.set('sessionToken', '', { httpOnly: true, maxAge: 0 });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}