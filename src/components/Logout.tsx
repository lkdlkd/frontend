"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
const Cookies = require("js-cookie");

export default function Logout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    
    // Xóa token từ cookie
    Cookies.remove("token");
    localStorage.removeItem("notiModalLastClosed"); // Xóa token khỏi localStorage nếu có
    // Các cookie khác nếu cần
    // Cookies.remove("user");
    
    // Chuyển hướng về trang đăng nhập
    setTimeout(() => {
      router.push("/dang-nhap");
      router.refresh(); // Refresh để cập nhật trạng thái đăng nhập
    }, 500);
  };

  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      className="dropdown-item"
      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
    >
      <i className="ti ti-logout me-2 text-danger"></i>
      {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
    </a>
  );
}