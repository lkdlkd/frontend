import HistoryUser from "@/app/lich-su-hoat-dong/History";
import { getUserHistory } from "@/utils/api";
import { cookies } from "next/headers";

export default async function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  // Đảm bảo searchParams được sử dụng đồng bộ
  const page = Number(searchParams.page ?? 1); // Sử dụng nullish coalescing (??) để tránh undefined
  const limit = Number(searchParams.limit ?? 10);
  const search = searchParams.search ?? "";
  const orderId = searchParams.orderId ?? "";

  // Xử lý cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Giải mã token
  const decoded = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const role = decoded.role;

  // Gọi API để lấy dữ liệu
  const data = await getUserHistory(token, page, limit, orderId, search);

  // Trả về component
  return (
    <HistoryUser
      role={role}
      currentPage={page}
      limit={limit}
      historyData={data.history}
      totalPages={data.totalPages}
    />
  );
}