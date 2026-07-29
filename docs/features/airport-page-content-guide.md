# Airport Page Content Guide

## Mục tiêu trang

Airport page của Tripways là một **flight-route hub có thêm lớp hướng dẫn sân bay vừa đủ**.

Trang cần trả lời nhanh:

1. Đây là sân bay nào và phục vụ thành phố nào?
2. Có thể bay thẳng đi đâu từ sân bay này?
3. Những thành phố nào có chuyến bay thẳng đến sân bay này?
4. Hãng hàng không nào khai thác các route liên quan?
5. Có thể đi đến hoặc rời sân bay bằng cách nào?
6. Người dùng cần biết gì về parking, lounge và một số lưu ý quan trọng?

Trang không thay thế website chính thức của sân bay và không cố trở thành airport directory.

## Tỷ trọng nội dung

- **60–70%:** flight routes, destinations, origins và airlines.
- **20–25%:** airport access, parking và lounges.
- **10–15%:** airport overview, notices và FAQs.

## Thứ tự content sections

```text
Airport hero
→ Direct route explorer
→ Airport essentials
→ Lounges
→ Essential notices
→ Frequently asked questions
→ Related internal links
```

## 1. Airport hero

### Mục đích

Xác nhận ngay identity của sân bay và cho người dùng biết giá trị chính của trang.

### Nội dung

- IATA code.
- Tên đầy đủ của sân bay.
- Thành phố và quốc gia phục vụ.
- ICAO code nếu có giá trị với người dùng.
- Múi giờ.
- Airport type ở mức khái quát.
- Reviewed subheadline.
- Đoạn giới thiệu ngắn từ 2–3 câu.
- Số direct destinations từ sân bay.
- Số direct origins bay đến sân bay.
- Số quốc gia được phục vụ.
- Số hãng hàng không liên quan.
- Shortest/longest route duration khi có dữ liệu.

### Chú ý

- IATA code là visual identity chính.
- Không mở đầu bằng một bài SEO dài.
- Không hiển thị derived count khi chưa có `data_version`.
- Không biến unknown thành `0` nếu dữ liệu thực sự chưa được refresh.
- Không đưa live departures, gates hoặc terminal status vào hero.

## 2. Direct route explorer

### Mục đích

Đây là utility chính của airport page, tương đương phần công cụ trung tâm trên một trang Wise pSEO.

### Direction modes

- **From airport:** các direct destinations từ sân bay.
- **To airport:** các direct origins bay thẳng đến sân bay.

Direction được lưu trong URL:

```text
/airports/suvarnabhumi-bkk?direction=outbound
/airports/suvarnabhumi-bkk?direction=inbound
```

Hai URL filter đều canonical về airport base page.

### Route filters

- Airline.
- Country.
- Maximum flight duration.
- Seasonality.
- Pagination hoặc load more khi cần.

### Route card

- Counterpart city.
- Counterpart airport name.
- Counterpart IATA code.
- Country name/code.
- Airlines khai thác.
- Shortest/longest stored duration.
- Frequency per week khi biết.
- Route count khi có nhiều operators/records.
- Route detail link khi target page đã publish.

### Chú ý

- Results và facets phải được tính từ cùng một filtered relation.
- Outbound dùng `origin_airport_id`; inbound dùng `destination_airport_id`.
- Không hiển thị route từ nguồn không có production/SEO/derived-data rights.
- Không mặc định route là `year_round` khi seasonality chưa biết.
- Không biến missing frequency thành `0`.
- Không mô tả stored schedule như live availability.
- Filter combinations không phải sitemap entries.
- Empty state cần đề nghị người dùng bỏ bớt filter, không kết luận rằng route không tồn tại.

## 3. Airlines

Airline information có thể nằm trong route cards, facets hoặc một summary nhỏ.

### Nội dung

- Airline IATA code.
- Airline name.
- Số direct routes liên quan.
- Các destinations/origins nổi bật.
- Airline business model khi dữ liệu đã được chuẩn hóa.

### Chú ý

- Không cần airline counter, check-in zone hoặc terminal assignment.
- Không khẳng định sân bay là official hub/base nếu không có nguồn xác minh.
- Operating airline là dimension chính; marketing airline chỉ bổ sung khi có ích.

## 4. Airport essentials

Phần này chỉ giữ thông tin giúp người dùng bắt đầu hoặc kết thúc hành trình.

### 4.1 Getting to and from the airport

Mỗi access option có thể gồm:

- Transport type: rail, metro, bus, taxi, ride-hailing hoặc transfer.
- Tên phương án.
- Destination label, ví dụ `Central Bangkok`.
- Summary ngắn.
- Estimated duration range.
- Estimated price range và currency khi có nguồn.
- Operating-hours summary.
- Booking hoặc official link.
- Primary source URL.
- Last verified date.

### Chú ý

- Thời gian và giá chỉ là estimate, phải có nguồn và ngày xác minh.
- Không mô tả từng cửa ra, platform hoặc pickup zone nếu không duy trì được.
- Không tự suy diễn transport availability từ dữ liệu bản đồ.
- Unknown để `NULL`, không chuyển thành false hoặc zero.

### 4.2 Parking

Chỉ cần overview:

- Short-stay availability.
- Long-stay availability.
- Reservation availability.
- Shuttle availability.
- Summary.
- Official/source URL.
- Last verified date.

### Chú ý

- Không lưu bảng giá chi tiết trong MVP.
- Nullable boolean phân biệt `unknown` với `false`.
- Khi không xác minh được, bỏ section hoặc ghi rõ chưa có dữ liệu; không đoán.

## 5. Lounges

### Nội dung

