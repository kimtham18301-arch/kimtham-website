# Kim Thắm - Content & Social Media Freelancer Website

Website cá nhân cho domain `kimtham.id.vn`, định hướng giới thiệu dịch vụ freelance về Content Marketing, Social Media và SEO cơ bản.

## Bản deploy chính

Chỉ upload nội dung trong thư mục `public_html/` lên hosting. Thư mục `config/` và `storage/` nên nằm cùng cấp với `public_html/`, nhưng không đặt bên trong vùng public nếu hosting cho phép tách riêng.

```text
kimtham-website/
  public_html/        # Thư mục public deploy chính
  config/             # Cấu hình admin, nên để ngoài public_html
  storage/            # Nội dung và lead liên hệ, nên để ngoài public_html
  DIRECTADMIN.md      # Hướng dẫn upload hosting
  README-backend.md   # Ghi chú API PHP
```

## Tính năng

- Trang giới thiệu dịch vụ freelance với hero, dịch vụ, gói hợp tác, case study, quy trình, giới thiệu và liên hệ.
- Nội dung public đọc từ `api/content.php`, có fallback khi API chưa chạy.
- Form liên hệ có honeypot, giới hạn gửi theo IP và lưu lead vào `storage/leads.json`.
- Trang admin đăng nhập bằng PHP session, CSRF token và mật khẩu qua `password_verify()`.
- Admin quản lý nội dung chính và xem lead liên hệ.
- Favicon, canonical URL, Open Graph metadata và ảnh đại diện SVG mặc định.

## Việc cần làm trước khi công khai

1. Đặt biến môi trường `KIMTHAM_ADMIN_PASSWORD_HASH` bằng giá trị tạo từ `password_hash()` trên PHP.
2. Cập nhật email, Facebook, LinkedIn nếu đã có link thật trong admin.
3. Thay `public_html/images/kim-tham.svg` bằng ảnh thật nếu có.
4. Thêm file CV/profile thật vào `public_html/files/cv-kim-tham.pdf`, rồi nhập `profileUrl` là `files/cv-kim-tham.pdf` trong admin.
5. Upload đúng thư mục `public_html/` theo `DIRECTADMIN.md`.
