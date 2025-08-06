import "./globals.css";
import Header from "@/components/server/Header";
import ReduxProvider from "@/components/clients/Provider";
import AuthInitializer from "@/components/clients/AuthInitializer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "TaskFlow - Task Planner",
  description: "TaskFlow - Organize your tasks effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo_icon.svg" />
      </head>
      <body className="antialiased italic bg-[#172842] text-white">
        <ReduxProvider>
          <AuthInitializer />
          <Header />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
