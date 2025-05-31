import { getStatistics } from "@/utils/api";
import { cookies } from "next/headers";
import ThongKe from "@/app/admin/thongke/Thongke";

interface SearchParams {
  napRange?: string;
  doanhthuRange?: string;
}

export default async function ThongKePage({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;


  return (
    <ThongKe
      token={token || ""}

    />
  );
}