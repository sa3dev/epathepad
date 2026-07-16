import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Épat'Ehpad",
  description:
    "Épat'Ehpad met en relation les EHPAD et les artistes pour organiser des animations et spectacles joyeux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="flex flex-1 flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
