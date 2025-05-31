'use client';

import { useState } from "react";
import { addCategory, updateCategory, deleteCategory } from "@/utils/api";
import Swal from "sweetalert2";
import CategoryModal from "@/app/admin/dich-vu/CategoryModal"; // Modal để thêm/sửa danh mục

interface Platform {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    platforms_id: {
        _id: string;
        name: string;
    };
    name: string;
    path: string;
    notes: string | null;
    modal_show: string | null;
}

interface CategoriesPageProps {
    categories: Category[];
    platforms: Platform[];
    token: string;
}

export default function CategoriesPage({ categories: initialCategories = [], platforms, token }: CategoriesPageProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddCategory = async (categoryData: Category) => {
        try {
            await addCategory(categoryData, token);
            Swal.fire("Thành công", "Danh mục đã được thêm!", "success");
            setIsModalOpen(false);
            const updatedCategories = [...categories, categoryData];
            setCategories(updatedCategories);
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
            Swal.fire("Lỗi", "Không thể thêm danh mục!", "error");
        }
    };

    const handleUpdateCategory = async (categoryId: string, categoryData: Category) => {
        try {
            await updateCategory(categoryId, categoryData, token);
            Swal.fire("Thành công", "Danh mục đã được cập nhật!", "success");
            setIsModalOpen(false);
            const updatedCategories = categories.map((category) =>
                category._id === categoryId ? { ...category, ...categoryData } : category
            );
            setCategories(updatedCategories);
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error);
            Swal.fire("Lỗi", "Không thể cập nhật danh mục!", "error");
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
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
                await deleteCategory(categoryId, token);
                Swal.fire("Đã xóa!", "Danh mục đã được xóa.", "success");
                const updatedCategories = categories.filter((category) => category._id !== categoryId);
                setCategories(updatedCategories);
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
                Swal.fire("Lỗi", "Không thể xóa danh mục!", "error");
            }
        }
    };

    return (
        <div className="container">
            <h1 className="my-4">Quản lý Danh mục</h1>
            <button className="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>
                Thêm Danh mục
            </button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Hành động</th>
                        <th>Nền tảng</th>
                        <th>Tên</th>
                        <th>Đường dẫn</th>
                        <th>Ghi chú</th>
                        <th>Hiển thị Modal</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <tr key={category._id}>
                                <td>
                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteCategory(category._id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                                <td>{category.platforms_id?.name}</td>
                                <td>{category.name}</td>
                                <td>{category.path}</td>
                                <td>{category.notes || "Không có"}</td>
                                <td>{category.modal_show || "Không có"}</td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">
                                Không có danh mục nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && (
                <CategoryModal
                    category={selectedCategory}
                    platforms={platforms} // Truyền danh sách nền tảng vào modal
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedCategory(null);
                    }}
                    onSave={(categoryData) => {
                        if (selectedCategory) {
                            handleUpdateCategory(selectedCategory._id, categoryData);
                        } else {
                            handleAddCategory(categoryData);
                        }
                    }}
                />
            )}
        </div>
    );
}