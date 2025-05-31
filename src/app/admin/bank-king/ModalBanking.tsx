interface ModalBankingProps {
  editing: boolean;
  formData: {
    bank_name: string;
    account_name: string;
    account_number: string;
    logo: string;
    bank_account: string;
    bank_password: string;
    min_recharge: number;
    status: boolean;
    token: string;
  };
  token?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ModalBanking({
  editing,
  formData,
  handleChange,
  handleSubmit,
}: ModalBankingProps) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">{editing ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng"}</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Ngân Hàng</label>
              <input
                type="text"
                name="bank_name"
                className="form-control"
                onChange={handleChange}
                value={formData.bank_name || ""}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tên chủ tài khoản</label>
              <input
                type="text"
                name="account_name"
                className="form-control"
                onChange={handleChange}
                value={formData.account_name || ""}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Số tài khoản</label>
              <input
                type="text"
                name="account_number"
                className="form-control"
                onChange={handleChange}
                value={formData.account_number || ""}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Logo</label>
              <input
                type="text"
                name="logo"
                className="form-control"
                onChange={handleChange}
                value={formData.logo || ""}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tài khoản ngân hàng</label>
              <input
                type="text"
                name="bank_account"
                className="form-control"
                onChange={handleChange}
                value={formData.bank_account || ""}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mật khẩu ngân hàng</label>
              <input
                type="password"
                name="bank_password"
                className="form-control"
                onChange={handleChange}
                value={formData.bank_password || ""}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Số tiền nạp tối thiểu</label>
              <input
                type="number"
                name="min_recharge"
                className="form-control"
                onChange={handleChange}
                value={formData.min_recharge || ""}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Trạng thái</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  name="status"
                  className="form-check-input"
                  checked={formData.status || false}
                  onChange={(e) =>
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: e.target.checked.toString(),
                      },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <label className="form-check-label">Hoạt động</label>
              </div>
            </div>
            <div className="col-md-12">
              <label className="form-label">Token</label>
              <input
                type="text"
                name="token"
                className="form-control"
                onChange={handleChange}
                value={formData.token || ""}
              />
            </div>
          </div>
          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-primary">
              {editing ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
