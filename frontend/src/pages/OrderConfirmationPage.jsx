import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmationPage.css"; // We'll create this CSS file later
import { FaClock, FaStore, FaShoppingBag } from "react-icons/fa";

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { restaurant, cartItems, totalPrice } = location.state || {}; // Get data passed from previous page

    const [dataReady, setDataReady] = useState(false); // New state

    const [deliveryTime, setDeliveryTime] = useState("ASAP");
    const [orderType, setOrderType] = useState("delivery"); // 'delivery' or 'pickup'

    // Sample available time slots (in a real app, this would come from the backend)
    const timeSlots = ["ASAP", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];

    useEffect(() => {
        if (!restaurant || !cartItems || totalPrice === undefined) {
            // If data is missing, navigate away.
            navigate('/');
        } else {
            setDataReady(true); // Mark data as ready for rendering
        }
    }, [restaurant, cartItems, totalPrice, navigate]); // Effect dependencies

    if (!dataReady) {
        // Show loading message or spinner until data is validated and ready
        return <p>Đang tải thông tin đơn hàng...</p>;
    }

    const handleConfirmOrder = () => {
        // Logic to place the order
        console.log("Order confirmed:", {
            restaurant,
            cartItems,
            totalPrice,
            deliveryTime,
            orderType,
        });
        // Navigate to order tracking page (assuming it exists)
        navigate("/orders", { state: { orderJustPlaced: true } });
    };

    return (
        <div className="order-confirmation-page">
            <header className="confirmation-header">
                <h1>Xác nhận đơn hàng</h1>
            </header>

            <div className="order-summary-card">
                <h2>{restaurant.name}</h2>
                <div className="cart-items-summary">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item-entry">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{item.price}</span>
                        </div>
                    ))}
                </div>
                <div className="total-price-summary">
                    <strong>Tổng cộng:</strong>
                    <strong>{totalPrice}</strong>
                </div>
            </div>

            <div className="order-options-card">
                <div className="option-group">
                    <h3><FaClock /> Chọn giờ giao hàng</h3>
                    <select 
                        value={deliveryTime} 
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="time-select"
                    >
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <div className="option-group">
                    <h3><FaShoppingBag /> Hình thức nhận hàng</h3>
                    <div className="order-type-selection">
                        <button 
                            className={`type-button ${
                                orderType === "delivery" ? "active" : ""
                            }`}
                            onClick={() => setOrderType("delivery")}
                        >
                            Giao tận nơi
                        </button>
                        <button 
                            className={`type-button ${
                                orderType === "pickup" ? "active" : ""
                            }`}
                            onClick={() => setOrderType("pickup")}
                        >
                           <FaStore /> Lấy tại quán
                        </button>
                    </div>
                </div>
            </div>

            <div className="confirmation-actions">
                <button className="confirm-button" onClick={handleConfirmOrder}>
                    Xác nhận đặt hàng
                </button>
                <button className="cancel-button" onClick={() => navigate(-1)}>
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage; 