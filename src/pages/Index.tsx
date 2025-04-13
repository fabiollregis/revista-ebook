
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import PasswordModal from "@/components/PasswordModal";

const Index: React.FC = () => {
  const { toast } = useToast();
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeTitle, setIframeTitle] = useState("");
  const [infoText, setInfoText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Carregando dados do localStorage
    const savedUrl = localStorage.getItem("venice-iframe-url") || "https://heyzine.com/flip-book/dce36e099f.html";
    const savedTitle = localStorage.getItem("venice-iframe-title") || "Venice Guide - Interactive Flipbook";
    const savedInfoText = localStorage.getItem("venice-info-text") || 
      "Guia interativo de Veneza";
    const savedFooterText = localStorage.getItem("venice-footer-text") || "Conteúdo interativo";
    
    setIframeUrl(savedUrl);
    setIframeTitle(savedTitle);
    setInfoText(savedInfoText);
    setFooterText(savedFooterText);

    // Garantindo que a senha de administrador está definida
    if (!localStorage.getItem("venice-admin-password")) {
      localStorage.setItem("venice-admin-password", "15183020");
    }
  };

  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    // Redirecionar para a área de admin após autenticação bem-sucedida
    window.location.href = "/dashboard";
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Venice Guide</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsPasswordModalOpen(true)}
              aria-label="Área administrativa"
              className="rounded-full hover:bg-gray-100"
            >
              <Lock size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="w-full h-[70vh] shadow-md border border-gray-200 rounded-lg overflow-hidden mb-6">
          <iframe
            title={iframeTitle}
            src={iframeUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        <p className="text-center text-gray-600 mb-6">{infoText}</p>
      </main>

      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} - {footerText}</p>
        </div>
      </footer>

      {/* Modal de senha */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
        correctPassword="15183020"
      />
    </motion.div>
  );
};

export default Index;
