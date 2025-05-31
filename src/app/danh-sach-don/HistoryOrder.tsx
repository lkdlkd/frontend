"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Table from "react-bootstrap/Table";

// Import `react-select` chỉ trên client
const Select = dynamic(() => import("react-select"), { ssr: false });

interface HistoryOrderProps {
    servers: any[];
    orders: any[];
    initialPage: number;
    totalPages: number;
    initialLimit: number;
    error?: string | null; // Thêm prop error
}

export default function HistoryOrder({
    servers,
    orders,
    initialPage,
    totalPages,
    initialLimit,
    error,
}: HistoryOrderProps) {
    const [ordersState, setOrders] = useState(orders);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [isError, setIsError] = useState(false); // Trạng thái để kiểm tra lỗi

    // Tính toán typeOptions chỉ một lần
    const typeOptions = useMemo(() => {
        const uniqueTypes = Array.from(new Set(servers.map((server) => server.type)));
        return uniqueTypes.map((type) => ({
            value: type,
            label: type,
        }));
    }, [servers]);
    // Tính toán categoryOptions dựa trên selectedType
    const categoryOptions = useMemo(() => {
        if (!selectedType) return [];
        const filteredServers = servers.filter(
            (server) => server.type === selectedType.value
        );
        const uniqueCategories = Array.from(
            new Set(filteredServers.map((server) => server.category))
        );
        return uniqueCategories.map((category) => ({
            value: category,
            label: category,
        }));
    }, [servers, selectedType]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        const url = new URL(window.location.href);
        url.searchParams.set("page", newPage.toString());
        if (selectedCategory) {
            url.searchParams.set("category", selectedCategory.value);
        }
        window.location.href = url.toString();
    };

    const handleSearch = () => {
        const cleanedSearchQuery = searchQuery.trim().replace(/\s+/g, ""); // Loại bỏ khoảng trắng
        const url = new URL(window.location.href);
        url.searchParams.set("search", encodeURIComponent(cleanedSearchQuery));
        if (selectedCategory) {
            url.searchParams.set("category", selectedCategory.value);
        }
        url.searchParams.set("page", "1"); // Reset về trang đầu tiên
        window.location.href = url.toString();
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = e.target.value;
        setLimit(parseInt(newLimit, 10));
        const url = new URL(window.location.href);
        url.searchParams.set("limit", newLimit);
        if (selectedCategory) {
            url.searchParams.set("category", selectedCategory.value);
        }
        url.searchParams.set("page", "1"); // Reset về trang đầu tiên
        window.location.href = url.toString();
    };

    const handleTypeChange = (selected: any) => {
        setSelectedType(selected);
        setSelectedCategory(null); // Reset category khi thay đổi type
    };

    const handleCategoryChange = (selected: any) => {
        setSelectedCategory(selected);
    };

    useEffect(() => {
        const url = new URL(window.location.href);
        const searchParam = url.searchParams.get("search") || "";
        const cleanedSearchParam = decodeURIComponent(searchParam).trim().replace(/\s+/g, "");
        setSearchQuery(cleanedSearchParam); // Cập nhật giá trị tìm kiếm đã làm sạch
    }, []);


    // Hiển thị dữ liệu nếu không có lỗi
    return (

        <div className="row">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h2 className="card-title">Lịch sử tạo đơn</h2>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">
                            Nếu muốn xem đơn của loại nào thì chọn - ấn tìm (mặc định sẽ hiện tất cả)
                        </p>

                        <div className="row">
                            {/* Chọn Nền Tảng */}
                            <div className="col-md-6 col-lg-3">
                                <div className="form-group">
                                    <label>Chọn Nền Tảng:</label>
                                    <Select
                                        value={selectedType}
                                        onChange={handleTypeChange}
                                        options={typeOptions}
                                        placeholder="Chọn"
                                    />
                                </div>
                            </div>

                            {/* Chọn Phân Loại */}
                            <div className="col-md-6 col-lg-3">
                                {selectedType && (
                                    <div className="form-group">
                                        <label>Phân Loại:</label>
                                        <Select
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            options={categoryOptions}
                                            placeholder="Chọn"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Tìm kiếm */}
                            <div className="col-md-6 col-lg-3">
                                <div className="form">
                                    <label htmlFor="order_code" className="form-label">
                                        Mã đơn
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm dữ liệu..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-primary d-flex align-items-center"
                                            onClick={handleSearch}
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Số đơn hàng/trang */}
                            <div className="col-md-6 col-lg-3">
                                <div className="form-group">
                                    <label>Số đơn hàng/trang:</label>
                                    <select
                                        className="form-select"
                                        value={limit}
                                        onChange={handleLimitChange}
                                    >
                                        <option value={10}>10 nhật ký</option>
                                        <option value={25}>25 nhật ký</option>
                                        <option value={50}>50 nhật ký</option>
                                        <option value={100}>100 nhật ký</option>
                                        <option value={500}>500 nhật ký</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Hiển thị bảng đơn hàng */}
                        <div className="table-responsive">
                            {ordersState && ordersState.length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã đơn</th>
                                            <th>Username</th>
                                            <th>Link</th>
                                            <th>Server</th>
                                            <th>Bắt đầu</th>
                                            <th>Đã chạy</th>
                                            <th>Số lượng mua</th>
                                            <th>Giá</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            {selectedCategory && selectedCategory.value === "BÌNH LUẬN" && <th>Bình luận</th>}
                                            <th>Ghi chú</th>
                                            <th>Ngày tạo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersState.map((order, index) => (
                                            <tr key={index}>
                                                <td>{(page - 1) * limit + index + 1}</td>
                                                <td>{order.Madon}</td>
                                                <td>{order.username}</td>
                                                <td style={{
                                                    maxWidth: "250px",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
                                                }}>{order.link}</td>
                                                <td style={{
                                                    maxWidth: "250px",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
                                                }}>{order.namesv}</td>
                                                <td>{order.start}</td>
                                                <td>{order.dachay}</td>
                                                <td>{order.quantity}</td>
                                                <td>{Number(order.rate).toLocaleString("en-US")}</td>
                                                <td>{Number(order.totalCost).toLocaleString("en-US")}</td>
                                                <td>
                                                    {order.status === "Completed" ? (
                                                        <span className="badge bg-success">
                                                            Hoàn thành
                                                        </span>
                                                    ) : order.status === "In progress" ||
                                                        order.status === "Processing" ||
                                                        order.status === "Pending" ? (
                                                        <span className="badge bg-primary">
                                                            Đang chạy
                                                        </span>
                                                    ) : order.status === "Canceled" ? (
                                                        <span className="badge bg-danger">Đã hủy</span>
                                                    ) : (
                                                        <span>{order.status}</span>
                                                    )}
                                                </td>
                                                {selectedCategory &&
                                                    selectedCategory.value === "BÌNH LUẬN" && (
                                                        <td>
                                                            <textarea
                                                                readOnly
                                                                rows={2}
                                                            >
                                                                {order.category === "BÌNH LUẬN"
                                                                    ? order.comments || "Không có bình luận"
                                                                    : ""}
                                                            </textarea>
                                                        </td>
                                                    )}
                                                <td style={{
                                                    maxWidth: "250px",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
                                                }}>{order.note}</td>
                                                <td>
                                                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-center text-muted">Không có đơn hàng nào để hiển thị.</p>
                            )}
                        </div>

                        {/* Phân trang */}
                        {ordersState.length > 0 && (
                            <div className="pagination d-flex justify-content-between align-items-center mt-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                                    disabled={page === 1}
                                >
                                    Trước
                                </button>
                                <span>
                                    Trang {page} / {totalPages}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        handlePageChange(Math.min(page + 1, totalPages))
                                    }
                                    disabled={page === totalPages}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}