import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Testimonial } from '@/types';

export function useTestimonials() {
    return useQuery<Testimonial[]>({
        queryKey: ['testimonials'],
        queryFn: () => apiClient.get<Testimonial[]>('/testimonials'),
    });
}
