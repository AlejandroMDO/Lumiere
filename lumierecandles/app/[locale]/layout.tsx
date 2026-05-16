import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css"; 

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Lumière Home Candles | El arte de esculpir el aire",
  description: "Lumière: La luz que habita tus sentidos. Decoración y aromas premium para el hogar.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={params.locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-lumiere-crema text-lumiere-cacao antialiased min-h-screen flex flex-col selection:bg-lumiere-arena/30">
        {children}
      </body>
    </html>
  );
}
