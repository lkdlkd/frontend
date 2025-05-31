"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { register } from "@/utils/api"; // Giả sử bạn đã tạo hàm register trong api service

export default function DangKyPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Kiểm tra độ dài của username
    if (username.length > 100) {
      setError("Tên tài khoản không được vượt quá 100 ký tự.");
      setLoading(false);
      return;
    }

    try {
      const res = await register({ username, password });
      if (res.message) {
        router.push("/dang-nhap"); // Chuyển hướng đến trang đăng nhập
      } else {
        setError(res.error || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra. Vui lòng thử lại.";
        setError(errorMessage);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="login-wrap d-flex flex-wrap justify-content-center align-items-md-center align-items-start min-vh-100 overflow-auto">
        <div className="container">
          <div className="row g-0">
            {/* Bên hình */}
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="col-12 py-3">
                  <Image
                    className="img-fluid rounded mb-4"
                    style={{ maxWidth: "90%" }}
                    loading="lazy"
                    src="/login-page-img.png"
                    alt="banner"
                    width={1500}
                    height={1300}
                  />
                </div>
              </div>
            </div>
            {/* Bên form */}
            <div className="col-12 col-md-6">
              <div className="card p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h2 className="text-center text-primary">Đăng ký</h2>
                    </div>
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="alert"
                          aria-label="Close"
                          onClick={() => setError("")}
                        ></button>
                      </div>
                    )}
                  </div>
                </div>
                <form onSubmit={handleRegister}>
                  <div className="row gy-3 gy-md-4">
                    <div className="col-12">
                      <label htmlFor="username" className="form-label">
                        Tên tài khoản <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tài khoản"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Mật khẩu <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button
                          className="btn bsb-btn-xl btn-primary"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                      </div>
                    </div>
                    <div className="font-16 weight-600 pt-10 pb-10 text-center">
                      HOẶC
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <Link
                          className="btn btn-outline-primary btn-block"
                          href="/dang-nhap"
                        >
                          Đã có tài khoản
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}