"use client";

import React from "react";
import Link from "next/link";
import HeroSection from "@/sections/HeroSection";


// HOOK_AMARA: Cambiar este bloque de datos por el llamado asíncrono a la base de datos de PostgreSQL vía Server Actions


interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const currentLocale = params.locale === "en" ? "en" : "es";

  return (
    <>      
      <main className="w-full grow flex flex-col items-center">
        {/* SECCIÓN 01: Impacto Sensorial Hero */}
        <HeroSection currentLocale={currentLocale} />
      </main>
    </>
  );
}