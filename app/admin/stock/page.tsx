"use client";
import { useState } from "react";
import { useProducts, useUpdateProduct, Product } from "@/hooks/use-products";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminStockPage() {
  const { data: productsData, isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const [localStock, setLocalStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const getStock = (product: Product): number => {
    const stock = localStock[product.id];
    return stock !== undefined ? stock : product.stock;
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setLocalStock(prev => ({ ...prev, [id]: Math.max(0, newStock) }));
  };

  const handleSave = async (product: Product) => {
    const stockToSave = getStock(product);
    if (stockToSave === product.stock) return;

    setSavingId(product.id);
    try {
      let status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" = "IN_STOCK";
      if (stockToSave === 0) status = "OUT_OF_STOCK";
      else if (stockToSave < 20) status = "LOW_STOCK";

      await updateProduct.mutateAsync({
        id: product.id,
        data: { stock: stockToSave, status }
      });
      toast.success("Stock updated successfully");
      
      setLocalStock(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } catch (error) {
      toast.error("Failed to update stock");
    } finally {
      setSavingId(null);
    }
  };

  const columns = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (item: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                 <ImageIcon className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
      )
    },
    { 
      header: "Category", 
      accessorKey: "category",
      cell: (item: Product) => item.category?.name || "Unknown"
    },
    {
      header: "Current Stock",
      accessorKey: "stock",
      cell: (item: Product) => <span className="font-bold text-lg">{getStock(item)}</span>
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: Product) => {
        const currentStock = getStock(item);
        let statusDisplay = "In stock";
        let color = "bg-green-500/20 text-green-700 dark:text-green-400";

        if (currentStock === 0) {
          statusDisplay = "Out of stock";
          color = "bg-red-500/20 text-red-700 dark:text-red-400";
        } else if (currentStock < 20) {
          statusDisplay = "Low stock";
          color = "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
        }

        return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>{statusDisplay}</span>;
      }
    },
    {
      header: "Update Quantity",
      accessorKey: "update",
      cell: (item: Product) => {
        const currentStock = getStock(item);
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateStock(item.id, currentStock - 1)}>
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={currentStock}
              onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
              className="w-16 h-8 text-center px-1"
            />
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateStock(item.id, currentStock + 1)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        );
      }
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (item: Product) => {
        const hasChanged = localStock[item.id] !== undefined && localStock[item.id] !== item.stock;
        const isSaving = savingId === item.id;
        
        return (
          <Button 
            variant={hasChanged ? "default" : "outline"} 
            size="sm" 
            className="h-8 shadow min-w-[80px]"
            onClick={() => handleSave(item)}
            disabled={!hasChanged || isSaving}
          >
            {isSaving ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Save className="h-3 w-3 mr-2" />} 
            Save
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Update inventory levels across all products.</p>
        </div>
        <div className="bg-muted p-2 rounded-lg inline-flex items-center text-sm font-medium gap-2 border">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> In Stock
          <span className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></span> Low
          <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span> Out
        </div>
      </div>
      
      {isLoading ? (
        <div className="w-full flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={productsData?.products || []} />
      )}
    </div>
  );
}
