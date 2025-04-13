
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import CreateUserDialog from "./CreateUserDialog";

interface UserManagementHeaderProps {
  loading: boolean;
  activeView: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
  onRefresh: () => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  loading,
  activeView,
  onViewChange,
  onRefresh,
  isCreateDialogOpen,
  setIsCreateDialogOpen
}) => {
  return (
    <div className="flex items-center gap-2">
      <CreateUserDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={onRefresh}
      />
      
      <Tabs defaultValue={activeView} onValueChange={(v) => onViewChange(v as "cards" | "table")}>
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
        disabled={loading}
      >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      </Button>
    </div>
  );
};

export default UserManagementHeader;
