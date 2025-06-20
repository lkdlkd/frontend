import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { updateUser } from "@/utils/api";
import { toast } from "react-toastify";
import { User } from "@/types/index";

interface DeductBalanceProps {
  user: User;
  token: string;
  onClose: () => void;
  onUserUpdated: (updatedUser: User) => void;
}

function DeductBalanceForm({ user, token, onClose, onUserUpdated }: DeductBalanceProps) {
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDeductBalance = async () => {
    if (deductionAmount <= 0) {
        toast.error("Số tiền trừ phải lớn hơn 0!");
        return;
    }

    if (deductionAmount > user.balance) {
        toast.error("Số tiền trừ không được lớn hơn số dư hiện tại!");
        return;
    }

    try {
        setLoading(true);

        // Tính toán số dư mới
        const updatedBalance = user.balance - deductionAmount;

        // Gọi API để cập nhật số dư
        const updatedUser = await updateUser(user._id, { balance: updatedBalance }, token);

        // Gửi dữ liệu đã cập nhật về component cha
        onUserUpdated(updatedUser);

        toast.success("Trừ số dư thành công!");
        onClose(); // Đóng modal
    } catch (error) {
        console.error("Lỗi khi trừ số dư:", error);
        toast.error("Trừ số dư thất bại. Vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Trừ số dư</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Tên người dùng</label>
            <input
              type="text"
              className="form-control"
              value={user.username}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số dư hiện tại</label>
            <input
              type="number"
              className="form-control"
              value={user.balance}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số tiền muốn trừ</label>
            <input
              type="number"
              className="form-control"
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(Number(e.target.value))}
              placeholder="Nhập số tiền muốn trừ"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleDeductBalance} disabled={loading}>
          {loading ? "Đang xử lý..." : "Trừ số dư"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeductBalanceForm;