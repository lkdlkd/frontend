import { cookies } from "next/headers";
import { getServer, getOrders } from "@/utils/api";
import HistoryOrder from "@/app/danh-sach-don/HistoryOrder";

export default async function Page({ searchParams }: { searchParams: any }) {
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;
    const category = searchParams.category || "";
    const search = searchParams.search || "";

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    // Khởi tạo giá trị mặc định
    let servers = { data: [] };
    let ordersData = { orders: [], totalPages: 0 };
    let errorMessage = null;

    try {
        // Gọi API getServer
        servers = await getServer(token);
        if (!servers || !servers.data || servers.data.length === 0) {
            throw new Error("Không tìm thấy dữ liệu server.");
        }

        // Gọi API getOrders
        ordersData = await getOrders(token, page, limit, category, search);
        if (!ordersData || !ordersData.orders || ordersData.orders.length === 0) {
            throw new Error("Không tìm thấy đơn hàng.");
        }
    } catch (error: any) {
        // Lưu thông báo lỗi
        errorMessage = error.message || "Đã xảy ra lỗi không xác định.";
    }

    // Truyền dữ liệu hoặc lỗi vào HistoryOrder
    return (
        <HistoryOrder
            servers={servers.data}
            orders={ordersData.orders}
            initialPage={page}
            totalPages={ordersData.totalPages}
            initialLimit={limit}
            error={errorMessage} // Truyền lỗi nếu có
        />
    );
}