"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  Product 
} from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  status: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]),
  image: z.string(),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      stock: 0,
      status: "IN_STOCK",
      image: "",
      description: "",
    },
  });

  const watchImage = watch("image");

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    reset({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      status: product.status,
      image: product.image ?? "",
      description: product.description,
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    reset({
      name: "",
      categoryId: "",
      price: 0,
      stock: 0,
      status: "IN_STOCK",
      image: "",
      description: "",
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

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

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      
      setValue('image', result.data.url, { shouldValidate: true });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (currentProduct) {
        await updateProduct.mutateAsync({ id: currentProduct.id, data });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(data);
        toast.success("Product created successfully");
      }
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || "An error occurred. Please try again.");
      console.error("API Error:", error);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast.success("Product deleted successfully");
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const columns = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (item: Product) => (
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
      header: "Category", 
      accessorKey: "category",
      cell: (item: Product) => item.category?.name || "Unknown"
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (item: Product) => `₹${Number(item.price).toFixed(2)}`
    },
    { header: "Stock", accessorKey: "stock" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: Product) => {
        let color = "text-muted-foreground";
        let label = "Unknown";
        
        if (item.status === "IN_STOCK") { color = "text-green-500"; label = "In stock"; }
        if (item.status === "LOW_STOCK") { color = "text-yellow-500"; label = "Low stock"; }
        if (item.status === "OUT_OF_STOCK") { color = "text-red-500"; label = "Out of stock"; }
        
        return <span className={`font-medium ${color}`}>{label}</span>;
      }
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: Product) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Pencil className="w-4 h-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setProductToDelete(item)}>
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
              {currentProduct ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Fill in the details below to save the product.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="name" className="text-xs md:text-sm">Product Name</Label>
                  <Input 
                    id="name" 
                    {...register("name")} 
                    placeholder="e.g. Pro Running Shorts" 
                    className="h-8 md:h-10 text-xs md:text-sm" 
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="categoryId" className="text-xs md:text-sm">Category</Label>
                  <select
                    id="categoryId"
                    {...register("categoryId")}
                    className="flex h-8 md:h-10 w-full items-center justify-between rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    disabled={isLoadingCategories}
                  >
                    <option value="" disabled>Select category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="price" className="text-xs md:text-sm">Price (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    {...register("price")} 
                    placeholder="0.00" 
                    className="h-8 md:h-10 text-xs md:text-sm" 
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="stock" className="text-xs md:text-sm">Quantity in Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    {...register("stock")} 
                    placeholder="0" 
                    className="h-8 md:h-10 text-xs md:text-sm" 
                  />
                  {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="status" className="text-xs md:text-sm">Status</Label>
                  <select
                    id="status"
                    {...register("status")}
                    className="flex h-8 md:h-10 w-full items-center justify-between rounded-md border border-input bg-background px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="IN_STOCK">In stock</option>
                    <option value="LOW_STOCK">Low stock</option>
                    <option value="OUT_OF_STOCK">Out of stock</option>
                  </select>
                  {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="image" className="text-xs md:text-sm">Product Image</Label>
                
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
                    <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden group bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={watchImage} alt="Preview" className="w-full h-full object-contain transition-opacity group-hover:opacity-50" onError={(e) => (e.currentTarget.src = "")} />
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
                
                <input type="hidden" {...register("image")} />
                {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="description" className="text-xs md:text-sm">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  placeholder="Product description detailing the technical specs and benefits..."
                  className="text-xs md:text-sm min-h-[60px]"
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
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
                  {currentProduct ? "Update" : "Save"}
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Manage your sportswear inventory here.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      {isLoadingProducts ? (
        <div className="w-full flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={productsData?.products || []} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <strong>{productToDelete?.name}</strong> and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
