"use client"

import Spline from '@splinetool/react-spline';
import { useRef, useState } from 'react';
import { TbMatchstick } from "react-icons/tb";
import { motion, useAnimate } from "motion/react"

export default function HeroScene() {
  const [scope, animate] = useAnimate()
  const objectToAnimate: any = useRef('Ellipse');
  const [isOn, setIsOn] = useState(false);

  

  function onLoad(spline: any) {
    const obj = spline.findObjectById('518f6ae6-012a-4528-99e1-cf43797f1b58');
    objectToAnimate.current = obj;
  }

  function triggerAnimation() {
    objectToAnimate.current.emitEvent('keyDown');  
    setIsOn(true)
  }



  return (
    <main
      ref={scope}
      className='h-screen w-screen relative flex justify-center items-center'
    >
      <Spline
        className='absolute z-0 inset-0'
        scene="https://prod.spline.design/QFFh-guw2ZTa-oTG/scene.splinecode" 
        onLoad={onLoad}
        style={{ width: "100%", height: "100%" }}
      />
        {
          !isOn &&
            <motion.div
              className='border-2 border-red-500 translate-y-[100px]'
            >
              <TbMatchstick 
                size={100}
                color="#F7F2EE" 
                className="relative z-10 opacity-0"
                onClick={triggerAnimation}
              />
            </motion.div>  
        }
    </main>
  );
}
