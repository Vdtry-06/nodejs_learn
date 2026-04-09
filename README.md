# my-api

REST API CRUD đơn giản xây dựng bằng Node.js + Express + PostgreSQL, chạy bằng Docker Compose.

---

## Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/) _(chỉ cần nếu chạy local không dùng Docker)_

---

## Cấu trúc thư mục

```
my-api/
├── docker-compose.yml          # Khởi động API + Database cùng lúc
├── Dockerfile                  # Đóng gói Node.js app thành container
├── init.sql                    # Tạo bảng và dữ liệu mẫu (chạy 1 lần đầu)
├── .env                        # Biến môi trường (KHÔNG commit lên git)
├── .env.example                # Mẫu biến môi trường cho người mới clone
├── .gitignore
├── package.json
└── src/
    ├── index.js                # Khởi động server (entry point)
    ├── app.js                  # Cấu hình Express, đăng ký routes
    ├── config/
    │   └── db.js               # Kết nối PostgreSQL (Pool)
    ├── controllers/
    │   └── user.controller.js  # Xử lý logic cho từng API
    ├── routes/
    │   └── user.routes.js      # Định nghĩa các đường dẫn API
    └── middlewares/
        └── errorHandler.js     # Xử lý lỗi tập trung
```

---

## Luồng hoạt động

```
Client (Postman / Browser)
        │
        │  HTTP Request
        ▼
   src/index.js          ← Khởi động server, lắng nghe port
        │
        ▼
    src/app.js           ← Nhận request, chạy qua middleware (express.json)
        │
        ▼
 src/routes/             ← Xác định: URL này gọi hàm nào?
 user.routes.js            GET /users      → controller.getAll
                           GET /users/:id  → controller.getOne
                           POST /users     → controller.create
                           PUT /users/:id  → controller.update
                           DELETE /users/:id → controller.remove
        │
        ▼
 src/controllers/        ← Xử lý logic: validate, gọi database
 user.controller.js
        │
        ▼
 src/config/db.js        ← Gửi câu SQL đến PostgreSQL
        │
        ▼
   PostgreSQL DB         ← Trả về kết quả
        │
        ▼
 Controller              ← Nhận kết quả, trả JSON về client
        │
        │  Nếu có lỗi → next(err)
        ▼
 src/middlewares/        ← Bắt lỗi, trả thông báo lỗi thống nhất
 errorHandler.js
```

---

## Các bước triển khai

### Bước 1 — Clone project

```bash
git clone https://github.com/Vdtry-06/nodejs_learn.git
cd my-api
```

### Bước 2 — Tạo file `.env`

Copy file mẫu rồi điền thông tin thật:

```bash
cp .env.example .env
```

Nội dung file `.env`:

```
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret123
DB_NAME=mydb
```

> `DB_HOST=db` là tên service trong docker-compose, không phải localhost.

### Bước 3 — Khởi động bằng Docker Compose

```bash
docker-compose up --build
```

Lần đầu sẽ mất vài phút để tải image. Khi thấy dòng này là thành công:

```
Server is running at http://localhost:3000
```

### Bước 4 — Test API

Dùng Postman hoặc curl:

```bash
# Lấy tất cả users
curl http://localhost:3000/users

# Lấy 1 user
curl http://localhost:3000/users/1

# Tạo user mới
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Le Van C", "email": "vanc@example.com"}'

# Cập nhật user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Ten moi", "email": "moi@example.com"}'

# Xoá user
curl -X DELETE http://localhost:3000/users/1
```

---

## API Endpoints

| Method | Endpoint      | Mô tả                  | Body                          |
|--------|---------------|------------------------|-------------------------------|
| GET    | /users        | Lấy tất cả users       | —                             |
| GET    | /users/:id    | Lấy 1 user theo id     | —                             |
| POST   | /users        | Tạo user mới           | `{ "name": "", "email": "" }` |
| PUT    | /users/:id    | Cập nhật user theo id  | `{ "name": "", "email": "" }` |
| DELETE | /users/:id    | Xoá user theo id       | —                             |

---

## Các lệnh thường dùng

```bash
# Khởi động (lần đầu hoặc sau khi đổi Dockerfile)
docker-compose up --build

# Khởi động bình thường
docker-compose up

# Chạy ngầm (background)
docker-compose up -d

# Dừng
docker-compose down

# Dừng và xoá toàn bộ data
docker-compose down -v

# Xem log
docker-compose logs api
docker-compose logs db

# Xem trạng thái containers
docker-compose ps
```

---

## Xử lý lỗi thường gặp

**`ECONNREFUSED` khi gọi API**
- Kiểm tra `DB_PORT` trong `.env` phải là `5432`
- Chạy `docker-compose ps` xem container `db` đã `healthy` chưa

**Port bị chiếm**
- Đổi port máy thật trong `docker-compose.yml`: `"5433:5432"` (giữ nguyên `DB_PORT=5432` trong `.env`)

**Volume không xoá được**
```bash
docker rm -f <container_id>
docker volume rm my-api_pgdata
```

**Warning `version` obsolete**
- Xoá dòng `version: '3.8'` ở đầu file `docker-compose.yml`