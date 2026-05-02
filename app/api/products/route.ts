import { NextRequest } from 'next/server';
import { productsService } from '@/lib/services/products.service';
import { apiSuccess, apiError } from '@/types/api';
import { ProductStatus } from '@/generated/prisma/client';

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') as ProductStatus | null;
    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('pageSize') ?? 20);

    const result = await productsService.findAll({
      category,
      search,
      featured: featured !== null ? featured === 'true' : undefined,
      status: status ?? undefined,
      page,
      pageSize,
    });

    return apiSuccess(result);
  } catch (err) {
    console.error('[GET /api/products]', err);
    return apiError('Failed to fetch products', 500);
  }
}

// POST /api/products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, categoryId, price, stock, status, image, description, featured, boxQuantity } =
      body;

    if (!name || !categoryId || price === undefined || !description) {
      return apiError('Missing required fields: name, categoryId, price, description', 400);
    }

    const product = await productsService.create({
      name,
      categoryId,
      price: Number(price),
      stock: Number(stock ?? 0),
      status: status ?? ProductStatus.IN_STOCK,
      image,
      description,
      featured: Boolean(featured),
      boxQuantity: boxQuantity ? Number(boxQuantity) : undefined,
    });

    return apiSuccess(product, 'Product created successfully', 201);
  } catch (err) {
    console.error('[POST /api/products]', err);
    return apiError('Failed to create product', 500);
  }
}
