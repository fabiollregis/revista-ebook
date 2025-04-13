import React, { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Monitor } from "lucide-react";
const GeneralSettings: React.FC = () => {
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    toast
  } = useToast();
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
  return <Card>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme-select">Tema</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme-select" className="w-full">
              <div className="flex items-center gap-2">
                {getThemeIcon()}
                <SelectValue placeholder="Selecione um tema" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Claro</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Escuro</span>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Sistema</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Escolha entre tema claro, escuro ou siga as preferências do sistema
          </p>
        </div>
      </CardContent>
    </Card>;
};
export default GeneralSettings;