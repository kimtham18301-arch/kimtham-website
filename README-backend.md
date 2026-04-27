# Backend Kim Thắm Website

Backend dùng PHP thuần để phù hợp hosting DirectAdmin.

## API

- `GET /api/content.php`: trả nội dung website và CSRF token.
- `POST /api/content.php`: lưu nội dung, yêu cầu admin và CSRF token.
- `POST /api/login.php`: đăng nhập admin bằng `password_verify()`.
- `POST /api/logout.php`: đăng xuất, yêu cầu CSRF token.
- `GET /api/session.php`: kiểm tra phiên đăng nhập.
- `POST /api/contact.php`: nhận form liên hệ, kiểm tra honeypot, giới hạn gửi theo IP, validate dữ liệu và lưu vào `storage/leads.json`.
- `GET /api/leads.php`: admin xem lead liên hệ.

## Dữ liệu

- `storage/content.json`: nội dung public site.
- `storage/leads.json`: danh sách lead từ form liên hệ.
- `config/config.php`: tài khoản admin và password hash.

## Cấu hình admin

Admin không còn mật khẩu mặc định. Trước khi dùng, đặt biến môi trường:

```bash
KIMTHAM_ADMIN_PASSWORD_HASH="hash-tao-tu-password_hash"
KIMTHAM_NOTIFICATION_EMAIL="email-nhan-lead"
```

`KIMTHAM_NOTIFICATION_EMAIL` là email nhận thông báo khi có lead mới. Tạo password hash trên máy hoặc hosting có PHP:

```bash
php -r "echo password_hash('mat-khau-moi', PASSWORD_DEFAULT);"
```

## Chạy local

Máy cần có PHP trong PATH:

```bash
php -S localhost:8000 -t public_html
```

Sau đó mở:

```text
http://localhost:8000
http://localhost:8000/admin.html
```

Máy hiện tại của dự án chưa có `php` trong PATH, nên phần kiểm thử runtime cần chạy trên máy đã cài PHP hoặc trên hosting.
