
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PagesProvider } from "@/contexts/PagesContext";
import { ThemeProvider } from "@/hooks/use-theme";

// Páginas
import LoginPage from "./pages/LoginPage";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import PagesManager from "./pages/PagesManager";
import Settings from "./pages/Settings";
import PageView from "./pages/PageView";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <PagesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Página de login como página inicial */}
              <Route path="/" element={<LoginPage />} />
              
              {/* Rota antiga para a página inicial - opcional */}
              <Route path="/home" element={<Index />} />
              
              {/* Páginas públicas */}
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
          </TooltipProvider>
        </PagesProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
