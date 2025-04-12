
import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";

const IframeSettingsForm: React.FC = () => {
  const { iframeUrl, setIframeUrl, iframeTitle, setIframeTitle } = useAdmin();

  return (
    <div className="space-y-4 mb-6">
      <div>
        <label htmlFor="iframe-url" className="block text-sm font-medium text-gray-700 mb-1">
          URL do Iframe (URL da revista embedada)
        </label>
        <Input
          id="iframe-url"
          type="url"
          value={iframeUrl}
          onChange={(e) => setIframeUrl(e.target.value)}
          placeholder="https://heyzine.com/flip-book/exemplo.html"
        />
        <p className="mt-1 text-sm text-gray-500">
          Insira a URL completa da revista que deseja exibir.
        </p>
      </div>
      
      <div>
        <label htmlFor="iframe-title" className="block text-sm font-medium text-gray-700 mb-1">
          Título do Iframe
        </label>
        <Input
          id="iframe-title"
          type="text"
          value={iframeTitle}
          onChange={(e) => setIframeTitle(e.target.value)}
          placeholder="Venice Guide - Interactive Flipbook"
        />
      </div>
    </div>
  );
};

export default IframeSettingsForm;
