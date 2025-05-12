import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inscrição Humberto De Campos",
  description: "Inscrição para o evento de Humberto De Campos no centro Augusto Elias.",
  openGraph: {
    title: "Inscrição Humberto De Campos",
    description: "Inscreva-se no evento do Centro Espírita Augusto Elias.",
    images: [
      {
        url: "/convite.jpg", // Caminho da imagem na pasta /public
        width: 800,
        height: 1200, // vertical
        alt: "Convite do Evento Humberto de Campos",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
