'use client';

import { useState } from "react";
import { addPlatform, updatePlatform, deletePlatform } from "@/utils/api";
import Swal from "sweetalert2";
import PlatformModal from "./PlatformModal"; // Modal để thêm/sửa nền tảng
import Image from "next/image";

// Định nghĩa dữ liệu của một nền tảng
interface Platform {
  _id: string; // ID của nền tảng
  name: string; // Tên nền tảng
  logo: string; // URL logo của nền tảng
}

// Định nghĩa props của PlatformsPage
interface PlatformsPageProps {
  platforms: Platform[]; // Mảng các nền tảng
  token: string; // Token xác thực
}

export default function PlatformsPage({ platforms: initialPlatforms, token }: PlatformsPageProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms); // Đảm bảo platforms luôn là một mảng
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null); // Nền tảng được chọn để chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

  const handleAddPlatform = async (platformData: Platform) => {
    try {
      await addPlatform(platformData, token);
      Swal.fire("Thành công", "Nền tảng đã được thêm!", "success");
      setIsModalOpen(false);
      const updatedPlatforms = [...platforms, platformData];
      setPlatforms(updatedPlatforms);
    } catch (error) {
      console.error("Lỗi khi thêm nền tảng:", error);
      Swal.fire("Lỗi", "Không thể thêm nền tảng!", "error");
    }
  };

  const handleUpdatePlatform = async (platformId: string, platformData: Platform) => {
    try {
      await updatePlatform(platformId, platformData, token);
      Swal.fire("Thành công", "Nền tảng đã được cập nhật!", "success");
      setIsModalOpen(false);
      const updatedPlatforms = platforms.map((platform) =>
        platform._id === platformId ? { ...platform, ...platformData } : platform
      );
      setPlatforms(updatedPlatforms);
    } catch (error) {
      console.error("Lỗi khi cập nhật nền tảng:", error);
      Swal.fire("Lỗi", "Không thể cập nhật nền tảng!", "error");
    }
  };

  const handleDeletePlatform = async (platformId: string) => {
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
        await deletePlatform(platformId, token);
        Swal.fire("Đã xóa!", "Nền tảng đã được xóa.", "success");
        const updatedPlatforms = platforms.filter((platform) => platform._id !== platformId);
        setPlatforms(updatedPlatforms);
      } catch (error) {
        console.error("Lỗi khi xóa nền tảng:", error);
        Swal.fire("Lỗi", "Không thể xóa nền tảng!", "error");
      }
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Quản lý Nền tảng</h1>
      <button className="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>
        Thêm Nền tảng
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Hành động</th>

            <th>Tên</th>
            <th>Logo</th>
          </tr>
        </thead>
        <tbody>
          {platforms.length > 0 ? (
            platforms.map((platform) => (
              <tr key={platform._id}>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => {
                      setSelectedPlatform(platform);
                      setIsModalOpen(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeletePlatform(platform._id)}
                  >
                    Xóa
                  </button>
                </td>
                <td>{platform.name}</td>
                <td>
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                Không có nền tảng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <PlatformModal
          platform={selectedPlatform}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlatform(null);
          }}
          onSave={(platformData) => {
            if (selectedPlatform) {
              handleUpdatePlatform(selectedPlatform._id, platformData);
            } else {
              handleAddPlatform(platformData);
            }
          }}
        />
      )}
    </div>
  );
}