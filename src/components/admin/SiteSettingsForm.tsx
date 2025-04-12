
import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";

const SiteSettingsForm: React.FC = () => {
  const { siteTitle, setSiteTitle } = useAdmin();

  return (
    <div className="mb-6">
      <label htmlFor="site-title" className="block text-sm font-medium text-gray-700 mb-1">
        Título do Site
      </label>
      <Input
        id="site-title"
        type="text"
        value={siteTitle}
        onChange={(e) => setSiteTitle(e.target.value)}
        placeholder="Venice Guide"
      />
    </div>
  );
};

export default SiteSettingsForm;
