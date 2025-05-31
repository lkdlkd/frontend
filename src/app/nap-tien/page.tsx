
import { cookies } from "next/headers";
import { getCard, getBanking, getCardHistory } from "@/utils/api";
import { getMe } from "@/utils/api";
import Napthecao from "@/app/nap-tien/Napthecao";
import CardHistory from "@/app/nap-tien/CardHistory";
import Banking from "@/app/nap-tien/Banking";
export default async function Naptien() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";
    const userRes = await getMe(token);
    const user = userRes;
    // Gọi API trên server
    const [banking, historycard, card] = await Promise.all([
        getBanking(token),
        getCardHistory(token),
        getCard(token),
    ]);
    return (
        <div className="row">
            {/* Phần thông tin ngân hàng và nạp tiền qua chuyển khoản, quét mã QR */}
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Nạp tiền</h5>
                    </div>
                    <div className="card-body">
                        <div className="alert alert-danger mb-0">
                            <ul className="mb-0">
                                <li className="fw-bold text-dark">
                                    Vui lòng nạp đúng tài khoản và nội dung
                                </li>
                                <li className="fw-bold text-dark">
                                    Sai nội dung hoặc quên không có nội dung bị phạt 20% (ví dụ nạp
                                    100k còn 80k)
                                </li>
                                <li className="fw-bold text-dark">
                                    Nạp dưới min của web yêu cầu (mất tiền)
                                </li>
                                <li className="fw-bold text-dark">
                                    Không hỗ trợ nạp rồi rút ra với bất kì lý do gì
                                </li>
                                <li className="fw-bold text-dark">
                                    Sau 10p nếu chưa thấy tiền về tài khoản thì liên hệ trực tiếp Admin.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Banking banking={banking} user={user} />
            {/* {message && <p className="text-danger">{message}</p>} */}
            <Napthecao cardData={card.data} token ={token} />

            {/* Các bảng lịch sử giao dịch */}
            <div>history banking</div>

            <CardHistory historycard={historycard.transactions} />
        </div>
    );
}

