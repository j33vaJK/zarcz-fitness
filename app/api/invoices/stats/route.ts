import { NextRequest } from 'next/server';
import { getFinancialStats } from '@/lib/services/invoice.service';
import { apiSuccess, apiError } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const stats = await getFinancialStats();
    return apiSuccess(stats);
  } catch (error: any) {
    console.error('Failed to fetch invoice stats:', error);
    return apiError(error?.message || 'Failed to fetch invoice stats', 500);
  }
}
