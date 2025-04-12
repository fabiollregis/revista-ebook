
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PagesProvider } from "@/contexts/PagesContext";

// Páginas
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import PagesManager from "./pages/PagesManager";
import Settings from "./pages/Settings";
import PageView from "./pages/PageView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PagesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Páginas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/page/:slug" element={<PageView />} />
            
            {/* Páginas do dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/pages" element={<PagesManager />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            
            {/* Rota de admin legado - redireciona para o dashboard */}
            <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PagesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
