
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, FileText, Settings, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Layout,
    },
    {
      title: "Páginas",
      path: "/dashboard/pages",
      icon: FileText,
    },
    {
      title: "Configurações",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-bold text-lg">Venice Guide</span>
              </Link>
              <div className="text-xs text-gray-500 mt-1">Gerenciador de Páginas</div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center",
                        location.pathname === item.path && "bg-accent"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    <span>Voltar ao Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="py-2">
              <SidebarTrigger />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
