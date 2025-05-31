import { getServer, getCategories } from "@/utils/api"; // Import hàm gọi API
import Dichvupage from "@/app/admin/server/Dichvupage"; // Import component Dichvupage
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Gọi API getServer để lấy danh sách dịch vụ
  const servers = await getServer(token);

  // Gọi API getCategories để lấy danh sách danh mục
  const categories = await getCategories(token);
  return <Dichvupage servers={servers.data} categories={categories.data} token={token} />;
}