
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { usePages } from "@/contexts/PagesContext";
import { BarChart4, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PagesReport = () => {
  const { pages, loading } = usePages();

  const stats = useMemo(() => {
    const totalPages = pages.length;
    const totalViews = pages.reduce((sum, page) => sum + (page.view_count || 0), 0);
    const avgViews = totalPages > 0 ? totalViews / totalPages : 0;
    const sortedPages = [...pages].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    
    return {
      totalPages,
      totalViews,
      avgViews,
      sortedPages
    };
  }, [pages]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Páginas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              páginas publicadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              visualizações em todas as páginas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Visualizações</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgViews.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              visualizações por página
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatório de Páginas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando dados...</div>
          ) : stats.totalPages === 0 ? (
            <div className="text-center py-4">Nenhuma página encontrada</div>
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
                {stats.sortedPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <a 
                        href={`/page/${page.slug}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {page.slug}
                      </a>
                    </TableCell>
                    <TableCell>
                      {page.created_at ? formatDate(page.created_at) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">{page.view_count || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PagesReport;
