import { useState, useEffect } from "react";

interface Platform {
  _id?: string; // ID có thể không tồn tại khi thêm mới
  name: string; // Tên nền tảng
  logo: string; // URL logo của nền tảng
}

interface PlatformModalProps {
  platform?: Platform; // Nền tảng được chọn để chỉnh sửa (nếu có)
  onClose: () => void; // Đóng modal
  onSave: (platformData: Platform) => void; // Lưu dữ liệu nền tảng
}

export default function PlatformModal({ platform, onClose, onSave }: PlatformModalProps) {
  const [formData, setFormData] = useState<Platform>({
    name: "",
    logo: "",
  });

  useEffect(() => {
    if (platform) {
      setFormData({
        name: platform.name || "",
        logo: platform.logo || "",
      });
    }
  }, [platform]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{platform ? "Sửa Nền tảng" : "Thêm Nền tảng"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên Nền tảng</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Logo (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}