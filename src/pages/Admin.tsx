
import React, { useState, useEffect } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import IframeSettingsForm from "@/components/admin/IframeSettingsForm";
import ContentSettingsForm from "@/components/admin/ContentSettingsForm";
import UserManagement from "@/components/admin/UserManagement";
import SaveButton from "@/components/admin/SaveButton";
import PasswordProtection from "@/components/admin/PasswordProtection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("venice-admin-auth");
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full max-w-md"
        >
          <TabsList>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              <span>Configurações</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              <span>Usuários</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </Button>
      </div>
      
      <TabsContent value="settings" className="space-y-6 mt-0">
        <SiteSettingsForm />
        <IframeSettingsForm />
        <ContentSettingsForm />
        <SaveButton />
      </TabsContent>
      
      <TabsContent value="users" className="mt-0">
        <UserManagement />
      </TabsContent>
    </div>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ADMIN_PASSWORD = "15183020";
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      setIsAuthenticated(true);
    }
  }, [isAdmin]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <PasswordProtection correctPassword={ADMIN_PASSWORD} onAuthenticated={handleAuthenticated} />;
  }

  return (
    <AdminProvider>
      <AdminLayout>
        <AdminContent />
      </AdminLayout>
    </AdminProvider>
  );
};

export default Admin;
