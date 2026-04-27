import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CampusStat = {
  label: string;
  value: number;
  colorClass: string;
};

type CampusContentItem = {
  id: string;
  title: string;
  category: "Sự kiện" | "CLB" | "Học bổng" | "Tài liệu";
  author: string;
  status: "draft" | "review" | "scheduled";
  publishAt: string;
  views: number;
};

type CampusMilestone = {
  id: string;
  phase: string;
  task: string;
  status: "done" | "in-progress" | "upcoming";
};

const campusStats: CampusStat[] = [
  { label: "Nội dung đã tạo", value: 128, colorClass: "text-blue-600" },
  { label: "Đang chờ duyệt", value: 24, colorClass: "text-amber-600" },
  { label: "Đã lên lịch", value: 16, colorClass: "text-emerald-600" },
  { label: "Tổng lượt xem", value: 93240, colorClass: "text-violet-600" },
];

const campusContents: CampusContentItem[] = [
  {
    id: "CC-001",
    title: "Ngày hội việc làm sinh viên 2026",
    category: "Sự kiện",
    author: "Nguyen Minh",
    status: "review",
    publishAt: "2026-05-03T08:30:00",
    views: 1240,
  },
  {
    id: "CC-002",
    title: "Danh sách CLB tuyển thành viên tháng 5",
    category: "CLB",
    author: "Le Hai",
    status: "scheduled",
    publishAt: "2026-05-01T09:00:00",
    views: 860,
  },
  {
    id: "CC-003",
    title: "Học bổng doanh nghiệp ngành CNTT",
    category: "Học bổng",
    author: "Tran Thu",
    status: "draft",
    publishAt: "2026-05-05T14:00:00",
    views: 0,
  },
  {
    id: "CC-004",
    title: "Tài liệu ôn tập kỳ cuối học phần Web",
    category: "Tài liệu",
    author: "Pham Quoc",
    status: "scheduled",
    publishAt: "2026-04-30T19:30:00",
    views: 420,
  },
];

const campusMilestones: CampusMilestone[] = [
  {
    id: "M-01",
    phase: "Phase 1",
    task: "Thiết kế giao diện quản lý nội dung campus",
    status: "done",
  },
  {
    id: "M-02",
    phase: "Phase 2",
    task: "Kết nối API bài viết và danh mục",
    status: "in-progress",
  },
  {
    id: "M-03",
    phase: "Phase 3",
    task: "Thêm bộ lọc, tìm kiếm và phân quyền",
    status: "upcoming",
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: CampusContentItem["status"]) {
  if (status === "draft") return "bg-slate-100 text-slate-700";
  if (status === "review") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function statusLabel(status: CampusContentItem["status"]) {
  if (status === "draft") return "Nháp";
  if (status === "review") return "Chờ duyệt";
  return "Đã lên lịch";
}

function milestoneBadgeClass(status: CampusMilestone["status"]) {
  if (status === "done") return "bg-emerald-100 text-emerald-700";
  if (status === "in-progress") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

function milestoneLabel(status: CampusMilestone["status"]) {
  if (status === "done") return "Hoàn thành";
  if (status === "in-progress") return "Đang làm";
  return "Sắp triển khai";
}

export function CampusContentComingSoonPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold">Campus Content - Coming Soon</h1>
          <p className="mt-2 text-sm text-slate-200">
            Dữ liệu đang dùng mock trực tiếp trong trang để phục vụ thiết kế UI và
            demo nhanh trước khi tích hợp API.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {campusStats.map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="space-y-1 p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`text-2xl font-semibold ${item.colorClass}`}>
                {item.value.toLocaleString("vi-VN")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh sách nội dung mẫu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campusContents.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge className={statusBadgeClass(item.status)}>
                    {statusLabel(item.status)}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span>ID: {item.id}</span>
                  <span>Danh mục: {item.category}</span>
                  <span>Tác giả: {item.author}</span>
                  <span>Lịch đăng: {formatDate(item.publishAt)}</span>
                  <span>Lượt xem: {item.views.toLocaleString("vi-VN")}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Roadmap triển khai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campusMilestones.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700">{item.phase}</p>
                  <Badge className={milestoneBadgeClass(item.status)}>
                    {milestoneLabel(item.status)}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{item.task}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
