import { NextRequest } from 'next/server';
import { categoriesService } from '@/lib/services/categories.service';
import { apiSuccess, apiError } from '@/types/api';

// GET /api/categories
export async function GET() {
  try {
    const categories = await categoriesService.findAll();
    return apiSuccess(categories);
  } catch (err) {
    console.error('[GET /api/categories]', err);
    return apiError('Failed to fetch categories', 500);
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, image, itemCount } = body;

    if (!name) {
      return apiError('Missing required fields: name', 400);
    }

    const category = await categoriesService.create({ name, image, itemCount });
    return apiSuccess(category, 'Category created successfully', 201);
  } catch (err: any) {
    console.error('[POST /api/categories]', err);
    if (err?.code === 'P2002') return apiError('Category name already exists', 409);
    return apiError('Failed to create category', 500);
  }
}
