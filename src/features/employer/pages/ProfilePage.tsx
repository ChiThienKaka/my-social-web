import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchRecruiterCompanyInfo,
  updateRecruiterCompany,
  type RecruiterCompany,
  type UpdateCompanyPayload,
} from "../services/company.service";

const VERIFICATION_STATUS: Record<string, { label: string; class: string }> = {
  verified: {
    label: "Đã xác thực",
    class: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  pending: {
    label: "Chờ xác thực",
    class: "border-yellow-500 bg-yellow-50 text-yellow-700",
  },
  rejected: {
    label: "Bị từ chối",
    class: "border-red-500 bg-red-50 text-red-700",
  },
};

const COMPANY_SIZES = [
  "1-10",
  "10-50",
  "50-100",
  "100-200",
  "200-500",
  "500-1000",
  "1000+",
];

export function ProfilePage() {
  const [company, setCompany] = useState<RecruiterCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UpdateCompanyPayload>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecruiterCompanyInfo();
        if (mounted) setCompany(data);
      } catch (err: any) {
        if (mounted)
          setError(err?.message ?? "Không thể tải thông tin công ty.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const startEdit = () => {
    if (!company) return;
    setForm({
      company_name: company.company_name,
      company_address: company.company_address,
      company_phone: company.company_phone,
      company_email: company.company_email,
      company_size: company.company_size ?? "",
      company_industry: company.company_industry ?? "",
      company_url: company.company_url ?? "",
    });
    setSaveError(null);
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!form.company_name?.trim()) {
      setSaveError("Tên công ty là bắt buộc.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateRecruiterCompany(form);
      setCompany(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setSaveError(e?.message ?? "Có lỗi khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Đang tải thông tin công ty...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Chưa có thông tin công ty. Vui lòng cập nhật hồ sơ.
      </div>
    );
  }

  const verStatus = company.verification_status ?? "pending";
  const verCfg = VERIFICATION_STATUS[verStatus] ?? VERIFICATION_STATUS.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ nhà tuyển dụng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem và quản lý thông tin công ty mà ứng viên sẽ nhìn thấy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            <Building2 className="mr-1 h-3 w-3" />
            Company Profile
          </Badge>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={startEdit}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
          Cập nhật thông tin công ty thành công!
        </div>
      )}

      {isEditing ? (
        /* Edit Form */
        <Card className="border-2 border-blue-100">
          <CardHeader className="border-b border-blue-100 bg-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Chỉnh sửa thông tin công ty</h2>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Lưu ý: Mã số thuế và trạng thái xác thực không thể thay đổi.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {saveError && (
              <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {saveError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Tên công ty *</Label>
                <Input
                  value={form.company_name ?? ""}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  placeholder="Tên công ty"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label>Địa chỉ</Label>
                <Input
                  value={form.company_address ?? ""}
                  onChange={(e) => setForm({ ...form, company_address: e.target.value })}
                  placeholder="Địa chỉ công ty"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input
                  value={form.company_phone ?? ""}
                  onChange={(e) => setForm({ ...form, company_phone: e.target.value })}
                  placeholder="VD: 0274123456"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email công ty</Label>
                <Input
                  type="email"
                  value={form.company_email ?? ""}
                  onChange={(e) => setForm({ ...form, company_email: e.target.value })}
                  placeholder="VD: contact@company.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Quy mô nhân sự</Label>
                <Select
                  value={form.company_size ?? ""}
                  onValueChange={(v) => setForm({ ...form, company_size: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn quy mô" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} nhân viên
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ngành nghề</Label>
                <Input
                  value={form.company_industry ?? ""}
                  onChange={(e) => setForm({ ...form, company_industry: e.target.value })}
                  placeholder="VD: Công nghệ thông tin"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label>Website công ty</Label>
                <Input
                  type="url"
                  value={form.company_url ?? ""}
                  onChange={(e) => setForm({ ...form, company_url: e.target.value })}
                  placeholder="https://congty.com"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={cancelEdit}>
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Summary */}
          <Card className="col-span-1 border-2 border-blue-100">
            <CardHeader className="space-y-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-blue-50">
                  {company.company_url ? (
                    <img
                      src={company.company_url}
                      alt={company.company_name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{company.company_name}</h2>
                  <p className="text-sm text-gray-600">
                    {company.company_industry || "Chưa cập nhật ngành"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.company_size && (
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    {company.company_size} nhân viên
                  </Badge>
                )}
                <Badge variant="outline" className={verCfg.class}>
                  {verCfg.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-6 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
                <span>{company.company_address || "Chưa có địa chỉ"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{company.company_phone || "Chưa có số điện thoại"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="truncate">{company.company_email || "Chưa có email"}</span>
              </div>
              {company.company_url && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                  <a
                    href={company.company_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {company.company_url}
                  </a>
                </div>
              )}
              <Button variant="outline" className="mt-2 w-full" onClick={startEdit}>
                <Edit2 className="mr-2 h-4 w-4" />
                Chỉnh sửa hồ sơ
              </Button>
            </CardContent>
          </Card>

          {/* Right: Details */}
          <div className="col-span-2 space-y-6">
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-white">
                <h3 className="text-lg font-bold text-gray-900">Thông tin chi tiết</h3>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-8 gap-y-5 p-6 text-sm text-gray-700">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Mã số thuế</p>
                  <p className="mt-1 font-medium">{company.company_tax_code}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Quy mô</p>
                  <p className="mt-1 font-medium">{company.company_size || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Ngành nghề</p>
                  <p className="mt-1 font-medium">{company.company_industry || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trạng thái xác thực</p>
                  <Badge variant="outline" className={`mt-1 ${verCfg.class}`}>
                    {verCfg.label}
                  </Badge>
                </div>
                {company.created_at && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Ngày tạo</p>
                    <p className="mt-1 font-medium">
                      {new Date(company.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
                {company.updated_at && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Cập nhật lần cuối</p>
                    <p className="mt-1 font-medium">
                      {new Date(company.updated_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-100 bg-white">
                <h3 className="text-lg font-bold text-gray-900">Giới thiệu về công ty</h3>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-sm text-gray-700">
                {company.company_description ? (
                  <p className="leading-relaxed">{company.company_description}</p>
                ) : (
                  <p className="text-gray-400">
                    Chưa có mô tả công ty. Hãy thêm đoạn mô tả ngắn gọn về lĩnh vực
                    hoạt động, văn hoá và giá trị cốt lõi để thu hút ứng viên.
                  </p>
                )}
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>
                    Thông tin công ty chỉ được dùng cho mục đích tuyển dụng và
                    tuân thủ chính sách bảo mật dữ liệu của TalentHub.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
