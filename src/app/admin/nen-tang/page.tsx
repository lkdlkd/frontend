import { getPlatforms } from "@/utils/api"; // Import hàm gọi API
import PlatformsPage from "./PlatformsPage"; // Import component PlatformsPage
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Gọi API getPlatforms để lấy danh sách nền tảng
  const platforms = await getPlatforms(token);
  return <PlatformsPage platforms={platforms.platforms} token={token} />;
}