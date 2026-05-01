# Huong dan upload len DirectAdmin

Website dung `public_html/` lam thu muc public duy nhat. Thu muc `public-html/` cu khong con la nguon deploy.

## Cau truc can co tren hosting

```text
domains/kimtham.id.vn/
  config/
    .htaccess
    config.php
  storage/
    .htaccess
    blogs.json
    content.json
    leads.json
    pages.json
    portfolio.json
    products.json
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

1. Upload toan bo noi dung trong `kimtham-website/public_html/` vao `domains/kimtham.id.vn/public_html/`.
2. Upload `kimtham-website/config/` vao `domains/kimtham.id.vn/config/`.
3. Upload `kimtham-website/storage/` vao `domains/kimtham.id.vn/storage/`.
4. Neu DirectAdmin khong cho tao `config/` va `storage/` ngang hang `public_html/`, hay giu `.htaccess` trong hai thu muc do de chan truy cap truc tiep.

## Tai khoan admin

Admin khong con mat khau mac dinh. Truoc khi cong khai, tao hash moi bang PHP:

```bash
php -r "echo password_hash('mat-khau-moi', PASSWORD_DEFAULT);"
```

Sau do cau hinh bien moi truong tren hosting:

```text
KIMTHAM_ADMIN_PASSWORD_HASH=hash-vua-tao
KIMTHAM_NOTIFICATION_EMAIL=email-nhan-lead
```

Neu hosting khong ho tro bien moi truong, co the dat truc tiep hash trong `config/config.php`.

## Link sau khi upload

```text
https://kimtham.id.vn/
https://kimtham.id.vn/admin.html
https://kimtham.id.vn/api/session.php
```

## Quyen file

Neu admin khong luu duoc noi dung, bai viet, san pham, portfolio hoac lead:

```text
storage/               755
storage/blogs.json     644 hoac 664
storage/content.json   644 hoac 664
storage/leads.json     644 hoac 664
storage/pages.json     644 hoac 664
storage/portfolio.json 644 hoac 664
storage/products.json  644 hoac 664
```

## Kiem tra nhanh

- Website hien thi tieng Viet dung dau.
- Menu public khong co link Admin.
- Tao va luu bai viet moi thanh cong trong admin.
- Gui form lien he thanh cong va lead xuat hien trong admin.
- Truy cap `/config/`, `/storage/`, file `.htaccess`, va cac file JSON bi chan.
- Dang nhap admin chi hoat dong sau khi da cau hinh `KIMTHAM_ADMIN_PASSWORD_HASH`.
