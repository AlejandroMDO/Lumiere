"use client";


import Link from "next/link";
import dynamic from "next/dynamic";


// Inyección diferida para proteger Core Web Vitals (FCP y LCP Guard)
const Spline3DLive = dynamic(() => import("./Spline3DContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-lumiere-crema rounded-lg" />
  )
});

interface HeroSectionProps {
  currentLocale: "es" | "en";
}

export default function HeroSection({ currentLocale }: HeroSectionProps) {
  return (
    <section 
      className="w-full h-[calc(100vh-80px)] bg-lumiere-crema relative overflow-hidden px-space-6"
      aria-label="Introducción Sensorial Lumière"
    >
      
      {/* 
        CAPA DE FONDO: Contenedor Spline 3D (Z-Index: 0)
        Ocupa el 100% de la sección de forma absoluta.
        SLOT_LUCA: Aquí se inyecta la máscara global Vignette ( mix-blend-mode ) 
        que sigue al puntero sobre el fondo 3D.
      */}
      <div 
        id="spline-background-root" 
        className="absolute inset-0 z-0 w-full h-full flex items-center justify-center opacity-40 md:opacity-100"
      >
        <Spline3DLive />
      </div>

      {/* 
        CAPA SUPERIOR: Bloque Narrativo Semántico (Z-Index: 10)
        Superpuesto, centrado vertical y horizontalmente sobre el background interactivo.
      */}
      <div className="w-full max-w-[1440px] mx-auto h-full flex items-center justify-center relative z-10">
        
        <div className="flex flex-col items-center justify-center text-center space-y-space-6 max-w-2xl animate-fade-in">
          
          <h1 className="font-title text-6xl text-lumiere-cacao font-normal leading-[1.15] tracking-tight">
            {currentLocale === "es" ? (
              <>El arte de <span className="italic">esculpir</span> el aire</>
            ) : (
              <>The art of <span className="italic">sculpting</span> the air</>
            )}
          </h1>
          
          <p className="font-sans text-lg text-lumiere-cacao max-w-lg leading-relaxed tracking-[0.02em]">
            {currentLocale === "es" 
              ? "Lumière: La luz que habita tus sentidos. Un susurro cálido diseñado para guiarte en el ritual de volver a casa."
              : "Lumière: The light that inhabits your senses. A warm whisper designed to guide you through the ritual of coming home."}
          </p>
          
          <Link 
          // SLOT LUCA: Framer Motion suave de 400ms al hover hacia el color color-brand-secondary ( salvia )
            href={`/${currentLocale}/coleccion`}
            className="inline-flex items-center justify-center px-space-6 h-12 bg-lumiere-arena text-lumiere-ahumado font-sans text-sm font-medium rounded-lg transition-all duration-400 hover:bg-lumiere-salvia focus:ring-2 focus:ring-lumiere-cacao/20"
            aria-label={currentLocale === "es" ? "Comprar la colección oficial" : "Shop the official collection"}
          >
            {currentLocale === "es" ? "Llevar la calma a casa" : "Bring calm home"}
          </Link>
          
        </div>

      </div>
    </section>
  );
}