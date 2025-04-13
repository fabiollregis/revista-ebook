
import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PagesList from "@/components/dashboard/PagesList";

const PagesManager = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PagesList />
      </motion.div>
    </DashboardLayout>
  );
};

export default PagesManager;
