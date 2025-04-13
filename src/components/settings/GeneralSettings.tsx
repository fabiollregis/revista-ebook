
import React, { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Monitor } from "lucide-react";

const GeneralSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system");
    toast({
      title: "Tema atualizado",
      description: `O tema foi alterado para ${newTheme === "system" ? "sistema" : newTheme === "dark" ? "escuro" : "claro"}`
    });
  };
  
  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "light":
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Personalize sua experiência com o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Tema</Label>
          <Select defaultValue={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Selecione um tema">
                <div className="flex items-center gap-2">
                  {getThemeIcon()}
                  <span>
                    {theme === "system" 
                      ? "Sistema" 
                      : theme === "dark" 
                        ? "Escuro" 
                        : "Claro"}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>Claro</span>
              </SelectItem>
              <SelectItem value="dark" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Escuro</span>
              </SelectItem>
              <SelectItem value="system" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span>Sistema</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
