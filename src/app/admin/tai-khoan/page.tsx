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


  // Truyền dữ liệu và lỗi vào component TaiKhoan
  return (
    <TaiKhoan
      token={token}
    
    />
  );
}




