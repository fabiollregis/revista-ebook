
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePages } from "@/contexts/PagesContext";

const Dashboard = () => {
  const { pages } = usePages();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Gerencie suas páginas com iframes</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/dashboard/pages")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Página
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{pages.length}</CardTitle>
                <CardDescription>Páginas Criadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/pages")}>
                  Ver Todas
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Gerenciar</CardTitle>
                <CardDescription>Editar páginas existentes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/pages")}>
                  Gerenciar Páginas
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Visualizar Site</CardTitle>
                <CardDescription>Ver o site público</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" /> Abrir Site
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold mt-8">Páginas Recentes</h2>
          
          {pages.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-muted-foreground mb-4">
                  Você ainda não criou nenhuma página.
                </p>
                <Button onClick={() => navigate("/dashboard/pages")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Criar Primeira Página
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.slice(0, 6).map((page) => (
                <Card key={page.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{page.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{page.description || "Sem descrição"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" /> Visualizar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </PageTransition>
  );
};

export default Dashboard;
