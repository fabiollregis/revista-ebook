
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteSettings, saveSiteSettings } from "@/utils/supabase/settings-api";
import { SiteSettings } from "@/types/page";

const DesignSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Site settings state
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "",
    footerText: "",
    infoText: "",
    iframeUrl: "",
    iframeTitle: "",
    installPromptTitle: "",
    installPromptDescription: "",
    installButtonText: "",
    faviconUrl: "",
    infographUrl: ""
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do site.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validar a URL do iframe
      try {
        new URL(settings.iframeUrl);
      } catch (e) {
        toast({
          title: "URL inválida",
          description: "Por favor, insira uma URL válida para o iframe",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Salvar configurações
      const success = await saveSiteSettings(settings);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As alterações foram aplicadas com sucesso",
        });
      } else {
        throw new Error("Falha ao salvar configurações");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações do site.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-5xl pb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Configurações de Design</h1>
            <p className="text-muted-foreground">Personalize a aparência da página principal</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Defina as informações básicas do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Título do Site</Label>
                <Input
                  id="siteTitle"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleChange}
                  placeholder="Revista Digital"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="infoText">Texto Informativo</Label>
                <Input
                  id="infoText"
                  name="infoText"
                  value={settings.infoText}
                  onChange={handleChange}
                  placeholder="Guia interativo - Instale como aplicativo para acesso offline"
                />
                <p className="text-xs text-muted-foreground">Este texto aparece abaixo do iframe na página principal</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Texto do Rodapé</Label>
                <Input
                  id="footerText"
                  name="footerText"
                  value={settings.footerText}
                  onChange={handleChange}
                  placeholder="Conteúdo interativo"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações do iframe</CardTitle>
              <CardDescription>Personalize a revista digital exibida na página principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="iframeUrl">URL do iframe</Label>
                <Input
                  id="iframeUrl"
                  name="iframeUrl"
                  value={settings.iframeUrl}
                  onChange={handleChange}
                  placeholder="https://heyzine.com/flip-book/123abc.html"
                />
                <p className="text-xs text-muted-foreground">URL completa da revista digital que será incorporada</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="iframeTitle">Título do iframe</Label>
                <Input
                  id="iframeTitle"
                  name="iframeTitle"
                  value={settings.iframeTitle}
                  onChange={handleChange}
                  placeholder="Revista Digital - Edição Interativa"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações do Prompt de Instalação</CardTitle>
              <CardDescription>Personalize a mensagem que incentiva a instalação do app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="installPromptTitle">Título do Prompt</Label>
                <Input
                  id="installPromptTitle"
                  name="installPromptTitle"
                  value={settings.installPromptTitle}
                  onChange={handleChange}
                  placeholder="Instale a Revista Digital"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installPromptDescription">Descrição do Prompt</Label>
                <Textarea
                  id="installPromptDescription"
                  name="installPromptDescription"
                  value={settings.installPromptDescription}
                  onChange={handleChange}
                  placeholder="Instale este aplicativo para acessar a revista offline e ter uma experiência melhor."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installButtonText">Texto do Botão de Instalação</Label>
                <Input
                  id="installButtonText"
                  name="installButtonText"
                  value={settings.installButtonText}
                  onChange={handleChange}
                  placeholder="Instalar Aplicativo"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignSettings;
