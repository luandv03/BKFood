import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaClock, FaRegClock } from "react-icons/fa";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurant, cartItems, totalPrice } = location.state || {
        restaurant: { name: "Bún Chả 52 Tạ Hiện" },
        cartItems: [
            {
                name: "Bún chả đặc biệt",
                price: "60,000₫",
                quantity: 1,
                totalPrice: "60,000₫",
                imageUrl:
                    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba",
            },
            {
                name: "Bún chả đầy đủ",
                price: "40,000₫",
                quantity: 1,
                totalPrice: "40,000₫",
                imageUrl:
                    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba",
            },
            {
                name: "Bún bò huế",
                price: "60,000₫",
                quantity: 1,
                totalPrice: "60,000₫",
                imageUrl:
                    "https://images.unsplash.com/photo-1553701879-4aa576804f65",
            },
        ],
        totalPrice: "160,000₫",
    };

    // For the delivery option selection
    const [deliveryLocation, setDeliveryLocation] = useState("location");

    // For time scheduling
    const [isScheduled, setIsScheduled] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");

    // For reward points
    const [useRewardPoints, setUseRewardPoints] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);

    // Define constants for reward points calculation
    const maxAvailablePoints = 1000; // Maximum points the user has
    const pointsToMoneyRate = 100; // Conversion rate: 1 point = 100 VND

    // Generate available time slots
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Start from the next 30-minute interval
        let startHour = currentHour;
        let startMinute = currentMinute < 30 ? 30 : 0;
        if (currentMinute >= 30) startHour += 1;

        // Generate slots for the next 6 hours
        for (let h = 0; h < 6; h++) {
            const hour = (startHour + h) % 24;
            for (let m = 0; m < 2; m++) {
                // Skip first slot if starting at :30
                if (h === 0 && m === 0 && startMinute === 30) continue;

                const minute = h === 0 && startMinute === 30 ? 30 : m * 30;
                const timeString = `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`;
                slots.push(timeString);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleBack = () => {
        navigate(-1);
    };

    const handleOrderSubmit = () => {
        // Create new order object
        const newOrder = {
            id: "OR" + Math.floor(Math.random() * 100000),
            date: new Date().toLocaleDateString("vi-VN"),
            restaurant: restaurant,
            items: cartItems,
            totalAmount: totalPrice,
            status: "processing",
            deliveryTime: isScheduled ? selectedTime : "Càng sớm càng tốt",
            currentStep: 1,
            steps: [
                {
                    id: 1,
                    title: "Đã đặt hàng",
                    time: new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    completed: true,
                },
                { id: 2, title: "Đã xác nhận", time: "", completed: false },
                { id: 3, title: "Đang chuẩn bị", time: "", completed: false },
                { id: 4, title: "Đã hoàn thành", time: "", completed: false },
            ],
            estimatedArrival: isScheduled
                ? selectedTime
                : calculateEstimatedTime(),
            deliveryLocation: deliveryLocation,
        };

        // Store in localStorage
        const existingOrders =
            JSON.parse(localStorage.getItem("activeOrders")) || [];
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem("activeOrders", JSON.stringify(updatedOrders));

        // Navigate to orders page
        navigate("/orders", { state: { orderJustPlaced: true } });
    };

    // Calculate estimated arrival time (30-45 min from now)
    const calculateEstimatedTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        return now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Calculate total without additional fees
    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseInt(item.totalPrice.replace(/[^\d]/g, ""));
        return sum + price;
    }, 0);

    // Additional fee
    const additionalFee = 10000;

    // Calculate final total
    const finalTotal = subtotal + additionalFee;

    // Calculate discount from reward points
    const calculatePointsDiscount = () => {
        if (!useRewardPoints || rewardPoints <= 0) return 0;
        const discount = Math.min(rewardPoints * pointsToMoneyRate, finalTotal);
        return discount;
    };

    const pointsDiscount = calculatePointsDiscount();
    const finalTotalAfterDiscount = finalTotal - pointsDiscount;

    return (
        <div className="order-confirmation-page">
            <header className="order-confirmation-header">
                <button className="back-button" onClick={handleBack}>
                    <FaChevronLeft />
                </button>
                <h1>Xác nhận đơn hàng</h1>
            </header>

            <div className="order-confirmation-content">
                {/* Order now section */}
                <section className="order-now-section">
                    <div
                        className="order-now-header"
                        onClick={() => setIsScheduled(false)}
                    >
                        <div className="clock-icon-container">
                            <FaClock
                                className={`clock-icon ${
                                    !isScheduled ? "active" : ""
                                }`}
                            />
                        </div>
                        <div className="order-now-info">
                            <h3>Đặt món ngay</h3>
                            <p>Lên món đến nhanh có thể</p>
                        </div>
                    </div>
                    <div
                        className="header-time"
                        onClick={() => setIsScheduled(true)}
                    >
                        <FaRegClock
                            className={`clock-icon ${
                                isScheduled ? "active" : ""
                            }`}
                        />{" "}
                        Hẹn giờ
                    </div>
                </section>

                {/* Time selection section - shown only when scheduling */}
                {isScheduled && (
                    <section className="time-selection-section">
                        <h3>Chọn thời gian nhận đồ</h3>
                        <div className="time-slots">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    className={`time-slot-btn ${
                                        selectedTime === time ? "selected" : ""
                                    }`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Restaurant and order items section */}
                <section className="restaurant-items-section">
                    <h3>{restaurant.name}</h3>

                    {cartItems.map((item, index) => (
                        <div className="order-item" key={index}>
                            <div className="item-image-container">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="item-image"
                                />
                            </div>
                            <div className="item-details">
                                <div className="item-name-row">
                                    <h4>{item.name}</h4>
                                    {/* <span className="item-price">
                                        {item.price}
                                    </span> */}
                                </div>
                                <div className="item-quantity-row">
                                    <span>Số lượng: {item.quantity}</span>
                                    <span>{item.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Delivery method section */}
                <section className="delivery-method-section">
                    <h3>Hình thức nhận đơn hàng</h3>

                    <div className="delivery-options">
                        <div className="delivery-option">
                            <input
                                type="radio"
                                id="location"
                                name="deliveryMethod"
                                checked={deliveryLocation === "location"}
                                onChange={() => setDeliveryLocation("location")}
                            />
                            <label htmlFor="location">Dùng tại quán</label>
                        </div>

                        <div className="delivery-option">
                            <input
                                type="radio"
                                id="pickup"
                                name="deliveryMethod"
                                checked={deliveryLocation === "pickup"}
                                onChange={() => setDeliveryLocation("pickup")}
                            />
                            <label htmlFor="pickup">Mang đi</label>
                        </div>
                    </div>
                </section>

                {/* Payment details section */}
                <section className="payment-details-section">
                    <h3>Chi tiết thanh toán</h3>

                    <div className="payment-item">
                        <span>Tạm tính ({cartItems.length} món)</span>
                        <span>{subtotal.toLocaleString()}đ</span>
                    </div>

                    <div className="payment-item">
                        <span>Phí áp dụng</span>
                        <span>{additionalFee.toLocaleString()}đ</span>
                    </div>

                    <div className="total-amount">
                        <span>Tổng số tiền</span>
                        <span className="final-price">
                            {finalTotal.toLocaleString()}đ
                        </span>
                    </div>
                </section>

                {/* Reward Points Section */}
                <section className="payment-details-section rewards-section">
                    <div className="rewards-header">
                        <h3>Dùng điểm giảm giá</h3>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={useRewardPoints}
                                onChange={() =>
                                    setUseRewardPoints(!useRewardPoints)
                                }
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {useRewardPoints && (
                        <div className="rewards-content">
                            <div className="points-input-container">
                                <input
                                    type="number"
                                    min="0"
                                    max={maxAvailablePoints}
                                    value={rewardPoints}
                                    onChange={(e) =>
                                        setRewardPoints(
                                            Math.min(
                                                parseInt(e.target.value || 0),
                                                maxAvailablePoints
                                            )
                                        )
                                    }
                                    className="points-input"
                                    placeholder="Nhập số điểm"
                                />
                                <span className="points-available">
                                    /{maxAvailablePoints} điểm
                                </span>
                            </div>

                            <div className="points-info">
                                <p>
                                    1 điểm ={" "}
                                    {pointsToMoneyRate.toLocaleString()}đ
                                </p>
                            </div>

                            {pointsDiscount > 0 && (
                                <div className="discount-applied">
                                    <div className="payment-item discount">
                                        <span>Giảm giá từ điểm</span>
                                        <span>
                                            -{pointsDiscount.toLocaleString()}đ
                                        </span>
                                    </div>
                                    <div className="total-after-discount">
                                        <span>Thành tiền</span>
                                        <span className="final-price">
                                            {finalTotalAfterDiscount.toLocaleString()}
                                            đ
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <div className="order-confirmation-footer">
                <button
                    className="submit-order-button"
                    onClick={handleOrderSubmit}
                    // disabled={isScheduled && !selectedTime}
                >
                    {useRewardPoints && pointsDiscount > 0
                        ? `Thanh toán ${finalTotalAfterDiscount.toLocaleString()}đ`
                        : `Thanh toán ${finalTotal.toLocaleString()}đ`}
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
