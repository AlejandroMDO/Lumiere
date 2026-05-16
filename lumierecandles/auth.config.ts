import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], 
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // Expiración a las 72 horas lógicas
  },
  pages: {
    signIn: "/cuenta", // Ruta del sitemap mapeada para el login
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as 'ADMIN' | 'CUSTOMER';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;