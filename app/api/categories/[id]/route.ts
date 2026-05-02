import { NextRequest } from 'next/server';
import { categoriesService } from '@/lib/services/categories.service';
import { apiSuccess, apiError } from '@/types/api';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/categories/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const category = await categoriesService.findById(id);
    if (!category) return apiError('Category not found', 404);
    return apiSuccess(category);
  } catch (err) {
    console.error('[GET /api/categories/[id]]', err);
    return apiError('Failed to fetch category', 500);
  }
}

// PUT /api/categories/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const category = await categoriesService.update(id, body);
    return apiSuccess(category, 'Category updated successfully');
  } catch (err: any) {
    console.error('[PUT /api/categories/[id]]', err);
    if (err?.code === 'P2025') return apiError('Category not found', 404);
    return apiError('Failed to update category', 500);
  }
}

// DELETE /api/categories/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await categoriesService.delete(id);
    return apiSuccess(null, 'Category deleted successfully');
  } catch (err: any) {
    console.error('[DELETE /api/categories/[id]]', err);
    if (err?.code === 'P2025') return apiError('Category not found', 404);
    if (err?.code === 'P2003') return apiError('Cannot delete category with existing products', 409);
    return apiError('Failed to delete category', 500);
  }
}
