import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VLM Content Studio",
  description: "Socle applicatif marketing pour le groupe VLM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

