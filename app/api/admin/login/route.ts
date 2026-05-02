import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "admin";

    if (username === adminUser && password === adminPass) {
      await login(username);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
