import { cookies } from "next/headers";
import { getMe } from "@/utils/api";
import ProfileInfo from "@/app/profile/Profile";
import ChangePasswordForm from "@/app/profile/ChangePasswordForm";
import { User } from "@/types/index";

// const cookies = require("js-cookie");

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const userRes = await getMe(token);
  const User = userRes;
  return (
    <div className="row">
      {/* Phần thông tin cá nhân */}
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="col-md-12">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row">
                    <ProfileInfo user={User} />
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">
                          <h5 className="card-title">Đổi mật khẩu</h5>
                        </div>
                        <div className="card-body">
                          <ChangePasswordForm token = {token} userId={User.userId} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

