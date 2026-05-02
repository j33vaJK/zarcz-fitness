"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/ui/product-card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

/** Skeleton card shown while products are loading */
function ProductSkeleton() {
  return (
    <div className="rounded-[2rem] overflow-hidden bg-card/60 border border-border/50 animate-pulse">
      <div className="aspect-[4/5] bg-muted/50" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-16 bg-muted/60 rounded-full" />
        <div className="h-3 w-full bg-muted/60 rounded-full" />
        <div className="h-3 w-3/4 bg-muted/60 rounded-full" />
        <div className="mt-3 flex justify-between items-end">
          <div className="h-5 w-16 bg-muted/60 rounded-full" />
          <div className="h-8 w-8 bg-muted/60 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Filter state ────────────────────────────────────────────────────────────
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = searchParams.get("category");
    return cats ? cats.split(",") : [];
  });
  const [priceRange, setPriceRange] = useState<number>(() => {
    const price = searchParams.get("price");
    return price ? Number(price) : 5000;
  });
  const [inStockOnly, setInStockOnly] = useState(() => {
    return searchParams.get("inStock") === "true";
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(() => {
    const p = searchParams.get("page");
    return p ? Number(p) : 1;
  });

  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update URL search params whenever filters change
  const updateURL = useCallback((params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "price" && value === "5000") || (key === "inStock" && value === "false") || (key === "page" && value === "1")) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}` as any, { scroll: false });
  }, [searchParams, router, pathname]);

  // Sync state with URL only on initial mount or back/forward navigation
  useEffect(() => {
    const cats = searchParams.get("category");
    setSelectedCategories(cats ? cats.split(",") : []);
    
    const price = searchParams.get("price");
    setPriceRange(price ? Number(price) : 5000);
    
    const inStock = searchParams.get("inStock") === "true";
    setInStockOnly(inStock);
    
    const p = searchParams.get("page");
    setPage(p ? Number(p) : 1);
  }, [searchParams]);

  const handleCategoryToggle = (name: string) => {
    const newCategories = selectedCategories.includes(name)
      ? selectedCategories.filter((c) => c !== name)
      : [...selectedCategories, name];
    
    setSelectedCategories(newCategories);
    updateURL({ category: newCategories.join(","), page: "1" });
  };

  const handlePriceChange = (val: number) => {
    setPriceRange(val);
    updateURL({ price: val.toString(), page: "1" });
  };

  const handleInStockToggle = (checked: boolean) => {
    setInStockOnly(checked);
    updateURL({ inStock: checked.toString(), page: "1" });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    updateURL({ page: p.toString() });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange(5000);
    setInStockOnly(false);
    setPage(1);
    router.push(pathname as any, { scroll: false });
  };

  // ── Data fetching ────────────────────────────────────────────────────────────
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Pass selected categories to the API (multi-category: first selected, or undefined for all)
  const apiCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : undefined;

  const { data, isLoading, isError } = useProducts({
    category: apiCategory,
    page,
    pageSize: 24,
  });

  // ── Client-side filtering (price, stock, multi-category) ───────────────────
  const allProducts = data?.products ?? [];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.length === 1 || // already filtered server-side
        selectedCategories.includes(p.category?.name ?? "");
      const priceMatch = p.price <= priceRange;
      const stockMatch =
        !inStockOnly || p.status === "IN_STOCK" || p.status === "LOW_STOCK";
      return categoryMatch && priceMatch && stockMatch;
    });
  }, [allProducts, selectedCategories, priceRange, inStockOnly]);

  const totalPages = data?.totalPages ?? 1;

  if (!isMounted) return <div className="container mx-auto px-4 py-fluid-section bg-background min-h-screen" />;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-fluid-section bg-background min-h-screen">

      {/* Mobile header */}
      <div className="flex md:hidden justify-between items-center mb-6">
        <h1 className="text-fluid-h2 font-black uppercase tracking-tight">Products</h1>
        <Button size="sm" variant="outline" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="font-bold">
          <Filter className="mr-2 h-4 w-4" />
          {mobileFiltersOpen ? "Hide Filters" : "Filters"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-fluid">

        {/* ── Filters Sidebar ──────────────────────────────────────────────────── */}
        <aside className={`w-full md:w-72 flex-shrink-0 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
          <div className="sticky top-24 space-y-8 bg-background/60 backdrop-blur-xl p-8 rounded-[2rem] border border-border/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 font-black text-xl border-b border-border/50 pb-6 uppercase tracking-tight">
              <SlidersHorizontal className="h-6 w-6 text-primary" />
              Filters
            </div>

            {/* Categories */}
            <div className="space-y-5">
              <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-widest">Categories</h3>
              <div className="space-y-4">
                {categoriesLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 group">
                        <div className="h-4 w-4 rounded bg-muted/60 animate-pulse" />
                        <div className="h-4 rounded bg-muted/60 animate-pulse" style={{ width: `${60 + i * 15}px` }} />
                      </div>
                    ))
                  : (categories ?? []).map((category) => (
                      <div key={category.id} className="flex items-center space-x-3 group">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={() => handleCategoryToggle(category.name)}
                          className="border-primary/50 group-hover:border-primary transition-colors"
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="font-semibold text-base cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))
                }
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Price Range */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-widest">Price Range</h3>
                <span className="text-sm font-black text-primary bg-primary/10 px-2 py-1 rounded-md">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>₹0</span>
                <span>₹5000+</span>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Availability */}
            <div className="space-y-5">
              <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-widest">Availability</h3>
              <div className="flex items-center space-x-3 group">
                <Checkbox
                  id="in-stock"
                  checked={inStockOnly}
                  onCheckedChange={(checked) => handleInStockToggle(checked as boolean)}
                  className="border-primary/50 group-hover:border-primary transition-colors"
                />
                <Label htmlFor="in-stock" className="font-semibold text-base cursor-pointer group-hover:text-primary transition-colors">
                  In Stock Only
                </Label>
              </div>
            </div>

            {/* Reset */}
            {(selectedCategories.length > 0 || priceRange < 5000 || inStockOnly) && (
              <Button variant="outline" size="sm" className="w-full font-bold border-primary/30 hover:border-primary" onClick={resetFilters}>
                Reset Filters
              </Button>
            )}
          </div>
        </aside>

        {/* ── Product Grid ─────────────────────────────────────────────────────── */}
        <main className="flex-1 space-y-6">

          {/* Result count */}
          {!isLoading && !isError && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Showing <span className="text-foreground font-bold">{filteredProducts.length}</span>
                {data && data.total > 0 && ` of ${data.total}`} products
              </p>
              {totalPages > 1 && (
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-fluid">
              {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center border border-red-500/20 rounded-[2rem] bg-red-500/5"
            >
              <PackageSearch className="h-12 w-12 text-red-400 mb-4 opacity-70" />
              <h3 className="text-xl font-black uppercase tracking-tight text-red-400">Failed to load products</h3>
              <p className="text-muted-foreground mt-2 text-sm">Check your connection and try again.</p>
            </motion.div>
          )}

          {/* Products grid */}
          {!isLoading && !isError && filteredProducts.length > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-fluid"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={FADE_UP_ANIMATION_VARIANTS}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center border border-border/50 rounded-[2rem] bg-card/10 backdrop-blur-sm shadow-xl"
            >
              <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-6 border border-border/50">
                <Filter className="h-8 w-8 text-muted-foreground opacity-70" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">No gear found</h3>
              <p className="text-muted-foreground mt-3 max-w-md text-lg font-medium">
                We couldn&apos;t find any products matching your filters.
              </p>
              <Button size="lg" className="mt-8 font-bold" onClick={resetFilters}>
                Reset Filters
              </Button>
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="font-bold"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${
                        pageNum === page
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="font-bold"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 min-h-screen" />}>
      <ProductsContent />
    </Suspense>
  );
}
