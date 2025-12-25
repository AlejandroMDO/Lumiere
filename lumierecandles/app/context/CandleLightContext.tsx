"use client"

import { createContext, useContext, useState } from "react";

interface GlobalStateType {
    isOn: any;
    toggleLight: () => any;
}


const CandleLightContext = createContext<GlobalStateType | undefined>(undefined);

export function CandleLightContextProvider({ children } : { children: React.ReactNode }) {
    const [isOn, setIsOn] = useState(false)

    const toggleLight = () => {
        setIsOn(prev => (prev === false ? true : false))
    }

    return (
        <CandleLightContext.Provider value={{ isOn, toggleLight }}>
            {children}
        </CandleLightContext.Provider>
    )
}

export function useGlobalContext() {
  const context = useContext(CandleLightContext);

  if (!context) {
    throw new Error("useStateContext debe usarse dentro de GlobalProvider");
  }

  return context;
}



