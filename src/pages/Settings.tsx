
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import ProfileSettings from "@/components/settings/ProfileSettings";
import PasswordSettings from "@/components/settings/PasswordSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import DangerZone from "@/components/settings/DangerZone";
import { User, Key, Bell, Settings as SettingsIcon, AlertTriangle } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Configurações</h1>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <div className="mb-6 overflow-auto">
              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <TabsList className="inline-flex h-10">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User size={16} />
                    <span>Perfil</span>
                  </TabsTrigger>
                  <TabsTrigger value="password" className="flex items-center gap-2">
                    <Key size={16} />
                    <span>Senha</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell size={16} />
                    <span>Notificações</span>
                  </TabsTrigger>
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <SettingsIcon size={16} />
                    <span>Gerais</span>
                  </TabsTrigger>
                  <TabsTrigger value="danger" className="flex items-center gap-2 text-destructive">
                    <AlertTriangle size={16} />
                    <span>Perigo</span>
                  </TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>
            
            <div className="space-y-8">
              <TabsContent value="profile" className="mt-0">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="password" className="mt-0">
                <PasswordSettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="general" className="mt-0">
                <GeneralSettings />
              </TabsContent>
              
              <TabsContent value="danger" className="mt-0">
                <DangerZone />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Settings;
