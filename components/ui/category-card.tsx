import Link from "next/link";
import { Category } from "@/types";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/20 border-border/50">
          <img
            src={category.image || "/categories/placeholder.jpeg"}
            alt={category.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 z-10">
            <h3 className="text-3xl font-black text-white mb-3 group-hover:text-primary transition-colors tracking-tight">{category.name}</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/20 uppercase tracking-widest shadow-sm">
              {category.itemCount} Products
            </span>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

