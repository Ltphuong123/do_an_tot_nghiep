

Toàn bộ sơ đồ có xuất hiện chữ phải là tiếng Việt, trừ các từ chuyên ngành không dịch được như: login, logout, API, database, server, client, admin, user, manager, v.v. xuất hiện tại sequence diagram(ví dụ như LoginPage, LoginController....), class diagram, 
- Không sử dụng bullet cho tên của các mục trong một kịch bản như tiền điều kiện, hậu điều kiện, luồng chính, luồng ngoại lệ. Chỉ sử dụng bullet cho các mục con bên trong các mục đó nếu có.

- Triển khai chi tiết use case:
Mỗi phần use case đều cần có các phần: 
1. Sơ đồ 


- Triển khai use case cho chức năng nào thì phải đọc code của chức năng đó(trong pages/) trước để hiểu rõ luồng nghiệp vụ. Lưu ý: Việc đọc code không phải để mô tả chi tiết code, hàm, biến trong use case mà chỉ để hiểu rõ nghiệp vụ, luồng xử lý của chức năng đó mà thôi, tuyệt đối không nhắc tên file, hàm, biến trong use case.
- Tuyệt đối không bịa ra use case khi chưa hiểu rõ nghiệp vụ.
- Sơ đồ tuần tự (Sequence diagram): Trình bày theo kiểu actor -> ...Page -> ...Controller -> Database(ở đây phải là tên rõ ràng cho đối tượng, ví dụ như User, Post, Comment). Có thể có nhiều Page, Controller và Database trong một sequence nếu nó liên quan đến nghiệp vụ. Cần đánh số các bước trong sequence để dễ theo dõi.

Các sơ đồ nên code để vẽ không bị kéo dài và hẹp theo chiều dọc quá nhiều, không nên vượt quá một trang A4, cần tối ưu để dễ nhìn, dễ đọc, mở rộng theo chiều ngang. Không nên xuất hiện câu lệnh sql trong sơ đồ tuần tự, chỉ mô tả logic nghiệp vụ bằng ngôn ngữ kỹ thuật.

Ngôn ngữ & thuật ngữ

Mô tả, kịch bản: dùng tiếng Việt, câu tự nhiên, không dài dòng, kỹ thuật vừa đủ.
Tên màn hình, thành phần kỹ thuật trong sơ đồ: dùng tiếng Anh dạng LoginPage, CommunityPage, AuthController, ModerationSystem, Users....
Cấu trúc kịch bản use case

Có các mục: Tên use case, Tác nhân, Mô tả, Tiền điều kiện, Luồng sự kiện chính, Luồng sự kiện phụ (nếu có), Hậu điều kiện, Ngoại lệ.
Luồng chính đánh số 1, 2, 3…; ngoại lệ dùng 3.1, 3.2… tương ứng bước.
Không dùng bullet cho tiêu đề mục, chỉ dùng bullet (hoặc xuống dòng) cho nội dung bên trong nếu cần. luòng sự kiện phụ được đánh số riêng biệt (1, 2, 3…) bên trong mục luồng sự kiện phụ và chỉ phát sinh khi có luồng chính liên quan và có hành động cụ thể.
Activity diagram:ba
Diễn tả theo ngôn ngữ nghiệp vụ súc tích, không liệt kê chi tiết field, SQL.
Mở rộng theo chiều ngang, hạn chế quá dài theo chiều dọc, dùng if/while/fork hợp lý.

Sequence diagram:
Thứ tự lifeline: actor (Client/Admin) → ...Page → ...Controller / ... Servicee(nên dùng controller) → thành phần đực biệt khác nếu có → database (Users, Posts, Comments…).
Tên message mô tả hành động rõ ràng, ngắn gọn (ví dụ: “Gửi dữ liệu bài viết mới”, “Kiểm tra thông tin bắt buộc”).
Sử dụng alt cho nhánh điều kiện (hợp lệ/không hợp lệ, vi phạm/không vi phạm).
Không nhắc chi tiết code, hàm cụ thể; chỉ nói hành vi (lưu, kiểm tra, cập nhật, ẩn/gỡ).
Giữ title dạng UC - Tên use case để dễ tra cứu.

