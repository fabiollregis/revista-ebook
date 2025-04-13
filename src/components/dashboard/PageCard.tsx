
import React from "react";
import { Edit, Trash2, ExternalLink, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="transition-all duration-200"
    >
      <Card className="glass-card h-full flex flex-col overflow-hidden">
        <CardHeader className="pb-2 border-b border-border/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-lg font-semibold truncate group flex items-center">
            {page.title}
          </CardTitle>
          <CardDescription className="flex items-center text-xs">
            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
            {formattedDate}
          </CardDescription>
        </CardHeader>
        
        {page.description && (
          <CardContent className="pt-3 pb-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-2">{page.description}</p>
          </CardContent>
        )}
        
        <CardContent className="pt-0 pb-3">
          <p className="text-xs text-muted-foreground truncate">
            {page.iframe_url}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2 pb-3 border-t border-border/20 bg-accent/30 mt-auto">
          <div className="flex justify-between w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Abrir página em uma nova aba</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(page)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar página</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(page)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir página</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PageCard;
