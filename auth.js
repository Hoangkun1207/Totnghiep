/**
 * ============================================================================
 * MODULE: QUẢN LÝ XÁC THỰC & BẢO MẬT (AUTHENTICATION)
 * ============================================================================
 */

class AuthManager {
    constructor() {
        // Tên key lưu trữ trong trình duyệt
        this.tokenKey = 'sms_auth_token';
        this.userKey = 'sms_user_info';
    }

    // 1. Hàm Đăng Nhập
    login(username, password) {
        // Mô phỏng gọi API Backend kiểm tra tài khoản
        if (username === 'admin' && password === '123456') {
            // Giả lập mã Token JWT mã hóa
            const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_' + Date.now();
            
            // Thông tin người dùng
            const userInfo = {
                username: 'admin',
                role: 'System Admin',
                name: 'Quản Trị Viên'
            };

            // Lưu vào LocalStorage
            localStorage.setItem(this.tokenKey, fakeToken);
            localStorage.setItem(this.userKey, JSON.stringify(userInfo));

            return true; // Đăng nhập thành công
        }
        return false; // Sai thông tin
    }

    // 2. Hàm Đăng Xuất
    logout() {
        // Xóa sạch Token và thông tin
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        
        // Đá văng về trang đăng nhập
        window.location.replace('login.html');
    }

    // 3. Hàm Kiểm tra quyền truy cập (Middleware Route Protection)
    checkAuth(isLoginPage = false) {
        const token = localStorage.getItem(this.tokenKey);

        if (!token && !isLoginPage) {
            // Trường hợp 1: Chưa đăng nhập mà cố tình vào trang index.html
            console.warn("Truy cập trái phép! Chuyển hướng về trang đăng nhập.");
            window.location.replace('login.html');
        } else if (token && isLoginPage) {
            // Trường hợp 2: Đã đăng nhập rồi mà cố tình quay lại trang login.html
            window.location.replace('index.html');
        }
    }

    // 4. Lấy thông tin user hiện tại
    getCurrentUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Khởi tạo instance toàn cục
const appAuth = new AuthManager();
