# Huong dan up len DirectAdmin

DirectAdmin cua ban dang co cau truc:

```text
domains/
  kimtham.id.vn/
    logs/
    public_html/
```

Hay upload theo cau truc nay:

```text
domains/kimtham.id.vn/
  config/
    config.php
  storage/
    content.json
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

## Thu muc nao dua vao dau?

- Noi dung trong `kimtham-website/public_html/` dua vao `domains/kimtham.id.vn/public_html/`.
- Thu muc `kimtham-website/config/` dua vao `domains/kimtham.id.vn/config/`.
- Thu muc `kimtham-website/storage/` dua vao `domains/kimtham.id.vn/storage/`.

Khong dua `config/` va `storage/` vao trong `public_html` neu DirectAdmin cho phep tao thu muc ngang hang nhu anh chup cua ban.
Minh da them `.htaccess` chan truy cap trong `config/` va `storage/` de an toan hon neu hosting dung Apache.

## Link sau khi upload

```text
https://kimtham.id.vn/
https://kimtham.id.vn/admin.html
```

Tai khoan mac dinh nam trong `config/config.php`:

```text
admin
admin123
```

Doi mat khau truoc khi cong khai website.

## Quyen file

Neu admin bao loi khong luu duoc noi dung, chinh quyen:

```text
storage/             755
storage/content.json 644
```

Mot so hosting co the can `664` cho `content.json`.
