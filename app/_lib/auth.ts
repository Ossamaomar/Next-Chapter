import { getUserByEmail } from "@/app/_services/auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getUserByEmail(user.email);

        if (!existingGuest) throw new Error("Create account first");
        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      const guest = await getUserByEmail(session.user.email);
      session.user.id = guest.id;
      return session;
    },
  },
});
