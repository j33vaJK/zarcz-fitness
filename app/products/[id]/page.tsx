"use client";

import { useProduct } from "@/hooks/use-products";
import { useParams, useRouter } from "next/navigation";
import { m, LazyMotion, domAnimation, Variants } from "framer-motion";
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FADE_IN: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

import { handleWhatsAppCheckout } from "@/lib/checkout";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(id as string);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      ...product,
      category: product.category?.name || "Uncategorized",
      status: product.status === "IN_STOCK" ? "In stock" : product.status === "LOW_STOCK" ? "Low stock" : "Out of stock",
      image: product.image || "/products/placeholder.jpeg",
    } as any);

    toast.success(`${product.name} added to cart`, {
      description: "You can view and manage your items in the cart.",
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleWhatsAppCheckout([{ name: product.name, quantity: 1, price: product.price }], product.price);
  };

  if (isLoading) return <ProductLoadingSkeleton />;
  if (isError || !product) return <ProductErrorState />;

  const isOutOfStock = product.status === "OUT_OF_STOCK";

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <m.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Gear
          </m.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image Section */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm group"
            >
              <img
                src={product.image || "/products/placeholder.jpeg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {product.featured && (
                <div className="absolute top-6 left-6 z-20">
                  <Badge className="bg-primary text-primary-foreground font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(255,107,53,0.5)]">
                    Featured Gear
                  </Badge>
                </div>
              )}
            </m.div>

            {/* Info Section */}
            <m.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              className="space-y-8"
            >
              <m.div variants={FADE_IN} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    {product.category?.name}
                  </span>
                  {product.stock < 10 && !isOutOfStock && (
                    <span className="flex items-center gap-1.5 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                      <AlertCircle className="w-3 h-3" /> Only {product.stock} left
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex text-primary">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    (48 Verified Reviews)
                  </span>
                </div>
              </m.div>

              <m.div variants={FADE_IN} className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tighter text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground line-through opacity-50">
                    ₹{(product.price * 1.2).toLocaleString()}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-xl">
                  {product.description}
                </p>
              </m.div>

              {/* Specs & Highlights */}
              <m.div variants={FADE_IN} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, text: "Premium Quality Material" },
                  { icon: Truck, text: "Free Fast Delivery" },
                  { icon: RotateCcw, text: "30-Day Easy Returns" },
                  { icon: CheckCircle2, text: "Verified Athletic Grade" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-card/30 border border-border/50 group hover:border-primary/30 transition-colors">
                    <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-foreground/80">{item.text}</span>
                  </div>
                ))}
              </m.div>

              {/* Action Section */}
              <m.div variants={FADE_IN} className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={cn(
                    "h-16 flex-1 text-lg font-black uppercase tracking-widest transition-all",
                    !isOutOfStock && "shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:shadow-[0_0_40px_rgba(255,107,53,0.5)] hover:scale-[1.02]"
                  )}
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 px-8 border-border/50 hover:bg-primary/10 hover:border-primary/50 font-black uppercase tracking-widest"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </Button>
              </m.div>

              {/* Footer Info */}
              <m.div variants={FADE_IN} className="pt-8 border-t border-border/50 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ships within 24 hours</span>
                </div>
              </m.div>
            </m.div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

function ProductLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <Skeleton className="aspect-square rounded-[3rem]" />
          <div className="space-y-12">
            <div className="space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-16 flex-1" />
                <Skeleton className="h-16 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductErrorState() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AlertCircle className="w-20 h-20 text-red-500 mb-6 opacity-20" />
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Gear Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8 font-medium">
        We couldn't locate the product you're looking for. It might have been removed or the link is incorrect.
      </p>
      <Button asChild className="font-black uppercase tracking-widest">
        <a href="/products">Explore Other Gear</a>
      </Button>
    </div>
  );
}
