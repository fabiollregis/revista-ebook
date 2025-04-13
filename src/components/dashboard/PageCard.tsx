
import React from "react";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageData } from "@/types/page";

interface PageCardProps {
  page: PageData;
  onEdit: (page: PageData) => void;
  onDelete: (page: PageData) => void;
}

const PageCard: React.FC<PageCardProps> = ({ page, onEdit, onDelete }) => {
  const formattedDate = page.created_at ? 
    formatDistanceToNow(new Date(page.created_at), { addSuffix: true, locale: ptBR }) : 
    "";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{page.title}</CardTitle>
        <CardDescription>
          {formattedDate}
        </CardDescription>
      </CardHeader>
      
      {page.description && (
        <CardContent className="pt-0 pb-3">
          <p className="text-sm text-gray-600 line-clamp-2">{page.description}</p>
        </CardContent>
      )}
      
      <CardContent className="pt-0 pb-3">
        <p className="text-sm text-gray-500 truncate">{page.iframe_url}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-3">
        <div>
          <Button variant="outline" size="sm" asChild>
            <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" />
              Ver
            </a>
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(page)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(page)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PageCard;
