
import React from "react";
import UserManagement from "@/components/admin/UserManagement";
import DashboardLayout from "@/components/layout/DashboardLayout";

const UserManagementPage = () => {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
};

export default UserManagementPage;
