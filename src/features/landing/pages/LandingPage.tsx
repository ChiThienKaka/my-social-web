import {
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  GraduationCap,
  Target,
  Zap,
  Shield,
  Briefcase,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  fetchRecruiterPackages,
  type RecruiterPackage,
} from "../services/recruiter-packages.service";
import { API_ENDPOINTS } from "@/lib/api";

export function LandingPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<RecruiterPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoadingPackages(true);
        const data = await fetchRecruiterPackages();
        if (isMounted) setPackages(data);
      } catch (error) {
        console.error("Failed to load recruiter packages:", error);
      } finally {
        if (isMounted) setIsLoadingPackages(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);
  console.log(packages);
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Modern */}
      <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TalentHub</span>
            </div>
            <div className="flex items-center gap-8">
              <a
                href="#why"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Vì sao chọn TalentHub
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Bảng giá
              </a>
              <a
                href="#how"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Cách hoạt động
              </a>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => navigate(API_ENDPOINTS.AUTH.EMPLOYER_LOGIN)}
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-4 py-1.5">
                  <Briefcase className="mr-2 h-3.5 w-3.5" />
                  Dành cho bộ phận HR & Tuyển dụng
                </Badge>
                <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
                  Kết nối nhân tài từ trường đại học
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {" "}
                    hàng đầu
                  </span>
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">
                  Kết nối với hàng nghìn sinh viên và cựu sinh viên chất lượng
                  cao từ các khoa hàng đầu. Xây dựng đội ngũ tương lai với những
                  ứng viên được xác thực, giàu kỹ năng và sẵn sàng tạo dấu ấn.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="h-14 rounded-xl bg-blue-600 px-8 text-base font-semibold shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
                  onClick={() => navigate("/subscription/pricing")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-xl border-2 border-gray-300 px-8 text-base font-semibold hover:border-blue-600 hover:bg-blue-50"
                >
                  Schedule Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-12 pt-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600">12,458</div>
                  <div className="text-sm font-medium text-gray-600">
                    Ứng viên đang hoạt động
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">520+</div>
                  <div className="text-sm font-medium text-gray-600">
                    Doanh nghiệp đối tác
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">95%</div>
                  <div className="text-sm font-medium text-gray-600">
                    Tỷ lệ tuyển dụng thành công
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Modern Visual */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-20 blur-3xl" />
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-2xl">
                <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
                  <div className="rounded-full bg-blue-600 p-6">
                    <GraduationCap className="h-16 w-16 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      Ngân hàng nhân tài sinh viên
                    </div>
                    <div className="text-gray-600">
                      Truy cập hồ sơ sinh viên đã được xác thực
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="rounded-xl bg-white p-4 shadow-md">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-md">
                      <Briefcase className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-md">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE THIS PLATFORM */}
      <section id="why" className="border-t border-blue-100 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Vì sao chọn TalentHub
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900">
              Nền tảng dành riêng cho nhà tuyển dụng
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Tất cả những gì bạn cần để tuyển đúng nhân tài từ trường đại học
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <Card className="group border-2 border-blue-100 transition-all hover:border-blue-600 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
                  <Target className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Tìm kiếm chính xác
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Bộ lọc nâng cao theo khoa, chuyên ngành, kỹ năng và GPA. Giúp
                  bạn nhanh chóng tìm đúng ứng viên phù hợp.
                </p>
              </CardContent>
            </Card>

            {/* Benefit 2 */}
            <Card className="group border-2 border-blue-100 transition-all hover:border-blue-600 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
                  <Zap className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Ứng tuyển nhanh chóng
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Cộng đồng sinh viên năng động. Nhận được hồ sơ chất lượng
                  trong vòng 24 giờ sau khi đăng tin.
                </p>
              </CardContent>
            </Card>

            {/* Benefit 3 */}
            <Card className="group border-2 border-blue-100 transition-all hover:border-blue-600 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
                  <Shield className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Hồ sơ đã xác thực
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Hồ sơ sinh viên được trường xác thực. Xem điểm số, hồ sơ năng
                  lực và chứng chỉ một cách minh bạch.
                </p>
              </CardContent>
            </Card>

            {/* Benefit 4 */}
            <Card className="group border-2 border-blue-100 transition-all hover:border-blue-600 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
                  <Award className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Xây dựng thương hiệu tuyển dụng
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Giới thiệu doanh nghiệp của bạn tới hàng nghìn sinh viên. Xây
                  dựng thương hiệu nhà tuyển dụng nổi bật.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. STUDENT AUDIENCE OVERVIEW */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
              Ngân hàng nhân tài
            </Badge>
            <h2 className="text-5xl font-bold">
              Ứng viên tiếp theo của bạn đang ở đây
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Tiếp cận nguồn ứng viên đa dạng, giàu kỹ năng ở nhiều lĩnh vực
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-16 grid grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/20">
              <Users className="mx-auto mb-4 h-12 w-12 text-blue-200" />
              <div className="mb-2 text-5xl font-bold">12,458</div>
              <div className="text-lg text-blue-100">
                Ứng viên đang hoạt động
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/20">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-blue-200" />
              <div className="mb-2 text-5xl font-bold">15+</div>
              <div className="text-lg text-blue-100">Khoa / chuyên ngành</div>
            </div>

            <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/20">
              <Star className="mx-auto mb-4 h-12 w-12 text-blue-200" />
              <div className="mb-2 text-5xl font-bold">95%</div>
              <div className="text-lg text-blue-100">
                Tỷ lệ tuyển dụng thành công
              </div>
            </div>
          </div>

          {/* Faculties List */}
          <div className="rounded-3xl bg-white/10 p-10 backdrop-blur-sm">
            <h3 className="mb-8 text-center text-3xl font-bold">
              Nhóm ngành được tuyển nhiều nhất
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                "Khoa học máy tính",
                "Quản trị kinh doanh",
                "Kỹ thuật",
                "Công nghệ thông tin",
                "Marketing & Sales",
                "Thiết kế UI/UX",
                "Khoa học dữ liệu",
                "Kinh tế học",
                "Truyền thông",
                "Tài chính & Kế toán",
                "Toán học",
                "Khoa học ứng dụng",
              ].map((faculty) => (
                <div
                  key={faculty}
                  className="rounded-xl bg-white/10 p-4 text-center font-medium backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {faculty}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section id="pricing" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Gói đăng ký
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900">
              Chọn gói phù hợp cho doanh nghiệp
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Mức giá linh hoạt, phù hợp với nhu cầu tuyển dụng của bạn
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {(packages.length ? packages : []).map((pkg, index) => {
              const isFeatured = index === 1;
              const isBestValue = index === 2;
              const priceLabel = new Intl.NumberFormat("vi-VN").format(
                pkg.price,
              );
              const durationLabel =
                pkg.duration_days >= 30
                  ? `${Math.round(pkg.duration_days / 30)} months`
                  : `${pkg.duration_days} days`;

              return (
                <Card
                  key={pkg.package_id}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all hover:border-blue-200 hover:shadow-lg ${
                    isFeatured
                      ? "border-blue-600 shadow-2xl hover:shadow-blue-600/20 border-4"
                      : "border-gray-200"
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute left-0 right-0 top-0 bg-gradient-to-r from-blue-600 to-blue-700 py-2 text-center">
                      <Badge className="bg-white/20 font-bold uppercase text-white hover:bg-white/20">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isBestValue && !isFeatured && (
                    <div className="absolute right-4 top-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Best Value
                      </Badge>
                    </div>
                  )}
                  <CardHeader
                    className={isFeatured ? "pb-8 pt-16" : "pb-8 pt-10"}
                  >
                    <div className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
                      {pkg.package_name}
                    </div>
                    <h3 className="mb-4 text-3xl font-bold text-gray-900">
                      {pkg.package_name} Plan
                    </h3>
                    <div className="mb-2 flex items-baseline">
                      <span className="text-5xl font-extrabold text-gray-900">
                        ₫{priceLabel}
                      </span>
                      <span className="ml-2 text-xl text-gray-600">
                        /{durationLabel}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {pkg.support_priority === "vip"
                        ? "Phù hợp cho nhu cầu tuyển dụng số lượng lớn"
                        : pkg.support_priority === "priority"
                          ? "Phù hợp cho đội ngũ đang mở rộng"
                          : "Phù hợp để bắt đầu trải nghiệm nền tảng"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-10">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <span className="text-gray-700">
                          {pkg.post_limit === 0
                            ? "Tin tuyển dụng không giới hạn"
                            : `${pkg.post_limit} tin tuyển dụng đang hoạt động`}
                        </span>
                      </li>
                      {pkg.featured_posts_limit > 0 && (
                        <li className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                          <span className="text-gray-700">
                            {pkg.featured_posts_limit} tin tuyển dụng nổi bật
                          </span>
                        </li>
                      )}
                      <li className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <span className="text-gray-700">
                          {pkg.refresh_limit}{" "}
                          {pkg.refresh_limit === 1
                            ? "lần làm mới / tin"
                            : "lần làm mới / tin"}
                        </span>
                      </li>
                      {pkg.features.logo_highlight && (
                        <li className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                          <span className="text-gray-700">
                            Làm nổi bật logo công ty
                          </span>
                        </li>
                      )}
                      {pkg.features.top_search && (
                        <li className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                          <span className="text-gray-700">
                            Ưu tiên ở đầu kết quả tìm kiếm
                          </span>
                        </li>
                      )}
                      {pkg.features.analytics !== "none" && (
                        <li className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                          <span className="text-gray-700">
                            {pkg.features.analytics === "full"
                              ? "Báo cáo & phân tích nâng cao"
                              : "Báo cáo phân tích cơ bản"}
                          </span>
                        </li>
                      )}
                    </ul>
                    <Button
                      onClick={() => navigate("/employer/login")}
                      variant={isFeatured ? "default" : "outline"}
                      className={
                        isFeatured
                          ? "w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl"
                          : "w-full h-12 rounded-xl border-2 border-gray-300 font-semibold hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                      }
                      size="lg"
                    >
                      {isFeatured ? (
                        <>
                          Bắt đầu ngay
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      ) : (
                        "Chọn gói này"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {packages.length === 0 && !isLoadingPackages && (
              <div className="col-span-3 text-center text-gray-500">
                Các gói đăng ký sẽ sớm được cập nhật.
              </div>
            )}
          </div>

          <p className="mt-12 text-center text-gray-600">
            ✓ Tất cả gói đều bao gồm: hồ sơ ứng viên đã xác thực • theo dõi ứng
            tuyển • truy cập trên di động
          </p>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section
        id="how"
        className="bg-gradient-to-br from-gray-50 to-blue-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              Quy trình đơn giản
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900">
              Bắt đầu tuyển dụng ngay hôm nay
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              3 bước đơn giản để tìm được ứng viên phù hợp
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-12">
            {/* Connecting Lines */}
            <div className="absolute left-[16.66%] right-[16.66%] top-12 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>

            {/* Step 1 */}
            <div className="relative text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-600/30">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <Building2 className="mx-auto mb-4 h-10 w-10 text-blue-600" />
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Tạo hồ sơ công ty
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Đăng ký tài khoản và hoàn thiện hồ sơ doanh nghiệp. Giới thiệu
                  thương hiệu, văn hoá và điểm khác biệt của bạn.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-600/30">
                <span className="text-4xl font-bold text-white">2</span>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <Briefcase className="mx-auto mb-4 h-10 w-10 text-blue-600" />
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Đăng tin tuyển dụng
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Tạo tin tuyển dụng phù hợp. Sử dụng bộ lọc để tiếp cận đúng
                  ứng viên theo khoa, kỹ năng và kinh nghiệm.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-600/30">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <Users className="mx-auto mb-4 h-10 w-10 text-blue-600" />
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Tuyển dụng nhân tài phù hợp
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Xem và sàng lọc hồ sơ, đặt lịch phỏng vấn và gửi offer. Quản
                  lý toàn bộ quy trình trong một nơi duy nhất.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-10 text-base font-semibold shadow-xl shadow-blue-600/30 hover:shadow-2xl"
              onClick={() => navigate("/subscription/pricing")}
            >
              Bắt đầu dùng thử miễn phí
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm text-gray-600">
              Không cần thẻ tín dụng • Thiết lập trong 5 phút
            </p>
          </div>
        </div>
      </section>

      {/* 6. TRUST SECTION */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Partner Logos */}
          <div className="mb-20">
            <h3 className="mb-12 text-center text-sm font-bold uppercase tracking-wider text-gray-500">
              Được tin dùng bởi hơn 500+ doanh nghiệp hàng đầu
            </h3>
            <div className="grid grid-cols-6 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex aspect-video items-center justify-center rounded-xl border-2 border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <div className="mb-16 text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                Câu chuyện thành công
              </Badge>
              <h3 className="text-5xl font-bold text-gray-900">
                Được các đội ngũ HR tin tưởng
              </h3>
              <p className="mt-4 text-xl text-gray-600">
                Lắng nghe chia sẻ từ các chuyên gia tuyển dụng về TalentHub
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "TalentHub đã thay đổi hoàn toàn cách chúng tôi tuyển dụng tại trường. 15 vị trí được lấp đầy chỉ trong 3 tuần, chất lượng ứng viên rất ấn tượng.",
                  name: "Sarah Johnson",
                  title: "Giám đốc Nhân sự",
                  company: "Tech Innovations Inc.",
                },
                {
                  quote:
                    "Nền tảng dễ sử dụng, hồ sơ sinh viên chi tiết. Chúng tôi đã xây dựng được pipeline thực tập sinh chất lượng, nhiều bạn trở thành nhân viên chính thức.",
                  name: "Michael Chen",
                  title: "Trưởng nhóm Tuyển dụng",
                  company: "Digital Solutions Co.",
                },
                {
                  quote:
                    "Khoản đầu tư xứng đáng cho chiến lược tuyển dụng. Tiếp cận trực tiếp nhân tài từ trường đại học giúp tiết kiệm rất nhiều thời gian và chi phí.",
                  name: "Emily Rodriguez",
                  title: "Phó chủ tịch Nhân sự",
                  company: "Growth Ventures",
                },
              ].map((testimonial, i) => (
                <Card
                  key={i}
                  className="border-2 border-blue-100 transition-all hover:border-blue-600 hover:shadow-xl"
                >
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="mb-4 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-lg leading-relaxed text-gray-700">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.title}
                        </div>
                        <div className="text-sm text-blue-600">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center text-white">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/20">
            Sẵn sàng bắt đầu?
          </Badge>
          <h2 className="mb-6 text-6xl font-extrabold leading-tight">
            Xây dựng đội ngũ mơ ước của bạn ngay hôm nay
          </h2>
          <p className="mb-10 text-2xl text-blue-100">
            Hơn 520+ doanh nghiệp đã và đang tuyển dụng nhân tài từ đại học qua
            TalentHub
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-16 rounded-xl bg-white px-10 text-lg font-semibold text-blue-600 shadow-2xl hover:bg-blue-50"
              onClick={() => navigate("/subscription/pricing")}
            >
              Dùng thử miễn phí
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 rounded-xl border-2 border-white bg-transparent px-10 text-lg font-semibold text-white hover:bg-white hover:text-blue-600"
            >
              Đặt lịch demo
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Dùng thử miễn phí 30 ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Có thể hủy bất cứ lúc nào</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-4 gap-12">
            <div className="col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  TalentHub
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Kết nối doanh nghiệp với nguồn nhân tài từ các trường đại học để
                cùng phát triển bền vững.
              </p>
            </div>
            <div>
              <div className="mb-4 font-bold text-gray-900">Sản phẩm</div>
              <ul className="space-y-3 text-gray-600">
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Tính năng
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Bảng giá
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Cách hoạt động
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Câu hỏi thường gặp
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4 font-bold text-gray-900">Công ty</div>
              <ul className="space-y-3 text-gray-600">
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Về chúng tôi
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Liên hệ
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Cơ hội nghề nghiệp
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Blog
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4 font-bold text-gray-900">Pháp lý</div>
              <ul className="space-y-3 text-gray-600">
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Chính sách bảo mật
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Điều khoản sử dụng
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Chính sách Cookie
                </li>
                <li className="transition-colors hover:text-blue-600 cursor-pointer">
                  Bảo mật
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>
              © 2024 TalentHub. Đã đăng ký bản quyền. Xây dựng với ❤️ dành cho
              các nhà tuyển dụng.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
