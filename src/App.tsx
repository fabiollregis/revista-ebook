
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PagesProvider } from "@/contexts/PagesContext";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from 'react';

// Páginas
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import PagesManager from "./pages/PagesManager";
import Settings from "./pages/Settings";
import PageView from "./pages/PageView";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserManagementPage from "./pages/UserManagementPage";
import DesignSettings from "./pages/DesignSettings";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <BrowserRouter>
            <PagesProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Páginas públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/page/:slug" element={<PageView />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Páginas do dashboard - protegidas */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/pages" element={
                    <ProtectedRoute>
                      <PagesManager />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/design" element={
                    <ProtectedRoute>
                      <DesignSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/users" element={
                    <ProtectedRoute requireAdmin={true}>
                      <UserManagementPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rota de admin legado - redireciona para o dashboard */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  
                  {/* Página 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </PagesProvider>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
