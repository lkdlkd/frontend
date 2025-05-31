
import { cookies } from "next/headers";
import { getServer } from "@/utils/api"; // Giả sử có hàm getServices để lấy dịch vụ
import AddOrder from "@/app/order/AddOrder"; // Giả sử có component AddOrder để thêm đơn hàng
export default async function Dichvupage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";
    // Gọi API để lấy dữ liệu dịch vụ nếu cần
    const server = await getServer(token); // Giả sử có hàm getServices để lấy dịch vụ
    return (
        <div className="main-content">
            <div className="row">
                <div className="col-md-12 col-lg-8">
                    <div className="card">
                        <AddOrder server={server.data} token={token} />
                    </div>
                </div>
                <div className="col-md-12 col-lg-4">
                    <div className="alert alert-danger bg-danger text-white mb-3">
                        <h5 className="alert-heading">Lưu ý</h5>
                        <span>
                            Nghiêm cấm buff các đơn có nội dung vi phạm pháp luật, chính trị, đồ trụy...
                            Nếu cố tình buff bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.
                            Nếu đơn đang chạy trên hệ thống mà bạn vẫn mua ở các hệ thống bên khác hoặc đè nhiều đơn, nếu có tình trạng hụt, thiếu số lượng giữa 2 bên thì sẽ không được xử lí.
                            Đơn cài sai thông tin hoặc lỗi trong quá trình tăng hệ thống sẽ không hoàn lại tiền.
                            Nếu gặp lỗi hãy nhắn tin hỗ trợ phía bên phải góc màn hình hoặc vào mục liên hệ hỗ trợ để được hỗ trợ tốt nhất.
                        </span>
                    </div>
                    <div className="alert alert-primary bg-primary text-white">
                        <h5 className="alert-heading">Các trường hợp huỷ đơn hoặc không chạy</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

