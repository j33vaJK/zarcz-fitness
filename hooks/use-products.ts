import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Product } from '@/types';
export type { Product };

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export function useProducts(filters?: Record<string, any>) {
    return useQuery<ProductsResponse>({
        queryKey: ['products', filters],
        queryFn: () => apiClient.get<ProductsResponse>('/products', { params: filters }),
    });
}

export function useProduct(id: string) {
    return useQuery<Product>({
        queryKey: ['products', id],
        queryFn: () => apiClient.get<Product>(`/products/${id}`),
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Product>) => apiClient.post<Product>('/products', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            apiClient.put<Product>(`/products/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/products/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
