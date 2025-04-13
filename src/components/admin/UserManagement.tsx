
import React, { useState, useEffect } from "react";
import { getUserProfiles } from "@/utils/supabase/user-api";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "./user-management/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserManagementHeader from "./user-management/UserManagementHeader";
import UserTable from "./user-management/UserTable";
import UserCard from "./user-management/UserCard";
import EmptyState from "./user-management/EmptyState";

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"table" | "cards">("cards");
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const profiles = await getUserProfiles();
      setUsers(profiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar os dados dos usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = (userId: string, newIsAdmin: boolean) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, is_admin: newIsAdmin } : user
      )
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Gestão de Usuários</CardTitle>
          <CardDescription>Gerencie as contas e permissões dos usuários</CardDescription>
        </div>
        <UserManagementHeader 
          loading={loading}
          activeView={activeView}
          onViewChange={setActiveView}
          onRefresh={fetchUsers}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <>
            {activeView === "table" ? (
              <UserTable 
                users={users} 
                onStatusChange={handleStatusChange} 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {users.map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    onStatusChange={handleStatusChange} 
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState loading={loading} />
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
