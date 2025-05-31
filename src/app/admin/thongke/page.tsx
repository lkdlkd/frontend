import { cookies } from "next/headers";
import ThongKe from "@/app/admin/thongke/Thongke";



export default async function ThongKePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;


  return (
    <ThongKe
      token={token || ""}

    />
  );
}