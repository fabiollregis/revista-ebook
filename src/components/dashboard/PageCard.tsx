
import React from "react";
import { Link } from "react-router-dom";
import { PageData } from "@/types/page";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, ExternalLink, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PageCardProps {
  page: PageData;
  onEdit: (page: PageData) => void;
  onDelete: (page: PageData) => void;
}

const PageCard: React.FC<PageCardProps> = ({ page, onEdit, onDelete }) => {
  // Formatar a data de criação
  const formattedDate = formatDistanceToNow(new Date(page.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-lg">{page.title}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{page.description || "Sem descrição"}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>Criado {formattedDate}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-1">
          {page.iframeUrl}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(page)}>
            <Edit size={16} className="mr-1" /> Editar
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" 
            onClick={() => onDelete(page)}>
            <Trash size={16} className="mr-1" /> Excluir
          </Button>
        </div>
        
        <Link to={`/page/${page.slug}`} target="_blank">
          <Button variant="outline" size="sm">
            <ExternalLink size={16} className="mr-1" /> Visualizar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PageCard;
