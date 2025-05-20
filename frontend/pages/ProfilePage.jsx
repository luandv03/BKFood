import {
    FaBell,
    FaChevronRight,
    FaCog,
    FaCreditCard,
    FaHeart,
    FaMapMarkerAlt,
    FaQuestionCircle,
} from "react-icons/fa";
import "./ProfilePage.css";

// Sample user data
const userData = {
    name: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    address: "Ký túc xá BKHN, Ngõ 22 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội",
};

// Menu items
const menuItems = [
    {
        id: "payment",
        title: "Phương thức thanh toán",
        icon: <FaCreditCard />,
        color: "#4CAF50",
    },
    {
        id: "addresses",
        title: "Địa chỉ đã lưu",
        icon: <FaMapMarkerAlt />,
        color: "#2196F3",
    },
    {
        id: "favorites",
        title: "Nhà hàng yêu thích",
        icon: <FaHeart />,
        color: "#E91E63",
    },
    {
        id: "notifications",
        title: "Thông báo",
        icon: <FaBell />,
        color: "#FF9800",
    },
    {
        id: "settings",
        title: "Cài đặt",
        icon: <FaCog />,
        color: "#607D8B",
    },
    {
        id: "help",
        title: "Trợ giúp và hỗ trợ",
        icon: <FaQuestionCircle />,
        color: "#9C27B0",
    },
];

const ProfilePage = () => {
    const handleMenuItemPress = (id) => {
        console.log(`Selected menu item: ${id}`);
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="user-info">
                    <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="user-avatar"
                    />
                    <div className="user-details">
                        <h1 className="user-name">{userData.name}</h1>
                        <p className="user-contact">{userData.phone}</p>
                        <p className="user-contact">{userData.email}</p>
                    </div>
                </div>

                <button className="edit-profile-button">Chỉnh sửa</button>
            </div>

            <div className="profile-address">
                <h3>Địa chỉ hiện tại</h3>
                <p>{userData.address}</p>
            </div>

            <div className="menu-section">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="menu-item"
                        onClick={() => handleMenuItemPress(item.id)}
                    >
                        <div
                            className="menu-icon"
                            style={{
                                backgroundColor: `${item.color}20`,
                                color: item.color,
                            }}
                        >
                            {item.icon}
                        </div>
                        <span className="menu-title">{item.title}</span>
                        <FaChevronRight className="menu-arrow" />
                    </div>
                ))}
            </div>

            <div className="logout-section">
                <button className="logout-button">Đăng xuất</button>
            </div>

            <footer className="profile-footer">
                <p>Phiên bản 1.0.0</p>
                <div className="footer-links">
                    <a href="#terms">Điều khoản dịch vụ</a>
                    <span className="footer-divider">•</span>
                    <a href="#privacy">Chính sách bảo mật</a>
                </div>
            </footer>
        </div>
    );
};

export default ProfilePage;
