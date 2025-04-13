
import React, { useState, useEffect } from "react";
import { getUserProfiles, updateUserAdminStatus } from "@/utils/supabase/user-api";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/string-utils";

interface UserProfile {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleAdminToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const success = await updateUserAdminStatus(userId, !currentStatus);
      
      if (success) {
        // Update local state
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, is_admin: !currentStatus } : user
          )
        );
        
        toast({
          title: "Status atualizado",
          description: `Permissões de administrador ${!currentStatus ? "concedidas" : "revogadas"} com sucesso.`,
        });
      } else {
        throw new Error("Falha ao atualizar status");
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar as permissões do usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Gestão de Usuários</CardTitle>
          <CardDescription>Gerencie as contas e permissões dos usuários</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchUsers} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Atualizar</span>
        </Button>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.is_admin}
                      onCheckedChange={() => handleAdminToggle(user.id, user.is_admin)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_admin ? "default" : "outline"}>
                      {user.is_admin ? "Administrador" : "Usuário"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <User size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
            <p className="text-muted-foreground">
              {loading ? "Carregando usuários..." : "Não há usuários cadastrados no sistema."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
