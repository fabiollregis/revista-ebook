
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, FileText, Settings, ExternalLink, Moon, Sun, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Layout,
      description: "Visão geral"
    }, 
    {
      title: "Páginas",
      path: "/dashboard/pages",
      icon: FileText,
      description: "Gerenciar conteúdo"
    }, 
    {
      title: "Configurações",
      path: "/dashboard/settings",
      icon: Settings,
      description: "Preferências do site"
    }
  ];
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      } 
    })
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const handleLogout = () => {
    // Simula o logout limpando qualquer dado de autenticação
    localStorage.removeItem("venice-admin-auth");
    
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado do sistema",
      variant: "default",
    });
    
    // Redireciona para a página inicial
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-accent/30">
        <Sidebar className="glass border-r border-border/50">
          <SidebarHeader>
            <div className="p-4">
              <Link to="/" className="flex items-center space-x-2">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  VG
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-bold text-lg text-foreground"
                    >
                      Venice Guide
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground mt-1"
                  >
                    Gerenciador de Conteúdo
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <div className="space-y-1 px-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-md transition-all",
                            location.pathname === item.path 
                              ? "bg-primary text-primary-foreground font-medium shadow-md" 
                              : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          <item.icon className="w-5 h-5 min-w-5" />
                          <AnimatePresence>
                            {!isCollapsed && (
                              <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                              >
                                <div>{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50 px-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link 
                      to="/" 
                      className="flex items-center text-foreground/70 hover:text-foreground px-3 py-2 rounded-md hover:bg-accent/50 transition-all"
                    >
                      <ExternalLink className="w-5 h-5 mr-3" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                          >
                            Visitar Site
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full mt-2 flex items-center justify-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                          >
                            Sair
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
          
          <div className="p-4 mt-auto border-t border-border/50 flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleTheme}
              className="flex items-center justify-center"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center ml-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <motion.div 
            className="p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-2 flex items-center justify-between">
              <SidebarTrigger />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-white/80"
              >
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </div>
            <main>{children}</main>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
