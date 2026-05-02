"use client";

import { ShoppingCart, Eye, Activity } from "lucide-react";
import { Product as ApiProduct } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import Link from "next/link";


/** Normalise the API's uppercase status enum to display-friendly strings */
function normaliseStatus(status: ApiProduct["status"]): "In stock" | "Low stock" | "Out of stock" {
  switch (status) {
    case "IN_STOCK":   return "In stock";
    case "LOW_STOCK":  return "Low stock";
    case "OUT_OF_STOCK": return "Out of stock";
    default:           return "In stock";
  }
}

type DisplayStatus = "In stock" | "Low stock" | "Out of stock";

function getStatusColor(status: DisplayStatus) {
  switch (status) {
    case "In stock":    return "text-primary border-primary/50 bg-primary/10 shadow-[0_0_10px_rgba(255,107,53,0.5)]";
    case "Low stock":   return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
    case "Out of stock": return "text-red-500 border-red-500/50 bg-red-500/10";
    default:            return "text-muted-foreground bg-muted";
  }
}

interface ProductCardProps {
  product: ApiProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const displayStatus = normaliseStatus(product.status);
  const categoryName = product.category?.name ?? "";
  const imageSrc = product.image ?? "https://images.unsplash.com/photo-1517344884509-a0c97ea11cb7?w=500&q=80";

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      category: categoryName,
      price: product.price,
      stock: product.stock,
      status: displayStatus,
      image: imageSrc,
      description: product.description,
      featured: product.featured,
      boxQuantity: product.boxQuantity ?? undefined,
    } as any);
    toast.success(`${product.name} added to cart`, {
      description: "Access your cart in the header to checkout.",
    });
  };

  return (
    <Dialog>
      <motion.div
        whileHover={{ y: -10 }}
        className="group relative h-full flex flex-col perspective-1000"
      >
        <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-b from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur-md pointer-events-none" />

        <div className="relative flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,107,53,0.15)] group-hover:bg-card/80">

          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-tr from-muted to-muted/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110 relative z-10 mix-blend-normal"
            />

            {/* Dark overlay + quick-view button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 flex items-center justify-center z-20">
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 border-2 border-primary bg-background/20 backdrop-blur-md text-primary hover:bg-primary hover:text-primary-foreground shadow-[0_0_20px_rgba(255,107,53,0.5)]">
                  <Eye className="h-5 w-5" />
                </Button>
              </DialogTrigger>
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-30">
              <div className={cn("px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border backdrop-blur-md", getStatusColor(displayStatus))}>
                {displayStatus}
              </div>
            </div>

            {/* Category icon dot */}
            <div className="absolute top-3 right-3 z-30">
              <div className="h-6 w-6 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50">
                <Activity className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-3 flex-1 flex flex-col justify-between relative z-20">
            <div>
              <div className="text-[8px] font-black text-primary mb-1 uppercase tracking-widest flex items-center opacity-80">
                <span className="w-1 h-1 rounded-full bg-primary mr-1.5 animate-pulse" />
                {categoryName}
              </div>
              <Link href={`/products/${product.id}`}>
                <h3 className="font-black text-xs md:text-sm leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-all">
                  {product.name}
                </h3>
              </Link>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Value</span>
                <p className="font-black text-base md:text-lg tracking-tighter">₹{product.price.toFixed(2)}</p>
              </div>

              <Button
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300 p-0",
                  displayStatus === "Out of stock"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:bg-orange-600 hover:scale-110 shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_25px_rgba(255,107,53,0.8)]"
                )}
                disabled={displayStatus === "Out of stock"}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick-view Dialog */}
        <DialogContent className="sm:max-w-[800px] border-border/50 bg-background/95 p-0 overflow-hidden shadow-[0_0_50px_rgba(255,107,53,0.15)] rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt={product.name} className="object-cover w-full h-full" />
              <div className="absolute top-4 left-4 z-10">
                <span className={cn("px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full border backdrop-blur-md shadow-lg", getStatusColor(displayStatus))}>
                  {displayStatus}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center relative">
              <DialogHeader>
                <div className="text-xs font-black text-primary mb-3 uppercase tracking-widest flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> {categoryName}
                </div>
                <DialogTitle className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">{product.name}</DialogTitle>
                <DialogDescription className="text-2xl font-black text-white mt-4 tracking-tighter">
                  ₹{product.price.toFixed(2)}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-8">
                <div className="pl-4 border-l-2 border-primary/30">
                  <p className="text-muted-foreground leading-relaxed font-medium text-lg">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-14 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)] transition-all"
                    size="lg"
                    disabled={displayStatus === "Out of stock"}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {displayStatus === "Out of stock" ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button 
                    variant="outline" 
                    asChild
                    className="h-14 font-black uppercase tracking-widest border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-colors" 
                    size="lg"
                  >
                    <Link href={`/products/${product.id}`}>Full Specs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
