# HendyAppStore

> **Kiến trúc Hệ Thống Tích Hợp: Adaptive UI, Serverless Workers & Quy Trình Tự Động Hóa Đồng Bộ Môi Trường**

Hệ thống phân phối ứng dụng đa nền tảng (Android .apk, iOS .ipa OTA, Windows .exe SignTool) với 26 biến bảo mật tập trung, mạng biên Cloudflare Edge Router, backend API mã hóa Libsodium và GitHub Actions Matrix CI/CD.

## 1. Kiến Trúc 4 Tầng

1. **Tầng Điều Hành Admin (`Web-Admin`)**: Form nạp tập trung 26 Secrets & Variables, mã hóa Base64 cho chứng chỉ và theo dõi tiến trình Live Status Sync Logs.
2. **Tầng Mạng Biên Điều Hướng (`Cloudflare Edge Router`)**: Cloudflare DNS Proxy ON, Worker Router bóc tách Hostname & User-Agent để gọi ngầm Web-User Core hoặc Web-Admin Core. Cung cấp dynamic `manifest.plist` cho iOS Safari OTA direct install (`itms-services://`).
3. **Tầng Core API & Đồng Bộ (`Workers/Backend-API`)**: Nhận gói tin 26 biến, mã hóa Libsodium (`crypto_box_seal`), gọi GitHub Secrets & Vars REST API tự động cập nhật và kích hoạt GitHub Actions API.
4. **Tầng Ma Trận Biên Dịch & Xuất Bản (`GitHub Runners & R2`)**:
   - Android: Ký số V2/V3 bằng `apksigner` với `ANDROID_KEYSTORE_BASE64`, vượt rào kiểm duyệt Knox & Play Protect.
   - iOS: Ký số Fastlane Gym với `IOS_CERTIFICATE_P12_BASE64` & `PROVISION_PROFILE_BASE64` chuẩn Enterprise In-House OTA.
   - Windows: Ký số Authenticode SHA256 với `WINDOWS_CERT_PFX_BASE64` qua SignTool, đạt chỉ số tín nhiệm SmartScreen danh sách xanh.
   - Xuất bản lên Cloudflare R2 Storage và Pages Web-User không lỗi.

## 2. Server API Endpoints

- `GET /api/health` — Trạng thái máy chủ và kết nối mạng biên.
- `GET /api/edge-detect` — Nhận diện thiết bị và điều phối layout tự động.
- `GET /api/manifest.plist` — Dynamic XML manifest cho iOS Safari OTA.
- `GET /api/secrets` & `PUT /api/secrets/:id` — Quản trị 26 biến môi trường.
- `POST /api/sync-secrets` — Mã hóa Libsodium và đồng bộ 26 biến sang GitHub Secrets.
- `GET /api/sync-logs` & `POST /api/sync-logs` — Nhật ký kiểm toán thời gian thực.
- `POST /api/matrix/dispatch` & `GET /api/matrix/status` — Kích hoạt và theo dõi ma trận biên dịch multi-OS.
- `POST /api/github/sync` — Tự động đẩy mã nguồn lên GitHub và triển khai Cloudflare Pages.
- `POST /api/self-healing/webhook` — AI Bot tự động phân tích và khắc phục lỗi build.
- `GET /api/d1/tables` — Truy vấn bảng cơ sở dữ liệu Cloudflare D1.

## 3. Khởi Chạy

```bash
# Cài đặt thư viện
npm install

# Chạy máy chủ phát triển
npm run dev

# Đóng gói sản phẩm
npm run build

# Chạy máy chủ production
npm start
```
