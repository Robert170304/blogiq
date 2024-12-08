import { authConfig } from "@blogiq/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export { handler as POST, handler as GET }; // App Router requires explicit HTTP methods
