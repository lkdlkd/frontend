"use client";

import React, { useState } from "react";
import Table from "react-bootstrap/Table";

interface HistoryItem {
  _id: string;
  madon: string;
  username: string;
  hanhdong: string;
  link: string;
  tienhientai: number;
  tongtien: number;
  tienconlai: number;
  createdAt: string;
  mota?: string;
}

interface HistoryProps {
  role: string;
  currentPage: number;
  limit: number;
  historyData: HistoryItem[];
  totalPages: number;
}

export default function History({
  role,
  currentPage,
  limit,
  historyData,
  totalPages,
}: HistoryProps) {
  const [page, setPage] = useState(currentPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderIdSearch, setOrderIdSearch] = useState("");

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    window.location.href = url.toString();
  };

  const handleSearch = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("search", searchQuery);
    url.searchParams.set("orderId", orderIdSearch);
    url.searchParams.set("page", "1"); // Reset về trang đầu tiên
    window.location.href = url.toString();
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set("limit", newLimit);
    url.searchParams.set("page", "1"); // Reset về trang đầu tiên
    window.location.href = url.toString();
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 className="card-title">Lịch sử hoạt động</h2>
          </div>

          <div className="card-body">
            <div className="row">
              {/* Tìm kiếm theo mã đơn */}
              <div className="col-md-6 col-lg-3">
                <div className="form">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm theo mã đơn"
                      value={orderIdSearch}
                      onChange={(e) => setOrderIdSearch(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center"
                      onClick={handleSearch}
                    >
                      <i className="fas fa-search"></i>
                      Tìm
                    </button>
                  </div>
                </div>
              </div>

              {/* Tìm kiếm theo username */}
              <div className="col-md-6 col-lg-3">
                <div className="input-group">
                  {role === "admin" && (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo username"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={handleSearch}
                      >
                        <i className="fas fa-search"></i>
                        Tìm
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thay đổi số lượng bản ghi mỗi trang */}
              <div className="col-md-6 col-lg-3">
                <div className="form-group">
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

            {/* Hiển thị bảng lịch sử */}
            <div className="table-responsive">
              {historyData && historyData.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã đơn</th>
                      <th>Username</th>
                      <th>Hành động</th>
                      <th>Link</th>
                      <th>Số tiền</th>
                      <th>Ngày tạo</th>
                      <th>Diễn tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, index) => {
                      const actionText = item.hanhdong.toLowerCase();
                      const isPlusAction =
                        actionText.includes("nạp tiền") ||
                        actionText.includes("cộng tiền");
                      return (
                        <tr
                          key={item._id}
                          style={
                            isPlusAction
                              ? { backgroundColor: "#bcf0d6" }
                              : {}
                          }
                        >
                          <td>{(page - 1) * limit + index + 1}</td>
                          <td>{item.madon}</td>
                          <td>{item.username}</td>
                          <td>{item.hanhdong}</td>
                          <td
                            style={{
                              maxWidth: "250px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {item.link}
                          </td>
                          <td>
                            <span
                              className="badge bg-info"
                              style={{ backgroundColor: "#43bfe5" }}
                            >
                              {Number(item.tienhientai).toLocaleString("en-US")}
                            </span>{" "}
                            {isPlusAction ? (
                              <>
                                +
                                <span
                                  className="badge"
                                  style={{ backgroundColor: "#e53935" }}
                                >
                                  {Number(item.tongtien).toLocaleString(
                                    "en-US"
                                  )}
                                </span>{" "}
                              </>
                            ) : (
                              <>
                                -
                                <span
                                  className="badge"
                                  style={{ backgroundColor: "#e53935" }}
                                >
                                  {Number(item.tongtien).toLocaleString(
                                    "en-US"
                                  )}
                                </span>{" "}
                              </>
                            )}
                            ={" "}
                            <span className="badge bg-success">
                              {Number(item.tienconlai).toLocaleString("en-US")}
                            </span>
                          </td>
                          <td>
                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td
                            style={{
                              maxWidth: "570px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            {item.mota || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <p>Không có đơn hàng nào.</p>
              )}
            </div>

            {/* Phân trang */}
            {historyData && historyData.length > 0 && (
              <div className="pagination d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Trước
                </button>
                <span>
                  Trang {page} / {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(page + 1)}
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
