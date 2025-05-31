import { getNotifications } from "@/utils/api";
import { cookies } from "next/headers";
import Taothongbaopage from "@/app/admin/taothongbao/Taothongbaopage";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Gọi hàm getNotifications để lấy danh sách thông báo
  const notifications = await getNotifications(token);

  return <Taothongbaopage notifications={notifications} token={token} />;
}