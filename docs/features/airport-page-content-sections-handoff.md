# Airport Page — Content Sections Handoff

Tài liệu này dành cho UI/UX Team và Content Team để thống nhất cấu trúc một airport page.

## Tổng thể trang

```text
1. Airport Hero
2. Direct Route Explorer
3. Airlines Overview
4. Getting To and From the Airport
5. Parking
6. Lounges
7. Essential Notices
8. Frequently Asked Questions
9. Related Links
```

## 1. Airport Hero

### Mục đích

Giúp người dùng xác nhận ngay họ đang xem đúng sân bay và hiểu giá trị chính của trang.

### Nội dung

- IATA code.
- Tên đầy đủ của sân bay.
- Thành phố và quốc gia phục vụ.
- Một subheadline mô tả vai trò của sân bay.
- Đoạn giới thiệu ngắn từ 2–3 câu.
- Số điểm đến bay thẳng.
- Số thành phố có chuyến bay thẳng đến sân bay.
- Số quốc gia được phục vụ.
- Số hãng hàng không.
- Khoảng thời lượng chuyến bay nếu có.

### Gợi ý UI/UX

- IATA code là yếu tố visual nổi bật nhất.
- Headline và introduction cần dễ đọc, không tạo cảm giác bài SEO dài.
- Quick facts nên scan được trong vài giây.
- Trên mobile, hero chuyển thành một cột.

### Gợi ý Content

- Viết ngắn, có thông tin cụ thể.
- Không sử dụng các mô tả chung như “world-class airport” nếu không có giá trị thực.
- Không mô tả dữ liệu chuyến bay định kỳ như thông tin live.

## 2. Direct Route Explorer

### Mục đích

Cho phép người dùng khám phá các chuyến bay thẳng liên quan đến sân bay.

Đây là section quan trọng nhất của trang.

### Nội dung

- Chế độ `From airport`.
- Chế độ `To airport`.
- Bộ lọc theo airline.
- Bộ lọc theo country.
- Bộ lọc theo flight duration.
- Bộ lọc theo seasonality khi có dữ liệu.
- Tổng số kết quả.
- Danh sách route cards.
- Empty state khi không có kết quả phù hợp.

### Nội dung mỗi route card

- Thành phố.
- Tên sân bay.
- IATA code.
- Quốc gia.
- Airlines khai thác.
- Thời lượng bay.
- Tần suất hàng tuần khi biết.
- Link đến route detail khi trang đích đã sẵn sàng.

### Gợi ý UI/UX

- Direction switch phải rõ ràng và luôn cho biết người dùng đang xem chiều nào.
- Route cards ưu tiên city, IATA, airline và duration.
- Filters phải hoạt động tốt trên mobile và keyboard.
- Empty state cần cho phép người dùng dễ dàng bỏ filter.

### Gợi ý Content

- Dùng từ “direct” hoặc “nonstop” nhất quán.
- Không dùng “no flights exist” khi chỉ không có kết quả trong dataset hiện tại.
- Không tự suy diễn route hoạt động quanh năm.

## 3. Airlines Overview

### Mục đích

Giúp người dùng hiểu những hãng hàng không chính đang phục vụ sân bay và mạng bay tương ứng.

### Nội dung

- Airline name.
- Airline IATA code.
- Số direct routes liên quan.
- Các destinations hoặc origins nổi bật.
- Airline type khi có dữ liệu phù hợp.

### Gợi ý UI/UX

- Có thể thể hiện dưới dạng compact cards, chips hoặc ranked list.
- Không cần trở thành một directory lớn.
- Nên liên kết với route filters.

### Gợi ý Content

- Không đưa check-in counter, gate hoặc terminal assignment.
- Không gọi một airline là “hub airline” nếu chưa được xác minh.

## 4. Getting To and From the Airport

### Mục đích

Giúp người dùng chọn phương án di chuyển phù hợp giữa sân bay và thành phố.

### Nội dung mỗi phương án

- Loại phương tiện.
- Tên dịch vụ hoặc phương án.
- Điểm đến chính, ví dụ `Central Bangkok`.
- Mô tả ngắn.
- Khoảng thời gian di chuyển.
- Khoảng giá khi có dữ liệu đáng tin cậy.
- Operating-hours summary khi cần.
- Link đặt chỗ hoặc link chính thức nếu có.

### Các loại phương tiện

- Rail.
- Metro.
- Bus.
- Taxi.
- Ride-hailing.
- Private transfer.

### Gợi ý UI/UX

- Cho phép so sánh nhanh giữa các lựa chọn.
- Ưu tiên time, price và suitable-for.
- Không cần airport map hoặc hướng dẫn từng cửa ra.

### Gợi ý Content

- Dùng khoảng thời gian và khoảng giá thay vì một con số tuyệt đối.
- Nêu rõ thông tin có thể thay đổi.
- Không mô tả pickup point chi tiết nếu không có quy trình cập nhật.

## 5. Parking

### Mục đích

Cung cấp thông tin tổng quan cho người dùng muốn đi ô tô đến sân bay.

### Nội dung

- Parking summary.
- Short-stay availability.
- Long-stay availability.
- Khả năng đặt trước.
- Shuttle từ bãi đỗ nếu có.
- Link chính thức.

### Gợi ý UI/UX

