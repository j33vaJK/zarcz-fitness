export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Category {
    id: string;
    name: string;
    image?: string | null;
    itemCount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: string;
    name: string;
    categoryId: string;
    category?: Category;
    price: number;
    stock: number;
    status: ProductStatus;
    image?: string | null;
    description: string;
    featured: boolean;
    boxQuantity?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role?: string | null;
    content: string;
    avatar: string;
    rating: number;
    createdAt?: string;
    updatedAt?: string;
}
