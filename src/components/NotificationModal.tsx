"use client";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// Định nghĩa interface cho dữ liệu thông báo
interface Notification {
  _id?: string;
  title: string;
  content?: string;
  created_at: string | Date;
  is_read?: boolean;
  type?: string;
  user_id?: string;
  [key: string]: any; // Cho phép các thuộc tính khác
}

// Props cho component
interface NotificationModalProps {
  notifications: Notification[];
}

export default function NotificationModal({ notifications = [] }: NotificationModalProps) {
  const [noti, setNoti] = useState<Notification>(notifications[0] || {});
  const [showModal, setShowModal] = useState<boolean>(false);
  // Kiểm tra và hiển thị modal khi load trang
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setNoti(notifications[0]);
      
      // Kiểm tra thời gian lần cuối đóng modal
      const lastClosedTime = localStorage.getItem("notiModalLastClosed");
      const now = Date.now();
      
      // 2 giờ = 2 * 60 * 60 * 1000 = 7200000 milliseconds
      const twoHoursInMs = 7200000;
      
      // Hiển thị modal nếu:
      // 1. Chưa từng đóng (không có lastClosedTime)
      // 2. Hoặc đã qua 2 giờ kể từ lần đóng cuối
      if (!lastClosedTime || (now - parseInt(lastClosedTime)) > twoHoursInMs) {
        setTimeout(() => {
          setShowModal(true);
        }, 500);
      }
    }
  }, [notifications]);

  // Chỉ đóng modal mà KHÔNG cập nhật thời gian - khi click X
  const handleDismiss = () => {
    setShowModal(false);
  };

  // Đóng modal VÀ lưu thời gian - khi click "Tôi đã đọc"
  const handleRead = () => {
    // Lưu thời gian hiện tại vào localStorage
    localStorage.setItem("notiModalLastClosed", Date.now().toString());
    setShowModal(false);
  };

  // Mở modal với thông báo cụ thể
  const openModal = (notification: Notification) => {
    setNoti(notification);
    setShowModal(true);
  };

  return (
    <>
      {/* Danh sách thông báo */}
      <div className="card mb-3">
        <div className="card-header">
          <h5 className="card-title">Thông báo gần đây</h5>
        </div>
        <div className="card-body">
          <div className="scroll h-350px">
            {notifications.length > 0 ? (
              notifications.map((notification, idx) => (
                <div key={notification._id || idx} className="list-group list-group-flush">
                  <div
                    className="list-group-item list-group-item-action py-2 px-3 cursor-pointer rounded"
                    style={{ cursor: "pointer" }}
                    onClick={() => openModal(notification)}
                  >
                    <div className="media align-items-center gap-2">
                      <div className="chat-avtar">
                        <div className="avtar avtar-s bg-light-info">
                          <i className="ti ti-bell-ringing fs-4"></i>
                        </div>
                      </div>
                      <div className="media-body mx-2">
                        <h6 className="card-title">{notification.title}</h6>
                        <span className="f-15 text-muted fw-bold mb-1" dangerouslySetInnerHTML={{ __html: notification.content || "" }} />
                        <p className="f-12 text-muted">
                          <i className="ti ti-clock"></i>
                          {new Date(notification.created_at).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">Chưa có thông báo</div>
            )}
          </div>
        </div>
      </div>

      {/* React Bootstrap Modal */}
      <Modal
        show={showModal}
        onHide={handleDismiss} // Thay đổi từ handleClose thành handleDismiss
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: noti.content || "" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleRead}>
            Tôi đã đọc
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}