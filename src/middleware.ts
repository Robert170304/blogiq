import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Import jose library

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const sessionToken = req.cookies.get("sessionToken")?.value;
    console.log("🚀 ~ middleware ~ sessionToken:", sessionToken, url)
    const signInUrl = new URL("/signin", req.nextUrl.origin); // Absolute URL
    const publicRoutes = ["/", "/signin", "/signup"];
    const protectedRoutes = ["/drafts", "/api/saveGeneratedContent", "/api/getSavedDrafts"];

    // Allow public routes
    if (publicRoutes.some((route) => url.includes(route))) {
        return NextResponse.next();
    }

    // Check session for protected routes
    if (protectedRoutes.some((route) => url.includes(route))) {
        if (!sessionToken) {
            // Redirect to sign-in if no token
            return NextResponse.redirect(signInUrl);
        }

        // Validate session token

        try {
            // Validate JWT
            // Replace jwt.verify with jose's jwtVerify
            const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convert secret to Uint8Array
            const { payload } = await jwtVerify(sessionToken, secret);
            console.log("🚀 ~ middleware ~ decoded:", payload)
            // Check if token has expired
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            console.log("🚀 ~ middleware ~ currentTime > payload.exp:", currentTime, payload.exp)
            if (payload.exp && currentTime > payload.exp) {
                // Invalid token: redirect to sign-in
                const response = NextResponse.redirect(signInUrl);
                response.cookies.delete("sessionToken");
                response.cookies.set("loggedOut", "true", {
                    path: "/",
                    httpOnly: false, // Allow client-side access
                    maxAge: 5, // Short-lived cookie (5 seconds)
                });
                return response;
            }
        } catch (error) {
            // Handle invalid or expired JWT
            console.error("🚀 ~ JWT validation error:", error);
            const response = NextResponse.redirect(signInUrl);
            response.cookies.delete("sessionToken");
            response.cookies.set("loggedOut", "true", {
                path: "/",
                httpOnly: false,
                maxAge: 5,
            });
            return response;
        }
    }

    // If everything is fine, allow the request
    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"], // Applies middleware to all routes
};
