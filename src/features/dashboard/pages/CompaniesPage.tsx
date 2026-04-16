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
    class: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <FileText className="h-4 w-4" />,
  },
  verified: {
    label: "Đã xác thực",
    class: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  rejected: {
    label: "Từ chối",
    class: "bg-red-100 text-red-700 border-red-200",
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý công ty</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng <span className="font-semibold text-blue-600">{total}</span> công
          ty
        </p>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email, MST..."
              className="pl-9"
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
            <SelectTrigger className="w-52">
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
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-gray-400">
              Đang tải...
            </div>
          ) : companies.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-gray-400">
              <Building2 className="h-10 w-10 opacity-30" />
              <p>Không có công ty nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
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
                    className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 overflow-hidden">
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 truncate max-w-[300px]">
                            {displayName}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              STATUS_CONFIG[company.verification_status]?.class
                            }`}
                          >
                            {STATUS_CONFIG[company.verification_status]?.label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {displayEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {displayPhone}
                          </span>
                          {company.company_industry && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {company.company_industry}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(company)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {company.verification_status === "pending" && (
                        <>
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
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setDeleteTarget(company)}
                      >
                        <Trash2 className="h-4 w-4" />
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
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <span className="text-sm text-gray-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 overflow-hidden">
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
                    <h2 className="text-lg font-bold text-gray-900">
                      {viewCompany.company_name ||
                        viewCompany.user?.full_name ||
                        "Chưa đặt tên"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      ID: #{viewCompany.company_id}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    STATUS_CONFIG[viewCompany.verification_status]?.class
                  }
                >
                  {STATUS_CONFIG[viewCompany.verification_status]?.icon}
                  <span className="ml-1">
                    {STATUS_CONFIG[viewCompany.verification_status]?.label}
                  </span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-400">Mã số thuế</p>
                  <p className="font-medium">
                    {viewCompany.company_tax_code || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Quy mô</p>
                  <p className="font-medium">
                    {viewCompany.company_size ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Ngành nghề</p>
                  <p className="font-medium">
                    {viewCompany.company_industry ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Hồ sơ pháp lý</p>
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
                    <p className="text-gray-400">Chưa tải lên</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">
                    {viewCompany.company_address || "Chưa có địa chỉ"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">
                    {viewCompany.company_phone ?? "Chưa có số điện thoại"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">
                    {viewCompany.company_email ||
                      viewCompany.user?.email ||
                      "Chưa có email"}
                  </span>
                </div>
                {(viewCompany.company_url || viewCompany.company_website) && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400 shrink-0" />
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
                  <p className="text-xs font-semibold uppercase text-gray-400 mb-1">
                    Giới thiệu
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {viewCompany.company_description}
                  </p>
                </div>
              )}

              {viewCompany.user && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs font-semibold uppercase text-blue-700 mb-2">
                    Tài khoản nhà tuyển dụng
                  </p>
                  <p className="text-sm text-blue-900">
                    {viewCompany.user.full_name ||
                      viewCompany.user.name ||
                      "Nhà tuyển dụng"}{" "}
                    ({viewCompany.user.email})
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    ID: #{viewCompany.user.user_id}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
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
          <p className="text-sm text-gray-600">
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
