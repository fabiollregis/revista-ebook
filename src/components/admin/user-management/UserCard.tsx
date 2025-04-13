
import React, { useState } from "react";
import { UserProfile } from "./types";
import { getRandomColor, getInitials } from "./utils";
import { updateUserAdminStatus, deleteUser } from "@/utils/supabase/user-api";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/string-utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, X, Check, Trash } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";

interface UserCardProps {
  user: UserProfile;
  onStatusChange: (userId: string, newIsAdmin: boolean) => void;
  onUserDeleted: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusChange, onUserDeleted }) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdminToggle = async () => {
    try {
      const success = await updateUserAdminStatus(user.id, !user.is_admin);
      
      if (success) {
        onStatusChange(user.id, !user.is_admin);
        
        toast({
          title: "Status atualizado",
          description: `Permissões de administrador ${!user.is_admin ? "concedidas" : "revogadas"} com sucesso.`,
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
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const { success, error } = await deleteUser(user.id);
      
      if (success) {
        onUserDeleted(user.id);
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso do sistema.",
        });
        setIsDeleteDialogOpen(false);
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

  // Prevent deleting yourself
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <>
      <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.username} />
              ) : (
                <AvatarFallback className={`bg-gradient-to-br ${getRandomColor(user.id)} flex items-center justify-center text-white font-semibold`}>
                  {getInitials(user.username)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="overflow-hidden">
              <CardTitle className="text-base truncate">{user.username}</CardTitle>
              <CardDescription className="text-xs truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-3">
          <div className="text-sm flex items-center gap-2 mt-2">
            <div className="flex-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" /> 
              Status:
            </div>
            <Badge variant={user.is_admin ? "default" : "outline"} className="ml-auto">
              {user.is_admin ? "Administrador" : "Usuário"}
            </Badge>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
            Criado em: {formatDate(user.created_at)}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 bg-muted/30 flex justify-between border-t border-border/30">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs h-8 px-2"
            onClick={handleAdminToggle}
          >
            {user.is_admin ? (
              <>
                <X className="h-3 w-3 mr-1" />
                Remover Admin
              </>
            ) : (
              <>
                <Check className="h-3 w-3 mr-1" />
                Tornar Admin
              </>
            )}
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            className="text-xs h-8 px-2 ml-2"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isCurrentUser} // Prevent deleting yourself
            title={isCurrentUser ? "Não é possível excluir seu próprio usuário" : "Excluir usuário"}
          >
            <Trash className="h-3 w-3 mr-1" />
            Excluir
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{user.username}</strong>?
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

export default UserCard;
