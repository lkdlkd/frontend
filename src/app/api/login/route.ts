import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await loginRes.json();

    if (loginRes.ok && data.token) {
      const response = NextResponse.json({ success: true });

      // Đặt cookie với các thuộc tính bảo mật
      response.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
      });

      return response;
    } else {
      return NextResponse.json(
        { error: data.error || "Đăng nhập thất bại" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Có lỗi xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}