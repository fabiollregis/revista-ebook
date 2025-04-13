
import React from "react";
import { usePages } from "@/contexts/PagesContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ExternalLink, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/string-utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const PagesReport = () => {
  const { pages, loading } = usePages();
  
  // Sort pages by view count (descending)
  const sortedPages = [...pages].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
  
  // Calculate total views
  const totalViews = pages.reduce((sum, page) => sum + (page.view_count || 0), 0);
  
  // Calculate average views per page
  const avgViews = pages.length > 0 ? totalViews / pages.length : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de páginas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pages.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de visualizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Média de visualizações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgViews.toFixed(1)}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Relatório de visualizações por página</CardTitle>
            <CardDescription>
              Visualizações de todas as páginas publicadas no site
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-muted-foreground">Carregando dados...</div>
            ) : sortedPages.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">Nenhuma página encontrada</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Página</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Data de criação</TableHead>
                    <TableHead className="text-right">Visualizações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {page.title}
                          <a 
                            href={`/page/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                        {page.iframe_url}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-muted-foreground" />
                          {format(parseISO(page.created_at), "dd MMM yyyy", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Eye size={14} className="mr-1 text-muted-foreground" />
                          {page.view_count || 0}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PagesReport;
