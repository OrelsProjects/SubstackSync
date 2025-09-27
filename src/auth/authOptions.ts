import { AuthOptions, DefaultSession, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
          ].join(" "),
        },
      },
      httpOptions: {
        timeout: process.env.NODE_ENV === "development" ? 15000 : 3500,
      },
    }),
  ],
  callbacks: {
    async session({ session, token }): Promise<Session | DefaultSession> {
      const userId = token.sub as string;
      try {
        session.user.id = userId;
        return session;
      } catch (error) {
        if (process.env.NODE_ENV !== "development") {
          console.error("Error in session callback", {
            error,
            userId: userId,
          });
        }
        throw error;
      }
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt", // This is the default value
  },
  secret: process.env.NEXTAUTH_SECRET,
};
