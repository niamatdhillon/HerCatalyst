import type { Metadata } from "next";
import "./globals.css"; // Double check that this path exactly targets your stylesheet

export const metadata: Metadata = {
  title: "HerCatalyst | The STEM Student OS",
  description: "An emotionally intelligent operating system for women in STEM.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}