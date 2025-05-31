import { getAllSmmPartners } from "@/utils/api";
import { cookies } from "next/headers";
import Doitacpage from "@/app/admin/doitac/Doitacpage";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Gọi hàm getAllSmmPartners để lấy danh sách đối tác
  const smmPartners = await getAllSmmPartners(token);

  return <Doitacpage smmPartners={smmPartners} token={token} />;
}