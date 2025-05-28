import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaClock } from "react-icons/fa";
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

    const handleBack = () => {
        navigate(-1);
    };

    const handleOrderSubmit = () => {
        // Process the order
        navigate("/orders", { state: { orderJustPlaced: true } });
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
                    <div className="order-now-header">
                        <div className="clock-icon-container">
                            <FaClock className="clock-icon" />
                        </div>
                        <div className="order-now-info">
                            <h3>Đặt món ngay</h3>
                            <p>Lên món đến nhanh có thể</p>
                        </div>
                    </div>
                    <div className="header-time">Hẹn giờ</div>
                </section>

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
            </div>

            <div className="order-confirmation-footer">
                <button
                    className="submit-order-button"
                    onClick={handleOrderSubmit}
                >
                    Gửi yêu cầu
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
