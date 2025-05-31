import { getCategories , getPlatforms } from "@/utils/api"; // Import hàm gọi API
import CategoriesPage from "@/app/admin/dich-vu/CategoriesPage"; // Import component CategoriesPage
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }
  const platforms = await getPlatforms(token);

  // Gọi API getCategories để lấy danh sách danh mục
  let categories = [];
  try {
    categories = await getCategories(token);
  } catch (error) {
    console.error("Lỗi khi gọi API getCategories:", error);
  }
  // Truyền categories và token xuống CategoriesPage
  return <CategoriesPage platforms={platforms.platforms} categories={categories.data} token={token} />;
}