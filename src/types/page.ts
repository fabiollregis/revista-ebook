
export interface PageData {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  iframe_url: string;
  description?: string;
  updated_at?: string;
  password?: string;
  password_protected?: boolean;
  view_count?: number;
}

export interface SiteSettings {
  siteTitle: string;
  footerText: string;
  metaDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}
