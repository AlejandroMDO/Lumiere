import { Role } from "@prisma/client";
import DefaultSession from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    email?: string | null;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
  }
}