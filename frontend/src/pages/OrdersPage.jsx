import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronRight,
    FaMotorcycle,
    FaSpinner,
    FaStore,
    FaGamepad,
} from "react-icons/fa";
import "./OrdersPage.css";

// Dữ liệu đơn hàng mẫu
const orderHistory = [
    {
        id: "OR12345",
        date: "20/05/2025",
        restaurant: "Phở Hà Nội",
        items: [
            { name: "Phở Bò Đặc Biệt", quantity: 1, price: "65,000₫" },
            { name: "Gỏi Cuốn", quantity: 2, price: "45,000₫" },
        ],
        totalAmount: "155,000₫",
        status: "delivered",
        deliveryTime: "13:30 - 14:00",
    },
    {
        id: "OR12346",
        date: "18/05/2025",
        restaurant: "Bún Chả Hương Liên",
        items: [
            { name: "Bún Chả", quantity: 2, price: "55,000₫" },
            { name: "Nem Cua Bể", quantity: 1, price: "35,000₫" },
        ],
        totalAmount: "145,000₫",
        status: "delivered",
        deliveryTime: "12:00 - 12:30",
    },
];

// Đơn hàng đang xử lý
const activeOrder = {
    id: "OR12347",
    date: "20/05/2025",
    restaurant: "Cơm Tấm Sài Gòn",
    items: [
        { name: "Cơm Tấm Sườn Bì Chả", quantity: 1, price: "60,000₫" },
        { name: "Chè Thái", quantity: 1, price: "25,000₫" },
    ],
    totalAmount: "85,000₫",
    status: "processing",
    deliveryTime: "14:30 - 15:00",
    currentStep: 2,
    steps: [
        { id: 1, title: "Đã đặt hàng", time: "13:55", completed: true },
        { id: 2, title: "Đã xác nhận", time: "14:05", completed: true },
        { id: 3, title: "Đang chuẩn bị", time: "", completed: false },
        { id: 4, title: "Đã hoàn thành", time: "", completed: false },
    ],
    estimatedArrival: "14:45",
};

