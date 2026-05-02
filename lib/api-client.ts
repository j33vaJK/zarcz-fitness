import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/config/env';

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: env.NEXT_PUBLIC_API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiError>) => {
                if (error.response?.status === 401) {
                    this.handleUnauthorized();
                }
                return Promise.reject(this.normalizeError(error));
            }
        );
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    }

    private handleUnauthorized() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/auth/login';
        }
    }

    private normalizeError(error: AxiosError<ApiError>): ApiError {
        return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status || 500,
            errors: error.response?.data?.errors,
        };
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url, config);
        return response.data.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return response.data.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<ApiResponse<T>>(url, data, config);
        return response.data.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<ApiResponse<T>>(url, data, config);
        return response.data.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<ApiResponse<T>>(url, config);
        return response.data.data;
    }
}

export const apiClient = new ApiClient();