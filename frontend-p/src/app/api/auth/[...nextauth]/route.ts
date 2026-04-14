import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Jab user pehli baar login karega
      if (account && user) {
        try {
          // Backend (NestJS) ko call karke Role aur Refresh Token mangwao
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`, {
            email: user.email,
            name: user.name,
            image: user.image,
          });

          token.accessToken = response.data.accessToken;
          token.refreshToken = response.data.refreshToken;
          token.role = response.data.role; // e.g., 'ADMIN' or 'USER'
        } catch (error) {
          console.error("Backend Auth Error", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };