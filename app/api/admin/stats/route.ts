import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/types/api';
import { ProductStatus } from '@/generated/prisma/client';

// GET /api/admin/stats
export async function GET() {
  try {
    const [
      totalProducts,
      totalCategories,
      totalServices,
      totalTestimonials,
      stockAggregation,
      lowStockCount,
      outOfStockCount,
      productsByCategory,
      featuredCount,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.product.aggregate({ _sum: { stock: true } }),
      prisma.product.count({ where: { status: ProductStatus.LOW_STOCK } }),
      prisma.product.count({ where: { status: ProductStatus.OUT_OF_STOCK } }),
      prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.product.count({ where: { featured: true } }),
    ]);

    // Resolve category names for the groupBy result
    const categoryIds = productsByCategory.map((p) => p.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    const productsByCategoryNamed = productsByCategory.map((p) => ({
      category: categoryMap[p.categoryId] ?? 'Unknown',
      count: p._count.id,
    }));

    const bestSellingCategory = productsByCategoryNamed[0]?.category ?? 'N/A';

    return apiSuccess({
      totalProducts,
      totalCategories,
      totalServices,
      totalTestimonials,
      totalStock: stockAggregation._sum.stock ?? 0,
      lowStockCount,
      outOfStockCount,
      inStockCount: totalProducts - lowStockCount - outOfStockCount,
      featuredCount,
      bestSellingCategory,
      productsByCategory: productsByCategoryNamed,
    });
  } catch (err) {
    console.error('[GET /api/admin/stats]', err);
    return apiError('Failed to fetch admin stats', 500);
  }
}
