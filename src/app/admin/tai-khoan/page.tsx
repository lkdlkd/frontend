import { cookies } from "next/headers";
import { getUsers } from "@/utils/api";
import TaiKhoan from "@/app/admin/tai-khoan/TaiKhoan";
import { User } from "@/types/index";

export default async function TaiKhoanPage({ searchParams }: { searchParams: any }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = searchParams.search || "";

  let users: User[] = [];
  let totalPages = 0; // Biến để lưu tổng số trang
  let errorMessage = null;

  try {
    const userRes = await getUsers(token, page, limit, search);
    users = userRes.users || [];
    totalPages = userRes.totalPages || 1;
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
  }

  // Truyền dữ liệu và lỗi vào component TaiKhoan
  return (
    <TaiKhoan
      token={token}
      users={users}
      limit={limit}
      page={page ? Number(page) : 1} // Chuyển đổi page sang số nếu có
      search={search}
      totalPages={totalPages}
      error={errorMessage}
    />
  );
}




