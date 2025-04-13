
import React, { useState, useEffect } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import IframeSettingsForm from "@/components/admin/IframeSettingsForm";
import ContentSettingsForm from "@/components/admin/ContentSettingsForm";
import SaveButton from "@/components/admin/SaveButton";
import PasswordProtection from "@/components/admin/PasswordProtection";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminContent = () => {
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
      <div className="flex justify-end mb-6">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </Button>
      </div>
      <SiteSettingsForm />
      <IframeSettingsForm />
      <ContentSettingsForm />
      <SaveButton />
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
