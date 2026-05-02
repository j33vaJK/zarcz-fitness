"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory, 
  Category 
} from "@/hooks/use-categories";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ArrowLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

// Define the validation schema
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const watchImage = watch("image");

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    reset({
      name: category.name,
      image: category.image ?? "",
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentCategory(null);
    reset({
      name: "",
      image: "",
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Update form value with the returned URL
      setValue('image', result.data.url, { shouldValidate: true });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    console.log("Submitting category data:", data);
    try {
      if (currentCategory) {
        console.log("Calling update mutation...");
        const res = await updateCategory.mutateAsync({ id: currentCategory.id, data });
        console.log("Update success:", res);
        toast.success("Category updated successfully");
      } else {
        console.log("Calling create mutation...");
        const res = await createCategory.mutateAsync(data);
        console.log("Create success:", res);
        toast.success("Category created successfully");
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("Raw error object:", error);
      console.error("Stringified error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast.error(error?.message || "An error occurred. Check console.");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast.success(`"${categoryToDelete.name}" deleted successfully`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete category");
    } finally {
      setCategoryToDelete(null);
    }
  };

  const columns = [
    {
      header: "Category",
      accessorKey: "name",
      cell: (item: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <span className="font-medium truncate max-w-[200px]">{item.name}</span>
        </div>
      )
    },
    { 
      header: "Products Count", 
      accessorKey: "itemCount",
      cell: (item: Category) => (
        <div className="font-medium">{item.itemCount} items</div>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: Category) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Pencil className="w-4 h-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCategoryToDelete(item)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {currentCategory ? "Edit Category" : "Add New Category"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Fill in the details below to save the category.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="name" className="text-xs md:text-sm">Category Name</Label>
                  <Input 
                    id="name" 
                    {...register("name")} 
                    placeholder="e.g. Footwear" 
                    className="h-8 md:h-10 text-xs md:text-sm" 
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="image" className="text-xs md:text-sm">Category Image</Label>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />

                <div 
                  className={`mt-4 border-2 border-dashed rounded-xl p-4 md:p-8 flex flex-col items-center justify-center gap-2 md:gap-4 transition-colors cursor-pointer hover:bg-muted/50 ${errors.image ? 'border-destructive' : 'border-muted-foreground/25'}`}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                      <span className="text-sm text-muted-foreground">Uploading image...</span>
                    </div>
                  ) : watchImage ? (
                    <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={watchImage} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-50" onError={(e) => (e.currentTarget.src = "")} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white mb-2 shadow-sm" />
                        <span className="text-sm text-white font-medium shadow-sm">Click to replace</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="w-8 h-8 md:w-12 md:h-12 opacity-50 mb-3" />
                      <span className="text-sm font-medium mb-1">Click to upload image</span>
                      <span className="text-[10px] md:text-xs text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</span>
                    </div>
                  )}
                </div>
                
                {/* Hidden input to track the form value for react-hook-form */}
                <input type="hidden" {...register("image")} />
                {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
              </div>

              <div className="flex justify-end gap-2 md:gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 md:h-10 text-xs md:text-sm" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting || isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-8 md:h-10 text-xs md:text-sm gap-2"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  {currentCategory ? "Update" : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Manage your product categories and collections.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add New Category
        </Button>
      </div>

      {isLoadingCategories ? (
        <div className="w-full flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={categories || []} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the <strong>{categoryToDelete?.name}</strong> category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
