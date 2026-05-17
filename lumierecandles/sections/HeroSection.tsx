"use client";


import Link from "next/link";
import HeroScene from "./Models/HeroScene";


// Inyección diferida para proteger Core Web Vitals (FCP y LCP Guard)

interface HeroSectionProps {
  currentLocale: "es" | "en";
}

export default function HeroSection({ currentLocale }: HeroSectionProps) {
  return (
    <section 
      className="w-screen h-[calc(100vh-80px)] bg-lumiere-crema relative overflow-hidden px-space-6"
      aria-label="Introducción Sensorial Lumière"
    >
      
      {/* 
        CAPA DE FONDO: Contenedor Spline 3D (Z-Index: 0)
        Ocupa el 100% de la sección de forma absoluta.
        SLOT_LUCA: Aquí se inyecta la máscara global Vignette ( mix-blend-mode ) 
        que sigue al puntero sobre el fondo 3D.
      */}

      {/* 
        CAPA SUPERIOR: Bloque Narrativo Semántico (Z-Index: 10)
        Superpuesto, centrado vertical y horizontalmente sobre el background interactivo.
        */}
        
      <div className="w-full max-w-[1440px] mx-auto my-auto h-full flex items-center justify-center">
        <div className="w-1/2 h-full flex justify-start">
          <div className="flex flex-col items-start justify-center text-left space-y-6 max-w-2xl animate-fade-in">
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
        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="w-1/2 h-1/2 relative p-12 rounded-lg flex justify-center items-center">
            <HeroScene />

          </div>

        </div>
        

      </div>
    </section>
  );
}