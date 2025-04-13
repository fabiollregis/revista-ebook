
import React, { useState } from "react";
import { UserProfile } from "./types";
import { getRandomColor, getInitials } from "./utils";
import { updateUserAdminStatus, deleteUser } from "@/utils/supabase/user-api";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/string-utils";
import { useAuth } from "@/contexts/AuthContext";

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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserTableProps {
  users: UserProfile[];
  onStatusChange: (userId: string, newIsAdmin: boolean) => void;
  onUserDeleted: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onStatusChange, onUserDeleted }) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteUser = async () => {
    if (!userToDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      const { success, error } = await deleteUser(userToDelete.id);
      
      if (success) {
        onUserDeleted(userToDelete.id);
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso do sistema.",
        });
        setUserToDelete(null);
      } else {
        throw new Error(error || "Falha ao excluir usuário");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Não foi possível excluir o usuário",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            // Prevent deleting yourself
            const isCurrentUser = currentUser?.id === user.id;
            
            return (
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUserToDelete(user)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isCurrentUser}
                    title={isCurrentUser ? "Não é possível excluir seu próprio usuário" : "Excluir usuário"}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.username}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
