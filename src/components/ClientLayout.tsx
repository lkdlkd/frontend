"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePathname } from "next/navigation";
import { User } from "@/types/index";
import { ToastContainer } from "react-toastify";

interface ClientLayoutProps {
  user: User | null; // Định nghĩa kiểu dữ liệu cho user
  categories: Categories | null; // Danh sách danh mục, có thể là mảng các đối tượng
  children: ReactNode;
}
interface Categories {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClientLayout({ categories, user, children }: ClientLayoutProps) {
  const safeUser: User = user || {
    _id: "",// Đảm bảo thuộc tính này tồn tại
    username: "",
    role: "",
    token: "",
    userId: "",
    tongnapthang: 0,
    balance: 0,
    tongnap: 0,
    capbac: "",
    status: "",
    createdAt: "",
    updatedAt: "",
  };

  const pathname = usePathname();

  const isLoginPage = pathname === "/dang-nhap";
  const isRegisterPage = pathname === "/dang-ky";

  if (isLoginPage || isRegisterPage) {
    return <>{children}</>;
  }


  return (
    <>
      <Header user={safeUser} />
      <Menu categories = {categories} user={safeUser} /> {/* Truyền toàn bộ safeUser vào Menu */}
      <div className="pc-container">
        <div className="pc-content">{children}</div>
      </div>
      <ToastContainer />
    </>
  );
}