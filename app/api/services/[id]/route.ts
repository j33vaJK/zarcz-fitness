import { NextRequest } from 'next/server';
import { servicesService } from '@/lib/services/services.service';
import { apiSuccess, apiError } from '@/types/api';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/services/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const service = await servicesService.findById(id);
    if (!service) return apiError('Service not found', 404);
    return apiSuccess(service);
  } catch (err) {
    console.error('[GET /api/services/[id]]', err);
    return apiError('Failed to fetch service', 500);
  }
}

// PUT /api/services/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const service = await servicesService.update(id, body);
    return apiSuccess(service, 'Service updated successfully');
  } catch (err: any) {
    console.error('[PUT /api/services/[id]]', err);
    if (err?.code === 'P2025') return apiError('Service not found', 404);
    return apiError('Failed to update service', 500);
  }
}

// DELETE /api/services/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await servicesService.delete(id);
    return apiSuccess(null, 'Service deleted successfully');
  } catch (err: any) {
    console.error('[DELETE /api/services/[id]]', err);
    if (err?.code === 'P2025') return apiError('Service not found', 404);
    return apiError('Failed to delete service', 500);
  }
}
