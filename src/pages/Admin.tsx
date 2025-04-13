
import React, { useState } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import IframeSettingsForm from "@/components/admin/IframeSettingsForm";
import ContentSettingsForm from "@/components/admin/ContentSettingsForm";
import InstallPromptForm from "@/components/admin/InstallPromptForm";
import SaveButton from "@/components/admin/SaveButton";
import PasswordProtection from "@/components/admin/PasswordProtection";
import { useAdmin } from "@/contexts/AdminContext";

const AdminContent = () => {
  const { 
    installPromptTitle, setInstallPromptTitle,
    installPromptDescription, setInstallPromptDescription,
    installButtonText, setInstallButtonText
  } = useAdmin();

  return (
    <div className="space-y-6">
      <SiteSettingsForm />
      <IframeSettingsForm />
      <ContentSettingsForm />
      <InstallPromptForm 
        installPromptTitle={installPromptTitle}
        installPromptDescription={installPromptDescription}
        installButtonText={installButtonText}
        onTitleChange={setInstallPromptTitle}
        onDescriptionChange={setInstallPromptDescription}
        onButtonTextChange={setInstallButtonText}
      />
      <SaveButton />
    </div>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ADMIN_PASSWORD = "15183020";

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
