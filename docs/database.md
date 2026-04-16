TÀI LIỆU THIẾT KẾ DATABASE
HỆ THỐNG TUYỂN DỤNG
Dành cho Ứng dụng Sinh viên
Phiên bản: 1.0
Ngày tạo: 2/2/2026

 
MỤC LỤC
(Vui lòng cập nhật mục lục bằng cách nhấn chuột phải vào đây và chọn 'Update Field')

 

1. BẢNG QUẢN LÝ GÓI DỊCH VỤ VÀ ĐĂNG KÝ
   recruiter_packages
   Quản lý các gói dịch vụ tuyển dụng (Basic, Pro, Premium)
   Tên cột Kiểu dữ liệu Mô tả
   package_id INT PRIMARY KEY AUTO_INCREMENT ID duy nhất của gói dịch vụ
   package_name VARCHAR(100) NOT NULL Tên gói dịch vụ (Basic, Pro, Premium)
   price DECIMAL(10,2) NOT NULL Giá gói dịch vụ (VNĐ)
   duration_days INT NOT NULL Số ngày hiệu lực của gói (30, 90, 365)
   post_limit INT NOT NULL Số lượng tin tuyển dụng tối đa được đăng
   featured_posts_limit INT DEFAULT 0 Số tin VIP/ưu tiên được đăng
   refresh_limit INT DEFAULT 0 Số lần làm mới tin tuyển dụng
   support_priority ENUM('standard', 'priority', 'vip') DEFAULT 'standard' Mức độ ưu tiên hỗ trợ khách hàng
   features JSON Các tính năng đặc biệt (JSON): logo nổi bật, top search, analytics...
   is_active BOOLEAN DEFAULT TRUE Trạng thái kích hoạt gói (TRUE/FALSE)
   display_order INT DEFAULT 0 Thứ tự hiển thị trên trang giá
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời điểm tạo gói dịch vụ
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP Thời điểm cập nhật gần nhất

recruiter_subscriptions
Quản lý đăng ký sử dụng gói dịch vụ của nhà tuyển dụng
Tên cột Kiểu dữ liệu Mô tả
subscription_id INT PRIMARY KEY AUTO_INCREMENT ID duy nhất của đăng ký
user_id INT NOT NULL FK đến users - Tài khoản nhà tuyển dụng
package_id INT NOT NULL FK đến recruiter_packages - Gói đã đăng ký
company_name VARCHAR(255) NOT NULL Tên công ty/doanh nghiệp
company_tax_code VARCHAR(50) Mã số thuế doanh nghiệp
company_address TEXT Địa chỉ trụ sở công ty
company_phone VARCHAR(20) Số điện thoại liên hệ công ty
company_email VARCHAR(255) Email chính thức của công ty
company_website VARCHAR(255) Website chính thức của công ty
company_logo TEXT URL logo công ty
company_size ENUM('1-10', '11-50', '51-200', '201-500', '500+') DEFAULT '1-10' Quy mô công ty theo số nhân viên
company_industry VARCHAR(100) Ngành nghề kinh doanh chính
company_description TEXT Giới thiệu về công ty
verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending' Trạng thái xác thực công ty
verification_documents JSON Danh sách tài liệu xác thực (GPKD, MST...)
start_date DATE NOT NULL Ngày bắt đầu gói dịch vụ
end_date DATE NOT NULL Ngày kết thúc gói dịch vụ
status ENUM('pending', 'active', 'expired', 'cancelled') DEFAULT 'pending' Trạng thái đăng ký: chờ duyệt/đang hoạt động/hết hạn/đã hủy
payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending' Trạng thái thanh toán
payment_method VARCHAR(50) Phương thức thanh toán (banking, momo, vnpay...)
payment_amount DECIMAL(10,2) Số tiền đã thanh toán
payment_transaction_id VARCHAR(100) Mã giao dịch thanh toán
approved_by INT FK đến users - Admin phê duyệt
approved_at TIMESTAMP Thời gian phê duyệt đăng ký
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời gian đăng ký
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP Thời gian cập nhật cuối

  2. BẢNG DANH MỤC VÀ PHÂN LOẠI
