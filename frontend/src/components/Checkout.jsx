import { useState } from "react";
import { FaCreditCard, FaMoneyBillWave, FaRegCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

/**
 * Checkout component for web - tương ứng với Checkout.tsx trong React Native
 */
const Checkout = ({ items = [], onClose, onSuccess }) => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [address, setAddress] = useState(
        "Ký túc xá BKHN, Ngõ 22 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội"
    );
    const [note, setNote] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Danh sách địa chỉ đã lưu
    const savedAddresses = [
        "Ký túc xá BKHN, Ngõ 22 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội",
        "Trường Đại học Bách Khoa Hà Nội, Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        "Văn phòng HUST, 268 Lý Thường Kiệt, Hai Bà Trưng, Hà Nội",
    ];

    // Danh sách phương thức thanh toán
    const paymentMethods = [
        { id: "cash", name: "Tiền mặt", icon: FaMoneyBillWave },
        { id: "credit", name: "Thẻ tín dụng", icon: FaCreditCard },
        { id: "banking", name: "Chuyển khoản", icon: FaRegCreditCard },
    ];

    // Tính tổng giá trị đơn hàng
    const calculateSubtotal = () => {
        return items.reduce((total, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ""));
            return total + price * item.quantity;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const deliveryFee = 15000;
    const total = subtotal + deliveryFee;

    // Xử lý đặt hàng
    const handlePlaceOrder = () => {
        if (address.trim() === "") {
            alert("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        setIsProcessing(true);

        // Giả lập quá trình đặt hàng
        setTimeout(() => {
            setIsProcessing(false);

            if (onSuccess) {
                onSuccess();
            } else {
                navigate("/orders");
                if (onClose) onClose();
            }
        }, 2000);
    };

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h2>Thanh toán</h2>
                <button className="checkout-close-button" onClick={onClose}>
                    ×
                </button>
            </div>

            <div className="checkout-content">
                <section className="checkout-section">
                    <h3>Địa chỉ giao hàng</h3>
                    <div className="address-selector">
                        <select
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="address-select"
                        >
                            <option value="">
                                -- Chọn địa chỉ giao hàng --
                            </option>
                            {savedAddresses.map((addr, index) => (
                                <option key={index} value={addr}>
                                    {addr}
                                </option>
                            ))}
                        </select>
                        <button className="new-address-button">
                            + Địa chỉ mới
                        </button>
                    </div>
                </section>

                <section className="checkout-section">
                    <h3>Phương thức thanh toán</h3>
                    <div className="payment-methods">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`payment-method ${
                                    paymentMethod === method.id
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setPaymentMethod(method.id)}
                            >
                                <method.icon className="payment-icon" />
                                <span>{method.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="checkout-section">
                    <h3>Ghi chú</h3>
                    <textarea
                        className="checkout-note"
                        placeholder="Ghi chú cho nhà hàng (không bỏ ớt, không hành...)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </section>

                <section className="checkout-section order-summary">
                    <h3>Tóm tắt đơn hàng</h3>
                    <div className="order-items">
                        {items.map((item, index) => (
                            <div key={index} className="order-item">
                                <div className="order-item-name">
                                    <span className="order-quantity">
                                        {item.quantity}x
                                    </span>
                                    <span>{item.name}</span>
                                </div>
                                <span className="order-item-price">
                                    {item.price}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="order-calculations">
                        <div className="calc-row">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="calc-row">
                            <span>Phí giao hàng</span>
                            <span>{deliveryFee.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="calc-row total">
                            <span>Tổng cộng</span>
                            <span>{total.toLocaleString("vi-VN")}₫</span>
                        </div>
                    </div>
                </section>
            </div>

            <div className="checkout-footer">
                <button
                    className="checkout-button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Đang xử lý..." : "Đặt hàng ngay"}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
