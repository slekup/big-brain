"use client";

import type { Metadata } from "next";
import "../styles/app.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="absolute flex w-full h-full">
        <Sidebar />
        <div className="relative h-full w-full">{children}</div>
      </body>
    </html>
  );
}
