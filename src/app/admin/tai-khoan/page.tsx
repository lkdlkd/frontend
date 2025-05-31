import { cookies } from "next/headers";
import { getUsers } from "@/utils/api";
import TaiKhoan from "@/app/admin/tai-khoan/TaiKhoan";
import { User } from "@/types/index";

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

export default async function TaiKhoanPage({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = searchParams.search || "";

  let users: User[] = [];
  let totalPages = 0; // Biến để lưu tổng số trang
  let errorMessage: string | null = null;

  try {
    const userRes = await getUsers(token, page, limit, search);
    users = userRes.users || [];
    totalPages = userRes.totalPages || 1;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching users:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Unknown error occurred while fetching users.");
      errorMessage = "Unknown error occurred.";
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




