import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import PasswordModal from "@/components/PasswordModal";
import { useAuth } from "@/contexts/AuthContext";
const Index: React.FC = () => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
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
    const savedInfoText = localStorage.getItem("venice-info-text") || "Guia interativo de Veneza";
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
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <motion.div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10" variants={containerVariants} initial="hidden" animate="visible" exit={{
    opacity: 0
  }}>
      <header className="bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Revista Digital</h1>
          </motion.div>
          <motion.div className="flex items-center gap-4" variants={itemVariants}>
            {user ? <Link to="/dashboard">
                <Button variant="outline" size="sm" className="rounded-full border-primary/50 hover:border-primary hover:bg-primary/10">
                  Dashboard
                </Button>
              </Link> : <Link to="/auth">
                <Button variant="outline" size="sm" className="rounded-full border-primary/50 hover:border-primary hover:bg-primary/10">
                  Login
                </Button>
              </Link>}
          </motion.div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Explore Veneza
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Navegue pelo guia interativo e descubra os segredos, história e beleza desta cidade única.
          </p>
        </motion.div>
        
        <motion.div className="w-full h-[70vh] rounded-xl overflow-hidden magazine-card border-2 border-primary/20" variants={itemVariants}>
          <iframe title={iframeTitle} src={iframeUrl} className="w-full h-full" frameBorder="0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
        </motion.div>

        <motion.p className="text-center text-gray-600 my-8" variants={itemVariants}>
          {infoText}
        </motion.p>
      </main>

      <motion.footer className="bg-white/80 dark:bg-background/80 backdrop-blur-md py-6 border-t border-border" variants={itemVariants}>
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} - {footerText}</p>
        </div>
      </motion.footer>

      {/* Modal de senha */}
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSuccess={handlePasswordSuccess} correctPassword="15183020" />
    </motion.div>;
};
export default Index;