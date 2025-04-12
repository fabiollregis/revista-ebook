
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PagesList from "@/components/dashboard/PagesList";

const PagesManager = () => {
  return (
    <DashboardLayout>
      <PagesList />
    </DashboardLayout>
  );
};

export default PagesManager;
