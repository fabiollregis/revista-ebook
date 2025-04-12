
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageData } from "@/types/page";
import { usePages } from "@/contexts/PagesContext";
import PageCard from "@/components/dashboard/PageCard";
import PageForm from "@/components/dashboard/PageForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const PagesList: React.FC = () => {
  const { pages, removePage } = usePages();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageData | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (page: PageData) => {
    setCurrentPage(page);
    setIsFormOpen(true);
  };

  const handleDelete = (page: PageData) => {
    setPageToDelete(page);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pageToDelete) {
      removePage(pageToDelete.id);
      setDeleteConfirmOpen(false);
      setPageToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentPage(undefined);
  };

  // Filtrar páginas com base na busca
  const filteredPages = searchQuery
    ? pages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : pages;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Páginas</h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentPage(undefined)}>
              <Plus size={16} className="mr-2" /> Nova Página
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <PageForm page={currentPage} onCancel={handleCloseForm} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Buscar páginas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredPages.length === 0 ? (
        <div className="text-center py-10">
          {searchQuery ? (
            <p className="text-gray-500">Nenhuma página encontrada para "{searchQuery}"</p>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500">Você ainda não criou nenhuma página</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus size={16} className="mr-2" /> Criar Primeira Página
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map((page) => (
            <PageCard 
              key={page.id} 
              page={page} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{pageToDelete?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PagesList;
