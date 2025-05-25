import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "./AuthContext"; // 导入 AuthContext

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PCB Defect Detection",
  description: "A system to detect defects in PCBs using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext> {/* 包裹 children */} 
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
