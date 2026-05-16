import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Validación de rutas dinámicas [locale] mediante expresiones regulares
  const isPrivateAccountRoute = /^\/([a-z]{2})\/cuenta/.test(nextUrl.pathname) || nextUrl.pathname.startsWith("/cuenta");
  const isAuthApi = nextUrl.pathname.startsWith("/api/auth");

  if (isAuthApi) {
    return NextResponse.next();
  }

  // Intercepción automática si intenta acceder sin sesión activa
  if (isPrivateAccountRoute && !isLoggedIn) {
    const localeMatch = nextUrl.pathname.match(/^\/([a-z]{2})/);
    const locale = localeMatch ? localeMatch[1] : "es";
    
    return NextResponse.redirect(new URL(`/${locale}/cuenta`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Matcher optimizado para excluir estáticos y procesos internos del framework
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.webp).*)"],
};