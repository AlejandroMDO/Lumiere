import React, { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarContainerProps {
  currentLocale: "es" | "en";
}

export default function NavbarContainer({ currentLocale }: NavbarContainerProps) {
  // Manejo de persistencia local del carrito en estado cliente
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    // HOOK_AMARA: Conectar con el estado global/Base de datos una vez iniciada la sesión
    // Sincronizar localStorage con el merge de PostgreSQL vía Server Actions
    const fetchCartData = () => {
      const localCart = localStorage.getItem("lumiere_cart_session");
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          setCartCount(parsed.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0);
        } catch (e) {
          setCartCount(2); // Fallback mock de UI Kit base
        }
      } else {
        setCartCount(2); // UI Kit base counter
      }
    };
    fetchCartData();
  }, []);

  return (
    <header 
      className="w-full h-20 bg-lumiere-crema border-b border-lumiere-ahumado/10 sticky top-0 z-50 transition-all duration-400"
      aria-label="Cabecera Principal"
    >
      <div className="w-full max-w-[1440px] mx-auto h-full px-20 grid grid-cols-12 items-center">
        
        {/* COL 1-3: Selector de Idioma e i18n Core */}
        <div className="col-span-3 flex items-center space-x-6 text-sm font-medium tracking-[0.02em]">
          <nav className="flex items-center space-x-2" aria-label="Selector de idioma">
            <Link 
              href="/es" 
              className={`font-sans transition-colors duration-400 hover:text-lumiere-salvia ${currentLocale === "es" ? "font-bold text-lumiere-ahumado" : "text-lumiere-cacao/60"}`}
            >
              ES
            </Link>
            <span className="opacity-40 text-lumiere-cacao">/</span>
            <Link 
              href="/en" 
              className={`font-sans transition-colors duration-400 hover:text-lumiere-salvia ${currentLocale === "en" ? "font-bold text-lumiere-ahumado" : "text-lumiere-cacao/60"}`}
            >
              EN
            </Link>
          </nav>
          
          <Link 
            href={`/${currentLocale}/coleccion`} 
            className="font-sans text-lumiere-cacao transition-colors duration-400 hover:text-lumiere-salvia hidden md:inline-block"
          >
            {currentLocale === "es" ? "Colección" : "Collection"}
          </Link>
        </div>

        {/* COL 5-8: Logo Tipográfico Centralizado Estricto */}
        <div className="col-span-6 flex justify-center">
          <Link 
            href={`/${currentLocale}`} 
            className="font-title text-2xl tracking-[0.04em] text-lumiere-cacao font-normal select-none"
          >
            LUMIÈRE
          </Link>
        </div>

        {/* COL 10-12: Utilidades de Interfaz (Iconos Atómicos con stroke="currentColor") */}
        <div className="col-span-3 flex justify-end items-center space-x-6 text-lumiere-cacao">
          
          {/* SLOT_LUCA: Animación de micro-interacción al abrir buscador */}
          <button 
            className="p-1 transition-colors duration-400 hover:text-lumiere-salvia focus:outline-none focus:ring-1 focus:ring-lumiere-arena"
            aria-label="Buscar productos"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <Link 
            href={`/${currentLocale}/cuenta`}
            className="p-1 transition-colors duration-400 hover:text-lumiere-salvia focus:outline-none focus:ring-1 focus:ring-lumiere-arena"
            aria-label="Mi cuenta"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Botón Carrito con Indicador de Cantidad Persistente */}
          {/* SLOT_LUCA: Transición/Pulse de escala cuando cartCount cambie */}
          <button 
            className="p-1 transition-colors duration-400 hover:text-lumiere-salvia relative focus:outline-none focus:ring-1 focus:ring-lumiere-arena"
            aria-label="Ver bolsa de compra"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-lumiere-salvia text-lumiere-ahumado text-[10px] font-bold rounded-full flex items-center justify-center font-sans animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>
          
        </div>
      </div>
    </header>
  );
}