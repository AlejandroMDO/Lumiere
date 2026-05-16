import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Instancia compartida del cliente Prisma
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email({ message: "Formato de correo inválido." }),
  password: z.string().min(8, { message: "Estructura de contraseña inválida." }),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Búsqueda directa en PostgreSQL bajo el modelo User
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null; 
        }

        // Comparación criptográfica en tiempo constante contra ataques de temporización
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role, // Inyección segura del rol enum
        };
      },
    }),
  ],
});