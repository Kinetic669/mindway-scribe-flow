
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mindway - Therapy Session Management",
  description: "A smarter way to run your therapy sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <TooltipProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
