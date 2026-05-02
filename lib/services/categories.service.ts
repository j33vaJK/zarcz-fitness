import { prisma } from '@/lib/prisma';

export interface CreateCategoryInput {
  name: string;
  image?: string | null;
  itemCount?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export const categoriesService = {
  async findAll() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return categories.map(({ _count, ...cat }) => ({
      ...cat,
      itemCount: _count.products,
    }));
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { products: true, _count: { select: { products: true } } },
    });
  },

  async findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  },

  async create(input: CreateCategoryInput) {
    return prisma.category.create({ data: input });
  },

  async update(id: string, input: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data: input });
  },

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
