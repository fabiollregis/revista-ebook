import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    session
  } = useAuth();
  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {
        error
      } = await signIn(email, password);
      if (!error) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const {
        error
      } = await signUp(email, password);
      if (!error) {
        // Keep on the same page to let user sign in after registration
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/30 p-4" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }}>
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm">
            <ArrowLeft size={16} />
            <span>Voltar para a página inicial</span>
          </Link>
        </div>
        
        <Card className="border-border/50 shadow-lg bg-white/80 backdrop-blur-sm py-0 px-[15px] my-0 mx-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Painel Admin</CardTitle>
            <CardDescription className="text-center">Faça login</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <span className="flex items-center gap-2">Entrando...</span> : <span className="flex items-center gap-2">
                        <LogIn size={18} />
                        Entrar
                      </span>}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-register">E-mail</Label>
                    <Input id="email-register" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <Input id="password-register" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <span className="flex items-center gap-2">Cadastrando...</span> : <span className="flex items-center gap-2">
                        <UserPlus size={18} />
                        Cadastrar
                      </span>}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </motion.div>;
};
export default Auth;