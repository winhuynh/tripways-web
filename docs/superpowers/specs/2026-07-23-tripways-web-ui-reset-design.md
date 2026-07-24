# Tripways Web UI Reset Design

## Mục tiêu

Xoá toàn bộ giao diện và route nháp của `tripways-web` để frontend có thể được thiết kế lại từ đầu theo hướng production, đồng thời giữ nguyên nền tảng kỹ thuật đã tách theo Clean Architecture.

Sau khi reset, ứng dụng vẫn phải khởi động, type-check, test và build được.

## Phạm vi xoá

- Route nháp `/routes/[from]/[to]`.
- Route nháp `/flights-from/[iata]`.
- Nội dung homepage nháp.
- Component homepage nháp.
- Header, footer và navigation nháp.
- UI primitive chỉ được tạo để phục vụ giao diện nháp và không còn consumer.
- CSS thiết kế và MapLibre presentation styles chỉ phục vụ giao diện nháp.
- Test chỉ kiểm tra component presentation bị xoá.

## Phạm vi giữ lại

- Next.js project, package manager và cấu hình build.
- Root layout tối thiểu.
- Homepage tối thiểu để xác nhận frontend đang hoạt động.
- Global CSS reset tối thiểu.
- Clean Architecture của `route-discovery`:
  - Domain models.
  - Application use cases.
  - Provider interfaces.
  - Infrastructure providers.
  - DTO validation và mapper.
  - Server composition root.
- MapLibre dependency và logic bản đồ không gắn với page nháp.
- Supabase environment contract.
- Unit test cho domain, application và infrastructure.
- Documentation, lint, TypeScript và Vitest configuration.

## Trạng thái frontend sau reset

Ứng dụng chỉ còn route `/`.

Homepage tối thiểu hiển thị:

- Tên `Tripways`.
- Thông báo frontend đã được reset và sẵn sàng cho thiết kế production.

Homepage không chứa header, footer, search form, map, route cards hoặc nội dung pSEO giả.

Các URL nháp cũ trả về `404`:

- `/routes/SGN/SIN`
- `/flights-from/SGN`

## Ranh giới kiến trúc

`src/app` chỉ giữ Next.js shell tối thiểu. Feature `route-discovery` tiếp tục độc lập với presentation page, để sau này có thể được dùng bởi pSEO feature production mà không phải viết lại provider hoặc use case.

Hệ thống pSEO mới chưa được xây trong thay đổi reset này. Nó sẽ là một feature riêng, có domain, use case, provider, DTO và publication rules riêng.

## Kiểm chứng

Sau khi xoá:

1. Tìm import và file mồ côi.
2. Chạy unit tests.
3. Chạy ESLint.
4. Chạy TypeScript check.
5. Chạy production build.
6. Kiểm tra `/` trả `200`.
7. Kiểm tra hai route nháp cũ trả `404`.

## Ngoài phạm vi

- Thay đổi database hoặc Supabase schema.
- Xoá backend.
- Thiết kế UI production mới.
- Xây hệ thống pSEO production.
- Commit, push hoặc deploy.
