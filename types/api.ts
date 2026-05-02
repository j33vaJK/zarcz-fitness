import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────
// Standard API response envelope
// ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────────
// Helper: success response
// ─────────────────────────────────────────────
export function apiSuccess<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, message, status }, { status });
}

// ─────────────────────────────────────────────
// Helper: error response
// ─────────────────────────────────────────────
export function apiError(
  message: string,
  status: number = 500,
  errors?: Record<string, string[]>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ message, status, errors }, { status });
}
