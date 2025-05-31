'use client';
import { useState, useEffect } from "react";
import Adddichvu from "./Adddichvu";
import Table from "react-bootstrap/Table";
import { deleteServer } from "@/utils/api"; // Giả sử bạn có hàm này để xóa server
import Swal from "sweetalert2";
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

interface DichvupageProps {
    categories: any[]; // Danh sách danh mục, có thể là mảng các chuỗi
    token: string;
    servers: Server[];
}

export default function Dichvupage({ servers, categories, token }: DichvupageProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(servers.length / limit));
    const [editMode, setEditMode] = useState(false); // Trạng thái chỉnh sửa
    const [selectedServer, setSelectedServer] = useState<Server | null>(null); // Server được chọn để chỉnh sửa
    const [serverList, setServerList] = useState(servers); // Danh sách server hiển thị

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const filteredServers = servers.filter(
        (server) =>
            (server.Magoi?.toLowerCase() || "").includes(debouncedSearch.toLowerCase()) ||
            (server.serviceId?.toLowerCase() || "").includes(debouncedSearch.toLowerCase())
    );

    const paginatedServers = filteredServers.slice((currentPage - 1) * limit, currentPage * limit);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
        setTotalPages(Math.ceil(filteredServers.length / Number(e.target.value)));
    };

    const handleEdit = (server: Server) => {
        setEditMode(true); // Bật chế độ chỉnh sửa
        setSelectedServer(server); // Gán server được chọn
    };

    const handleCancelEdit = () => {
        setEditMode(false); // Tắt chế độ chỉnh sửa
        setSelectedServer(null); // Xóa server được chọn
    };

    const handleDelete = async (serverId: string) => {
        const result = await Swal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteServer(serverId, token); // Gọi API xóa server

                Swal.fire("Đã xóa!", "Server đã được xóa thành công.", "success");
                // Cập nhật danh sách server sau khi xóa
                setSelectedServer(null); // Xóa server được chọn

            } catch (error) {
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa server.", "error");
            }
        }
    };
    return (
        <div className="main-content">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <h2 className="smmdv-title">Danh Sách Server</h2>
                        <Adddichvu
                            categories={categories} // Giả sử bạn có danh sách danh mục để truyền vào
                            token={token}
                            editMode={editMode}
                            initialData={selectedServer || {}}
                            onClose={handleCancelEdit} // Đóng chế độ chỉnh sửa
                            onSuccess={() => {
                                setEditMode(false); // Tắt chế độ chỉnh sửa sau khi thành công
                                setSelectedServer(null); // Xóa server được chọn
                            }}
                        />
                        {/* Search Input */}
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo Mã gói hoặc Service ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Dropdown for selecting items per page */}
                        <div className="limit-selector">
                            <label>Hiển thị:</label>
                            <select value={limit} onChange={handleLimitChange}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>mục</span>
                        </div>
                        <div className="rsp-table">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Hành động</th>

                                        <th>Mã gói</th>
                                        <th>Service ID</th>
                                        <th>Loại</th>
                                        <th>Danh mục</th>
                                        <th>Tên dịch vụ</th>
                                        <th>Giá (đã tính)</th>
                                        <th>Giá gốc</th>
                                        <th>Link dịch vụ</th>
                                        <th>Tên dịch vụ bên SMM</th>
                                        <th>Domain SMM</th>
                                        <th>Trạng thái</th>
                                        <th>Thời gian thêm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedServers.length > 0 ? (
                                        paginatedServers.map((serverItem, index) => (
                                            <tr key={serverItem.id || serverItem.serviceId}>
                                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleEdit(serverItem)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(serverItem._id || "")}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                                <td>{serverItem.Magoi}</td>
                                                <td>{serverItem.serviceId}</td>
                                                <td>{serverItem.category}</td>
                                                <td>{serverItem.type}</td>
                                                <td style={{
                                                    maxWidth: "250px",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
                                                }}>
                                                    {serverItem.maychu} {serverItem.name}
                                                </td>
                                                <td>{serverItem.rate}</td>
                                                <td>{serverItem.originalRate}</td>
                                                <td>{serverItem.Linkdv}</td>
                                                <td style={{
                                                    maxWidth: "250px",
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
                                                }}>{serverItem.serviceName}</td>
                                                <td>{serverItem.DomainSmm}</td>
                                                <td>{serverItem.isActive ? "Hiển thị" : "Ẩn"}</td>
                                                <td>{new Date(serverItem.createdAt).toLocaleString()}</td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={14} style={{ textAlign: "center" }}>
                                                Không có server nào được tìm thấy.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination d-flex justify-content-between align-items-center mt-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}