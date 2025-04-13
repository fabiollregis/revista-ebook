
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage, Type, Info, FileText } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [infographFile, setInfographFile] = useState<File | null>(null);

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

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaviconFile(e.target.files[0]);
    }
  };
  
  const handleInfographChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInfographFile(e.target.files[0]);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // Handle file uploads if selected
      if (faviconFile) {
        // For now, store the file name. In a real implementation, you'd upload to storage
        // and get a URL back
        handleInputChange('faviconUrl', faviconFile.name);
      }
      
      if (infographFile) {
        // For now, store the file name. In a real implementation, you'd upload to storage
        // and get a URL back
        handleInputChange('infographUrl', infographFile.name);
      }

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

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="conteudo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Conteúdo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="aparencia">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize elementos visuais do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center gap-4">
                    {settings.faviconUrl && (
                      <div className="w-10 h-10 border rounded flex items-center justify-center overflow-hidden">
                        <img 
                          src={settings.faviconUrl} 
                          alt="Favicon" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fix: Cast the target to HTMLElement to access style property
                            const imgElement = e.currentTarget;
                            imgElement.style.display = 'none';
                            // Get the next sibling and cast it to HTMLElement
                            const nextSibling = imgElement.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center bg-primary/10 text-primary">
                          <FileImage size={16} />
                        </div>
                      </div>
                    )}
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleFaviconChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    O favicon é o ícone que aparece na aba do navegador. Recomendado: 32x32px, formato PNG ou SVG.
                  </p>
                </div>

                <div className="grid gap-2 mt-4">
                  <Label htmlFor="infograph">Imagem de Infográfico</Label>
                  <div className="flex items-center gap-4">
                    {settings.infographUrl && (
                      <div className="w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                        <img 
                          src={settings.infographUrl} 
                          alt="Infográfico" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fix: Cast the target to HTMLElement to access style property
                            const imgElement = e.currentTarget;
                            imgElement.style.display = 'none';
                            // Get the next sibling and cast it to HTMLElement
                            const nextSibling = imgElement.nextSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center bg-primary/10 text-primary">
                          <Info size={24} />
                        </div>
                      </div>
                    )}
                    <Input
                      id="infograph"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleInfographChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Imagem de destaque para o infográfico do site. Recomendado: 1200x630px.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conteudo">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
                <CardDescription>
                  Edite o conteúdo textual do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid gap-2 mt-4">
                  <Label htmlFor="info-text">Texto do Infográfico</Label>
                  <Input
                    id="info-text"
                    value={settings.infoText}
                    onChange={(e) => handleInputChange("infoText", e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Texto descritivo para o infográfico do site, usado em compartilhamentos em redes sociais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
