import { cookies } from "next/headers";
import TaiKhoan from "@/app/admin/tai-khoan/TaiKhoan";



export default async function TaiKhoanPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";


  // Truyền dữ liệu và lỗi vào component TaiKhoan
  return (
    <TaiKhoan
      token={token}

    />
  );
}




