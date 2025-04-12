
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("venice-admin-auth");
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo",
    });
    // Redireciona para a página principal após o logout
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Administração - Venice Guide</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-1">
              <LogOut size={18} />
              <span>Sair</span>
            </Button>
            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Configurações do Guia</h2>
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Venice Guide - Painel Administrativo
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
