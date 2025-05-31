"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { addOrder , getUid } from "@/utils/api";

// Import `react-select` động
const Select = dynamic(() => import("react-select"), { ssr: false });

interface Server {
    id: string;
    Magoi: string;
    serviceId: string;
    category: string;
    type: string;
    maychu: string;
    name: string;
    rate: number;
    originalRate: number;
    Linkdv: string;
    serviceName: string;
    DomainSmm: string;
    isActive: boolean;
    createdAt: string;
}

interface AddOrderProps {
    server: Server[];
    token: string;
}

const AddOrder: React.FC<AddOrderProps> = ({ server, token }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [rawLink, setRawLink] = useState("");
    const [convertedUID, setConvertedUID] = useState("");
    const [selectedMagoi, setSelectedMagoi] = useState("");
    const [quantity, setQuantity] = useState(100);
    const [comments, setComments] = useState("");
    const [note, setNote] = useState("");
    const [totalCost, setTotalCost] = useState(0);
    const [min, setMin] = useState(100);
    const [max, setMax] = useState(10000);
    const [rate, setRate] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConverting, setIsConverting] = useState(false); // Thêm state isConverting

    const displayLink = convertedUID || rawLink;

    // Tính toán danh sách các loại nền tảng (Type) độc nhất chỉ một lần
    const uniqueTypes = useMemo(() => {
        return Array.from(new Set(server.map((server) => server.type)));
    }, [server]); // Thêm `server` vào dependencies

    // Tạo options cho react-select cho Type
    const typeOptions = useMemo(() => {
        return uniqueTypes.map((type) => ({
            value: type,
            label: type,
        }));
    }, [uniqueTypes]);

    // Nếu đã chọn một Type, tạo danh sách options cho Category dựa theo Type đó
    const categoryOptions = useMemo(() => {
        if (!selectedType) return [];
        const categories = Array.from(
            new Set(
                server
                    .filter((server) => server.type === selectedType.value)
                    .map((server) => server.category)
            )
        );
        return categories.map((cat) => ({
            value: cat,
            label: cat,
        }));
    }, [server, selectedType]);

    // Lọc danh sách server theo Type và Category đã chọn
    const filteredServers = useMemo(() => {
        return server.filter((server) => {
            const matchType = selectedType ? server.type === selectedType.value : true;
            const matchCategory = selectedCategory
                ? server.category === selectedCategory.value
                : true;
            return matchType && matchCategory;
        });
    }, [server, selectedType, selectedCategory]);

    // Handler cho khi chọn Type từ react-select
    const handleTypeChange = (option) => {
        setSelectedType(option);
        setSelectedCategory(null);
        setSelectedMagoi("");
        setTotalCost(0);
        // Reset các trường liên quan
        setRawLink("");
        setConvertedUID("");
        setQuantity(100);
        setComments("");
        setNote("");
    };

    // Handler cho khi chọn Category từ react-select
    const handleCategoryChange = (option) => {
        setSelectedCategory(option);
        setSelectedMagoi("");
        setTotalCost(0);
        // Reset các trường liên quan
        setRawLink("");
        setConvertedUID("");
        setQuantity(100);
        setComments("");
        setNote("");
    };

    // Tính tổng chi phí dựa vào dịch vụ được chọn
    useEffect(() => {
        if (selectedMagoi) {
            const selectedService = filteredServers.find(
                (service) => service.Magoi === selectedMagoi
            );
            if (selectedService) {
                if (selectedService.iscomment === "on") {
                    const lines = comments.split(/\r?\n/).filter((line) => line.trim() !== "");
                    setTotalCost(lines.length * selectedService.rate);
                } else {
                    setTotalCost(selectedService.rate * quantity);
                }
            }
        } else {
            setTotalCost(0);
        }
    }, [selectedMagoi, quantity, filteredServers, comments]);

    // Xử lý gửi đơn hàng
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalLink = convertedUID || rawLink;
        if (!finalLink || !selectedMagoi) {
            Swal.fire({
                title: "Lỗi",
                text: "Vui lòng chọn dịch vụ và nhập link.",
                icon: "error",
                confirmButtonText: "Xác nhận",
            });
            return;
        }

        try {
            setIsSubmitting(true); // Bắt đầu trạng thái xử lý

            const payload = {
                link: finalLink,
                category: selectedCategory ? selectedCategory.value : "",
                magoi: selectedMagoi,
                note,
                quantity,
            };

            await addOrder(payload, token);
            Swal.fire({
                title: "Thành công",
                text: "Mua dịch vụ thành công",
                icon: "success",
                confirmButtonText: "Xác nhận",
            });
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
                icon: "error",
                confirmButtonText: "Xác nhận",
            });
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái xử lý
        }
    };

    const handleConvertLink = async () => {
        try {
            setIsConverting(true); // Bắt đầu trạng thái xử lý
            // Logic chuyển đổi link hoặc UID
            const converted = await getUid(rawLink); // Giả sử bạn có hàm convertLink
            setConvertedUID(converted);
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: "Không thể chuyển đổi link. Vui lòng thử lại!",
                icon: "error",
                confirmButtonText: "Xác nhận",
            });
        } finally {
            setIsConverting(false); // Kết thúc trạng thái xử lý
        }
    };

    if (!server || server.length === 0) {
        return <p>Không có server nào khả dụng.</p>;
    }

    return (
        <div className="card-body">
            <h3 className="card-title d-flex align-items-center gap-2 mb-5">
                <span className="text-primary">Tạo đơn hàng mới: </span>
            </h3>
            <div className="form-group mb-3">
                <label className="form-label fw-semibold">CHỌN NỀN TẢNG:</label>
                <Select
                    value={selectedType}
                    onChange={handleTypeChange}
                    options={typeOptions}
                    placeholder="Chọn nền tảng"
                    instanceId="select-type"
                />
                {selectedType && (
                    <>
                        <label className="form-label fw-semibold">PHÂN LOẠI:</label>
                        <Select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            options={categoryOptions}
                            placeholder="Chọn phân loại"
                        />
                    </>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                {selectedType && selectedCategory && (
                    <>
                        <div className="form-group mb-3">
                            <label htmlFor="object_id" className="form-label">
                                <strong>Link Hoặc UID:</strong>
                            </label>
                            <input
                                className="form-control ipt-link"
                                type="text"
                                value={isConverting ? "Đang xử lý..." : displayLink}
                                onChange={(e) => {
                                    setRawLink(e.target.value);
                                    setConvertedUID("");
                                }}
                                placeholder="Nhập link hoặc ID tùy các máy chủ"
                                disabled={isConverting}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary mt-2"
                                onClick={handleConvertLink}
                                disabled={isConverting}
                            >
                                {isConverting ? "Đang chuyển đổi..." : "Chuyển đổi UID"}
                            </button>
                        </div>
                        <h3>Danh sách dịch vụ</h3>
                        <div className="form-group mb-3">
                            <label className="form-label">
                                <strong>Máy chủ:</strong>
                            </label>
                            {filteredServers.map((server) => (
                                <div
                                    key={server.Magoi}
                                    className="form-check mb-2 d-flex align-items-center gap-2"
                                >
                                    <input
                                        id={`server-${server.Magoi}`}
                                        className="form-check-input"
                                        type="radio"
                                        name="server"
                                        value={server.Magoi}
                                        checked={selectedMagoi === server.Magoi}
                                        onChange={(e) => {
                                            setSelectedMagoi(e.target.value);
                                            setMin(server.min);
                                            setMax(server.max);
                                            setRate(server.rate);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor={`server-${server.Magoi}`}>
                                        <span className="badge badge-success ">{server.maychu}</span>
                                        <span className="font-semibold">{server.name}</span>
                                        <span className="badge badge-primary">
                                            {Number(server.rate).toLocaleString("en-US")}đ
                                        </span>
                                        <span className="badge badge-success">
                                            {server.trangthai ? "Hoạt động" : "Không hoạt động"}
                                        </span>
                                        <span className="custom-control-label">
                                            {" "}
                                            - ID server - {server.Magoi}
                                        </span>
                                    </label>
                                </div>
                            ))}
                            {server.map((server, index) => (
                                <div key={index}>
                                    {selectedMagoi === server.Magoi && (
                                        <div
                                            className="alert text-white alert-info bg-info text-white"
                                            dangerouslySetInnerHTML={{ __html: server.description }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {(() => {
                            const selectedService = filteredServers.find(
                                (service) => service.Magoi === selectedMagoi
                            );
                            if (selectedService && selectedService.iscomment === "on") {
                                return (
                                    <div
                                        className="form-group mb-3 comments"
                                        id="comments_type"
                                        style={{ display: "block" }}
                                    >
                                        <strong>
                                            Số lượng: <span id="quantity_limit">({min} ~ {max})</span>
                                        </strong>
                                        <label htmlFor="comments" className="form-label">
                                            <strong>Nội dung bình luận: </strong>
                                            <strong>số lượng: {cmtqlt}</strong>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="comments"
                                            id="comments"
                                            rows="3"
                                            placeholder="Nhập nội dung bình luận, mỗi dòng là 1 comment"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                        ></textarea>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="form-group mb-3 quantity" id="quantity_type">
                                        <label htmlFor="quantity" className="form-label">
                                            <strong>
                                                Số lượng: <span id="quantity_limit">({min} ~ {max})</span>
                                            </strong>
                                        </label>
                                        <input
                                            list="suggestions"
                                            type="number"
                                            className="form-control"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                        <datalist id="suggestions">
                                            <option value="100"></option>
                                            <option value="1000"></option>
                                            <option value="10000"></option>
                                        </datalist>
                                    </div>
                                );
                            }
                        })()}
                        <div className="form-group mb-3">
                            <label htmlFor="note" className="form-label">
                                <strong>Ghi chú:</strong>
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú đơn hàng"
                            />
                        </div>
                        {(() => {
                            const selectedService = filteredServers.find(
                                (service) => service.Magoi === selectedMagoi
                            );
                            const qty =
                                selectedService && selectedService.iscomment === "on"
                                    ? cmtqlt
                                    : quantity;
                            return (
                                <div className="form-group mb-3">
                                    <div className="alert bg-primary text-center text-white">
                                        <h3 className="alert-heading">
                                            Tổng thanh toán:{" "}
                                            <span className="text-danger">
                                                {Number(totalCost).toLocaleString("en-US")}
                                            </span>{" "}
                                            VNĐ
                                        </h3>
                                        <p className="fs-4 mb-0">
                                            Bạn sẽ tăng{" "}
                                            <span className="text-danger">{qty} </span>số lượng với giá{" "}
                                            <span className="text-danger">{rate}</span> đ
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                            >
                                <i className="fas fa-shopping-cart"></i>
                                {isSubmitting ? "Đang xử lý..." : "Tạo đơn hàng"}
                            </button>
                        </div>
                    </>
                )}
            </form>
            {isSubmitting && (
                <div className="overlay">
                    <div className="spinner-container">
                        <div style={{ minHeight: "200px" }} className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary" role="status" />
                            <span className="ms-2">Đang xử lý</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddOrder;