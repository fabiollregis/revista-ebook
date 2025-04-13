
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

const ProfileSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(profile?.username || user?.email || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(!!avatarUrl);

  const updateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    
    setIsUpdating(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl);
        setIsImageLoading(true);
        
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            avatar_url: data.publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id);
        
        if (updateError) throw updateError;
        
        toast({
          title: "Avatar atualizado",
          description: "Sua imagem de perfil foi atualizada com sucesso",
        });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao fazer upload da imagem",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    console.error("Failed to load avatar image");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>
          Gerencie suas informações de perfil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            {avatarUrl && isImageLoading ? (
              <AvatarImage 
                src={avatarUrl} 
                alt={username} 
                onError={handleImageError}
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                <User size={30} />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium">
                Alterar Avatar
              </div>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={isUpdating}
              />
            </Label>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG ou GIF. Tamanho máximo de 2MB.
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Nome de usuário</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu nome de usuário"
            disabled={isUpdating}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Seu nome completo"
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={updateProfile} disabled={isUpdating}>
            {isUpdating ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
