// app/api/auth/auth.config.ts
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { sql } from "@/app/db/actions";

export const authConfig: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Save the access token to the database
        const expiryDate = new Date(Date.now() + account.expires_at! * 1000);
        await sql`
          INSERT INTO users (email, google_id, access_token, refresh_token, token_expiry, name)
          VALUES (${token.email}, ${account.providerAccountId}, ${account.access_token}, ${account.refresh_token}, ${expiryDate}, ${token.name})
          ON CONFLICT (google_id) DO UPDATE
          SET access_token = EXCLUDED.access_token,
              refresh_token = EXCLUDED.refresh_token,
              token_expiry = EXCLUDED.token_expiry;
        `;

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = expiryDate.getTime();
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};