import { prisma } from '@/lib/prisma';

export interface CreateServiceInput {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {}

export const servicesService = {
  async findAll() {
    return prisma.service.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  },

  async create(input: CreateServiceInput) {
    return prisma.service.create({ data: input });
  },

  async update(id: string, input: UpdateServiceInput) {
    return prisma.service.update({ where: { id }, data: input });
  },

  async delete(id: string) {
    return prisma.service.delete({ where: { id } });
  },
};