Đây là kịch bản mẫu, nên làm theo cấu trúc tương tự:
Tên use case: Đăng nhập
Tác nhân: Client, Admin, Super Admin
Mô tả: Tác nhân xác thực tài khoản để truy cập hệ thống và sử dụng các chức năng tương ứng với vai trò.
Tiền điều kiện: Tác nhân đã có tài khoản hợp lệ trong hệ thống và không bị khóa.
Luồng sự kiện chính:
1.	Hệ thống hiển thị màn hình đăng nhập với form nhập tên đăng nhập và mật khẩu.
2.	Tác nhân nhập tên đăng nhập, mật khẩu và nhấn nút "Đăng nhập".
3.	Hệ thống kiểm tra thông tin đăng nhập (định dạng, tồn tại tài khoản, khớp mật khẩu, trạng thái tài khoản).
4.	Nếu thông tin hợp lệ, hệ thống ghi nhận lần đăng nhập mới, tạo phiên đăng nhập và lưu thông tin phiên làm việc.
5.	Hệ thống chuyển hướng tác nhân tới màn hình chính phù hợp với vai trò (ví dụ: trang quản trị cho Admin/Super Admin).
Luồng sự kiện phụ:
•	Trường hợp đây là lần đăng nhập đầu tiên của tác nhân:
1.	Hệ thống chuyển hướng tới trang hồ sơ cá nhân sau khi đăng nhập thành công.
2.	Hệ thống yêu cầu tác nhân nhập một địa chỉ email hợp lệ vào trường email (bắt buộc), sau đó lưu lại.
3.	Sau khi lưu thành công email, hệ thống cho phép tác nhân tiếp tục sử dụng các chức năng khác (email này sẽ được dùng cho luồng quên mật khẩu sau này).
Hậu điều kiện: Nếu thành công, tác nhân được đăng nhập vào hệ thống, phiên đăng nhập được ghi nhận; với lần đăng nhập đầu tiên, hồ sơ cá nhân đã được bổ sung email phục vụ đặt lại mật khẩu.
Ngoại lệ:
3.1. Tên đăng nhập hoặc mật khẩu không đúng: Hệ thống hiển thị thông báo lỗi và yêu cầu nhập lại.
3.2. Tài khoản bị khóa hoặc không hoạt động: Hệ thống hiển thị thông báo tài khoản bị khóa/không thể đăng nhập.
4.1. Lỗi hệ thống hoặc lỗi kết nối: Hệ thống hiển thị thông báo lỗi chung và đề nghị thử lại sau.
Luồng phụ – email:
2.1. Email nhập không hợp lệ: Hệ thống hiển thị lỗi tại trường email và yêu cầu nhập lại.
2.2. Lỗi khi lưu email: Hệ thống hiển thị thông báo lỗi chung và yêu cầu tác nhân thử lưu lại.


Viết activity diagram tương tự phong cách sau(mở rộng theo chiều ngang, không nên quá dài theo chiều dọc):
@startuml
title Activity Diagram - UC-TIP-01\nThêm/Sửa/Xóa/Ghim mẹo

skinparam backgroundColor white
skinparam activityBorderColor #3A7A6
skinparam activityBackgroundColor #E8F4F8
skinparam partitionBorderColor #3A7A6
skinparam partitionBackgroundColor #FFFFFF

start

:Tác nhân truy cập màn hình "Quản lý mẹo";
:Hệ thống tải và hiển thị danh sách mẹo;

