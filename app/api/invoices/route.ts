import { NextRequest } from 'next/server';
import { createInvoice, getRecentInvoices } from '@/lib/services/invoice.service';
import { apiSuccess, apiError } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const invoices = await getRecentInvoices(limit);
    return apiSuccess(invoices);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return apiError('Failed to fetch invoices', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Parse date if string
    if (data.date && typeof data.date === 'string') {
      data.date = new Date(data.date);
    } else if (!data.date) {
      data.date = new Date();
    }

    const invoice = await createInvoice(data);
    return apiSuccess(invoice, 'Invoice created successfully', 201);
  } catch (error: any) {
    console.error('Failed to create invoice:', error);
    return apiError(error?.message || 'Failed to create invoice', 500);
  }
}
