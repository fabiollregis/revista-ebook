
import React from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import IframeSettingsForm from "@/components/admin/IframeSettingsForm";
import ContentSettingsForm from "@/components/admin/ContentSettingsForm";
import InstallPromptForm from "@/components/admin/InstallPromptForm";
import SaveButton from "@/components/admin/SaveButton";

const Admin = () => {
  return (
    <AdminProvider>
      <AdminLayout>
        <div className="space-y-6">
          <SiteSettingsForm />
          <IframeSettingsForm />
          <ContentSettingsForm />
          <InstallPromptForm />
          <SaveButton />
        </div>
      </AdminLayout>
    </AdminProvider>
  );
};

export default Admin;
