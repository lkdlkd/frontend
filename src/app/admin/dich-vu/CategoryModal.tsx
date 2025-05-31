'use client';

import { useState, useEffect } from "react";

interface Platform {
  _id: string; // ID của nền tảng
  name: string; // Tên của nền tảng
}

interface CategoryModalProps {
  category?: {
    _id?: string;
    platforms_id?: string;
    name: string;
    path: string;
    notes: string | null;
    modal_show: string | null;
  };
  platforms: Platform[]; // Danh sách nền tảng
  onClose: () => void;
  onSave: (categoryData: {
    platforms_id: string;
    name: string;
    path: string;
    notes: string | null;
    modal_show: string | null;
  }) => void;
}

export default function CategoryModal({ category, platforms, onClose, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    platforms_id: "",
    name: "",
    path: "",
    notes: "",
    modal_show: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        platforms_id: category.platforms_id || "",
        name: category.name || "",
        path: category.path || "",
        notes: category.notes || "",
        modal_show: category.modal_show || "",
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{category ? "Sửa Danh mục" : "Thêm Danh mục"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nền tảng</label>
                <select
                  className="form-select"
                  value={formData.platforms_id}
                  onChange={(e) => setFormData({ ...formData, platforms_id: e.target.value })}
                  required
                >
                  <option value="">Chọn nền tảng</option>
                  {platforms.map((platform) => (
                    <option key={platform._id} value={platform._id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Tên Danh mục</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đường dẫn</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ghi chú</label>
                <textarea
                  className="form-control"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Hiển thị Modal</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.modal_show || ""}
                  onChange={(e) => setFormData({ ...formData, modal_show: e.target.value })}
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