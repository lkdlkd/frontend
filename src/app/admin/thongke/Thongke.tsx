'use client';
import { useRouter } from "next/navigation";

interface ThongKeProps {
    statistics: {
        tonguser: number;
        tongtienweb: number;
        tongdanap: number;
        tongnapthang: number;
        tongdoanhthu: number;
        tongdondangchay: number;
        tongnapngay: number;
        tongdoanhthuhnay: number;
    };
    napRange: string;
    doanhthuRange: string;
}

export default function ThongKe({ statistics, napRange, doanhthuRange }: ThongKeProps) {
    const router = useRouter();

    const handleRangeChange = (type: "napRange" | "doanhthuRange", value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set(type, value);
        router.push(`/admin/thongke?${params.toString()}`);
    };

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <label>Chọn khoảng thời gian nạp tiền:</label>
                    <select
                        className="form-select"
                        value={napRange}
                        onChange={(e) => handleRangeChange("napRange", e.target.value)}
                    >
                        <option value="today">Hôm nay</option>
                        <option value="yesterday">Hôm qua</option>
                        <option value="this_week">Tuần này</option>
                        <option value="last_week">Tuần trước</option>
                        <option value="this_month">Tháng này</option>
                        <option value="last_month">Tháng trước</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label>Chọn khoảng thời gian doanh thu:</label>
                    <select
                        className="form-select"
                        value={doanhthuRange}
                        onChange={(e) => handleRangeChange("doanhthuRange", e.target.value)}
                    >
                        <option value="today">Hôm nay</option>
                        <option value="yesterday">Hôm qua</option>
                        <option value="this_week">Tuần này</option>
                        <option value="last_week">Tuần trước</option>
                        <option value="this_month">Tháng này</option>
                        <option value="last_month">Tháng trước</option>
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-primary me-3">
                                    <i className="ti ti-coin fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongnapngay).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Nạp tiền hôm nay</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-primary me-3">
                                    <i className="ti ti-coin fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongdoanhthuhnay).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Doanh thu hôm nay</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-success me-3">
                                    <i className="ti ti-users fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tonguser).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Tổng thành viên</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-warning me-3">
                                    <i className="ti ti-coin fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongtienweb).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Tổng số dư</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-primary me-3">
                                    <i className="ti ti-coin fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongdanap).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Tổng đã nạp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-info me-3">
                                    <i className="ti ti-users fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongnapthang).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Tổng nạp tháng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-warning me-3">
                                    <i className="ti ti-coin fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongdoanhthu).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Tổng doanh thu</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                                <div className="avtar bg-light-warning me-3">
                                    <i className="ti ti-coin fs-2"></i>
                                </div>
                                <div>
                                    <h4 className="mb-0">{Number(statistics.tongdondangchay).toLocaleString("en-US")}</h4>
                                    <p className="mb-0 text-opacity-75 capitalize">Đơn hàng đang chạy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}