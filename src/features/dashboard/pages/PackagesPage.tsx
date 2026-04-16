import { useEffect, useState } from "react";
import { Package, Plus, Power, PowerOff, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  fetchPackages,
  createPackage,
  togglePackageStatus,
  type Package as PackageType,
  type CreatePackagePayload,
} from "../services/admin-package.service";

const defaultForm: CreatePackagePayload = {
  package_name: "",
  price: 0,
  duration_days: 30,
  post_limit: 10,
  featured_posts_limit: 0,
  refresh_limit: 0,
  support_priority: "normal",
  features: "",
  is_active: true,
};

function formatPrice(price: string | number): string {
  const val = typeof price === "string" ? parseFloat(price) : price;
  return val.toLocaleString("vi-VN") + " ₫";
}

export function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreatePackagePayload>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [toggling, setToggling] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPackages();
      setPackages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(defaultForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.package_name.trim()) {
      setFormError("Tên gói là bắt buộc.");
      return;
    }
    if (form.price <= 0) {
      setFormError("Giá phải lớn hơn 0.");
      return;
    }
    if (form.duration_days <= 0) {
      setFormError("Thời hạn phải lớn hơn 0.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createPackage(form);
      setShowForm(false);
      load();
    } catch (e: any) {
      setFormError(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (packageId: number) => {
    setToggling(packageId);
    try {
      await togglePackageStatus(packageId);
      load();
    } catch (e: any) {
      alert(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setToggling(null);
    }
  };

  const parseFeatures = (features: any) => {
    if (!features) return [];
    if (typeof features !== "string") {
      if (Array.isArray(features)) return features;
      return [];
    }
    return features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý gói dịch vụ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng <span className="font-semibold text-blue-600">{packages.length}</span> gói
          </p>
        </div>
        <Button
          className="bg-linear-to-r from-blue-600 to-blue-700 text-white"
          onClick={openCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo gói mới
        </Button>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center text-gray-400">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.package_id}
              className={`border-2 transition-all ${
                pkg.is_active
                  ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                  : "border-gray-200 bg-gray-50 opacity-70"
              }`}
            >
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pkg.package_name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-blue-600">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-sm text-gray-500">/ {pkg.duration_days} ngày</span>
                    </div>
                  </div>
                  <Badge
                    className={
                      pkg.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }
                  >
                    {pkg.is_active ? "Hoạt động" : "Tắt"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white p-3 text-center border border-gray-100">
                    <p className="text-2xl font-bold text-blue-600">{pkg.post_limit}</p>
                    <p className="text-xs text-gray-500 mt-1">Bài đăng</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-center border border-gray-100">
                    <p className="text-2xl font-bold text-purple-600">
                      {pkg.featured_posts_limit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Nổi bật</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-center border border-gray-100">
                    <p className="text-2xl font-bold text-green-600">{pkg.refresh_limit}</p>
                    <p className="text-xs text-gray-500 mt-1">Làm mới</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-center border border-gray-100">
                    <p className="text-sm font-bold text-orange-600 capitalize">
                      {pkg.support_priority}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ</p>
                  </div>
                </div>

                {pkg.features && (
                  <div className="rounded-lg bg-white border border-gray-100 p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Tính năng
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {parseFeatures(pkg.features).map((feat, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 shrink-0 text-green-500 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={toggling === pkg.package_id}
                  onClick={() => handleToggle(pkg.package_id)}
                >
                  {pkg.is_active ? (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" />
                      {toggling === pkg.package_id ? "Đang tắt..." : "Tắt gói"}
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 h-4 w-4" />
                      {toggling === pkg.package_id ? "Đang bật..." : "Bật gói"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo gói dịch vụ mới</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Điền thông tin gói đăng ký cho nhà tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {formError && (
              <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div>
              <Label>
                Tên gói <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.package_name}
                onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                placeholder="VD: Gói Kim Cương"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseInt(e.target.value) || 0 })
                  }
                  placeholder="VD: 2000000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>
                  Thời hạn (ngày) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.duration_days}
                  onChange={(e) =>
                    setForm({ ...form, duration_days: parseInt(e.target.value) || 30 })
                  }
                  placeholder="VD: 30"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Số bài đăng</Label>
                <Input
                  type="number"
                  value={form.post_limit}
                  onChange={(e) =>
                    setForm({ ...form, post_limit: parseInt(e.target.value) || 0 })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Bài nổi bật</Label>
                <Input
                  type="number"
                  value={form.featured_posts_limit ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured_posts_limit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Làm mới</Label>
                <Input
                  type="number"
                  value={form.refresh_limit ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, refresh_limit: parseInt(e.target.value) || 0 })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Mức hỗ trợ</Label>
              <Select
                value={form.support_priority ?? "normal"}
                onValueChange={(v) => setForm({ ...form, support_priority: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="premium">Cao cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tính năng (phân cách bằng dấu phẩy)</Label>
              <Textarea
                value={form.features ?? ""}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="VD: 50 bài đăng, 10 bài nổi bật, Hỗ trợ 24/7"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Kích hoạt ngay khi tạo
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitting ? "Đang tạo..." : "Tạo gói"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
