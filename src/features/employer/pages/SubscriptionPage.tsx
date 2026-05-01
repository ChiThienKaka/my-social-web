import { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  ArrowUpCircle,
  RefreshCw,
  Package,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createVnpayPaymentUrl,
  fetchActiveSubscription,
  fetchRecruiterPackages,
  fetchSubscriptionHistory,
  subscribeRecruiterPackage,
  type RecruiterPackage,
  type Subscription,
} from "../services/subscription.service";
import { message } from "antd";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  active: { label: "Đang hoạt động", class: "bg-green-100 text-green-700 border-green-200" },
  expired: { label: "Đã hết hạn", class: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Đã hủy", class: "bg-gray-100 text-gray-700 border-gray-200" },
  pending: { label: "Chờ thanh toán", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function formatPrice(price: string | number): string {
  const normalized = typeof price === "number" ? price : parseInt(price, 10);
  return normalized.toLocaleString("vi-VN") + " ₫";
}

export function SubscriptionPage() {
  const [activeSub, setActiveSub] = useState<Subscription | null | undefined>(undefined);
  const [history, setHistory] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<RecruiterPackage[]>([]);
  const [subscribingPackageId, setSubscribingPackageId] = useState<number | null>(null);
  const [payingSubscriptionId, setPayingSubscriptionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [active, hist, packageList] = await Promise.all([
          fetchActiveSubscription(),
          fetchSubscriptionHistory(),
          fetchRecruiterPackages(),
        ]);
        if (mounted) {
          setActiveSub(active);
          setHistory(hist.data);
          setPackages(packageList);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        Đang tải thông tin gói đăng ký...
      </div>
    );
  }

  const daysRemaining = activeSub ? getDaysRemaining(activeSub.end_date) : 0;
  const isExpiringSoon = daysRemaining <= 14 && daysRemaining > 0;

  const parseFeatures = (features: any) => {
    if (typeof features !== "string") {
      if (Array.isArray(features)) return features;
      return [];
    }
    return features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  };

  const handleSubscribePackage = async (packageId: number) => {
    try {
      setSubscribingPackageId(packageId);
      await subscribeRecruiterPackage({ package_id: packageId });
      const [active, hist] = await Promise.all([
        fetchActiveSubscription(),
        fetchSubscriptionHistory(),
      ]);
      setActiveSub(active);
      setHistory(hist.data);
      message.success("Mua gói thành công.");
    } catch (error) {
      console.error("Subscribe package failed:", error);
      message.error("Mua gói thất bại. Vui lòng kiểm tra lại thông tin!.");
    } finally {
      setSubscribingPackageId(null);
    }
  };

  const handlePayPendingSubscription = async (subscriptionId: number) => {
    try {
      setPayingSubscriptionId(subscriptionId);
      const paymentUrl = await createVnpayPaymentUrl({
        route_home: `${window.location.origin}/employer/subscription`,
        subscription_id: subscriptionId,
      });
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Create VNPay payment failed:", error);
      message.error("Tạo link thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setPayingSubscriptionId(null);
    }
  };

  return (
    <div className="space-y-8">
     {/* Packages List */}
      <Card className="border border-gray-200 shadow-sm">
  <CardHeader className="border-b border-gray-200 bg-white">
    <div>
      <h3 className="text-xl font-bold text-gray-900">Danh sách gói</h3>
      <p className="mt-1 text-sm text-gray-500">
        Các gói hiện có để bạn đăng ký hoặc nâng cấp
      </p>
    </div>
  </CardHeader>

  <CardContent className="p-6">
    {packages.length === 0 ? (
      <div className="flex h-24 items-center justify-center text-sm text-gray-400">
        Chưa có gói nào khả dụng
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.package_id}
            className="flex h-full flex-col border border-gray-200"
          >
            <CardContent className="flex h-full flex-col p-5">
              
              {/* CONTENT */}
              <div className="flex-1">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-gray-900">
                    {pkg.package_name}
                  </h4>
                  <Badge variant="outline" className="capitalize">
                    {pkg.support_priority}
                  </Badge>
                </div>

                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(pkg.price)}
                </p>
                <p className="mb-4 text-sm text-gray-500">
                  /{pkg.duration_days} ngày
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>- {pkg.post_limit} bài đăng</p>
                  <p>- {pkg.featured_posts_limit} bài nổi bật</p>
                  <p>- {pkg.refresh_limit} lượt làm mới</p>
                  <p>- Analytics: {pkg.features.analytics}</p>
                  {pkg.features.logo_highlight && <p>- Highlight logo</p>}
                  {pkg.features.top_search && <p>- Ưu tiên top search</p>}
                </div>
              </div>

              {/* BUTTON */}
              <Button
                className="mt-auto w-full cursor-pointer bg-blue-600 hover:bg-blue-700"
                onClick={() => handleSubscribePackage(pkg.package_id)}
                disabled={subscribingPackageId === pkg.package_id}
              >
                {subscribingPackageId === pkg.package_id ? "Đang xử lý..." : "🚀 Chọn gói này"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </CardContent>
      </Card>

      {/* Current Active Plan */}
      {activeSub ? (
        <Card className="border-2 border-blue-200 shadow-md">
          <CardHeader className="border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Gói đang sử dụng</h2>
                  <Badge
                    variant="outline"
                    className={STATUS_CONFIG[activeSub.status]?.class}
                  >
                    {STATUS_CONFIG[activeSub.status]?.label}
                  </Badge>
                </div>
                <p className="mt-1 text-gray-600">Chi tiết gói đăng ký và quyền lợi</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {isExpiringSoon && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
                Gói đăng ký của bạn sắp hết hạn trong <strong>{daysRemaining} ngày</strong>. Hãy gia hạn sớm để không bị gián đoạn.
              </div>
            )}

            <div className="grid grid-cols-3 gap-8">
              {/* Plan Details */}
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tên gói</p>
                  <h3 className="mt-1 text-2xl font-bold text-gray-900">
                    {activeSub.package.package_name}
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Giá</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(activeSub.package.price)}
                    </span>
                    <span className="text-gray-500">/ {activeSub.package.duration_days} ngày</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                  <Calendar className="h-8 w-8 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ngày hết hạn</p>
                    <p className="text-lg font-bold text-gray-900">{activeSub.end_date}</p>
                    <p className={`text-xs ${daysRemaining <= 7 ? "text-red-600 font-semibold" : "text-blue-600"}`}>
                      {daysRemaining > 0
                        ? `Còn ${daysRemaining} ngày`
                        : "Đã hết hạn"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Quyền lợi gói</h4>
                <ul className="space-y-3">
                  {parseFeatures(activeSub.package.features).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span className="text-sm text-gray-700">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {activeSub.package.post_limit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Bài đăng</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {activeSub.package.featured_posts_limit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Bài nổi bật</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {activeSub.package.refresh_limit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Làm mới</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-sm font-bold text-orange-600 capitalize">
                      {activeSub.package.support_priority}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-6">
                  <h4 className="mb-4 font-semibold text-gray-900">Thao tác nhanh</h4>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-linear-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg"
                      size="lg"
                    >
                      <ArrowUpCircle className="mr-2 h-5 w-5" />
                      Nâng cấp gói
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      size="lg"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Gia hạn gói
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Bắt đầu:
                      </span>
                      <span className="font-medium text-gray-900">{activeSub.start_date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Kết thúc:
                      </span>
                      <span className="font-medium text-gray-900">{activeSub.end_date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trạng thái:</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_CONFIG[activeSub.status]?.class}`}
                      >
                        {STATUS_CONFIG[activeSub.status]?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              Bạn hiện không có gói đăng ký nào đang hoạt động
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Đăng ký gói để bắt đầu đăng tin tuyển dụng và tiếp cận ứng viên
            </p>
            <Button className="mt-6 bg-blue-600 text-white hover:bg-blue-700">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Xem các gói đăng ký
            </Button>
          </CardContent>
        </Card>
      )}

     

      {/* Subscription History */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Lịch sử đăng ký</h3>
            <p className="mt-1 text-sm text-gray-500">
              Xem tất cả gói đăng ký đã sử dụng
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-gray-400">
              Chưa có lịch sử đăng ký
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Gói</TableHead>
                  <TableHead className="font-semibold">Ngày bắt đầu</TableHead>
                  <TableHead className="font-semibold">Ngày kết thúc</TableHead>
                  <TableHead className="font-semibold">Giá</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((sub) => (
                  <TableRow key={sub.subscription_id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {sub.package.package_name}
                    </TableCell>
                    <TableCell className="text-gray-600">{sub.start_date}</TableCell>
                    <TableCell className="text-gray-600">{sub.end_date}</TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(sub.package.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_CONFIG[sub.status]?.class}`}
                      >
                        {STATUS_CONFIG[sub.status]?.label ?? sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.status === "pending" ? (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={payingSubscriptionId === sub.subscription_id}
                          onClick={() => handlePayPendingSubscription(sub.subscription_id)}
                        >
                          {payingSubscriptionId === sub.subscription_id
                            ? "Đang tạo link..."
                            : "Thanh toán"}
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
