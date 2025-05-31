import { cookies } from "next/headers";
import { getUsers } from "@/utils/api";
import TaiKhoan from "@/app/admin/tai-khoan/TaiKhoan";
import { User } from "@/types/index";

export default async function TaiKhoanPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  // Chuyển đổi searchParams thành URLSearchParams nếu cần
  const params = new URLSearchParams(searchParams as Record<string, string>);
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;
  const search = params.get("search") || "";

  let users: User[] = [];
  let totalPages = 0; // Biến để lưu tổng số trang
  const errorMessage = null;

  try {
    const userRes = await getUsers(token, page, limit, search);
    users = userRes.users || [];
    totalPages = userRes.totalPages || 1;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
    } else {
      console.error("Unknown error occurred while fetching users.");
    }
  }

  // Truyền dữ liệu và lỗi vào component TaiKhoan
  return (
    <TaiKhoan
      token={token}
      users={users}
      limit={limit}
      page={page} // Chuyển đổi page sang số nếu có
      search={search}
      totalPages={totalPages}
      error={errorMessage}
    />
  );
}




