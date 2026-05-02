import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Service } from '@/types';

export function useServices() {
    return useQuery<Service[]>({
        queryKey: ['services'],
        queryFn: () => apiClient.get<Service[]>('/services'),
    });
}
