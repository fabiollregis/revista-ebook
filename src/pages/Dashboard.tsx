
import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createAdminUser } from "@/utils/create-admin-user";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Create admin user on first load
    createAdminUser();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel administrativo da Revista Digital
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/dashboard/pages">
            <Card className="overflow-hidden border-border/40 hover:border-primary/30 transition-all hover:shadow-md">
              <CardHeader className="bg-muted/50 flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl">Páginas</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription>
                  Gerencie o conteúdo e páginas da revista digital
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/dashboard/settings">
            <Card className="overflow-hidden border-border/40 hover:border-primary/30 transition-all hover:shadow-md">
              <CardHeader className="bg-muted/50 flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl">Configurações</CardTitle>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription>
                  Configure preferências gerais do aplicativo
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
