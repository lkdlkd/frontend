'use client';
import { useState } from "react";
import { addNotification } from "@/utils/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Editor } from "@ckeditor/ckeditor5-core";

interface Notification {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

interface AddthongbaoProps {
  token: string;
  onAdd: (newNotification: Notification) => void;
}

export default function Addthongbao({ token, onAdd }: AddthongbaoProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "primary",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newNotification: Notification = await addNotification(formData, token);
      toast.success("Thông báo mới đã được thêm thành công!");
      onAdd(newNotification); // Cập nhật danh sách thông báo
      setFormData({ title: "", content: "", color: "primary" }); // Reset form
    } catch (error) {
      console.error("Lỗi khi thêm thông báo:", error);
      toast.error("Lỗi khi thêm thông báo. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card mb-4"
      >
        <div className="card-header">
          <h5 className="card-title">Thêm thông báo mới</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="title"
                id="title"
                placeholder="Tiêu đề"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <label htmlFor="title">Tiêu đề</label>
            </div>
            {/* Màu sắc */}
            <div className="form-floating mb-3">
              <select
                name="color"
                id="color"
                className="form-select"
                value={formData.color}
                onChange={handleChange}
              >
                <option value="primary">Tím</option>
                <option value="secondary">Đen</option>
                <option value="success">Xanh Lục</option>
                <option value="danger">Đỏ</option>
                <option value="warning">Vàng</option>
                <option value="info">Xanh Dương</option>
              </select>
              <label htmlFor="color">Màu sắc</label>
            </div>
            {/* Nội dung: CKEditor */}
            <div className="form-group mb-3">
              <label>Nội dung</label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.content}
                onReady={(editor: Editor) => {
                  editor.ui.view.editable.element.style.height = "300px";
                }}
                onChange={(event, editor: Editor) => {
                  const data = editor.getData();
                  setFormData((prev) => ({ ...prev, content: data }));
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Đang thêm..." : "Thêm thông báo"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}