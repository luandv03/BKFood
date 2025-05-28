import { useEffect, useState } from "react";
import {
    FaBookmark,
    FaChevronLeft,
    FaClock,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaRegBookmark,
    FaShareAlt,
    FaStar,
    FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ExplorePage.css";
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

// Sample restaurant data
const restaurantDetail = {
    id: "1",
    name: "Phở Hà Nội",
    rating: 4.8,
    reviewCount: 128,
    address: "123 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    distance: "0.2",
    openingHours: "7 AM - 9 PM",
    price: "30,000 - 65,000₫",
    hygieneRating: 4.5,
    seatingAvailability: "Tốt",
    imageUrl:
        "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80",
    images: [
        "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80",
        "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
        "https://images.unsplash.com/photo-1576749872435-ff88a71c1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    ],
    isBusy: true,
    about: "Được thành lập vào năm 2010, Phở Hà Nội phục vụ ẩm thực Việt Nam truyền thống cho khách hàng tại Hà Nội. Chuyên môn của chúng tôi là phở bò truyền thống được nấu với nước dùng đậm đà được ninh trong hơn 8 giờ với các loại thảo mộc và gia vị.",
    featuredDishes: [
        {
            id: "1",
            name: "Phở Bò Đặc Biệt",
            price: "65,000₫",
            description:
                "Phở bò đặc biệt với các loại thịt bò cao cấp và nước dùng đậm đà",
            imageUrl:
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            isPopular: true,
        },
        {
            id: "2",
            name: "Bún Chả",
            price: "55,000₫",
            description:
                "Bún chả với thịt lợn nướng than hoa, ăn kèm với bún, rau sống và nước mắm chua ngọt",
            imageUrl:
                "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            isPopular: true,
        },
        {
            id: "3",
            name: "Gỏi Cuốn",
            price: "45,000₫",
            description:
                "Gỏi cuốn tôm thịt, cuốn với rau xanh, giá, bún và ăn với nước mắm pha",
            imageUrl:
                "https://images.unsplash.com/photo-1553701879-4aa576804f65?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        },
    ],
};

const ExplorePage = () => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [selectedQuantities, setSelectedQuantities] = useState({});
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([
        {
            id: 1,
            userName: "Nguyễn Văn A",
            userAvatar: "https://via.placeholder.com/40",
            rating: 5,
            date: "20/05/2025",
            comment: "Món ăn rất ngon, phục vụ nhanh chóng!",
            images: [
                "https://images.unsplash.com/photo-1503764654157-72d979d9af2f",
                "https://images.unsplash.com/photo-1555126634-323283e090fa"
            ]
        },
        {
            id: 2,
            userName: "Trần Thị B",
            userAvatar: "https://via.placeholder.com/40",
            rating: 4,
            date: "19/05/2025",
            comment: "Không gian quán đẹp, đồ ăn tạm ổn."
        }
    ]);

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 200) {
                setIsHeaderVisible(true);
            } else {
                setIsHeaderVisible(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: restaurantDetail.name,
                text: `Ghé thăm ${restaurantDetail.name} tại ${restaurantDetail.address}`,
                url: window.location.href,
            });
        } else {
            alert("Web Share API không được hỗ trợ trong trình duyệt của bạn");
        }
    };

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const handleBack = () => {
        navigate("/");
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleAddToCart = (dish) => {
        const currentQuantity = selectedQuantities[dish.id] || 0;
        setSelectedQuantities({
            ...selectedQuantities,
            [dish.id]: currentQuantity + 1,
        });
        setShowOrderForm(true);
    };

    const handleQuantityChange = (dishId, change) => {
        const currentQuantity = selectedQuantities[dishId] || 0;
        const newQuantity = Math.max(0, currentQuantity + change);

        setSelectedQuantities({
            ...selectedQuantities,
            [dishId]: newQuantity,
        });
    };

    const totalItems = Object.values(selectedQuantities).reduce(
        (sum, qty) => sum + qty,
        0
    );

    const handleReviewSubmit = (newReview) => {
        const reviewToAdd = {
            id: reviews.length + 1,
            userName: "Người dùng",
            userAvatar: "https://via.placeholder.com/40",
            date: new Date().toLocaleDateString('vi-VN'),
            ...newReview
        };
        setReviews([reviewToAdd, ...reviews]);
        setShowReviewForm(false);
    };

    return (
        <div className="explore-page">
            {/* Header Image Carousel */}
            <div className="image-carousel">
                <div
                    className="image-carousel-inner"
                    style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                >
                    {restaurantDetail.images.map((image, index) => (
                        <div key={index} className="carousel-item">
                            <img
                                src={image}
                                alt={`${restaurantDetail.name} - Image ${
                                    index + 1
                                }`}
                            />
                        </div>
                    ))}
                </div>

                <div className="carousel-indicators">
                    {restaurantDetail.images.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${
                                currentImageIndex === index ? "active" : ""
                            }`}
                            onClick={() => handleImageChange(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Back button */}
            <button className="back-button" onClick={handleBack}>
                <FaChevronLeft />
            </button>

            {/* Action buttons */}
            <div className="action-buttons">
                <button className="action-button" onClick={handleBookmark}>
                    {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <button className="action-button" onClick={handleShare}>
                    <FaShareAlt />
                </button>
            </div>

            {/* Fixed header on scroll */}
            <header
                className={`fixed-header ${isHeaderVisible ? "visible" : ""}`}
            >
                <button className="back-button" onClick={handleBack}>
                    <FaChevronLeft />
                </button>
                <h2>{restaurantDetail.name}</h2>
                <div className="header-actions">
                    <button className="action-button" onClick={handleBookmark}>
                        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                </div>
            </header>

            {/* Restaurant info */}
            <div className="content-container">
                <div className="restaurant-detail-info">
                    <h1 className="restaurant-name">{restaurantDetail.name}</h1>

                    <div className="rating-info">
                        <div className="rating">
                            <FaStar className="star-icon" />
                            <span>{restaurantDetail.rating}</span>
                        </div>
                        <span className="divider">•</span>
                        <span className="review-count">
                            {restaurantDetail.reviewCount} đánh giá
                        </span>
                    </div>

                    <div className="address-info">
                        <FaMapMarkerAlt className="icon" />
                        <span>{restaurantDetail.address}</span>
                    </div>

                    <div className="detail-badges">
                        <div className="detail-badge">
                            <FaClock className="icon" />
                            <span>{restaurantDetail.openingHours}</span>
                        </div>

                        <div className="detail-badge">
                            <FaMoneyBillWave className="icon" />
                            <span>{restaurantDetail.price}</span>
                        </div>

                        {restaurantDetail.isBusy && (
                            <div className="detail-badge busy">
                                <FaUsers className="icon" />
                                <span>Đông khách</span>
                            </div>
                        )}
                    </div>

                    <div className="restaurant-about">
                        <h2>Giới thiệu</h2>
                        <p>{restaurantDetail.about}</p>
                    </div>
                </div>

                {/* Restaurant Reviews Section */}
                <div className="restaurant-reviews">
                    <div className="reviews-header">
                        <h2>Đánh giá từ khách hàng</h2>
                        <div className="review-summary">
                            <FaStar className="star-icon" />
                            <span>{restaurantDetail.rating} ({restaurantDetail.reviewCount} đánh giá)</span>
                        </div>
                    </div>
                    
                    <button 
                        className="write-review-btn"
                        onClick={() => setShowReviewForm(true)}
                    >
                        Viết đánh giá
                    </button>

                    {showReviewForm && (
                        <div className="review-form-overlay">
                            <ReviewForm 
                                onSubmit={handleReviewSubmit}
                                onClose={() => setShowReviewForm(false)}
                            />
                        </div>
                    )}

                    <ReviewList reviews={reviews} />
                </div>

                {/* Featured dishes */}
                <div className="featured-dishes">
                    <h2>Món nổi bật</h2>

                    <div className="dish-list">
                        {restaurantDetail.featuredDishes.map((dish) => (
                            <div key={dish.id} className="dish-card">
                                <div className="dish-image-container">
                                    <img
                                        src={dish.imageUrl}
                                        alt={dish.name}
                                        className="dish-image"
                                    />
                                    {dish.isPopular && (
                                        <div className="popular-badge">
                                            Phổ biến
                                        </div>
                                    )}
                                </div>

                                <div className="dish-info">
                                    <h3 className="dish-name">{dish.name}</h3>
                                    <p className="dish-description">
                                        {dish.description}
                                    </p>
                                    <div className="dish-actions">
                                        <span className="dish-price">
                                            {dish.price}
                                        </span>

                                        {selectedQuantities[dish.id] ? (
                                            <div className="quantity-control">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            dish.id,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span className="quantity">
                                                    {
                                                        selectedQuantities[
                                                            dish.id
                                                        ]
                                                    }
                                                </span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            dish.id,
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="add-btn"
                                                onClick={() =>
                                                    handleAddToCart(dish)
                                                }
                                            >
                                                + Thêm
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order floating button */}
                {totalItems > 0 && (
                    <div className="order-button-container">
                        <button
                            className="order-button"
                            onClick={() => setShowOrderForm(true)}
                        >
                            <span className="item-count">{totalItems}</span>
                            <span>Xem giỏ hàng</span>
                            <span className="arrow">→</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Order form modal (simplified) */}
            {showOrderForm && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowOrderForm(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Giỏ hàng của bạn</h2>

                        <div className="cart-items">
                            {restaurantDetail.featuredDishes
                                .filter(
                                    (dish) => selectedQuantities[dish.id] > 0
                                )
                                .map((dish) => (
                                    <div key={dish.id} className="cart-item">
                                        <div className="item-info">
                                            <h4>{dish.name}</h4>
                                            <p className="item-price">
                                                {dish.price}
                                            </p>
                                        </div>

                                        <div className="quantity-control">
                                            <button
                                                className="quantity-btn"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        dish.id,
                                                        -1
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <span className="quantity">
                                                {selectedQuantities[dish.id]}
                                            </span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        dish.id,
                                                        1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="cart-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowOrderForm(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="order-btn"
                                onClick={() => {
                                    setShowOrderForm(false);
                                    navigate("/orders");
                                }}
                            >
                                Đặt hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