job_categories
Danh mục ngành nghề và lĩnh vực tuyển dụng
Tên cột Kiểu dữ liệu Mô tả
category_id INT PRIMARY KEY AUTO_INCREMENT ID danh mục
category_name VARCHAR(100) NOT NULL Tên ngành nghề (IT, Marketing, Sales, HR...)
category_slug VARCHAR(100) UNIQUE URL-friendly slug cho SEO
parent_id INT DEFAULT NULL FK đến category_id - Danh mục cha (cho phân cấp)
icon VARCHAR(50) Icon/emoji đại diện cho danh mục
description TEXT Mô tả chi tiết về danh mục
display_order INT DEFAULT 0 Thứ tự hiển thị
is_active BOOLEAN DEFAULT TRUE Trạng thái kích hoạt
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày tạo

job_skills
Danh sách kỹ năng nghề nghiệp
Tên cột Kiểu dữ liệu Mô tả
skill_id INT PRIMARY KEY AUTO_INCREMENT ID kỹ năng
skill_name VARCHAR(100) NOT NULL UNIQUE Tên kỹ năng (JavaScript, Communication, MS Excel...)
skill_category ENUM('technical', 'soft_skill', 'language', 'certificate') DEFAULT 'technical' Phân loại kỹ năng: kỹ thuật/mềm/ngôn ngữ/chứng chỉ
is_active BOOLEAN DEFAULT TRUE Trạng thái kích hoạt
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày tạo

  3. BẢNG TIN TUYỂN DỤNG
job_posts
Bài đăng tuyển dụng của nhà tuyển dụng
Tên cột Kiểu dữ liệu Mô tả
job_id INT PRIMARY KEY AUTO_INCREMENT ID bài đăng tuyển dụng
subscription_id INT NOT NULL FK đến recruiter_subscriptions - Gói đăng ký của công ty
user_id INT NOT NULL FK đến users - Người đăng tin
category_id INT FK đến job_categories - Ngành nghề
job_title VARCHAR(255) NOT NULL Tiêu đề công việc/vị trí tuyển dụng
slug VARCHAR(255) UNIQUE URL-friendly slug cho SEO
job_description TEXT NOT NULL Mô tả chi tiết công việc
requirements TEXT Yêu cầu ứng viên (kinh nghiệm, kỹ năng...)
benefits TEXT Quyền lợi được hưởng (bảo hiểm, thưởng...)
salary_min DECIMAL(10,2) Mức lương tối thiểu
salary_max DECIMAL(10,2) Mức lương tối đa
salary_type ENUM('hourly', 'monthly', 'yearly', 'negotiable') DEFAULT 'monthly' Loại lương: giờ/tháng/năm/thỏa thuận
job_type ENUM('fulltime', 'parttime', 'intern', 'freelance', 'contract') DEFAULT 'fulltime' Loại hình công việc
experience_level ENUM('intern', 'fresher', 'junior', '1-3years', '3-5years', '5+years') DEFAULT 'fresher' Mức kinh nghiệm yêu cầu
education_level ENUM('high_school', 'college', 'bachelor', 'master', 'phd', 'any') DEFAULT 'bachelor' Trình độ học vấn yêu cầu
number_of_positions INT DEFAULT 1 Số lượng vị trí cần tuyển
work_mode ENUM('onsite', 'remote', 'hybrid') DEFAULT 'onsite' Hình thức làm việc: tại văn phòng/từ xa/kết hợp
gender_requirement ENUM('male', 'female', 'any') DEFAULT 'any' Yêu cầu giới tính
location_province VARCHAR(100) Tỉnh/Thành phố làm việc
location_district VARCHAR(100) Quận/Huyện làm việc
location_address TEXT Địa chỉ cụ thể nơi làm việc
application_deadline DATE Hạn cuối nộp hồ sơ
contact_email VARCHAR(255) Email nhận hồ sơ ứng tuyển
contact_phone VARCHAR(20) SĐT liên hệ
contact_person VARCHAR(100) Người liên hệ
is_featured BOOLEAN DEFAULT FALSE Tin VIP/nổi bật (hiển thị ưu tiên)
priority_level INT DEFAULT 0 Mức độ ưu tiên hiển thị (cao hơn = hiển thị trước)
status ENUM('draft', 'pending', 'approved', 'rejected', 'expired', 'closed') DEFAULT 'pending' Trạng thái: nháp/chờ duyệt/đã duyệt/từ chối/hết hạn/đã đóng
rejection_reason TEXT Lý do từ chối (nếu bị từ chối)
moderated_by INT FK đến users - Admin kiểm duyệt
moderated_at TIMESTAMP Thời gian kiểm duyệt
view_count INT DEFAULT 0 Tổng lượt xem
application_count INT DEFAULT 0 Số lượng ứng tuyển
last_refreshed_at TIMESTAMP Lần làm mới tin cuối cùng
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày đăng tin
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP Ngày cập nhật cuối
published_at TIMESTAMP Ngày công khai tin tuyển dụng

 
job_post_skills
Liên kết kỹ năng với tin tuyển dụng
Tên cột Kiểu dữ liệu Mô tả
id INT PRIMARY KEY AUTO_INCREMENT ID liên kết
job_id INT NOT NULL FK đến job_posts
skill_id INT NOT NULL FK đến job_skills
is_required BOOLEAN DEFAULT TRUE Kỹ năng bắt buộc (TRUE) hay mong muốn (FALSE)
proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') Mức độ thành thạo yêu cầu

