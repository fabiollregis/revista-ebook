
import React, { useState, useEffect } from "react";
import { getUserProfiles, updateUserAdminStatus, createUser } from "@/utils/supabase/user-api";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RefreshCw, User, UserCog, UserPlus, Mail, Key, Shield, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/string-utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface UserProfile {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  isAdmin: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"table" | "cards">("cards");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdmin: false
    }
  });

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

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await createUser(values.email, values.password, values.isAdmin);
      
      if (result.success) {
        toast({
          title: "Usuário criado",
          description: "O usuário foi criado com sucesso",
        });
        setIsCreateDialogOpen(false);
        form.reset();
        fetchUsers(); // Refresh the user list
      } else {
        toast({
          title: "Erro ao criar usuário",
          description: result.error || "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const getRandomColor = (id: string) => {
    // Generate a consistent color based on user ID
    const colors = [
      "from-blue-500/60 to-indigo-500/60",
      "from-green-500/60 to-emerald-500/60",
      "from-purple-500/60 to-pink-500/60",
      "from-amber-500/60 to-orange-500/60",
      "from-red-500/60 to-rose-500/60",
      "from-cyan-500/60 to-sky-500/60"
    ];
    
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getInitials = (email: string) => {
    // Extract initials from email (before @)
    const name = email.split('@')[0];
    if (name.length <= 2) return name.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Gestão de Usuários</CardTitle>
          <CardDescription>Gerencie as contas e permissões dos usuários</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2"
              >
                <UserPlus size={16} />
                <span>Novo Usuário</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para criar um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="usuario@exemplo.com" 
                            {...field} 
                            type="email"
                          />
                        </FormControl>
                        <FormDescription>
                          Este será o email de login do usuário
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Senha" 
                            {...field} 
                            type="password"
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo de 6 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isAdmin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Administrador</FormLabel>
                          <FormDescription>
                            Conceder permissões de administrador
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Usuário</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Tabs defaultValue={activeView} onValueChange={(v) => setActiveView(v as "table" | "cards")}>
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Tabela</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchUsers} 
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <>
            {activeView === "table" ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {users.map((user) => (
                  <Card key={user.id} className="overflow-hidden border-2 transition-all hover:shadow-md">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRandomColor(user.id)} flex items-center justify-center text-white font-semibold`}>
                          {getInitials(user.username)}
                        </div>
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
                        onClick={() => handleAdminToggle(user.id, user.is_admin)}
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
                ))}
              </div>
            )}
          </>
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
