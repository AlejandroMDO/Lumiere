"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface FooterContainerProps {
  currentLocale: "es" | "en";
}

export default function FooterContainer({ currentLocale }: FooterContainerProps) {
    
  const params = useParams();
  const locale = params?.locale || "es";

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Intercepción atómica de formulario (Handoff para Amara Okafor)
  };

  return (
    <footer className="w-full bg-lumiere-cacao text-lumiere-crema py-16 px-20 border-t border-lumiere-ahumado/5 mt-auto">
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-8 items-start">
        
        {/* COL 1-4: Filosofía de Marca y Dirección de Narrativa */}
        <div className="col-span-4 flex flex-col space-y-6 text-left">
          <span className="font-serif text-xl tracking-[0.04em] select-none">LUMIÈRE</span>
          <p className="font-sans text-sm text-lumiere-crema/70 max-w-sm leading-relaxed tracking-[0.01em]">
            Una invitación a la pausa. Nuestras velas de soja vierten esencias honestas pensadas para acompañarte en el íntimo ritual de volver a casa.
          </p>
          <Link 
            href={`/${locale}/el-ritual`}
            className="font-sans text-xs underline decoration-1 underline-offset-4 tracking-wider uppercase opacity-80 hover:opacity-100 hover:text-lumiere-arena transition-all duration-300 w-fit"
          >
            Descubrir el Ritual
          </Link>
        </div>

        {/* COL 5-7: Enlaces Secundarios Estructurados */}
        <div className="col-span-3 flex flex-col space-y-4 text-left md:pl-8">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-lumiere-arena/80 select-none">Soporte</span>
          <nav className="flex flex-col space-y-3 text-sm text-lumiere-crema/80" aria-label="Enlaces de soporte">
            <Link href={`/${locale}/faqs`} className="hover:text-lumiere-arena transition-colors duration-300 w-fit">Preguntas Frecuentes</Link>
            <Link href={`/${locale}/contacto`} className="hover:text-lumiere-arena transition-colors duration-300 w-fit">Contacto</Link>
          </nav>
        </div>

        {/* COL 8-9: Documentación Legal Obligatoria */}
        <div className="col-span-2 flex flex-col space-y-4 text-left">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-lumiere-arena/80 select-none">Legal</span>
          <nav className="flex flex-col space-y-3 text-sm text-lumiere-crema/80" aria-label="Enlaces legales">
            <Link href={`/${locale}/legal/privacidad`} className="hover:text-lumiere-arena transition-colors duration-300 w-fit">Privacidad</Link>
            <Link href={`/${locale}/legal/terminos`} className="hover:text-lumiere-arena transition-colors duration-300 w-fit">Términos de Uso</Link>
          </nav>
        </div>

        {/* COL 10-12: Captura de Suscripción Sensorial Éterea */}
        <div className="col-span-3 flex flex-col space-y-4 text-left">
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-lumiere-arena/80 select-none">Boletín</span>
          <p className="font-sans text-sm text-lumiere-crema/70 leading-relaxed">
            Recibe luz en tu bandeja de entrada. Novedades y accesos exclusivos.
          </p>
          <form onSubmit={handleSubscribe} className="w-full pt-2 flex flex-col space-y-2" aria-label="Formulario de suscripción">
            <div className="relative border-b border-lumiere-crema/30 focus-within:border-lumiere-arena transition-colors duration-400 pb-2">
              <input 
                type="email" 
                required
                placeholder="Tu correo electrónico"
                className="w-full bg-transparent font-sans text-sm text-lumiere-crema placeholder-lumiere-crema/40 focus:outline-none pr-4"
                aria-label="Introduce tu dirección de correo electrónico"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-lumiere-crema/60 hover:text-lumiere-arena transition-colors duration-300"
                aria-label="Confirmar suscripción"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7m7.5-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>

      </div>
    </footer>
  );
}