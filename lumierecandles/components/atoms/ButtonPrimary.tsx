"use client";

import React from "react";

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "arena" | "salvia";
  fullWidth?: boolean;
}

export default function ButtonPrimary({
  children,
  variant = "arena",
  fullWidth = false,
  className = "",
  ...props
}: ButtonPrimaryProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 h-12 font-sans text-sm font-medium rounded-[8px] tracking-[0.02em] transition-all duration-400 ease-out focus:outline-none focus:ring-2 focus:ring-[#5A3E36]/20 active:scale-[0.99]";
  
  const variants = {
    arena: "bg-[#D9C4A6] text-[#1A1A1A] hover:bg-[#A7B2A0]",
    salvia: "bg-[#A7B2A0] text-[#1A1A1A] hover:bg-[#D9C4A6]",
  };

  const widthStyle = fullWidth ? "w-full" : "w-fit";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}