'use client';
import { useState, useEffect } from "react";
import { createSmmPartner, updateSmmPartner } from "@/utils/api";
import { toast } from "react-toastify";

interface Partner {
  _id?: string; // ID có thể không tồn tại khi thêm mới
  name: string;
  url_api: string;
  api_token: string;
  price_update: string;
  tigia: string;
  status: "on" | "off";
  update_price: "on" | "off";
}

interface AdddoitacProps {
  token: string;
  onAdd: (newPartner: Partner) => void;
  editingPartner?: Partner; // Đối tác đang chỉnh sửa (nếu có)
  onUpdate?: (updatedPartner: Partner) => void; // Hàm cập nhật đối tác
  onClose: () => void; // Đóng modal
}

export default function Adddoitac({
  token,
  onAdd,
  editingPartner,
  onUpdate,
  onClose,
}: AdddoitacProps) {
  const [formData, setFormData] = useState<Partner>({
    name: "",
    url_api: "",
    api_token: "",
    price_update: "",
    tigia: "",
    status: "on",
    update_price: "on",
  });
  const [loading, setLoading] = useState(false);

  // Đồng bộ hóa formData với editingPartner khi editingPartner thay đổi
  useEffect(() => {
    if (editingPartner) {
      setFormData(editingPartner);
    }
  }, [editingPartner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPartner) {
        // Cập nhật đối tác
        const updatedPartner = await updateSmmPartner(editingPartner._id!, formData, token);
        toast.success("Đối tác đã được cập nhật thành công!");
        onUpdate?.(updatedPartner); // Cập nhật danh sách đối tác
      } else {
        // Thêm đối tác mới
        const newPartner = await createSmmPartner(formData, token);
        toast.success("Đối tác mới đã được thêm thành công!");
        onAdd(newPartner); // Cập nhật danh sách đối tác
      }
      setFormData({
        name: "",
        url_api: "",
        api_token: "",
        price_update: "",
        tigia: "",
        status: "on",
        update_price: "on",
      }); // Reset form
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật đối tác:", error);
      toast.error("Lỗi khi thêm/cập nhật đối tác. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingPartner ? "Cập Nhật Đối Tác" : "Thêm Đối Tác"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên Đối Tác:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="VD : subvietvn"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">URL API:</label>
                <input
                  type="text"
                  name="url_api"
                  value={formData.url_api}
                  onChange={handleChange}
                  placeholder="https://subviet.vn/api/v3"
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">API Token:</label>
                <input
                  type="text"
                  name="api_token"
                  value={formData.api_token}
                  onChange={handleChange}
                  placeholder="token"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cập Nhật Giá:</label>
                <input
                  type="text"
                  name="price_update"
                  value={formData.price_update}
                  onChange={handleChange}
                  placeholder="5,10,15..."
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tỉ Giá:</label>
                <input
                  type="text"
                  name="tigia"
                  value={formData.tigia}
                  onChange={handleChange}
                  placeholder="VD: 23000"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Trạng Thái:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="on">Bật</option>
                  <option value="off">Tắt</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Cập Nhật Giá Tự Động:</label>
                <select
                  name="update_price"
                  value={formData.update_price}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="on">Bật</option>
                  <option value="off">Tắt</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Đang xử lý..." : editingPartner ? "Cập Nhật Đối Tác" : "Thêm Đối Tác"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}