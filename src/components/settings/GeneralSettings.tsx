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
      
      
    </Card>;
};
export default GeneralSettings;