
export interface PageData {
  id: string;
  title: string;
  slug: string;
  iframe_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  siteTitle: string;
  footerText: string;
  infoText: string;
  iframeUrl: string;
  iframeTitle: string;
  installPromptTitle: string;
  installPromptDescription: string;
  installButtonText: string;
}
