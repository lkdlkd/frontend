"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@/types/index"; // Import kiểu User

type MenuName = "Menu" | "dichvu" | "order" | string | null;

function MenuUser({ user, categories }: { user: User | null; categories: any[] }) {
  const [activeMenu, setActiveMenu] = useState<MenuName>(null);

  // Lấy role từ user, mặc định là "user" nếu không có
  const userRole = user?.role || "user";

  // Hàm toggle menu
  const toggleMenu = (menuName: MenuName | string) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  // Nhóm danh mục theo nền tảng
  const groupedCategories = categories.reduce((acc: any, category: any) => {
    const platformId = category.platforms_id._id;
    if (!acc[platformId]) {
      acc[platformId] = {
        platform: category.platforms_id,
        services: [],
      };
    }
    acc[platformId].services.push(category);
    return acc;
  }, {});

  return (
    <nav className="pc-sidebar">
      <div className="navbar-wrapper">
        <div className="m-header">
          <Link href="/" className="b-brand text-primary">
            <span>LIKESUBVIET.COM</span>
          </Link>
        </div>
        <div className="navbar-content mb-3">
          <ul className="pc-navbar">
            {/* Menu dành cho admin */}
            {userRole === "admin" && (
              <>
                <li className="pc-item pc-caption">
                  <label>Bảng Điều Khiển</label>
                </li>
                <li className="pc-item pc-hasmenu">
                  <a
                    onClick={() => toggleMenu("Menu")}
                    className="pc-link"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="pc-micon">
                      <img src="/dashboard.png" className="wid-35" alt="" />
                    </span>
                    <span className="pc-mtext">QUẢN LÝ HỆ THỐNG</span>
                    <span className="pc-arrow">
                      <i data-feather="chevron-right"></i>
                    </span>
                  </a>
                  {activeMenu === "Menu" && (
                    <ul className="pc-submenu" style={{ listStyleType: "none" }}>
                      <li className="pc-item">
                        <Link href="/admin/tai-khoan" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Khách hàng</span>
                        </Link>
                      </li>
                      <li className="pc-item">
                        <Link href="/admin/thongke" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Thống kê</span>
                        </Link>
                      </li>
                      <li className="pc-item">
                        <Link href="/admin/bank-king" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Nạp tiền</span>
                        </Link>
                      </li>
                      <li className="pc-item">
                        <Link href="/admin/taothongbao" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Thông báo</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li className="pc-item pc-hasmenu">
                  <a
                    onClick={() => toggleMenu("dichvu")}
                    className="pc-link"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="pc-micon">
                      <img src="/dashboard.png" className="wid-35" alt="" />
                    </span>
                    <span className="pc-mtext">MENU DỊCH VỤ</span>
                    <span className="pc-arrow">
                      <i data-feather="chevron-right"></i>
                    </span>
                  </a>
                  {activeMenu === "dichvu" && (
                    <ul className="pc-submenu" style={{ listStyleType: "none" }}>
                      <li className="pc-item">
                        <Link href="/admin/doitac" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Thêm đối tác</span>
                        </Link>
                      </li>
                      <li className="pc-item">
                        <Link href="/admin/nen-tang" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Thêm nền tảng</span>
                        </Link>
                      </li>
                      <li className="pc-item">
                        <Link href="/admin/dich-vu" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Thêm dịch vụ</span>
                        </Link>
                      </li>

                      <li className="pc-item">
                        <Link href="/admin/server" className="pc-link">
                          <span className="pc-micon">
                            <img src="/home.png" className="wid-35" alt="" />
                          </span>
                          <span className="pc-mtext">Thêm server</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            )}

            {/* Menu dành cho tất cả người dùng */}
            <li className="pc-item pc-caption">
              <label>Bảng Điều Khiển</label>
            </li>
            <li className="pc-item">
              <Link href="/profile" className="pc-link">
                <span className="pc-micon">
                  <img src="/home.png" className="wid-35" alt="" />
                </span>
                <span className="pc-mtext">Thông Tin Cá Nhân</span>
              </Link>
            </li>
            <li className="pc-item">
              <Link href="/nap-tien" className="pc-link">
                <span className="pc-micon">
                  <img src="/payment-method.png" className="wid-35" alt="" />
                </span>
                <span className="pc-mtext">Nạp Tiền</span>
              </Link>
            </li>
            <li className="pc-item">
              <Link href="/lich-su-hoat-dong" className="pc-link">
                <span className="pc-micon">
                  <img src="/transactions.png" className="wid-35" alt="" />
                </span>
                <span className="pc-mtext">Lịch Sử Hoạt Động</span>
              </Link>
            </li>
            <li className="pc-item pc-caption">
              <label>Danh Sách Dịch Vụ</label>
            </li>
            <li className="pc-item">
              <Link href="/order" className="pc-link">
                <span className="pc-micon">
                  <img
                    src="https://i.imgur.com/LtJfhAt.gif"
                    className="wid-35"
                    alt="Service Platform 1"
                  />
                </span>
                <span className="pc-mtext">MUA DỊCH VỤ</span>
              </Link>
            </li>
            <li className="pc-item">
              <Link href="/danh-sach-don" className="pc-link">
                <span className="pc-micon">
                  <img
                    src="/transactions.png"
                    className="wid-35"
                    alt="Service Platform 1"
                  />
                </span>
                <span className="pc-mtext">DANH SÁCH ĐƠN</span>
              </Link>
            </li>
            {Object.values(groupedCategories).map((group: any) => (
              <li key={group.platform._id} className="pc-item pc-hasmenu">
                <a
                  onClick={() => toggleMenu(group.platform._id)}
                  className="pc-link"
                  style={{ cursor: "pointer" }}
                >
                  <span className="pc-micon">
                    <img src={group.platform.logo} className="wid-35" alt={group.platform.name} />
                  </span>
                  <span className="pc-mtext">{group.platform.name}</span>
                  <span className="pc-arrow">
                    <i data-feather="chevron-right"></i>
                  </span>
                </a>
                {activeMenu === group.platform._id && (
                  <ul className="pc-submenu" style={{ listStyleType: "none" }}>
                    {group.services.map((service: any) => (
                      <li key={service._id} className="pc-item">
                        <Link
                          href={`/${group.platform.name.toLowerCase()}/${service.path}`}
                          className="pc-link"
                        >
                          <span className="pc-mtext">{service.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default MenuUser;
