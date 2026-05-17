"use client"

import Spline from '@splinetool/react-spline';


// Declaración estricta de la interfaz para erradicar el error TS(2322)
interface HeroSceneProps {
  onLoad?: (splineApp: any) => void;
}

export default function HeroScene({ onLoad }: HeroSceneProps) {

  return (
    <main
      className='h-screen w-screen relative flex justify-center items-center'
    >
      <Spline
        className='absolute z-0 inset-0'
        scene="https://prod.spline.design/QFFh-guw2ZTa-oTG/scene.splinecode" 
        style={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
      />
        
    </main>
  );
}




