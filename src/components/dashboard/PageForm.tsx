
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePages } from "@/contexts/PagesContext";
import { PageData } from "@/types/page";
import { generateSlug } from "@/utils/string-utils";

interface PageFormProps {
  page?: PageData;
  onCancel: () => void;
}

const PageForm: React.FC<PageFormProps> = ({ page, onCancel }) => {
  const { addPage, updatePage } = usePages();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(page?.title || "");
  const [iframeUrl, setIframeUrl] = useState(page?.iframe_url || "");
  const [description, setDescription] = useState(page?.description || "");
  const [facebookPixelCode, setFacebookPixelCode] = useState(page?.facebook_pixel_code || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "O título é obrigatório";
    }
    
    try {
      if (!iframeUrl.trim()) {
        newErrors.iframeUrl = "A URL do iframe é obrigatória";
      } else {
        // Tenta criar uma URL para validar
        new URL(iframeUrl);
      }
    } catch (error) {
      newErrors.iframeUrl = "A URL do iframe é inválida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (page) {
        // Atualizar página existente
        await updatePage(page.id, {
          title,
          iframe_url: iframeUrl,
          description,
          facebook_pixel_code: facebookPixelCode,
        });
      } else {
        // Criar nova página
        await addPage({
          title,
          slug: generateSlug(title),
          iframe_url: iframeUrl,
          description,
          facebook_pixel_code: facebookPixelCode,
        });
      }
      
      // Redirecionar para a listagem
      navigate("/dashboard");
      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{page ? "Editar Página" : "Nova Página"}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel} type="button">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da página"
          className={errors.title ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="iframe-url">URL do Iframe</Label>
        <Input
          id="iframe-url"
          value={iframeUrl}
          onChange={(e) => setIframeUrl(e.target.value)}
          placeholder="https://exemplo.com/embed"
          className={errors.iframeUrl ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.iframeUrl && <p className="text-red-500 text-sm">{errors.iframeUrl}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="facebook-pixel">Código do Pixel do Facebook (opcional)</Label>
        <Textarea
          id="facebook-pixel"
          value={facebookPixelCode}
          onChange={(e) => setFacebookPixelCode(e.target.value)}
          placeholder="Insira o código completo do pixel do Facebook"
          className="min-h-24 font-mono text-xs"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Insira o código completo do pixel do Facebook, incluindo as tags &lt;script&gt;. Este código será executado apenas nesta página específica.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva esta página"
          className="min-h-24"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : page ? "Atualizar" : "Criar"} Página
        </Button>
      </div>
    </form>
  );
};

export default PageForm;
