
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
  const [iframeUrl, setIframeUrl] = useState(page?.iframeUrl || "");
  const [description, setDescription] = useState(page?.description || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const slug = page?.slug || generateSlug(title);
    
    if (page) {
      // Atualizar página existente
      updatePage(page.id, {
        title,
        iframeUrl,
        description,
      });
    } else {
      // Criar nova página
      addPage({
        title,
        slug,
        iframeUrl,
        description,
      });
    }
    
    // Redirecionar para a listagem
    navigate("/dashboard");
    onCancel();
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
        />
        {errors.iframeUrl && <p className="text-red-500 text-sm">{errors.iframeUrl}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva esta página"
          className="min-h-24"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {page ? "Atualizar" : "Criar"} Página
        </Button>
      </div>
    </form>
  );
};

export default PageForm;