job_post_views
Thống kê lượt xem tin tuyển dụng chi tiết
Tên cột Kiểu dữ liệu Mô tả
view_id BIGINT PRIMARY KEY AUTO_INCREMENT ID lượt xem
job_id INT NOT NULL FK đến job_posts
user_id INT FK đến users (NULL nếu chưa đăng nhập)
ip_address VARCHAR(45) Địa chỉ IP người xem
user_agent TEXT Thông tin trình duyệt/thiết bị
session_id VARCHAR(100) ID phiên làm việc
viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời điểm xem

  4. BẢNG QUẢN LÝ ỨNG TUYỂN
job_applications
Hồ sơ ứng tuyển của sinh viên
Tên cột Kiểu dữ liệu Mô tả
application_id INT PRIMARY KEY AUTO_INCREMENT ID hồ sơ ứng tuyển
job_id INT NOT NULL FK đến job_posts - Tin tuyển dụng ứng tuyển
user_id INT NOT NULL FK đến users - Ứng viên
full_name VARCHAR(255) NOT NULL Họ tên đầy đủ ứng viên
email VARCHAR(255) NOT NULL Email liên hệ
phone VARCHAR(20) NOT NULL Số điện thoại
cv_url TEXT Link CV đã upload
cover_letter TEXT Thư xin việc/giới thiệu bản thân
status ENUM('pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending' Trạng thái xử lý: chờ/đã xem/sơ tuyển/phỏng vấn/nhận offer/chấp nhận/từ chối/rút hồ sơ
note TEXT Ghi chú của HR về ứng viên
rating INT Đánh giá ứng viên (1-5 sao)
rejection_reason TEXT Lý do từ chối (nếu có)
interview_schedule DATETIME Lịch phỏng vấn
interview_location TEXT Địa điểm/link phỏng vấn
interview_status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') Trạng thái phỏng vấn
reviewed_by INT FK đến users - HR đã xem xét
reviewed_at TIMESTAMP Thời gian xem xét hồ sơ
applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời gian nộp hồ sơ
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP Cập nhật cuối

application_timeline
Lịch sử xử lý hồ sơ ứng tuyển
Tên cột Kiểu dữ liệu Mô tả
timeline_id INT PRIMARY KEY AUTO_INCREMENT ID timeline
application_id INT NOT NULL FK đến job_applications
old_status VARCHAR(50) Trạng thái cũ
new_status VARCHAR(50) Trạng thái mới
note TEXT Ghi chú về thay đổi
changed_by INT FK đến users - Người thay đổi
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời điểm thay đổi

  5. BẢNG HỒ SƠ SINH VIÊN
student_profiles
Thông tin hồ sơ chi tiết của sinh viên
Tên cột Kiểu dữ liệu Mô tả
user_id INT PRIMARY KEY FK đến users - ID người dùng
student_code VARCHAR(50) Mã sinh viên
university VARCHAR(255) Tên trường đại học
major VARCHAR(100) Chuyên ngành đào tạo
graduation_year YEAR Năm tốt nghiệp dự kiến/đã tốt nghiệp
gpa DECIMAL(3,2) Điểm GPA (thang 4.0)
cv_default_url TEXT Link CV mặc định
linkedin_url VARCHAR(255) Liên kết LinkedIn
github_url VARCHAR(255) Liên kết GitHub
portfolio_url VARCHAR(255) Website portfolio cá nhân
bio TEXT Giới thiệu bản thân ngắn gọn
career_goals TEXT Mục tiêu nghề nghiệp
expected_salary_min DECIMAL(10,2) Mức lương mong muốn tối thiểu
expected_salary_max DECIMAL(10,2) Mức lương mong muốn tối đa
preferred_job_type SET('fulltime', 'parttime', 'intern', 'freelance') Loại công việc ưa thích (có thể chọn nhiều)
preferred_location JSON Địa điểm làm việc mong muốn (mảng JSON)
is_public BOOLEAN DEFAULT TRUE Cho phép nhà tuyển dụng tìm thấy hồ sơ
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày tạo hồ sơ
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP Cập nhật cuối

student_skills
Kỹ năng của sinh viên
Tên cột Kiểu dữ liệu Mô tả
id INT PRIMARY KEY AUTO_INCREMENT ID liên kết
user_id INT NOT NULL FK đến users
skill_id INT NOT NULL FK đến job_skills
proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner' Mức độ thành thạo
years_of_experience DECIMAL(3,1) Số năm kinh nghiệm với kỹ năng này
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày thêm kỹ năng

  6. BẢNG TƯƠNG TÁC VÀ LƯU TRỮ
saved_jobs
Công việc đã lưu của sinh viên
Tên cột Kiểu dữ liệu Mô tả
id INT PRIMARY KEY AUTO_INCREMENT ID bản ghi lưu
user_id INT NOT NULL FK đến users - Sinh viên
job_id INT NOT NULL FK đến job_posts - Công việc đã lưu
note TEXT Ghi chú cá nhân về công việc này
saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời điểm lưu

company_reviews
Đánh giá công ty từ sinh viên
Tên cột Kiểu dữ liệu Mô tả
review_id INT PRIMARY KEY AUTO_INCREMENT ID đánh giá
subscription_id INT NOT NULL FK đến recruiter_subscriptions - Công ty được đánh giá
user_id INT NOT NULL FK đến users - Sinh viên đánh giá
overall_rating DECIMAL(2,1) NOT NULL Điểm tổng thể (1.0 - 5.0)
work_environment_rating INT Đánh giá môi trường làm việc (1-5)
salary_benefit_rating INT Đánh giá lương thưởng, phúc lợi (1-5)
career_development_rating INT Đánh giá cơ hội phát triển nghề nghiệp (1-5)
management_rating INT Đánh giá quản lý, leadership (1-5)
review_title VARCHAR(255) Tiêu đề đánh giá
review_text TEXT Nội dung đánh giá chi tiết
pros TEXT Ưu điểm của công ty
cons TEXT Nhược điểm của công ty
is_verified BOOLEAN DEFAULT FALSE Đã xác thực từng làm việc tại công ty
employment_status ENUM('current', 'former', 'intern') Trạng thái làm việc: hiện tại/cũ/thực tập
job_title VARCHAR(100) Vị trí công việc khi làm tại công ty
work_duration_months INT Thời gian làm việc (tháng)
is_anonymous BOOLEAN DEFAULT FALSE Đánh giá ẩn danh
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' Trạng thái kiểm duyệt
moderated_by INT FK đến users - Admin kiểm duyệt
moderated_at TIMESTAMP Thời gian kiểm duyệt
helpful_count INT DEFAULT 0 Số người thấy hữu ích
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày đánh giá
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP Cập nhật cuối

  7. BẢNG THÔNG BÁO
recruiter_notifications
Thông báo cho nhà tuyển dụng
Tên cột Kiểu dữ liệu Mô tả
notification_id INT PRIMARY KEY AUTO_INCREMENT ID thông báo
subscription_id INT NOT NULL FK đến recruiter_subscriptions
type ENUM('new_application', 'expiring_post', 'package_expiring', 'post_approved', 'post_rejected', 'new_review') Loại thông báo
title VARCHAR(255) Tiêu đề thông báo
content TEXT Nội dung chi tiết
related_id INT ID liên quan (job_id, application_id...)
action_url VARCHAR(255) Link hành động
is_read BOOLEAN DEFAULT FALSE Đã đọc hay chưa
read_at TIMESTAMP Thời điểm đọc
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày tạo thông báo

student_notifications
Thông báo cho sinh viên
Tên cột Kiểu dữ liệu Mô tả
notification_id INT PRIMARY KEY AUTO_INCREMENT ID thông báo
user_id INT NOT NULL FK đến users - Sinh viên
type ENUM('application_status', 'interview_schedule', 'new_job_match', 'saved_job_expiring', 'job_recommendation') Loại thông báo
title VARCHAR(255) Tiêu đề thông báo
content TEXT Nội dung chi tiết
related_id INT ID liên quan (job_id, application_id...)
action_url VARCHAR(255) Link hành động
is_read BOOLEAN DEFAULT FALSE Đã đọc hay chưa
read_at TIMESTAMP Thời điểm đọc
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Ngày tạo thông báo

  8. BẢNG NHẬT KÝ VÀ BẢO MẬT
admin_action_logs
Nhật ký hành động quản trị
Tên cột Kiểu dữ liệu Mô tả
log_id BIGINT PRIMARY KEY AUTO_INCREMENT ID log
admin_id INT NOT NULL FK đến users - Admin thực hiện
action_type ENUM('approve_subscription', 'reject_subscription', 'approve_post', 'reject_post', 'ban_company', 'unban_company', 'approve_review', 'reject_review', 'delete_account') Loại hành động
target_type ENUM('subscription', 'job_post', 'application', 'review', 'user') Đối tượng bị tác động
target_id INT ID đối tượng
reason TEXT Lý do thực hiện hành động
old_value JSON Giá trị trước khi thay đổi
new_value JSON Giá trị sau khi thay đổi
ip_address VARCHAR(45) IP của admin
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời gian thực hiện

payment_transactions
Lịch sử giao dịch thanh toán
Tên cột Kiểu dữ liệu Mô tả
transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT ID giao dịch
subscription_id INT NOT NULL FK đến recruiter_subscriptions
transaction_code VARCHAR(100) UNIQUE Mã giao dịch từ cổng thanh toán
payment_method VARCHAR(50) Phương thức: banking/momo/vnpay/zalopay...
amount DECIMAL(10,2) NOT NULL Số tiền giao dịch
status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending' Trạng thái giao dịch
gateway_response JSON Phản hồi từ cổng thanh toán (JSON)
ip_address VARCHAR(45) IP thực hiện thanh toán
completed_at TIMESTAMP Thời điểm hoàn thành
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP Thời gian tạo giao dịch

  9. CÁC INDEX ĐỀ XUẤT
Để tối ưu hiệu suất truy vấn, các index sau đây nên được tạo:
• job_posts: CREATE INDEX idx_job_search ON job_posts(status, category_id, location_province, job_type, created_at);
• job_posts: CREATE INDEX idx_job_deadline ON job_posts(application_deadline, status);
• job_posts: CREATE INDEX idx_job_featured ON job_posts(is_featured, priority_level, created_at);
• job_applications: CREATE INDEX idx_app_job ON job_applications(job_id, status, applied_at);
• job_applications: CREATE INDEX idx_app_user ON job_applications(user_id, status, applied_at);
• job_post_views: CREATE INDEX idx_views ON job_post_views(job_id, viewed_at);
• recruiter_subscriptions: CREATE INDEX idx_sub_dates ON recruiter_subscriptions(start_date, end_date, status);
• recruiter_subscriptions: CREATE INDEX idx_sub_status ON recruiter_subscriptions(status, verification_status);
• saved_jobs: CREATE UNIQUE INDEX idx_saved_unique ON saved_jobs(user_id, job_id);
• company_reviews: CREATE INDEX idx_review_company ON company_reviews(subscription_id, status, created_at);

  10. GHI CHÚ VÀ KHUYẾN NGHỊ
Quan hệ giữa các bảng

1. users → recruiter_subscriptions (1:N): Một tài khoản có thể đăng ký nhiều gói dịch vụ qua thời gian
2. recruiter_packages → recruiter_subscriptions (1:N): Một gói dịch vụ có thể được nhiều công ty đăng ký
3. recruiter_subscriptions → job_posts (1:N): Một đăng ký có thể đăng nhiều tin tuyển dụng
4. job_posts → job_applications (1:N): Một tin tuyển dụng nhận nhiều hồ sơ ứng tuyển
5. users → student_profiles (1:1): Mỗi sinh viên có một hồ sơ chi tiết
6. job_categories → job_categories (Self-reference): Hỗ trợ danh mục phân cấp (parent_id)

Khuyến nghị triển khai
• Sử dụng Soft Delete: Thêm cột is_deleted và deleted_at thay vì xóa vật lý dữ liệu
• Backup định kỳ: Đặc biệt các bảng payment_transactions và admin_action_logs
• Phân quyền rõ ràng: Admin/Recruiter/Student có quyền truy cập khác nhau
• Validation nghiêm ngặt: Email, phone, URL, enum values phải được validate trước khi lưu
• Cache thông minh: Cache danh sách job_categories, job_skills để giảm truy vấn
• Cronjob tự động: Tự động cập nhật status='expired' cho tin hết hạn, gửi thông báo
• Full-text search: Cân nhắc sử dụng Elasticsearch cho tìm kiếm công việc hiệu quả
• Rate limiting: Giới hạn số lần ứng tuyển/ngày để tránh spam
