import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

/**
 * Cart component for web - tương ứng với Cart.tsx trong React Native
 */
const Cart = ({ items = [], onClose, onCheckout }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(items);

    // Tính tổng giá trị đơn hàng
    const calculateTotal = () => {
        return (
            cartItems
                .reduce((total, item) => {
                    // Chuyển đổi giá từ định dạng "65,000₫" sang số
                    const price = parseInt(item.price.replace(/[^\d]/g, ""));
                    return total + price * item.quantity;
                }, 0)
                .toLocaleString("vi-VN") + "₫"
        );
    };

    // Xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (itemId, change) => {
        setCartItems(
            (prevItems) =>
                prevItems
                    .map((item) => {
                        if (item.id === itemId) {
                            const newQuantity = Math.max(
                                0,
                                item.quantity + change
                            );
                            return { ...item, quantity: newQuantity };
                        }
                        return item;
                    })
                    .filter((item) => item.quantity > 0) // Loại bỏ sản phẩm có số lượng = 0
        );
    };

    // Xử lý thanh toán
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống");
            return;
        }

        if (onCheckout) {
            onCheckout(cartItems);
        } else {
            navigate("/orders");
            if (onClose) onClose();
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2>Giỏ hàng của bạn</h2>
                <button className="cart-close-button" onClick={onClose}>
                    ×
                </button>
            </div>

            {cartItems.length > 0 ? (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-price">{item.price}</p>
                                </div>

                                <div className="quantity-control">
                                    <button
                                        className="quantity-button"
                                        onClick={() =>
                                            handleQuantityChange(item.id, -1)
                                        }
                                    >
                                        -
                                    </button>
                                    <span className="quantity-value">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="quantity-button"
                                        onClick={() =>
                                            handleQuantityChange(item.id, 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-total">
                            <span>Tổng cộng:</span>
                            <span className="total-amount">
                                {calculateTotal()}
                            </span>
                        </div>

                        <div className="cart-actions">
                            <button
                                className="cart-action secondary"
                                onClick={onClose}
                            >
                                Tiếp tục đặt món
                            </button>
                            <button
                                className="cart-action primary"
                                onClick={handleCheckout}
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h3>Giỏ hàng trống</h3>
                    <p>Hãy thêm món ăn vào giỏ hàng của bạn</p>
                    <button className="cart-action primary" onClick={onClose}>
                        Tiếp tục đặt món
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
