import { prisma } from '@/lib/prisma';
import { ProductStatus, Prisma } from '@/generated/prisma/client';

export interface CreateProductInput {
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image?: string | null;
  description: string;
  featured?: boolean;
  boxQuantity?: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  status?: ProductStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const productsService = {
  async findAll(filters: ProductFilters = {}) {
    const { category, featured, status, search, page = 1, pageSize = 20 } = filters;

    const where: Prisma.ProductWhereInput = {
      ...(category && { category: { name: { equals: category, mode: 'insensitive' } } }),
      ...(featured !== undefined && { featured }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async create(input: CreateProductInput) {
    const product = await prisma.product.create({
      data: input,
      include: { category: true },
    });

    // Update category item count
    await prisma.category.update({
      where: { id: input.categoryId },
      data: { itemCount: { increment: 1 } },
    });

    return product;
  },

  async update(id: string, input: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: input,
      include: { category: true },
    });
  },

  async delete(id: string) {
    const product = await prisma.product.delete({ where: { id } });

    // Update category item count
    await prisma.category.update({
      where: { id: product.categoryId },
      data: { itemCount: { decrement: 1 } },
    });

    return product;
  },
};
