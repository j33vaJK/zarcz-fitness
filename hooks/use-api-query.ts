import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';

export function useApiQuery<T>(
    key: string | string[],
    url: string,
    options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
    return useQuery<T, ApiError>({
        queryKey: Array.isArray(key) ? key : [key],
        queryFn: () => apiClient.get<T>(url),
        ...options,
    });
}