while (Tác nhân còn ở lại trang?) is (Có)
    if (Nhấn "Tạo mẹo mới"?) then (Tạo mới)
        :Hiển thị form tạo mẹo trống;
        :Tác nhân nhập thông tin và nhấn "Lưu";
        if (Dữ liệu hợp lệ?) then (Có)
            :Hệ thống tạo bản ghi mẹo mới;
            :Hiển thị thông báo thành công;
        else (Không)
            :Hiển thị thông báo lỗi;
        endif

    elseif (Nhấn "Tải lên hàng loạt"?) then (Tải lên hàng loạt)
        :Hiển thị giao diện chọn file;
        if (File được chọn hợp lệ?) then (Có)
            :Hệ thống xử lý file và tạo mới các mẹo;
            :Hiển thị báo cáo kết quả;
        else (Không)
            :Hiển thị lỗi về định dạng/cấu trúc file;
        endif

    elseif (Chọn một mẹo đã có?) then (Hành động trên mẹo đã chọn)
        switch (Hành động được chọn?)
        case (Chỉnh sửa)
            :Hiển thị form với dữ liệu hiện tại của mẹo;
            :Tác nhân cập nhật và nhấn "Lưu";
            if (Dữ liệu hợp lệ?) then (Có)
                :Hệ thống cập nhật bản ghi mẹo;
                :Hiển thị thông báo thành công;
            else (Không)
                :Hiển thị thông báo lỗi;
            endif

        case (Xóa)
            :Hiển thị hộp thoại xác nhận xóa;
            if (Tác nhân xác nhận?) then (Có)
                :Hệ thống xóa bản ghi mẹo;
                :Hiển thị thông báo thành công;
            endif

        case (Ghim / Bỏ ghim)
            :Hệ thống đảo ngược trạng thái ghim của mẹo;
            :Hiển thị thông báo thành công;
        endswitch
    
    else (Rời khỏi trang)
      break
    endif

    :Cập nhật lại danh sách mẹo trên giao diện;
endwhile (Không)

stop
@enduml

mẫu phong cách code vẽ cho sequence diagram:
@startuml
title UC - Đăng nhập

actor Client
participant LoginPage
participant AuthController
database Users
database UserSessions

Client -> LoginPage: 1. Mở LoginPage
Client -> LoginPage: 2. Nhập username, password\nvà nhấn "Đăng nhập"

LoginPage -> AuthController: 3. Gửi yêu cầu đăng nhập\n(username, password)

AuthController -> Users: 4.1. Tìm tài khoản theo username
Users --> AuthController: 4.2. Trả thông tin tài khoản

AuthController -> AuthController: 4.3. Kiểm tra mật khẩu,\ntrạng thái, vai trò

alt Đăng nhập hợp lệ
    AuthController -> UserSessions: 5.1. Tạo bản ghi phiên đăng nhập\n(login_at, device, ip_address)
    UserSessions --> AuthController: 5.2. Xác nhận

    AuthController -> Users: 5.3. Cập nhật last_login
    Users --> AuthController: 5.4. Xác nhận

    alt Lần đăng nhập đầu tiên
        AuthController --> LoginPage: 6.1. Trả kết quả đăng nhập thành công\nvà yêu cầu chuyển đến ProfilePage
        LoginPage --> Client: 6.2. Điều hướng tới ProfilePage

        Client -> ProfilePage: 7. Nhập email và nhấn "Lưu"
        ProfilePage -> AuthController: 8. Gửi yêu cầu cập nhật email
        AuthController -> Users: 9. Cập nhật email cho tài khoản
        Users --> AuthController: 10. Xác nhận
        AuthController --> ProfilePage: 11. Thông báo lưu thành công
        ProfilePage --> Client: 12. Cho phép tiếp tục sử dụng hệ thống
    else Không phải lần đầu
        AuthController --> LoginPage: 6.3. Trả kết quả đăng nhập thành công
        LoginPage --> Client: 6.4. Điều hướng tới trang chính\n(Dashboard hoặc trang phù hợp)
    end
else Đăng nhập thất bại
    AuthController --> LoginPage: 3.1. Trả thông báo lỗi đăng nhập
    LoginPage --> Client: 3.2. Hiển thị lỗi trên form
end

@enduml