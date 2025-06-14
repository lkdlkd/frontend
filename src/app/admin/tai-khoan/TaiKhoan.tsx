"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/index";
import { getUsers, deleteUser } from "@/utils/api";
import Swal from "sweetalert2";
import UserEdit from "@/app/admin/tai-khoan/UserEdit";
import AddBalanceForm from "@/app/admin/tai-khoan/AddBalanceForm";
import DeductBalanceForm from "@/app/admin/tai-khoan/DeductBalanceForm";
import Table from "react-bootstrap/Table";

interface TaiKhoanProps {
  token: string;
}

export default function TaiKhoan({ token }: TaiKhoanProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Giá trị debounce
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deductUser, setDeductUser] = useState<User | null>(null);
  const [balanceUser, setBalanceUser] = useState<User | null>(null);

  // Debounce logic: Cập nhật `debouncedSearchQuery` sau 3 giây
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 3000);

    return () => {
      clearTimeout(handler); // Xóa timeout nếu `searchQuery` thay đổi trước khi hết 3 giây
    };
  }, [searchQuery]);

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userRes = await getUsers(token, page, limit, debouncedSearchQuery);
        setUsers(userRes.users || []);
        setTotalPages(userRes.totalPages || 1);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching users:", error.message);
          setErrorMessage(error.message);
        } else {
          console.error("Unknown error occurred while fetching users.");
          setErrorMessage("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, page, limit, debouncedSearchQuery]);

  // Hàm cập nhật danh sách người dùng sau khi sửa
  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  // Hàm xử lý tìm kiếm ngay lập tức khi ấn nút
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchQuery(searchQuery); // Cập nhật giá trị debounce ngay lập tức
    setPage(1); // Reset về trang đầu tiên
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Hàm xử lý thay đổi số lượng hiển thị (limit)
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1); // Reset về trang đầu tiên
  };

  // Hàm xử lý xóa người dùng
  const handleDeleteUser = async (userId: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xóa người dùng vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId, token);
          Swal.fire("Đã xóa!", "Người dùng đã được xóa thành công.", "success");
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
          console.error("Lỗi khi xóa người dùng:", error);
          Swal.fire("Lỗi!", "Không thể xóa người dùng. Vui lòng thử lại.", "error");
        }
      }
    });
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Danh sách Người dùng</h4>
        </div>
        <div className="card-body">
          {/* Ô tìm kiếm */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-search"></i> Tìm kiếm
                </button>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={limit}
                  onChange={handleLimitChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </form>

          {/* Bảng danh sách người dùng */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Thao tác</th>
                  <th>Tài khoản</th>
                  <th>Số dư</th>
                  <th>Tổng nạp</th>
                  <th>Cấp bậc</th>
                  <th>Chức vụ</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                  <th>Thời gian tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => setBalanceUser(user)}
                      >
                        Cộng tiền
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => setDeductUser(user)}
                      >
                        Trừ tiền
                      </button>
                    </td>
                    <td>{user.username}</td>
                    <td>{Number(user.balance).toLocaleString("en-US")} VNĐ</td>
                    <td>{Number(user.tongnap).toLocaleString("en-US")} VNĐ</td>
                    <td>{user.capbac}</td>
                    <td>
                      {user.role === "admin" ? (
                        <span className="badge bg-danger">Quản trị viên</span>
                      ) : (
                        <span className="badge bg-primary">Người dùng</span>
                      )}
                    </td>
                    <td>
                      {user.status === "active" ? (
                        <span className="badge bg-success">Hoạt động</span>
                      ) : (
                        <span className="badge bg-secondary">Không hoạt động</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => setEditingUser(user)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Xóa
                      </button>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleString("vi-VN", {
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
          </div>

          {/* Phân trang */}
          <div className="d-flex justify-content-between align-items-center mt-4">
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
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Các modal chỉnh sửa */}
      {editingUser && (
        <UserEdit
          user={editingUser}
          token={token}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      {deductUser && (
        <DeductBalanceForm
          token={token}
          user={deductUser}
          onClose={() => setDeductUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      {balanceUser && (
        <AddBalanceForm
          token={token}
          user={balanceUser}
          onClose={() => setBalanceUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}