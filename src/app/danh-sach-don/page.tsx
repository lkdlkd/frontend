import { cookies } from "next/headers";
import HistoryOrder from "@/app/danh-sach-don/HistoryOrder";



export default async function Page() {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";


  // Truyền dữ liệu hoặc lỗi vào HistoryOrder
  return (
    <HistoryOrder
      token={token}
    />
  );
}