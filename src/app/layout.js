import Header from "@/components/server/Header";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { ContextProvider } from "@/components/clients/ContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskFlow - Task Planner",
  description: "TaskFlow - Organize your tasks effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="icon" type="image/svg+xml" href="/logo_icon.svg" /></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased italic`}
      >
        <ContextProvider>
        <Header/>
        {children}
        </ContextProvider>
      </body>
    </html>
  );
}
