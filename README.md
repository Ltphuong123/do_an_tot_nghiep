# Hướng dẫn cài đặt hệ thống EChinese

## Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn
- Git
- Android Studio (cho Mobile App)
- Expo CLI: `npm install -g expo-cli`

---

## 1. Cài đặt Admin Web

```bash
# Di chuyển vào thư mục
cd EChinese_AdminWeb_FE

# Cài đặt dependencies
npm install

# Cấu hình môi trường
# Tạo file .env với nội dung:
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=false

# Chạy ứng dụng
npm run dev
```

Truy cập: `http://localhost:5173`

---

## 2. Cài đặt Mobile App

```bash
# Di chuyển vào thư mục
cd ChineseApp

# Cài đặt dependencies
npm install

# Cấu hình môi trường
# Tạo file .env với nội dung:
API_URL=https://echinese-server-1.onrender.com/api
WEB_CLIENT_ID=<your-google-client-id>

# Chạy ứng dụng
npx expo start
```

Quét mã QR bằng Expo Go (iOS/Android) hoặc nhấn `a` để mở Android Emulator.

---

## 3. Cài đặt Server (Backend)

```bash
# Di chuyển vào thư mục
cd EChinese_Server

# Cài đặt dependencies
npm install

# Cấu hình môi trường (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/echinese
JWT_SECRET=your-jwt-secret
PORT=5000

# Chạy server
npm run dev
```

Server chạy tại: `http://localhost:5000`

---

## Lưu ý

- Đảm bảo PostgreSQL đã được cài đặt và chạy trước khi khởi động Server
- Cập nhật `API_URL` trong Mobile App và `VITE_API_BASE_URL` trong Admin Web để trỏ đến Server
- Đối với Google Sign-In, cần cấu hình OAuth 2.0 trên Google Cloud Console
