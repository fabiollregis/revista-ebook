
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PagesList from "@/components/dashboard/PagesList";
import PagesReport from "@/components/dashboard/PagesReport";

const PagesManager = () => {
  const [activeTab, setActiveTab] = useState("pages");

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pages">Páginas</TabsTrigger>
            <TabsTrigger value="report">Relatório</TabsTrigger>
          </TabsList>
          <TabsContent value="pages" className="mt-6">
            <PagesList />
          </TabsContent>
          <TabsContent value="report" className="mt-6">
            <PagesReport />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default PagesManager;
