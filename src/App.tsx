
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DemoSession from "./pages/DemoSession";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SessionPrep from "./pages/SessionPrep";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo/session/prep" element={<SessionPrep />} />
          <Route path="/demo/session" element={<DemoSession />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sesje" element={<Dashboard />} />
          <Route path="/klienci" element={<Dashboard />} />
          <Route path="/narzedzia" element={<Dashboard />} />
          <Route path="/ustawienia" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
