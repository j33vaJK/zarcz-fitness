import { NextRequest } from 'next/server';
import { productsService } from '@/lib/services/products.service';
import { apiSuccess, apiError } from '@/types/api';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/products/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await productsService.findById(id);
    if (!product) return apiError('Product not found', 404);
    return apiSuccess(product);
  } catch (err) {
    console.error('[GET /api/products/[id]]', err);
    return apiError('Failed to fetch product', 500);
  }
}

// PUT /api/products/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await productsService.update(id, body);
    return apiSuccess(product, 'Product updated successfully');
  } catch (err: any) {
    console.error('[PUT /api/products/[id]]', err);
    if (err?.code === 'P2025') return apiError('Product not found', 404);
    return apiError('Failed to update product', 500);
  }
}

// PATCH /api/products/[id]
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return PUT(req, { params });
}

// DELETE /api/products/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await productsService.delete(id);
    return apiSuccess(null, 'Product deleted successfully');
  } catch (err: any) {
    console.error('[DELETE /api/products/[id]]', err);
    if (err?.code === 'P2025') return apiError('Product not found', 404);
    return apiError('Failed to delete product', 500);
  }
}
