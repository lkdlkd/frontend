import { getStatistics } from "@/utils/api";
import { cookies } from "next/headers";
import ThongKe from "@/app/admin/thongke/Thongke";
export default async function ThongKePage({ searchParams }: { searchParams: any }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Lấy giá trị từ query params hoặc sử dụng giá trị mặc định
  const napRange = searchParams?.napRange || "today";
  const doanhthuRange = searchParams?.doanhthuRange || "today";

  // Gọi hàm getStatistics với các tham số động
  const statistics = await getStatistics(token, napRange, doanhthuRange);

  return (
    <ThongKe
      statistics={statistics}  
        napRange={napRange}
        doanhthuRange={doanhthuRange}
    />
  );
}