import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy token từ cookie
  const token = request.cookies.get('token')?.value;

  // Các path không cần đăng nhập
  const publicPaths = ['/dang-nhap', '/dang-ky', '/api', '/_next', '/favicon.ico'];

  // Nếu đang ở trang public thì cho qua
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Nếu không có token thì redirect về trang đăng nhập
  if (!token) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url));
  }

  // Giải mã token để lấy thông tin vai trò (role)
  const payload = parseJwt(token); // Hàm parseJwt để giải mã token
  const role = payload?.role;

  // Nếu đang truy cập route admin nhưng không phải admin thì redirect
  const adminPaths = ['/admin'];
  if (adminPaths.some((path) => request.nextUrl.pathname.startsWith(path)) && role !== 'admin') {
    return NextResponse.redirect(new URL('/404', request.url)); // Redirect về trang chủ
  }

  // Nếu có token và vai trò hợp lệ thì cho qua
  return NextResponse.next();
}

// Hàm giải mã JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}