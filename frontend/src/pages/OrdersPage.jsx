import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronRight,
    FaMotorcycle,
    FaSpinner,
    FaStore,
    FaGamepad,
    FaEarlybirds,
    FaChessBoard,
    FaBrain,
    FaTimes,
} from "react-icons/fa";
import "./OrdersPage.css";

// Sample history data if none in localStorage
const sampleOrderHistory = [
    {
        id: "OR12345",
        date: "20/05/2025",
        restaurant: { name: "Phở Hà Nội" },
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
        restaurant: { name: "Bún Chả Hương Liên" },
        items: [
            { name: "Bún Chả", quantity: 2, price: "55,000₫" },
            { name: "Nem Cua Bể", quantity: 1, price: "35,000₫" },
        ],
        totalAmount: "145,000₫",
        status: "delivered",
        deliveryTime: "12:00 - 12:30",
    },
];

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
    const [showGameSelection, setShowGameSelection] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const orderStep = location.state?.orderStep;

    // States for orders
    const [activeOrders, setActiveOrders] = useState([]);
    const [historyOrders, setHistoryOrders] = useState([]);

    // Load orders from localStorage whenever we return to this page
    useEffect(() => {
        function loadOrders() {
            // Load active orders
            const storedActiveOrders =
                JSON.parse(localStorage.getItem("activeOrders")) || [];
            setActiveOrders(storedActiveOrders);

            // Load order history
            const storedHistoryOrders =
                JSON.parse(localStorage.getItem("orderHistory")) ||
                sampleOrderHistory;
            setHistoryOrders(storedHistoryOrders);
        }

        // Load orders immediately on component mount
        loadOrders();

        // Add event listener for when the page becomes visible again
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                loadOrders();
            }
        });

        // Cleanup event listener
        return () => {
            document.removeEventListener("visibilitychange", loadOrders);
        };
    }, []);

    // Separate effect for handling new orders
    useEffect(() => {
        if (location.state && location.state.orderJustPlaced) {
            // Clear state to avoid repeated updates
            window.history.replaceState({}, document.title);

            // Reload orders to ensure we have the latest
            const storedActiveOrders =
                JSON.parse(localStorage.getItem("activeOrders")) || [];
            setActiveOrders(storedActiveOrders);

            // Simulate order status updates
            const timer1 = setTimeout(() => {
                updateOrderStatus(storedActiveOrders[0]?.id, 2);
            }, 5000);

            const timer2 = setTimeout(() => {
                updateOrderStatus(storedActiveOrders[0]?.id, 3);
            }, 15000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [location.state]);

    useEffect(() => {
        console.log(location.state);
        if (orderStep && orderStep == 3) {
            handleDoneOrder();
        }
    }, []);

    const handleDoneOrder = () => {
        // Reload orders to ensure we have the latest
        const storedActiveOrders =
            JSON.parse(localStorage.getItem("activeOrders")) || [];
        setActiveOrders(storedActiveOrders);

        updateOrderStatus(storedActiveOrders[0]?.id, 2);

        updateOrderStatus(storedActiveOrders[0]?.id, 3);

        updateOrderStatus(storedActiveOrders[0]?.id, 4);
        // Get the latest active orders from localStorage
    };

    // Function to update order status - fixed to use the latest stored orders
    const updateOrderStatus = (orderId, stepNumber) => {
        if (!orderId) return;

        // Get the latest orders from localStorage
        const latestOrders =
            JSON.parse(localStorage.getItem("activeOrders")) || [];

        const updatedOrders = latestOrders.map((order) => {
            if (order.id === orderId) {
                const updatedSteps = order.steps.map((step) => {
                    if (step.id === stepNumber) {
                        return {
                            ...step,
                            completed: true,
                            time: new Date().toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        };
                    }
                    return step;
                });

                return {
                    ...order,
                    currentStep: stepNumber,
                    steps: updatedSteps,
                };
            }
            return order;
        });

        // Update state and localStorage
        setActiveOrders(updatedOrders);
        localStorage.setItem("activeOrders", JSON.stringify(updatedOrders));
    };

    // Function to complete order and move to history - fixed to use latest data
    const completeOrder = (orderId) => {
        // Get the latest data from localStorage
        const latestActiveOrders =
            JSON.parse(localStorage.getItem("activeOrders")) || [];
        const latestHistoryOrders =
            JSON.parse(localStorage.getItem("orderHistory")) || [];

        const orderToComplete = latestActiveOrders.find(
            (order) => order.id === orderId
        );

        if (orderToComplete) {
            // Update the completed order
            const completedOrder = {
                ...orderToComplete,
                status: "delivered",
                steps: orderToComplete.steps.map((step) => ({
                    ...step,
                    completed: true,
                    time:
                        step.time ||
                        new Date().toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                })),
            };

            // Add to history
            const updatedHistory = [completedOrder, ...latestHistoryOrders];
            setHistoryOrders(updatedHistory);
            localStorage.setItem(
                "orderHistory",
                JSON.stringify(updatedHistory)
            );

            // Remove from active orders
            const updatedActiveOrders = latestActiveOrders.filter(
                (order) => order.id !== orderId
            );
            setActiveOrders(updatedActiveOrders);
            localStorage.setItem(
                "activeOrders",
                JSON.stringify(updatedActiveOrders)
            );
        }
    };

    // Get current active order
    const currentActiveOrder = activeOrders[0];

    // Game-related handlers
    const handlePlayGame = () => {
        setShowGameSelection(true);
    };

    const handleGameSelect = (gameType) => {
        setSelectedGame(gameType);
    };

    const handleStartGame = () => {
        if (selectedGame) {
            navigate(`/game?game=${selectedGame}`);
        }
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
                    currentActiveOrder ? (
                        <div className="active-order">
                            <div className="order-tracking-card">
                                <div className="tracking-header">
                                    <div>
                                        <h2>Theo dõi đơn hàng</h2>
                                        <p className="order-id">
                                            Mã đơn: {currentActiveOrder.id}
                                        </p>
                                    </div>
                                    <OrderStatus
                                        status={currentActiveOrder.status}
                                    />
                                </div>

                                <div className="restaurant-info">
                                    <FaStore className="info-icon" />
                                    <div>
                                        <h3>
                                            {currentActiveOrder.restaurant.name}
                                        </h3>
                                        <p>
                                            {currentActiveOrder.deliveryLocation ===
                                            "location"
                                                ? "Đơn hàng sẽ được phục vụ tại quán"
                                                : "Đơn hàng sẽ được chuẩn bị để mang đi"}
                                        </p>
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
                                                {
                                                    currentActiveOrder.estimatedArrival
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <button className="details-button">
                                        Chi tiết <FaChevronRight />
                                    </button>
                                </div>

                                <div className="tracking-progress">
                                    {currentActiveOrder.steps.map(
                                        (step, index) => (
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
                                                      currentActiveOrder.currentStep ? (
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
                                                    currentActiveOrder.steps
                                                        .length -
                                                        1 && (
                                                    <div className="step-line" />
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="order-summary">
                                    <h3>Tóm tắt đơn hàng</h3>
                                    <div className="order-items">
                                        {currentActiveOrder.items.map(
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
                                            {currentActiveOrder.totalAmount}
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

                                {currentActiveOrder.currentStep === 3 && (
                                    <div className="order-actions">
                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                completeOrder(
                                                    currentActiveOrder.id
                                                )
                                            }
                                        >
                                            Đã nhận đơn
                                        </button>
                                    </div>
                                )}

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
                            <button
                                className="primary-button"
                                onClick={() => navigate("/")}
                            >
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
                        {historyOrders.length > 0 ? (
                            <div className="history-list">
                                {historyOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="history-card"
                                    >
                                        <div className="history-header">
                                            <div>
                                                <h3>{order.restaurant.name}</h3>
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

            {/* Game Selection Popup */}
            {showGameSelection && (
                <div className="game-selection-popup">
                    <div className="game-selection-content">
                        <div className="game-selection-header">
                            <h2>Chọn trò chơi</h2>
                            <button
                                className="game-selection-close"
                                onClick={() => setShowGameSelection(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="game-options">
                            <div
                                className={`game-option ${
                                    selectedGame === "flappybird"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => handleGameSelect("flappybird")}
                            >
                                <div className="game-icon">
                                    <FaEarlybirds />
                                </div>
                                <div className="game-title">Flappy Bird</div>
                                <div className="game-description">
                                    Bay qua các ống và ghi điểm
                                </div>
                            </div>

                            <div
                                className={`game-option ${
                                    selectedGame === "2048" ? "selected" : ""
                                }`}
                                onClick={() => handleGameSelect("2048")}
                            >
                                <div className="game-icon">
                                    <FaChessBoard />
                                </div>
                                <div className="game-title">2048</div>
                                <div className="game-description">
                                    Ghép các ô số để đạt được 2048
                                </div>
                            </div>

                            <div
                                className={`game-option ${
                                    selectedGame === "memory" ? "selected" : ""
                                }`}
                                onClick={() => handleGameSelect("memory")}
                            >
                                <div className="game-icon">
                                    <FaBrain />
                                </div>
                                <div className="game-title">
                                    Trò Chơi Trí Nhớ
                                </div>
                                <div className="game-description">
                                    Lật thẻ và tìm các cặp giống nhau
                                </div>
                            </div>
                        </div>

                        <div className="game-selection-footer">
                            <button
                                className="start-game-btn"
                                onClick={handleStartGame}
                                disabled={!selectedGame}
                            >
                                Bắt đầu chơi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
