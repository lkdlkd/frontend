"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Table from "react-bootstrap/Table";
import { getServer, getOrders } from "@/utils/api";

// Import `react-select` chỉ trên client
const Select = dynamic(() => import("react-select"), { ssr: false });

interface Server {
  type: string;
  category: string;
}

interface Order {
  Madon: string;
  username: string;
  link: string;
  namesv: string;
  start: number;
  dachay: number;
  quantity: number;
  rate: number;
  totalCost: number;
  status: string;
  category: string;
  comments?: string;
  note?: string;
  createdAt: string;
}

export default function HistoryOrder({ token }: { token: string }) {
  const [servers, setServers] = useState<Server[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<{ value: string; label: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(
    null
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gọi API để lấy danh sách servers
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serversData = await getServer(token);
        setServers(serversData.data || []);
      } catch (error) {
        console.error("Error fetching servers:", error);
        setErrorMessage("Không thể tải danh sách servers.");
      }
    };

    fetchServers();
  }, [token]);

  // Gọi API để lấy danh sách orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getOrders(token, page, limit,selectedCategory?.value, searchQuery);
        setOrders(ordersData.orders || []);
        setTotalPages(ordersData.totalPages || 1);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setErrorMessage("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, page, limit, searchQuery, selectedCategory]);

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
    const filteredServers = servers.filter((server) => server.type === selectedType.value);
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
  };

  const handleSearch = () => {
    setPage(1); // Reset về trang đầu tiên
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    setLimit(parseInt(newLimit, 10));
    setPage(1); // Reset về trang đầu tiên
  };

  const handleTypeChange = (selected: { value: string; label: string } | null) => {
    setSelectedType(selected);
    setSelectedCategory(null); // Reset category khi thay đổi type
  };

  const handleCategoryChange = (selected: { value: string; label: string } | null) => {
    setSelectedCategory(selected);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title">Lịch sử tạo đơn</h2>
          </div>
          <div className="card-body">
            <>
              <p className="text-muted">
                Nếu muốn xem đơn của loại nào thì chọn - ấn tìm (mặc định sẽ hiện tất cả)
              </p>

              {/* Các phần chọn nền tảng, phân loại, tìm kiếm, và bảng đơn hàng */}
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
                {orders && orders.length > 0 ? (
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
                        {selectedCategory && selectedCategory.value === "BÌNH LUẬN" && (
                          <th>Bình luận</th>
                        )}
                        <th>Ghi chú</th>
                        <th>Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index}>
                          <td>{(page - 1) * limit + index + 1}</td>
                          <td>{order.Madon}</td>
                          <td>{order.username}</td>
                          <td
                            style={{
                              maxWidth: "250px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {order.link}
                          </td>
                          <td
                            style={{
                              maxWidth: "250px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {order.namesv}
                          </td>
                          <td>{order.start}</td>
                          <td>{order.dachay}</td>
                          <td>{order.quantity}</td>
                          <td>{Number(order.rate).toLocaleString("en-US")}</td>
                          <td>{Number(order.totalCost).toLocaleString("en-US")}</td>
                          <td>
                            {order.status === "Completed" ? (
                              <span className="badge bg-success">Hoàn thành</span>
                            ) : order.status === "In progress" ||
                              order.status === "Processing" ||
                              order.status === "Pending" ? (
                              <span className="badge bg-primary">Đang chạy</span>
                            ) : order.status === "Canceled" ? (
                              <span className="badge bg-danger">Đã hủy</span>
                            ) : (
                              <span>{order.status}</span>
                            )}
                          </td>
                          {selectedCategory &&
                            selectedCategory.value === "BÌNH LUẬN" && (
                              <td>
                                <textarea readOnly rows={2}>
                                  {order.category === "BÌNH LUẬN"
                                    ? order.comments || "Không có bình luận"
                                    : ""}
                                </textarea>
                              </td>
                            )}
                          <td
                            style={{
                              maxWidth: "250px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {order.note}
                          </td>
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
                  <p className="text-center text-muted">
                    <div className="alert alert-danger text-center" role="alert">
                      Không có dữ liệu đơn hàng nào để hiển thị.
                    </div>
                  </p>
                )}
              </div>

              {/* Phân trang */}
              {orders.length > 0 && (
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
            </>
          </div>
        </div>
      </div>
    </div>
  );
}