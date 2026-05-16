import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// 1. Configuración de parámetros semánticos para i18n
const locales = ["es", "en"];
const defaultLocale = "es";

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = !!req.auth;

  // --- CAPA 1: EXCLUSIONES CRÍTICAS DE ENRUTAMIENTO ---
  // Permitir la ejecución de NextAuth API, estáticos globales e imágenes sin alterar rutas
  const isAuthApi = pathname.startsWith("/api/auth");
  const isInternalNext = pathname.startsWith("/_next") || pathname.includes(".");
  
  if (isAuthApi || isInternalNext) {
    return NextResponse.next();
  }

  // --- CAPA 2: CONTROL DE INTERNACIONALIZACIÓN (i18n) ---
  // Verificar si la URL entrante ya posee un prefijo de idioma soportado (es/en)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Detectar idioma del navegador a través de los headers de la request
    const acceptLanguage = req.headers.get("accept-language") || "";
    const preferredLocale = acceptLanguage.split(",")[0]?.split("-")[0];
    
    // Asignar el idioma preferido si está soportado, de lo contrario usar el default (es)
    const targetLocale = locales.includes(preferredLocale) ? preferredLocale : defaultLocale;

    // Ejecutar una redirección limpia conservando el pathname original
    const redirectUrl = new URL(`/${targetLocale}${pathname}`, req.url);
    
    // Traspasar parámetros de búsqueda (query params) si existen
    nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(redirectUrl);
  }

  // --- CAPA 3: BLINDAJE DE SEGURIDAD (AUTH PRINCIPIO DE MÍNIMO PRIVILEGIO) ---
  // Expresión regular robusta para evaluar si es una ruta protegida de /cuenta bajo cualquier locale
  const isPrivateAccountRoute = /^\/([a-z]{2})\/cuenta/.test(pathname) || pathname.startsWith("/cuenta");

  if (isPrivateAccountRoute && !isLoggedIn) {
    // Extraer el locale exacto de la URL actual para no romper la navegación bilingüe
    const localeMatch = pathname.match(/^\/([a-z]{2})/);
    const currentLocale = localeMatch ? localeMatch[1] : defaultLocale;
    
    // Redirigir al formulario de login seguro del idioma que está navegando
    return NextResponse.redirect(new URL(`/${currentLocale}/cuenta`, req.url));
  }

  return NextResponse.next();
});

// Ajustamos el matcher estricto del perímetro para evaluar de forma eficiente todas las solicitudes del Sitemap
export const config = {
  matcher: [
    /*
     * Match de todas las rutas de la aplicación excepto las que contienen:
     * - api (endpoints tradicionales de backend)
     * - _next/static (archivos compilados de estilos/javascript de Aria)
     * - _next/image (optimización nativa de imágenes)
     * - favicon.ico, archivos con extensiones (.png, .webp, .svg, .spline)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.webp|.*\\.svg|.*\\.spline).*)",
  ],
};