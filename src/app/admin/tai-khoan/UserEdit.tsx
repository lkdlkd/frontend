import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { updateUser, changePassword } from "@/utils/api";
import { toast } from "react-toastify";
import { User } from "@/types/index";
interface UserEditProps {
  user: User;
  token: string;
  onClose: () => void;
  onUserUpdated: (updatedUser: User) => void;
}

function UserEdit({ user, token, onClose, onUserUpdated }: UserEditProps) {
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);
  const [balance, setBalance] = useState(user.balance);
  const [capbac, setCapbac] = useState(user.capbac);
  const [tongnap, setTongnap] = useState(user.tongnap);
  const [tongnapthang, setTongnapthang] = useState(user.tongnapthang);
  const [newPassword, setNewPassword] = useState(""); // Thêm state cho mật khẩu mới

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(user._id, { username, role, balance, capbac, tongnap, tongnapthang }, token);

      // Gửi dữ liệu đã cập nhật về component cha
      onUserUpdated(updatedUser);

      toast.success("Cập nhật thông tin thành công!");
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!newPassword) {
        alert("Vui lòng nhập mật khẩu mới!");
        return;
      }

      // Gọi API để đổi mật khẩu
      await changePassword(user._id, { balance, newPassword }, token);
      alert("Mật khẩu đã được đặt lại thành công!");
      setNewPassword(""); // Xóa mật khẩu sau khi đổi thành công
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      alert("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Modal show={true} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Sửa thông tin người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Tên người dùng</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Vai trò</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Số dư</label>
            <input
              type="number"
              className="form-control"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cấp bậc</label>
            <input
              type="text"
              className="form-control"
              value={capbac}
              onChange={(e) => setCapbac(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tổng nạp</label>
            <input
              type="number"
              className="form-control"
              value={tongnap}
              onChange={(e) => setTongnap(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tổng nạp tháng</label>
            <input
              type="number"
              className="form-control"
              value={tongnapthang}
              onChange={(e) => setTongnapthang(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={handleChangePassword}>
          Đổi mật khẩu
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserEdit;