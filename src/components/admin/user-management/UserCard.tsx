
import React from "react";
import { UserProfile } from "./types";
import { getRandomColor, getInitials } from "./utils";
import { updateUserAdminStatus } from "@/utils/supabase/user-api";
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
import { Mail, Shield, X, Check } from "lucide-react";

interface UserCardProps {
  user: UserProfile;
  onStatusChange: (userId: string, newIsAdmin: boolean) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusChange }) => {
  const { toast } = useToast();

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

  return (
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
      </CardFooter>
    </Card>
  );
};

export default UserCard;
