import { NextRequest } from 'next/server';
import { testimonialsService } from '@/lib/services/testimonials.service';
import { apiSuccess, apiError } from '@/types/api';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/testimonials/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const testimonial = await testimonialsService.findById(id);
    if (!testimonial) return apiError('Testimonial not found', 404);
    return apiSuccess(testimonial);
  } catch (err) {
    console.error('[GET /api/testimonials/[id]]', err);
    return apiError('Failed to fetch testimonial', 500);
  }
}

// PUT /api/testimonials/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const testimonial = await testimonialsService.update(id, body);
    return apiSuccess(testimonial, 'Testimonial updated successfully');
  } catch (err: any) {
    console.error('[PUT /api/testimonials/[id]]', err);
    if (err?.code === 'P2025') return apiError('Testimonial not found', 404);
    return apiError('Failed to update testimonial', 500);
  }
}

// DELETE /api/testimonials/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await testimonialsService.delete(id);
    return apiSuccess(null, 'Testimonial deleted successfully');
  } catch (err: any) {
    console.error('[DELETE /api/testimonials/[id]]', err);
    if (err?.code === 'P2025') return apiError('Testimonial not found', 404);
    return apiError('Failed to delete testimonial', 500);
  }
}
