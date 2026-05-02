import { prisma } from '@/lib/prisma';

export interface CreateTestimonialInput {
  name: string;
  role?: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface UpdateTestimonialInput extends Partial<CreateTestimonialInput> {}

export const testimonialsService = {
  async findAll() {
    return prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async findById(id: string) {
    return prisma.testimonial.findUnique({ where: { id } });
  },

  async create(input: CreateTestimonialInput) {
    return prisma.testimonial.create({ data: input });
  },

  async update(id: string, input: UpdateTestimonialInput) {
    return prisma.testimonial.update({ where: { id }, data: input });
  },

  async delete(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  },
};
