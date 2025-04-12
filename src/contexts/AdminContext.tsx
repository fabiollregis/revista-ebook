
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminContextType {
  // Site settings
  siteTitle: string;
  setSiteTitle: (value: string) => void;
  
  // Iframe settings
  iframeUrl: string;
  setIframeUrl: (value: string) => void;
  iframeTitle: string;
  setIframeTitle: (value: string) => void;
  
  // Content settings
  footerText: string;
  setFooterText: (value: string) => void;
  infoText: string;
  setInfoText: (value: string) => void;
  
  // Install prompt settings
  installPromptTitle: string;
  setInstallPromptTitle: (value: string) => void;
  installPromptDescription: string;
  setInstallPromptDescription: (value: string) => void;
  installButtonText: string;
  setInstallButtonText: (value: string) => void;
  
  // Actions
  handleSave: () => void;
  loadSettings: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Site settings
  const [siteTitle, setSiteTitle] = useState("");
  
  // Iframe settings
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeTitle, setIframeTitle] = useState("");
  
  // Content settings
  const [footerText, setFooterText] = useState("");
  const [infoText, setInfoText] = useState("");
  
  // Install prompt settings
  const [installPromptTitle, setInstallPromptTitle] = useState("");
  const [installPromptDescription, setInstallPromptDescription] = useState("");
  const [installButtonText, setInstallButtonText] = useState("");
  
  const { toast } = useToast();

  const loadSettings = () => {
    // Load saved settings from localStorage
    const savedUrl = localStorage.getItem("venice-iframe-url") || "https://heyzine.com/flip-book/dce36e099f.html";
    const savedTitle = localStorage.getItem("venice-iframe-title") || "Venice Guide - Interactive Flipbook";
    const savedSiteTitle = localStorage.getItem("venice-site-title") || "Venice Guide";
    const savedFooterText = localStorage.getItem("venice-footer-text") || "Conteúdo interativo";
    const savedInstallPromptTitle = localStorage.getItem("venice-install-prompt-title") || "Instale o Venice Guide";
    const savedInstallPromptDescription = localStorage.getItem("venice-install-prompt-description") || 
      "Instale este aplicativo para acessar o guia de Veneza offline e ter uma experiência melhor.";
    const savedInstallButtonText = localStorage.getItem("venice-install-button-text") || "Instalar Aplicativo";
    const savedInfoText = localStorage.getItem("venice-info-text") || 
      "Guia interativo de Veneza - Instale como aplicativo para acesso offline";
    
    // Set default admin password if not set
    if (!localStorage.getItem("venice-admin-password")) {
      localStorage.setItem("venice-admin-password", "15183020");
    }
    
    setIframeUrl(savedUrl);
    setIframeTitle(savedTitle);
    setSiteTitle(savedSiteTitle);
    setFooterText(savedFooterText);
    setInstallPromptTitle(savedInstallPromptTitle);
    setInstallPromptDescription(savedInstallPromptDescription);
    setInstallButtonText(savedInstallButtonText);
    setInfoText(savedInfoText);
  };

  const handleSave = () => {
    // Validate the URL
    try {
      new URL(iframeUrl);
    } catch (e) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida para o iframe",
        variant: "destructive",
      });
      return;
    }

    // Save settings to localStorage
    localStorage.setItem("venice-iframe-url", iframeUrl);
    localStorage.setItem("venice-iframe-title", iframeTitle);
    localStorage.setItem("venice-site-title", siteTitle);
    localStorage.setItem("venice-footer-text", footerText);
    localStorage.setItem("venice-install-prompt-title", installPromptTitle);
    localStorage.setItem("venice-install-prompt-description", installPromptDescription);
    localStorage.setItem("venice-install-button-text", installButtonText);
    localStorage.setItem("venice-info-text", infoText);

    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso",
    });
  };

  // Load settings on initial mount
  useEffect(() => {
    loadSettings();
  }, []);

  const value = {
    // Site settings
    siteTitle, setSiteTitle,
    
    // Iframe settings
    iframeUrl, setIframeUrl,
    iframeTitle, setIframeTitle,
    
    // Content settings
    footerText, setFooterText,
    infoText, setInfoText,
    
    // Install prompt settings
    installPromptTitle, setInstallPromptTitle,
    installPromptDescription, setInstallPromptDescription,
    installButtonText, setInstallButtonText,
    
    // Actions
    handleSave,
    loadSettings
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
