'use client';
import { useState } from "react";
import Swal from "sweetalert2";
import Adddoitac from "@/app/admin/doitac/Adddoitac";
import { deleteSmmPartner } from "@/utils/api";

interface SmmPartner {
  _id: string;
  name: string;
  url_api: string;
  api_token: string;
  price_update: string;
  tigia: string;
  status: string;
  update_price: string;
}

interface DoitacpageProps {
  smmPartners: SmmPartner[];
  token: string;
}

export default function Doitacpage({ smmPartners: initialSmmPartners, token }: DoitacpageProps) {
  const [smmPartners, setSmmPartners] = useState(initialSmmPartners);
  const [editingPartner, setEditingPartner] = useState<SmmPartner | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xóa đối tác vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteSmmPartner(id, token); // Gọi API xóa đối tác
        setSmmPartners((prev) => prev.filter((partner) => partner._id !== id)); // Cập nhật danh sách đối tác
        Swal.fire("Đã xóa!", "Đối tác đã được xóa thành công.", "success");
      } catch (error) {
        console.error("Lỗi khi xóa đối tác:", error);
        Swal.fire("Lỗi!", "Không thể xóa đối tác. Vui lòng thử lại.", "error");
      }
    }
  };

  const handleUpdate = (updatedPartner: SmmPartner) => {
    setSmmPartners((prev) =>
      prev.map((partner) => (partner._id === updatedPartner._id ? updatedPartner : partner))
    );
    setEditingPartner(null);
    setIsAdding(false);
  };

  const handleAdd = (newPartner: SmmPartner) => {
    setSmmPartners((prev) => [newPartner, ...prev]);
    setIsAdding(false);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Danh Sách Đối Tác SMM</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsAdding(true);
            setEditingPartner(null);
          }}
        >
          Thêm Đối Tác
        </button>
      </div>

      {(isAdding || editingPartner !== null) && (
        <Adddoitac
          token={token}
          onAdd={handleAdd}
          editingPartner={editingPartner}
          onUpdate={handleUpdate}
          onClose={() => {
            setIsAdding(false);
            setEditingPartner(null);
          }}
        />
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Hành Động</th>
                  <th>#</th>
                  <th>Tên</th>
                  <th>URL API</th>
                  <th>API Token</th>
                  <th>Giá Cập Nhật</th>
                  <th>Tỉ Giá</th>
                  <th>Trạng Thái</th>
                  <th>Cập Nhật Giá</th>
                </tr>
              </thead>
              <tbody>
                {smmPartners.map((partner, index) => (
                  <tr key={partner._id}>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setIsAdding(false);
                          setEditingPartner(partner);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(partner._id)}
                      >
                        Xóa
                      </button>
                    </td>
                    <td>{index + 1}</td>
                    <td>{partner.name}</td>
                    <td>{partner.url_api}</td>
                    <td
                      style={{
                        maxWidth: "250px",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {partner.api_token}
                    </td>
                    <td>{partner.price_update}</td>
                    <td>{partner.tigia}</td>
                    <td>{partner.status === "on" ? "Bật" : "Tắt"}</td>
                    <td>{partner.update_price === "on" ? "Bật" : "Tắt"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}