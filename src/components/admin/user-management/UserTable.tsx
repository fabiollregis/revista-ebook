
import React from "react";
import { UserProfile } from "./types";
import { getRandomColor, getInitials } from "./utils";
import { updateUserAdminStatus } from "@/utils/supabase/user-api";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/string-utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserTableProps {
  users: UserProfile[];
  onStatusChange: (userId: string, newIsAdmin: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onStatusChange }) => {
  const { toast } = useToast();

  const handleAdminToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const success = await updateUserAdminStatus(userId, !currentStatus);
      
      if (success) {
        onStatusChange(userId, !currentStatus);
        
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
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.username} />
                  ) : (
                    <AvatarFallback className={`bg-gradient-to-br ${getRandomColor(user.id)}`}>
                      {getInitials(user.username)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span>{user.username}</span>
              </div>
            </TableCell>
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
  );
};

export default UserTable;