// Thành phần hiển thị trạng thái đơn hàng
const OrderStatus = ({ status }) => {
    const getStatusInfo = () => {
        switch (status) {
            case "processing":
                return { color: "#2196F3", text: "Đang xử lý" };
            case "delivering":
                return { color: "#FF9800", text: "Đang chuẩn bị" };
            case "delivered":
                return { color: "#4CAF50", text: "Đã hoàn thành" };
            case "cancelled":
                return { color: "#F44336", text: "Đã hủy" };
            default:
                return { color: "#757575", text: "Không xác định" };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <span className="order-status" style={{ color: statusInfo.color }}>
            {statusInfo.text}
        </span>
    );
};

const OrdersPage = () => {
    const [activeTab, setActiveTab] = useState("active");
    const navigate = useNavigate();

    const handlePlayGame = () => {
        navigate("/game");
    };

    return (
        <div className="orders-page">
            <header className="orders-header">
                <h1>Đơn hàng của bạn</h1>
            </header>

            <div className="tab-navigation">
                <button
                    className={`tab-button ${
                        activeTab === "active" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("active")}
                >
                    Đang xử lý
                </button>
                <button
                    className={`tab-button ${
                        activeTab === "history" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("history")}
                >
                    Lịch sử
                </button>
            </div>

            <div className="orders-content">
                {activeTab === "active" ? (
                    activeOrder ? (
                        <div className="active-order">
                            <div className="order-tracking-card">
                                <div className="tracking-header">
                                    <div>
                                        <h2>Theo dõi đơn hàng</h2>
                                        <p className="order-id">
                                            Mã đơn: {activeOrder.id}
                                        </p>
                                    </div>
                                    <OrderStatus status={activeOrder.status} />
                                </div>

                                <div className="restaurant-info">
                                    <FaStore className="info-icon" />
                                    <div>
                                        <h3>{activeOrder.restaurant}</h3>
                                        <p>Đơn hàng đang được chuẩn bị</p>
                                    </div>
                                </div>

                                <div className="delivery-time">
                                    <div className="time-info">
                                        <FaCalendarAlt className="info-icon" />
                                        <div>
                                            <h3>
                                                Thời gian hoàn thành dự kiến
                                            </h3>
                                            <p>
                                                {activeOrder.estimatedArrival}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="details-button">
                                        Chi tiết <FaChevronRight />
                                    </button>
                                </div>

                                <div className="tracking-progress">
                                    {activeOrder.steps.map((step, index) => (
                                        <div
                                            key={step.id}
                                            className={`tracking-step ${
                                                step.completed
                                                    ? "completed"
                                                    : ""
                                            }`}
                                        >
                                            <div className="step-icon">
                                                {step.completed ? (
                                                    <FaCheckCircle />
                                                ) : index ===
                                                  activeOrder.currentStep ? (
                                                    <FaSpinner className="spinning" />
                                                ) : (
                                                    <div className="step-dot" />
                                                )}
                                            </div>
                                            <div className="step-content">
                                                <p className="step-title">
                                                    {step.title}
                                                </p>
                                                {step.time && (
                                                    <p className="step-time">
                                                        {step.time}
                                                    </p>
                                                )}
                                            </div>
                                            {index <
                                                activeOrder.steps.length -
                                                    1 && (
                                                <div className="step-line" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="order-summary">
                                    <h3>Tóm tắt đơn hàng</h3>
                                    <div className="order-items">
                                        {activeOrder.items.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="order-item"
                                                >
                                                    <div className="item-detail">
                                                        <span className="item-quantity">
                                                            {item.quantity}x
                                                        </span>
                                                        <span className="item-name">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="item-price">
                                                        {item.price}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="order-total">
                                        <span>Tổng cộng:</span>
                                        <span className="total-amount">
                                            {activeOrder.totalAmount}
                                        </span>
                                    </div>
                                </div>

                                {/* <div className="order-actions">
                                    <button className="secondary-button">
                                        Liên hệ nhà hàng
                                    </button>
                                    <button className="primary-button">
                                        Theo dõi người giao
                                    </button>
                                </div> */}

                                <div className="game-action">
                                    <button
                                        className="game-button"
                                        onClick={handlePlayGame}
                                    >
                                        <FaGamepad /> Chơi game
                                    </button>
                                    <p className="game-info">
                                        Chơi game trong lúc chờ đơn!
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FaMotorcycle className="empty-icon" />
                            <h3>Không có đơn hàng nào đang xử lý</h3>
                            <p>
                                Khi bạn đặt đơn hàng, chúng sẽ xuất hiện ở đây
                            </p>
                            <button className="primary-button">
                                Đặt món ngay
                            </button>
                            <button
                                className="game-button-empty"
                                onClick={handlePlayGame}
                            >
                                <FaGamepad /> Chơi game
                            </button>
                        </div>
                    )
                ) : (
                    <div className="order-history">
                        <h2>Lịch sử đơn hàng</h2>
                        {orderHistory.length > 0 ? (
                            <div className="history-list">
                                {orderHistory.map((order) => (
                                    <div
                                        key={order.id}
                                        className="history-card"
                                    >
                                        <div className="history-header">
                                            <div>
                                                <h3>{order.restaurant}</h3>
                                                <p className="history-date">
                                                    {order.date} •{" "}
                                                    {order.deliveryTime}
                                                </p>
                                            </div>
                                            <OrderStatus
                                                status={order.status}
                                            />
                                        </div>

                                        <div className="history-items">
                                            {order.items.map((item, index) => (
                                                <p
                                                    key={index}
                                                    className="history-item"
                                                >
                                                    {item.quantity}x {item.name}
                                                </p>
                                            ))}
                                        </div>

                                        <div className="history-footer">
                                            <span className="history-total">
                                                Tổng cộng:{" "}
                                                <strong>
                                                    {order.totalAmount}
                                                </strong>
                                            </span>
                                            <button className="text-button">
                                                Đặt lại
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <FaCalendarAlt className="empty-icon" />
                                <h3>Chưa có lịch sử đơn hàng</h3>
                                <p>
                                    Lịch sử đơn hàng của bạn sẽ xuất hiện ở đây
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
