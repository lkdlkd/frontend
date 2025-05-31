import { cookies } from "next/headers";
import NotificationModal from "@/components/NotificationModal";
import { getMe , getNotifications } from "@/utils/api";
export default async function Home() {
  // Lấy token từ cookie (server-side)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  
  // Lấy dữ liệu user từ API backend qua route handler
  const userRes = await getMe(token);
  const user =  userRes;
  // Lấy notifications
  const notiRes = await getNotifications(token);
  const notifications =  notiRes;
  const notificationsArray = Array.isArray(notifications)
    ? notifications
    : notifications?.data || [];

  return (
    <>
      <div className="row">
        {/* Card số dư hiện tại */}
        <div className="col-md-6 col-xxl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-primary me-1">
                    <i className="ti ti-currency-dollar fs-2"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">
                    {Number(user.balance || 0).toLocaleString("en-US")}đ
                  </h4>
                  <h6 className="mb-0">Số dư hiện tại</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các card khác */}
        <div className="col-md-6 col-xxl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-warning me-1">
                    <i className="ti ti-calendar-minus fs-2"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">
                    {Number(user.tongnapthang || 0).toLocaleString("en-US")}đ
                  </h4>
                  <h6 className="mb-0">
                    Tổng nạp tháng {new Date().getMonth() + 1}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xxl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-success me-1">
                    <i className="ti ti-layers-intersect fs-2"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">
                    {Number(user.tongnap || 0).toLocaleString("en-US")}đ
                  </h4>
                  <h6 className="mb-0">Tổng nạp</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xxl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="avtar bg-light-info me-1">
                    <i className="ti ti-diamond fs-2"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="mb-0">{user.capbac || "Chưa có"}</h4>
                  <h6 className="mb-0">Cấp bậc</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông báo GHIM */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="header-title mb-3">Thông báo GHIM</h4>
              <div className="inbox-widget" data-simplebar="init">
                <div className="inbox-item">
                  <p className="inbox-item-author">
                    Hệ thống cung cấp nguồn like, sub, mắt, view, comment, share với
                    giá tốt nhất và hoàn toàn tự động!
                  </p>
                  <ul>
                    <li>
                      <strong>Hỗ trợ nhanh nhất qua zalo:&nbsp;</strong>
                      <a href="https://zalo.me/0868065672">
                        <strong>0868065672</strong>
                      </a>
                    </li>
                    <li>
                      <strong>Kênh thông báo khuyến mãi:&nbsp;</strong>
                      <a href="https://zalo.me/g/aywfhm129">
                        <strong>TẠI ĐÂY</strong>
                      </a>
                    </li>
                    <li>
                      <strong>Tài liệu API : </strong>
                      <a href="#">
                        <strong>TẠI ĐÂY</strong>
                      </a>
                      <strong> - LIÊN HỆ </strong>
                      <a href="https://zalo.me/0868065672">
                        <strong>ZALO&nbsp;</strong>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông báo gần đây - dùng Client Component */}
        <div className="col-md-8">
          <NotificationModal notifications={notificationsArray} />
        </div>
      </div>
    </>
  );
}

