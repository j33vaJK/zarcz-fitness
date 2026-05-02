import { NextRequest } from 'next/server';
import { servicesService } from '@/lib/services/services.service';
import { apiSuccess, apiError } from '@/types/api';

// GET /api/services
export async function GET() {
  try {
    const services = await servicesService.findAll();
    return apiSuccess(services);
  } catch (err) {
    console.error('[GET /api/services]', err);
    return apiError('Failed to fetch services', 500);
  }
}

// POST /api/services
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, icon, image } = body;

    if (!title || !description || !icon || !image) {
      return apiError('Missing required fields: title, description, icon, image', 400);
    }

    const service = await servicesService.create({ title, description, icon, image });
    return apiSuccess(service, 'Service created successfully', 201);
  } catch (err) {
    console.error('[POST /api/services]', err);
    return apiError('Failed to create service', 500);
  }
}
