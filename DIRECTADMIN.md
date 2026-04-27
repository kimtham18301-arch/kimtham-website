# Hướng dẫn upload lên DirectAdmin

Website dùng `public_html/` làm thư mục public duy nhất. Thư mục `public-html/` cũ không còn là nguồn deploy.

## Cấu trúc cần có trên hosting

```text
domains/kimtham.id.vn/
  config/
    .htaccess
    config.php
  storage/
    .htaccess
    content.json
    leads.json
  public_html/
    index.html
    admin.html
    admin.css
    admin.js
    style.css
    script.js
    .htaccess
    api/
    files/
    images/
```

## Upload

1. Upload toàn bộ nội dung trong `kimtham-website/public_html/` vào `domains/kimtham.id.vn/public_html/`.
2. Upload `kimtham-website/config/` vào `domains/kimtham.id.vn/config/`.
3. Upload `kimtham-website/storage/` vào `domains/kimtham.id.vn/storage/`.
4. Nếu DirectAdmin không cho tạo `config/` và `storage/` ngang hàng `public_html/`, hãy giữ `.htaccess` trong hai thư mục đó để chặn truy cập trực tiếp.

## Tài khoản admin

Admin không còn mật khẩu mặc định. Trước khi công khai, tạo hash mới bằng PHP:

```bash
php -r "echo password_hash('mat-khau-moi', PASSWORD_DEFAULT);"
```

Sau đó cấu hình biến môi trường trên hosting:

```text
KIMTHAM_ADMIN_PASSWORD_HASH=hash-vua-tao
KIMTHAM_NOTIFICATION_EMAIL=email-nhan-lead
```

Nếu hosting không hỗ trợ biến môi trường, có thể đặt trực tiếp hash trong `config/config.php`.

## Link sau khi upload

```text
https://kimtham.id.vn/
https://kimtham.id.vn/admin.html
https://kimtham.id.vn/api/session.php
```

## Quyền file

Nếu admin không lưu được nội dung hoặc lead:

```text
storage/             755
storage/content.json 644 hoặc 664
storage/leads.json   644 hoặc 664
```

## Kiểm tra nhanh

- Website hiển thị tiếng Việt đúng dấu.
- Menu public không có link Admin.
- Gửi form liên hệ thành công và lead xuất hiện trong admin.
- Truy cập `/config/`, `/storage/`, file `.htaccess`, `content.json`, `leads.json` bị chặn.
- Đăng nhập admin chỉ hoạt động sau khi đã cấu hình `KIMTHAM_ADMIN_PASSWORD_HASH`.
