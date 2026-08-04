import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "38-0 | Build the Ultimate English Top-Flight XI",
  description:
    "Spin the wheel, draft real players from every English top-flight season since 1992, build your XI, and simulate a 38-game season. Can you go 38-0?",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