- Một card hoặc một block nhỏ là đủ.
- Không cần bảng giá phức tạp.
- Khi dữ liệu chưa rõ, nên ẩn field thay vì hiển thị thông tin không chắc chắn.

### Gợi ý Content

- Không ghi giá parking chi tiết nếu không thể duy trì cập nhật.
- Phân biệt rõ “không có” với “chưa xác minh”.

## 6. Lounges

### Mục đích

Giúp người dùng biết các lounge đáng chú ý và điều kiện vào ở mức khái quát.

### Nội dung mỗi lounge

- Lounge name.
- Airside hoặc landside.
- Location summary.
- Access summary.
- Selected amenities.
- Official link khi có.

### Amenities có thể hiển thị

- Wi-Fi.
- Food.
- Drinks.
- Showers.
- Rest area.
- Work area.

### Gợi ý UI/UX

- Dùng cards hoặc list có thể scan nhanh.
- Amenities phù hợp với chips hoặc icons có label.
- Không cần terminal map.

### Gợi ý Content

- Không đảm bảo quyền vào lounge cho mọi hành khách của một airline.
- Điều kiện vào có thể phụ thuộc ticket, status, card membership hoặc paid access.
- Không viết review chủ quan nếu không có dữ liệu review riêng.

## 7. Essential Notices

### Mục đích

Nêu những thông tin người dùng dễ nhầm hoặc cần chuẩn bị trước hành trình.

### Nội dung phù hợp

- Thành phố có nhiều sân bay.
- Cần xác nhận đúng IATA code.
- Lưu ý về airport transfer.
- Lưu ý chung về connection.
- Một transport option không hoạt động cả đêm.
- Khoảng cách đáng kể giữa sân bay và trung tâm.

### Gợi ý UI/UX

- Dùng màu accent khác với content cards.
- Không thiết kế giống cảnh báo vận hành khẩn cấp.
- Mỗi notice gồm label, title và body ngắn.

### Gợi ý Content

- Chỉ giữ những lưu ý có ảnh hưởng thực tế.
- Không dùng ngôn ngữ gây hoảng sợ.
- Không khẳng định yêu cầu visa hoặc immigration nếu không có nguồn chính thức.
- Tránh nội dung theo thời gian thực.

## 8. Frequently Asked Questions

### Mục đích

Trả lời nhanh các câu hỏi phổ biến không được giải quyết hoàn toàn bởi route explorer và essential cards.

### Câu hỏi ưu tiên

- Tôi có thể bay thẳng đến đâu từ sân bay này?
- Những hãng nào bay từ sân bay này?
- Những thành phố nào có chuyến bay thẳng đến đây?
- Làm thế nào để đi từ sân bay vào thành phố?
- Sân bay có parking không?
- Sân bay có những lounge nào?
- Đây có phải sân bay duy nhất phục vụ thành phố không?
- Sân bay này khác sân bay còn lại trong cùng thành phố như thế nào?

### Gợi ý UI/UX

- Dùng accordion hoặc disclosure list.
- Câu hỏi phải đọc rõ ngay cả khi accordion đang đóng.
- Không nên có quá nhiều câu hỏi.

### Gợi ý Content

- Khoảng 4–8 câu hỏi cho mỗi airport.
- Không dùng cùng một bộ FAQ giống hệt cho mọi sân bay.
- Câu trả lời ngắn, trực tiếp và có thể dẫn người dùng về route explorer.

## 9. Related Links

### Mục đích

Giúp người dùng tiếp tục khám phá mạng bay hoặc chuyển sang các trang liên quan.

### Nhóm link

- Flights from the associated city.
- Flights to the associated city.
- Popular outbound routes.
- Popular inbound routes.
- Nearby airports.
- Other airports in the country.
- Airlines operating at the airport.

### Gợi ý UI/UX

- Chia link theo nhóm có heading rõ ràng.
- Popular links có thể dùng cards; directory links nên dùng compact list.
- Không để section dài hơn phần nội dung chính.

### Gợi ý Content

- Anchor text phải mô tả đúng trang đích.
- Không nhồi từ khóa.
- Không link đến trang chưa publish.

## Nội dung không đưa vào airport page

- Live departures hoặc arrivals.
- Live fares hoặc availability.
- Gate.
- Check-in counter.
- Baggage belt.
- Security wait time.
- Terminal map.
- Danh bạ nhà hàng và cửa hàng.
- Hướng dẫn di chuyển chi tiết bên trong terminal.
- Parking tariff history.
- Lounge review hoặc live capacity.
- Operational alerts theo thời gian thực.

## Checklist bàn giao giữa hai team

### UI/UX Team

- Hierarchy thể hiện route explorer là section quan trọng nhất.
- Outbound/inbound direction rõ ràng.
- Cards và filters responsive.
- Không horizontal overflow trên mobile.
- Controls có labels và keyboard focus.
- Empty states được thiết kế.
- Unknown data không tạo layout hỏng.

### Content Team

- Hero copy ngắn và riêng cho từng sân bay.
- Access, parking và lounge content không vượt quá độ chi tiết có thể duy trì.
- Notices là thông tin bền vững, không phải live alerts.
- FAQ khác nhau theo nhu cầu thực tế của từng airport.
- Không biến unknown thành một khẳng định.
- Tên sân bay, IATA, city và country nhất quán trên toàn trang.
