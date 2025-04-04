
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

export default function SessionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 text-red-600 rounded-full mb-6">
            <AlertCircle size={32} />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Wystąpił błąd</h1>
          <p className="text-gray-600 mb-6">
            Przepraszamy, wystąpił nieoczekiwany błąd podczas ładowania sesji. 
            Spróbuj ponownie lub wróć na stronę główną.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw size={16} />
              <span>Spróbuj ponownie</span>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/">
                <Home size={16} />
                <span>Strona główna</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
