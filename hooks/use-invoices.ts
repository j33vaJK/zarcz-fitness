import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  date: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceStats {
  daily: {
    revenue: number;
    invoices: number;
    itemsSold: number;
  };
  weekly: {
    timeSeries: { date: string; revenue: number }[];
  };
  monthly: {
    revenue: number;
    invoices: number;
    itemsSold: number;
    timeSeries: { date: string; revenue: number }[];
  };
  yearly: {
    revenue: number;
    invoices: number;
    itemsSold: number;
    bestSellingCategory: string;
    timeSeries: { month: string; revenue: number }[];
    topPerformers: { name: string; percentage: number }[];
  };
}

export function useInvoices(limit = 10) {
  return useQuery<Invoice[]>({
    queryKey: ['invoices', limit],
    queryFn: () => apiClient.get<Invoice[]>('/invoices', { params: { limit } }),
  });
}

export function useInvoiceStats() {
  return useQuery<InvoiceStats>({
    queryKey: ['invoices', 'stats'],
    queryFn: () => apiClient.get<InvoiceStats>('/invoices/stats'),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post<Invoice>('/invoices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Stock may have changed
    },
  });
}
