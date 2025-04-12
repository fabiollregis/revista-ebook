
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [siteTitle, setSiteTitle] = useState(
    localStorage.getItem("venice-site-title") || "Venice Guide"
  );
  const [footerText, setFooterText] = useState(
    localStorage.getItem("venice-footer-text") || "Conteúdo interativo"
  );
  const [showPwaPrompt, setShowPwaPrompt] = useState(
    localStorage.getItem("venice-show-pwa-prompt") !== "false"
  );

  const saveSettings = () => {
    localStorage.setItem("venice-site-title", siteTitle);
    localStorage.setItem("venice-footer-text", footerText);
    localStorage.setItem("venice-show-pwa-prompt", showPwaPrompt.toString());
    
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Configurações do Site</h3>
          <p className="text-sm text-gray-500">
            Personalize as configurações gerais do seu site.
          </p>
        </div>
        <Separator />

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="site-title">Título do Site</Label>
            <Input
              id="site-title"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Este título será exibido na barra de título do navegador e no cabeçalho do site.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="footer-text">Texto do Rodapé</Label>
            <Input
              id="footer-text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Este texto será exibido no rodapé de todas as páginas.
            </p>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pwa-prompt">Mostrar Prompt de Instalação PWA</Label>
                <p className="text-sm text-gray-500">
                  Exibir sugestão para instalar o aplicativo em dispositivos móveis.
                </p>
              </div>
              <Switch 
                id="pwa-prompt" 
                checked={showPwaPrompt} 
                onCheckedChange={setShowPwaPrompt} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSettings}>Salvar Configurações</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
