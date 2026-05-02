"use client";

import { useCartStore } from "@/store/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { handleWhatsAppCheckout } from "@/lib/checkout";

export function CartSheet() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-transparent">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    handleWhatsAppCheckout(items, totalPrice);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-black uppercase tracking-tight flex items-center">
              <ShoppingCart className="mr-3 h-6 w-6 text-primary" />
              Cart
            </SheetTitle>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto relative p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-24">
              <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center mb-4 border border-border/50">
                <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-30" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Your Cart is Empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Add performance gear to your cart to optimize your metrics.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image || "/products/placeholder.jpeg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="truncate">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                          {typeof item.category === 'string' ? item.category : item.category?.name || 'Uncategorized'}
                        </p>
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      </div>
                      <p className="font-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/50">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-background" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-background" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border/50 bg-background/95 backdrop-blur-xl relative z-10 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground pb-4 border-b border-border/50">
              <span>Shipping & Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between items-center font-black text-xl pt-2">
              <span className="uppercase tracking-tight">Total</span>
              <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" className="h-12 font-bold hover:bg-muted/50" onClick={clearCart}>
                Clear All
              </Button>
              <Button 
                className="h-12 font-bold gap-2 text-white shadow-[0_0_15px_rgba(30,58,138,0.3)]"
                onClick={handleCheckout}
              >
                <CreditCard className="w-4 h-4" /> Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
