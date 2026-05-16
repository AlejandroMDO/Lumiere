"use client";

import React from "react";
import Link from "next/link";

export interface ProductStaticData {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  price: number;
  intensityEs: string;
  intensityEn: string;
}

interface ProductCardProps {
  product: ProductStaticData;
  currentLocale: "es" | "en";
}

export default function ProductCard({ product, currentLocale }: ProductCardProps) {
  const title = currentLocale === "es" ? product.titleEs : product.titleEn;
  const intensity = currentLocale === "es" ? product.intensityEs : product.intensityEn;

  return (
    <article className="group flex flex-col space-y-spacing-space-4 cursor-pointer text-left">
      
      {/* Contenedor de la media con protección estricta contra Cumulative Layout Shift */}
      <Link 
        href={`/${currentLocale}/coleccion/${product.slug}`} 
        className="w-full aspect-4/5 bg-lumiere-arena/10 overflow-hidden rounded-sm relative block"
      >
        {/* SLOT_LUCA: Interpolación lineal de 700ms al escalar la imagen en hover */}
        <div className="w-full h-full bg-lumiere-arena/20 transition-transform duration-700 group-hover:scale-105" />
      </Link>

      <div className="flex flex-col space-y-spacing-space-1">
        <h3 className="font-title text-lg text-lumiere-cacao font-normal">
          <Link href={`/${currentLocale}/coleccion/${product.slug}`} className="hover:underline decoration-1 underline-offset-4">
            {title}
          </Link>
        </h3>
        <p className="font-sans text-sm text-lumiere-cacao/60">
          {currentLocale === "es" ? `Intensidad: ${intensity}` : `Intensity: ${intensity}`}
        </p>
        <p className="font-sans text-base font-semibold text-lumiere-cacao pt-spacing-space-1">
          ${product.price.toFixed(2)}
        </p>
      </div>

    </article>
  );
}