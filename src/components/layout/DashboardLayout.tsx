
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, FileText, Settings, ExternalLink, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-accent/30">
        <Sidebar className="glass border-r border-border/50">
          <SidebarHeader>
            <div className="p-4">
              <Link to="/" className="flex items-center space-x-2">
                <motion.div 
                  className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  RD
                </motion.div>
                <span className="font-bold text-lg text-foreground">Revista Digital</span>
              </Link>
              <div className="text-xs text-muted-foreground mt-1">Gerenciador de Páginas</div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <div className="space-y-1">
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
                              ? "bg-accent text-accent-foreground font-medium" 
                              : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <div>
                            <div>{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link 
                      to="/" 
                      className="flex items-center text-foreground/70 hover:text-foreground px-3 py-2 rounded-md hover:bg-accent/50 transition-all"
                    >
                      <ExternalLink className="w-5 h-5 mr-3" />
                      <span>Voltar ao Site</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
          
          <div className="p-4 mt-auto border-t border-border/50">
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleTheme}
              className="w-full flex items-center justify-center"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
            <div className="py-2">
              <SidebarTrigger />
            </div>
            <main>{children}</main>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
