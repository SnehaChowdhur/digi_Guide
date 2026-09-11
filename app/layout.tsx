import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "digiGUIDE | Learning Digital Twin",
  description: "An adaptive learning companion that models how you learn."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
