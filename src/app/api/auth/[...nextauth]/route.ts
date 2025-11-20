
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";


interface CustomSessionUser {
    githubUrl?: string;
    id: string;
    provider: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface CustomSession {
    user: CustomSessionUser;
    expires: string;
}

interface GitHubProfile {
    html_url?: string;
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        })
    ],

    callbacks: {
        async redirect({ url, baseUrl }) {
            if (url === '/api/auth/signin') return baseUrl
            return url
        },
        async jwt({ token, account, user, profile }) {
            if (account && user) {
                token.email = user.email
                token.picture = user.image
                token.name = user.name
                token.id = user.id

                token.provider = account.provider

                if (account.provider === 'github') {
                    const ghProfile = profile as GitHubProfile;
                    if (ghProfile.html_url) {
                        token.githubUrl = ghProfile.html_url;
                    }
                }
            }
            return token;
        },

        async session({ session, token }) {
            const email = token.email as string || undefined
            const customSession = session as CustomSession;

            customSession.user = customSession.user || {}
            customSession.user.email = email ?? null

            customSession.user.id = (token.id as string) ?? "";
            customSession.user.provider = token.provider as string;

            customSession.user.githubUrl = token.githubUrl as string  || undefined

            return customSession;
        },
    },
});

export { handler as GET, handler as POST };