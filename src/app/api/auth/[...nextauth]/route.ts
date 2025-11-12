// app/api/auth/[...nextauth]/route.ts
import { googleLogin } from "@/modules/auth/services/auth.api";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/auth/error" },

  callbacks: {
    /** 1. Call your backend → get DB userId */
    async signIn({ user, account, profile }) {
      try {
        if (!account?.providerAccountId || !user.email) return false;

        const payload = {
          googleId: account.providerAccountId,
          name: user.name || (profile as any)?.name || "",
          email: user.email,
          image: user.image || (profile as any)?.picture || "",
        };

        const data = await googleLogin(payload);
        if (!data?.id) return false;

        // Save your DB userId under a custom key
        (user as any).backendId = data.id;
        (user as any).role = data.role;

        return true;
      } catch (e) {
        console.error("Google signIn error:", e);
        return false;
      }
    },

    /** 2. Pass DB id to JWT */
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.backendId = u.backendId;
        token.role = u.role;
      }
      return token;
    },

    /** 3. Expose DB id in session */
    async session({ session, token }) {
      if (token.backendId) {
        session.user = {
          ...session.user,
          id: token.backendId as string,
          role: token.role as string | undefined,
        } as typeof session.user & { id: string; role?: string };
      }
      return session;
    },

    /** 4. Redirect after login */
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/home`;
    },
  },
});

export { handler as GET, handler as POST };