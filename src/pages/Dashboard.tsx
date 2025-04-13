import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Settings, Users, BookOpen, BarChart4, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createAdminUser } from "@/utils/create-admin-user";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  useEffect(() => {
    // Create admin user on first load
    createAdminUser();
  }, []);
  const cardVariants = {
    initial: {
      y: 20,
      opacity: 0
    },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3
      }
    }
  };
  const cards = [{
    title: "Páginas",
    description: "Gerencie o conteúdo e páginas da revista digital",
    icon: FileText,
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-200 dark:border-blue-800/30",
    path: "/dashboard/pages",
    stats: "12 páginas"
  }, {
    title: "Configurações",
    description: "Configure preferências gerais do aplicativo",
    icon: Settings,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-200 dark:border-purple-800/30",
    path: "/dashboard/settings",
    stats: "4 opções"
  }, {
    title: "Visualizações",
    description: "Acompanhe o engajamento dos seus leitores",
    icon: BarChart4,
    color: "from-green-500/20 to-teal-500/20",
    borderColor: "border-green-200 dark:border-green-800/30",
    path: "/dashboard",
    stats: "2.457 views"
  }, {
    title: "Usuários",
    description: "Gerenciar permissões e usuários do sistema",
    icon: Users,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-200 dark:border-amber-800/30",
    path: "/dashboard",
    stats: "8 usuários"
  }, {
    title: "Publicações",
    description: "Acesse todas as suas publicações recentes",
    icon: BookOpen,
    color: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-200 dark:border-rose-800/30",
    path: "/dashboard",
    stats: "3 publicações"
  }, {
    title: "Ações Rápidas",
    description: "Atalhos para tarefas frequentes",
    icon: Zap,
    color: "from-cyan-500/20 to-sky-500/20",
    borderColor: "border-cyan-200 dark:border-cyan-800/30",
    path: "/dashboard",
    stats: "5 ações"
  }];
  return <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>Painel de Controle</motion.h1>
          <motion.p className="text-muted-foreground mt-2" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2,
          duration: 0.5
        }}>
            Bem-vindo ao painel administrativo da Revista Digital, {user?.email}
          </motion.p>
        </div>
        
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }}>
          {cards.map((card, index) => <HoverCard key={card.title} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link to={card.path}>
                  <motion.div custom={index} initial="initial" animate="animate" whileHover="hover" variants={cardVariants} className={`h-full`}>
                    <Card className={`h-full overflow-hidden border-2 ${card.borderColor} relative magazine-card`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50`}></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5"></div>
                      
                      <CardHeader className="relative z-10 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                        <card.icon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      
                      <CardContent className="relative z-10 pt-2">
                        <div className="mb-4">
                          <CardDescription className="text-sm">
                            {card.description}
                          </CardDescription>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground mt-auto pt-2 border-t border-border/30">
                          {card.stats}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 overflow-hidden">
                <div className={`p-4 bg-gradient-to-br ${card.color} bg-opacity-30`}>
                  <div className="flex items-center gap-3">
                    <card.icon className="h-8 w-8" />
                    <div>
                      <h4 className="text-lg font-semibold">{card.title}</h4>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm">
                    Acesse rápido as funcionalidades de {card.title.toLowerCase()} para gerenciar sua revista digital de forma eficiente.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>)}
        </motion.div>
      </div>
    </DashboardLayout>;
};
export default Dashboard;