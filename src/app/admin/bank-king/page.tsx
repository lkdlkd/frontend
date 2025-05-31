import { getBanking } from "@/utils/api";
import { cookies } from "next/headers";
import BankingAdmin from "@/app/admin/bank-king/BankingAdmin";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token không tồn tại");
  }

  // Gọi hàm getBanking để lấy dữ liệu
  const bankingData = await getBanking(token);

  return <BankingAdmin banks={bankingData} token={token} />;
}