import { apiSuccess, apiError } from "@/types/api";
import { countTodayInvoices } from "@/lib/services/invoice.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await countTodayInvoices();
    return apiSuccess({ count });
  } catch (error) {
    return apiError("Failed to fetch today's invoice count");
  }
}
