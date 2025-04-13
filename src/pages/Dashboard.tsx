
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ExternalLink, LayoutDashboard, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { usePages } from "@/contexts/PagesContext";

const Dashboard = () => {
  const { pages } = usePages();
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <PageTransition>
      <DashboardLayout>
        <div className="space-y-6">
          <motion.div 
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-lg glass border border-primary/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Gerencie suas páginas com iframes</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/dashboard/pages")} className="hover-scale">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Página
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="grid gap-4 md:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="glass-card hover-elevate overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/20">
                  <CardTitle className="text-2xl flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    {pages.length}
                  </CardTitle>
                  <CardDescription>Páginas Criadas</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Total de páginas criadas no sistema
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/pages")} className="w-full">
                    Ver Todas
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card className="glass-card hover-elevate overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/20">
                  <CardTitle className="text-2xl flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                    </div>
                    Gerenciar
                  </CardTitle>
                  <CardDescription>Editar páginas existentes</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Edite, organize e configure suas páginas
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/pages")} className="w-full">
                    Gerenciar Páginas
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card className="glass-card hover-elevate overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/20">
                  <CardTitle className="text-2xl flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    Visualizar Site
                  </CardTitle>
                  <CardDescription>Ver o site público</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Veja como seus usuários visualizam o site
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <ExternalLink className="mr-2 h-4 w-4" /> Abrir Site
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Páginas Recentes</h2>
              {pages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/pages")}>
                  Ver Todas
                </Button>
              )}
            </div>
          </motion.div>
          
          {pages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Card className="glass-card border-dashed">
                <CardContent className="text-center p-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não criou nenhuma página.
                  </p>
                  <Button onClick={() => navigate("/dashboard/pages")} className="hover-scale">
                    <PlusCircle className="mr-2 h-4 w-4" /> Criar Primeira Página
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
              transition={{ delayChildren: 0.5 }}
            >
              {pages.slice(0, 6).map((page) => (
                <motion.div key={page.id} variants={item}>
                  <Card className="glass-card hover-elevate overflow-hidden">
                    <CardHeader className="pb-2 border-b border-border/20">
                      <CardTitle className="truncate text-lg">{page.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {page.description || "Sem descrição"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        URL: {page.iframe_url}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Slug: {page.slug}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 pb-3 flex justify-between">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          <ExternalLink className="mr-2 h-4 w-4" /> Visualizar
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </PageTransition>
  );
};

export default Dashboard;