- Lounge name.
- Airside, landside hoặc unknown.
- Location summary ở mức khái quát.
- Access summary.
- Selected amenities:
  - Wi-Fi.
  - Food.
  - Drinks.
  - Showers.
  - Rest area.
  - Work area.
- Official/source URL.
- Last verified date.

### Chú ý

- Không cần gate hoặc terminal map.
- Không khẳng định quyền vào lounge chỉ dựa trên airline; access phụ thuộc ticket, status, card hoặc paid programme.
- Không đưa review chủ quan nếu Tripways chưa có review data riêng.
- Không hiển thị opening hours hoặc price đã cũ.
- Lounge absence không chặn airport page indexability.

## 6. Essential notices

### Mục đích

Hiển thị tối đa 4–8 lưu ý bền vững, có ảnh hưởng thực tế đến trip planning.

### Notice types

- `general`
- `access`
- `connection`
- `airport_confusion`

### Ví dụ phù hợp

- Bangkok có BKK và DMK; cần kiểm tra đúng IATA trước khi đặt ground transport.
- Connection process phụ thuộc airline, ticket và immigration requirements.
- Một transport option không hoạt động cả đêm.
- Sân bay cách xa khu vực trung tâm mà người dùng thường nhầm.

### Chú ý

- Chỉ dùng severity `info` hoặc `important`.
- Không trình bày notice như live operational alert.
- Không đưa visa hoặc immigration advice mang tính khẳng định khi thiếu nguồn chính thức.
- Mỗi notice cần source URL và `last_verified_at`.
- Editorial content phải được review trước khi publish.

## 7. Frequently asked questions

### Câu hỏi ưu tiên

- Where can I fly directly from this airport?
- Which airlines fly from this airport?
- Which cities fly directly to this airport?
- How do I get from the airport to the city?
- Is parking available?
- Which lounges are available?
- Is this the same airport as another airport serving the city?
- Which airport should I use for a specific Bangkok/Singapore journey?

### Chú ý

- Không dùng một FAQ template giống hệt cho mọi sân bay.
- Câu trả lời data-backed phải đọc từ route projection.
- Câu trả lời hybrid kết hợp facts và reviewed editorial.
- Không tự động publish AI-generated answers.
- FAQ schema không bù đắp cho nội dung trang mỏng.

## 8. Related internal links

### Link groups

- Outbound routes.
- Inbound routes.
- Nearby airports.
- Flights from the associated city.
- Flights to the associated city.
- Airlines operating at the airport.
- Other airports in the same country.

### Chú ý

- Chỉ link đến registered, published pages.
- Không tạo stored nearby-airport table ở MVP; có thể tính từ coordinates.
- Airport page và city page không cạnh tranh cùng search intent:
  - City page phục vụ khám phá chuyến bay theo thành phố.
  - Airport page phục vụ flight network và logistics cơ bản của một sân bay.
- Anchor text cần mô tả đúng target, không nhồi từ khóa.

## Content ownership

### Normalized source of truth

Các bảng normalized sở hữu:

- Airport identity.
- City/country identity.
- Airlines.
- Flight routes.
- Flight services.
- Source rights.
- Confidence và freshness.

### pSEO route read model

`pseo_direct_routes` sở hữu projection có version dùng cho:

- Outbound/inbound airport route search.
- City route discovery.
- Route facts.
- Filters và facets.

Không tạo thêm một bản sao `airport_direct_routes`.

### Reviewed airport content

Các bảng airport pSEO sở hữu:

- SEO metadata.
- Intro và summaries.
- Access options.
- Parking overview.
- Lounges.
- Notices.
- FAQs.

Không đưa các nội dung này vào normalized `airports`.

## Source và freshness rules

Mỗi route hoặc reviewed content cần xem xét:

- Source có production rights không?
- Source có cho derived data không?
- Source có cho SEO usage không?
- Record được verify lần cuối khi nào?
- Confidence có đạt publication threshold không?
- Đây có phải development fixture không?

Development fixtures luôn:

```text
is_indexable = false
noindex_reason = development_fixture
```

## Indexability requirements

Airport page chỉ index khi:

- Airport active.
- Có IATA code.
- Page status là `published`.
- Content đã được review.
- Có ít nhất một eligible inbound hoặc outbound direct route.
- Không dùng development-only hoặc SEO-disallowed route source.
- Route data chưa stale.
- Có ít nhất một published, verified access option.

Parking và lounge không bắt buộc để index.

Các `noindex_reason`:

```text
development_fixture
not_published
airport_inactive
missing_iata
no_direct_routes
content_not_reviewed
missing_access_information
source_not_seo_eligible
stale_route_data
```

## Nội dung ngoài scope

Không đưa các nội dung sau vào airport pSEO page ở giai đoạn này:

- Live departures và arrivals.
- Live fares và availability.
- Gates.
- Check-in counters.
- Baggage belts.
- Security wait times.
- Terminal maps.
- Danh bạ nhà hàng/cửa hàng.
- Tình trạng facility theo thời gian thực.
- Hướng dẫn di chuyển chi tiết từng bước bên trong terminal.
- Parking tariff history.
- Lounge reviews hoặc live capacity.
- Automated AI publishing.

## Quality checklist trước khi publish

- Airport identity, IATA và canonical URL đúng.
- Outbound/inbound direction không bị đảo.
- Route facts dùng cùng `data_version`.
- Filter results và facets dùng cùng relation.
- Missing values không bị chuyển thành zero hoặc false.
- Access/lounge/parking content có source và last verified date.
- Notices không giả dạng live alerts.
- FAQs không trùng lặp máy móc giữa các airport.
- Internal links chỉ trỏ đến published targets.
- Filter pages canonical về base airport page.
- Page mobile không horizontal overflow.
- Keyboard focus và labels đầy đủ.
- Metadata phản ánh `is_indexable` và `noindex_reason`.
