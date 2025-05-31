import HistoryUser from "@/app/lich-su-hoat-dong/History";
import { cookies } from "next/headers";

export default async function Page() {


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

  // Trả về component
  return (
    <HistoryUser
      role={role}
      token={token}
    />
  );
}