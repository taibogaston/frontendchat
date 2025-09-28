import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import DynamicProviders from "../components/DynamicProviders";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ChatBot - Aprende idiomas conversando",
  description: "Aprende idiomas conversando con personajes auténticos de diferentes países",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${redHatDisplay.variable} font-red-hat-display antialiased`}>
        <DynamicProviders>{children}</DynamicProviders>
      </body>
    </html>
  );
}
