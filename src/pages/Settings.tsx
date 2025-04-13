
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { SiteSettings } from "@/types/page";
import { getSiteSettings, saveSiteSettings } from "@/utils/supabase/settings-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar as configurações do site.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // Save to Supabase
      const success = await saveSiteSettings(settings);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As alterações foram aplicadas com sucesso.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Configurações do Site</h3>
            <p className="text-sm text-red-500">
              Erro ao carregar configurações. Por favor, recarregue a página.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium">Configurações do Site</h3>
          <p className="text-sm text-gray-500">
            Personalize as configurações gerais do seu site.
          </p>
        </div>
        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Informações básicas do seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-title">Título do Site</Label>
              <Input
                id="site-title"
                value={settings.siteTitle}
                onChange={(e) => handleInputChange("siteTitle", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Este título será exibido na barra de título do navegador e no cabeçalho do site.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="footer-text">Texto do Rodapé</Label>
              <Input
                id="footer-text"
                value={settings.footerText}
                onChange={(e) => handleInputChange("footerText", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Este texto será exibido no rodapé de todas as páginas.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
