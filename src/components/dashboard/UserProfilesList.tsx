
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/string-utils";

interface UserProfile {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export default function UserProfilesList() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setProfiles(data || []);
    } catch (error: any) {
      console.error("Error fetching profiles:", error.message);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar os dados dos usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Generate initials from email
  const getInitials = (email: string) => {
    if (!email) return "?";
    const name = email.split('@')[0];
    if (name.length <= 2) return name.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a color based on user ID
  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-amber-500", "bg-red-500", "bg-pink-500"
    ];
    
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Usuários</CardTitle>
          <CardDescription>Lista de usuários cadastrados no sistema</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={fetchProfiles}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent>
        {profiles.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className={`h-8 w-8 ${getAvatarColor(profile.id)}`}>
                      <AvatarFallback className="text-white text-xs">
                        {getInitials(profile.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{profile.username}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.is_admin ? "default" : "outline"}>
                      {profile.is_admin ? "Administrador" : "Usuário"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(profile.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <User size={42} className="text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {loading ? "Carregando usuários..." : "Não há usuários cadastrados no sistema."}
            </p>
          </div>
        )}
        <div className="text-xs font-medium text-muted-foreground mt-auto pt-2 border-t border-border/30">
          Total de usuários: {profiles.length}
        </div>
      </CardContent>
    </Card>
  );
}
