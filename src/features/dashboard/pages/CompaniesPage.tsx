import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  fetchCompanyList,
  fetchCompanyDetail,
  verifyCompany,
  deleteCompany,
  type Company,
} from "../services/admin-company.service";

const STATUS_CONFIG: Record<
  string,
  { label: string; class: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Chờ xác thực",
    class: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <FileText className="h-4 w-4" />,
  },
  verified: {
    label: "Đã xác thực",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  rejected: {
    label: "Từ chối",
    class: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <XCircle className="h-4 w-4" />,
  },
};

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [viewCompany, setViewCompany] = useState<Company | null>(null);
  const [verifying, setVerifying] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      console.log("[CompaniesPage] Loading data with status:", statusFilter, "page:", page);
      const perPage = 15;

      if (statusFilter === "all") {
        // Backend default to `pending` when `verification_status` is missing,
        // so for "all" we must explicitly call each status and merge client-side.
        const statuses = ["pending", "verified", "rejected"] as const;

        // We fetch enough items so that client-side slice for current page works.
        // This is not perfectly "global order" across statuses, but returns the correct set size.
        const endIndex = page * perPage;
        const perStatus = Math.min(endIndex, 100); // backend validation: per_page max 100

        const results = await Promise.all(
          statuses.map((s) =>
            fetchCompanyList({
              verification_status: s,
              search: debouncedSearch || undefined,
              per_page: perStatus,
              page: 1,
            }),
          ),
        );

        const [pendingRes, verifiedRes, rejectedRes] = results;
        const totalCombined =
          (pendingRes?.total ?? 0) +
          (verifiedRes?.total ?? 0) +
          (rejectedRes?.total ?? 0);

        const merged = [
          ...(pendingRes?.data ?? []),
          ...(verifiedRes?.data ?? []),
          ...(rejectedRes?.data ?? []),
        ];

        const start = (page - 1) * perPage;
        const end = start + perPage;

        setCompanies(merged.slice(start, end));
        setTotal(totalCombined);
        setTotalPages(Math.ceil(totalCombined / perPage));
        console.log("[CompaniesPage] Merged all-status data:", {
          totalCombined,
          page,
          perStatus,
          received: merged.length,
        });
      } else {
        const res = await fetchCompanyList({
          verification_status: statusFilter !== "all" ? statusFilter : undefined,
          search: debouncedSearch || undefined,
          per_page: perPage,
          page,
        });
        console.log("[CompaniesPage] Data received:", res);
        if (res && res.data) {
          setCompanies(res.data);
          setTotal(res.total);
          setTotalPages(res.total_pages);
        } else {
          console.warn("[CompaniesPage] Response missing data array:", res);
          setCompanies([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleVerify = async (
    companyId: number,
    status: "verified" | "rejected",
  ) => {
    setVerifying(true);
    try {
      await verifyCompany(companyId, status);
      setViewCompany(null);
      load();
    } catch (e: any) {
      alert(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCompany(deleteTarget.company_id);
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      alert(e?.message ?? "Có lỗi xảy ra.");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = async (company: Company) => {
    try {
      const detail = await fetchCompanyDetail(company.company_id);
      setViewCompany(detail);
    } catch (e: any) {
      alert(e?.message ?? "Không thể tải chi tiết công ty.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Quản lý công ty
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tổng <span className="font-semibold text-blue-600">{total}</span> công
          ty
        </p>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-3 p-4 md:p-5">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm theo tên, email, MST..."
              className="h-10 border-slate-200 pl-9 focus-visible:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-56 border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xác thực</SelectItem>
              <SelectItem value="verified">Đã xác thực</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-slate-400">
              Đang tải...
            </div>
          ) : companies.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-slate-400">
              <Building2 className="h-10 w-10 opacity-30" />
              <p>Không có công ty nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => {
                const displayName =
                  company.company_name ||
                  company.user?.full_name ||
                  company.user?.name ||
                  "Chưa đặt tên";
                const displayEmail =
                  company.company_email || company.user?.email || "—";
                const displayPhone = company.company_phone || "—";

                return (
                  <div
                    key={company.company_id}
                    className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-4 flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
                        {company.company_logo ? (
                          <img
                            src={company.company_logo}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900 md:text-base">
                            {displayName}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              STATUS_CONFIG[company.verification_status]?.class
                            }`}
                          >
                            {STATUS_CONFIG[company.verification_status]?.label}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3" />
                            {displayEmail}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {displayPhone}
                          </div>
                          {company.company_industry && (
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3 w-3" />
                              {company.company_industry}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-200 hover:bg-slate-100"
                        onClick={() => handleViewDetail(company)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Button>

                      {company.verification_status === "pending" && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() =>
                              handleVerify(company.company_id, "verified")
                            }
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleVerify(company.company_id, "rejected")
                            }
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Từ chối
                          </Button>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-200 text-red-600 hover:border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteTarget(company)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa công ty
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3 md:px-5">
            <span className="text-sm text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 bg-white"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="hidden items-center gap-1 md:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <div key={p} className="flex items-center gap-1">
                      {idx > 0 && arr[idx - 1] !== p - 1 ? (
                        <span className="px-1 text-slate-400">...</span>
                      ) : null}
                      <Button
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        className={
                          p === page
                            ? "h-8 min-w-8 bg-blue-600 text-white hover:bg-blue-700"
                            : "h-8 min-w-8 border-slate-200 bg-white"
                        }
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 bg-white"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View Detail Dialog */}
      <Dialog
        open={!!viewCompany}
        onOpenChange={(o) => !o && setViewCompany(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết công ty</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Thông tin công ty và tài khoản nhà tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          {viewCompany && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
                    {viewCompany.company_logo ? (
                      <img
                        src={viewCompany.company_logo}
                        alt="Logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {viewCompany.company_name ||
                        viewCompany.user?.full_name ||
                        "Chưa đặt tên"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      ID: #{viewCompany.company_id}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_CONFIG[viewCompany.verification_status]?.class
                  }`}
                >
                  {STATUS_CONFIG[viewCompany.verification_status]?.icon}
                  <span className="ml-1">
                    {STATUS_CONFIG[viewCompany.verification_status]?.label}
                  </span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-400">Mã số thuế</p>
                  <p className="font-medium">
                    {viewCompany.company_tax_code || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Quy mô</p>
                  <p className="font-medium">
                    {viewCompany.company_size ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ngành nghề</p>
                  <p className="font-medium">
                    {viewCompany.company_industry ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Hồ sơ pháp lý</p>
                  {viewCompany.verification_documents ? (
                    <a
                      href={viewCompany.verification_documents}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
                    >
                      <FileText className="h-3 w-3" />
                      Xem tài liệu
                    </a>
                  ) : (
                    <p className="text-slate-400">Chưa tải lên</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="text-slate-700">
                    {viewCompany.company_address || "Chưa có địa chỉ"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="text-slate-700">
                    {viewCompany.company_phone ?? "Chưa có số điện thoại"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="text-slate-700">
                    {viewCompany.company_email ||
                      viewCompany.user?.email ||
                      "Chưa có email"}
                  </span>
                </div>
                {(viewCompany.company_url || viewCompany.company_website) && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                    <a
                      href={
                        viewCompany.company_url || viewCompany.company_website!
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {viewCompany.company_url || viewCompany.company_website}
                    </a>
                  </div>
                )}
              </div>

              {viewCompany.company_description && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-slate-400">
                    Giới thiệu
                  </p>
                  <p className="leading-relaxed text-slate-700">
                    {viewCompany.company_description}
                  </p>
                </div>
              )}

              {viewCompany.user && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-blue-700">
                    Tài khoản nhà tuyển dụng
                  </p>
                  <p className="text-sm text-blue-900">
                    {viewCompany.user.full_name ||
                      viewCompany.user.name ||
                      "Nhà tuyển dụng"}{" "}
                    ({viewCompany.user.email})
                  </p>
                  <p className="mt-0.5 text-xs text-blue-600">
                    ID: #{viewCompany.user.user_id}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Tạo:{" "}
                  {new Date(viewCompany.created_at).toLocaleString("vi-VN")}
                </span>
                <span>
                  Cập nhật:{" "}
                  {new Date(viewCompany.updated_at).toLocaleString("vi-VN")}
                </span>
              </div>

              {viewCompany.verification_status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    disabled={verifying}
                    onClick={() =>
                      handleVerify(viewCompany.company_id, "verified")
                    }
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {verifying ? "Đang xử lý..." : "Duyệt công ty"}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    disabled={verifying}
                    onClick={() =>
                      handleVerify(viewCompany.company_id, "rejected")
                    }
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {verifying ? "Đang xử lý..." : "Từ chối"}
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCompany(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa công ty</DialogTitle>
            <DialogDescription aria-describedby={undefined}>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Bạn có chắc muốn xóa công ty{" "}
            <span className="font-semibold">
              "{deleteTarget?.company_name}"
            </span>
            ? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
