
export interface PageData {
  id: string;
  title: string;
  slug: string; // URL amigável
  iframeUrl: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}
