import { NextRequest } from 'next/server';
import { testimonialsService } from '@/lib/services/testimonials.service';
import { apiSuccess, apiError } from '@/types/api';

// GET /api/testimonials
export async function GET() {
  try {
    const testimonials = await testimonialsService.findAll();
    return apiSuccess(testimonials);
  } catch (err) {
    console.error('[GET /api/testimonials]', err);
    return apiError('Failed to fetch testimonials', 500);
  }
}

// POST /api/testimonials
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, content, avatar, rating } = body;

    if (!name || !content || !avatar) {
      return apiError('Missing required fields: name, content, avatar', 400);
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return apiError('Rating must be between 1 and 5', 400);
    }

    const testimonial = await testimonialsService.create({
      name,
      role,
      content,
      avatar,
      rating: Number(rating ?? 5),
    });

    return apiSuccess(testimonial, 'Testimonial created successfully', 201);
  } catch (err) {
    console.error('[POST /api/testimonials]', err);
    return apiError('Failed to create testimonial', 500);
  }
}
