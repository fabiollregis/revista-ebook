
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; 
import { useAuth } from "@/contexts/AuthContext";

const NotificationSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(profile?.email_notifications || false);
  const [siteNotifications, setSiteNotifications] = useState(profile?.site_notifications || true);
  const [updatesNotifications, setUpdatesNotifications] = useState(profile?.updates_notifications || true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          email_notifications: emailNotifications,
          site_notifications: siteNotifications,
          updates_notifications: updatesNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram salvas com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar suas preferências",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Configure como você deseja receber notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Notificações por e-mail</span>
            <span className="font-normal text-xs text-muted-foreground">
              Receba atualizações e notificações por e-mail
            </span>
          </Label>
          <Switch 
            id="email-notifications" 
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="site-notifications" className="flex flex-col space-y-1">
            <span>Notificações no site</span>
            <span className="font-normal text-xs text-muted-foreground">
              Receba notificações quando estiver usando o site
            </span>
          </Label>
          <Switch 
            id="site-notifications" 
            checked={siteNotifications}
            onCheckedChange={setSiteNotifications}
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="updates-notifications" className="flex flex-col space-y-1">
            <span>Atualizações e novidades</span>
            <span className="font-normal text-xs text-muted-foreground">
              Receba informações sobre novos recursos e atualizações
            </span>
          </Label>
          <Switch 
            id="updates-notifications" 
            checked={updatesNotifications}
            onCheckedChange={setUpdatesNotifications}
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isUpdating}
          >
            {isUpdating ? "Salvando..." : "Salvar preferências"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
