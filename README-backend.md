# Kim Thắm Website Backend

## Cấu trúc mới

```text
kimtham-website/
  public-html/        # Đưa thư mục này lên public_html của hosting
    index.html        # Trang public
    admin.html        # Trang quản trị
    api/              # Backend PHP
    images/
    files/
  storage/
    content.json      # Dữ liệu website
  config/
    config.php        # Tài khoản admin
```

## Tài khoản admin mặc định

```text
Username: admin
Password: admin123
```

Đổi tài khoản trong `config/config.php` trước khi đưa website lên mạng.

## Chạy thử trên máy

Nếu máy có PHP:

```bash
php -S localhost:8000 -t public-html
```

Sau đó mở:

```text
http://localhost:8000
http://localhost:8000/admin.html
```

## Khi upload lên hosting

Đưa toàn bộ nội dung trong `public-html/` vào thư mục public của hosting. Nếu hosting dùng tên `public_html`, bạn có thể đổi `public-html` thành `public_html`.

Giữ `storage/` và `config/` bên ngoài thư mục public nếu hosting cho phép. Nếu bắt buộc phải để cùng cấp public, cần cấu hình chặn truy cập trực tiếp vào hai thư mục này.
