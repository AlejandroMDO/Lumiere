"use client";

import { useRef, useState } from "react";
import HeroScene from "./Models/HeroScene";

export default function Spline3DContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estado atómico para coordinar el fade-in visual posterior a la carga real
  const [isSceneActive, setIsSceneActive] = useState(false);

  const handleSplineLoad = (splineApp: any) => {
    if (splineApp) {
      // 1. Estabilización física obligatoria de dimensiones
      splineApp.setSize(
        containerRef.current?.clientWidth || window.innerWidth,
        containerRef.current?.clientHeight || window.innerHeight
      );
      
      // 2. Rompemos el cuello de botella del hilo principal delegando la ejecución
      // a la cola de macro-tareas mediante requestAnimationFrame y un micro-delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (isSceneActive === false) {
             // Forzado imperativo de la animación nativa
          }
          // 3. Una vez que WebGL está templado, liberamos la opacidad de la interfaz
          setIsSceneActive(true);
        }, 50); 
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full min-h-[450px] relative flex items-center justify-center bg-transparent select-none transition-opacity duration-1000 ease-out ${
        isSceneActive ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Esqueleto de precarga sutil: Mantiene el color Crema de Lumière mientras WebGL levanta */}
      {!isSceneActive && (
        <div className="absolute inset-0 bg-lumiere-ahumado z-10" />
      )}
      
      <HeroScene onLoad={handleSplineLoad} />
    </div>
  );
}