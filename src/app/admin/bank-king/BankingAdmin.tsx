'use client';
import { useState } from "react";
import { createBanking, updateBanking, deleteBanking } from "@/utils/api";
import ModalBanking from "./ModalBanking";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table"; // Import Table từ react-bootstrap

interface BankingAdminProps {
  banks: {
    _id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    logo: string;
    bank_account: string;
    min_recharge: number;
    status: boolean;
  }[];
  token: string;
}

export default function BankingAdmin({ banks, token }: BankingAdminProps) {
  const [bankList, setBankList] = useState(banks);
  const [editingBank, setEditingBank] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (data: any) => {
    try {
      const newBank = await createBanking(data, token);
      setBankList((prev) => [...prev, newBank]);
      toast.success("Ngân hàng mới được tạo thành công!");
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi tạo ngân hàng:", error);
      toast.error("Lỗi khi tạo ngân hàng. Vui lòng thử lại!");
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const updatedBank = await updateBanking(id, data, token);
      setBankList((prev) =>
        prev.map((bank) => (bank._id === id ? updatedBank : bank))
      );
      toast.success("Ngân hàng đã được cập nhật thành công!");
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật ngân hàng:", error);
      toast.error("Lỗi khi cập nhật ngân hàng. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này sẽ xóa ngân hàng vĩnh viễn!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await deleteBanking(id, token);
        setBankList((prev) => prev.filter((bank) => bank._id !== id));
        toast.success("Ngân hàng đã bị xóa thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa ngân hàng:", error);
      toast.error("Lỗi khi xóa ngân hàng. Vui lòng thử lại!");
    }
  };

  const handleEditClick = (bank: any) => {
    setEditingBank(bank);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingBank(null);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      {/* Modal thêm/sửa ngân hàng */}
      {showModal && (
        <ModalBanking
          token={token}
          editing={!!editingBank}
          formData={editingBank || {}}
          handleChange={(e) => {
            const { name, value, type, checked } = e.target as HTMLInputElement;
            setEditingBank((prev: any) => ({
              ...prev,
              [name]: type === "checkbox" ? checked : value,
            }));
          }}
          handleSubmit={(e) => {
            e.preventDefault();
            if (editingBank?._id) {
              handleUpdate(editingBank._id, editingBank);
            } else {
              handleCreate(editingBank);
            }
          }}
        />
      )}

      {/* Danh sách ngân hàng */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Danh sách ngân hàng</h4>
          <button className="btn btn-light btn-sm" onClick={handleAddClick}>
            Thêm ngân hàng
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-primary">
                <tr>
                  <th>Hành động</th>

                  <th>Ngân Hàng</th>
                  <th>Tên chủ tài khoản</th>
                  <th>Số tài khoản</th>
                  <th>Logo</th>
                  <th>Tài khoản ngân hàng</th>
                  <th>Số tiền nạp tối thiểu</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bankList.map((bank) => (
                  <tr key={bank._id}>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(bank)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(bank._id)}
                      >
                        Xóa
                      </button>
                    </td>
                    <td>{bank.bank_name}</td>
                    <td>{bank.account_name}</td>
                    <td>{bank.account_number}</td>
                    <td>
                      <img
                        src={bank.logo}
                        alt="Logo"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{bank.bank_account}</td>
                    <td>{bank.min_recharge.toLocaleString("en-US")}</td>
                    <td>{bank.status ? "Hoạt động" : "Ngưng hoạt động"}</td>

                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}