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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./ExplorePage.css";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

const ExplorePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams(); // Get restaurant ID from URL

    // State for restaurant data
    const [restaurantDetail, setRestaurantDetail] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [selectedQuantities, setSelectedQuantities] = useState({});
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Load restaurant data from localStorage
    useEffect(() => {
        const fetchRestaurantData = () => {
            // Get restaurantId from URL params or location state
            const restaurantId =
                id || (location.state && location.state.restaurantId) || "1";

            if (!restaurantId) {
                console.error("No restaurant ID provided");
                return;
            }

            // Get restaurants from localStorage
            const storedRestaurants = JSON.parse(
                localStorage.getItem("restaurants")
            );

            if (!storedRestaurants) {
                console.error("No restaurants found in localStorage");
                return;
            }

            // Find the specific restaurant
            const restaurant = storedRestaurants.find(
                (r) => r.id === restaurantId
            );

            if (restaurant) {
                setRestaurantDetail(restaurant);
            } else {
                console.error(`Restaurant with ID ${restaurantId} not found`);
            }
        };

        fetchRestaurantData();
    }, [id, location.state]);

    // Check if we should open review form from return navigation
    useEffect(() => {
        if (location.state && location.state.openReviewForm) {
            setShowReviewForm(true);
            // Clear the state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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

    // If restaurant data is not loaded yet
    if (!restaurantDetail) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Đang tải thông tin nhà hàng...</p>
            </div>
        );
    }

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
            id: restaurantDetail.reviews
                ? restaurantDetail.reviews.length + 1
                : 1,
            userName: "Người dùng",
            userAvatar: "https://via.placeholder.com/40",
            date: new Date().toLocaleDateString("vi-VN"),
            ...newReview,
        };

        // Create new updated restaurant object with added review
        const updatedRestaurant = {
            ...restaurantDetail,
            reviews: [reviewToAdd, ...(restaurantDetail.reviews || [])],
            reviewCount: (restaurantDetail.reviewCount || 0) + 1,
            // Update rating based on new review
            rating: calculateNewRating(
                restaurantDetail.rating,
                restaurantDetail.reviewCount || 0,
                newReview.rating
            ),
        };

        // Update local state
        setRestaurantDetail(updatedRestaurant);

        // Update in localStorage
        updateRestaurantInLocalStorage(updatedRestaurant);

        setShowReviewForm(false);

        // Show success notification
        alert("Đánh giá của bạn đã được gửi thành công!");
    };

    // Function to update restaurant in localStorage
    const updateRestaurantInLocalStorage = (updatedRestaurant) => {
        const storedRestaurants = JSON.parse(
            localStorage.getItem("restaurants")
        );

        if (storedRestaurants) {
            const updatedRestaurants = storedRestaurants.map((restaurant) =>
                restaurant.id === updatedRestaurant.id
                    ? updatedRestaurant
                    : restaurant
            );

            localStorage.setItem(
                "restaurants",
                JSON.stringify(updatedRestaurants)
            );
        }
    };

    // Function to calculate new average rating
    const calculateNewRating = (currentRating, currentCount, newRating) => {
        const totalRating = currentRating * currentCount + newRating;
        const newCount = currentCount + 1;
        const newAverage = totalRating / newCount;
        return parseFloat(newAverage.toFixed(1));
    };

    const handleOrderButtonClick = () => {
        // Calculate the total price
        let totalPrice = 0;
        const cartItems = restaurantDetail.featuredDishes
            .filter((dish) => selectedQuantities[dish.id] > 0)
            .map((dish) => {
                const quantity = selectedQuantities[dish.id];
                const price = parseInt(dish.price.replace(/[^\d]/g, ""));
                const itemTotal = price * quantity;
                totalPrice += itemTotal;

                return {
                    id: dish.id,
                    imageUrl: dish.imageUrl,
                    name: dish.name,
                    price: dish.price,
                    quantity,
                    totalPrice: `${itemTotal.toLocaleString()}₫`,
                };
            });

        // Format the total price with comma separator and currency symbol
        const formattedTotalPrice = `${totalPrice.toLocaleString()}₫`;

        // Navigate to the order confirmation page with the order data
        setShowOrderForm(false);
        navigate("/order-confirmation", {
            state: {
                restaurant: {
                    id: restaurantDetail.id,
                    name: restaurantDetail.name,
                    address: restaurantDetail.address,
                    imageUrl: restaurantDetail.imageUrl,
                },
                cartItems,
                totalPrice: formattedTotalPrice,
            },
        });
    };

    return (
        <div className="explore-page">
            {/* Image carousel */}
            <div className="image-carousel">
                <div
                    className="image-carousel-inner"
                    style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                >
                    {restaurantDetail.images &&
                        restaurantDetail.images.map((image, index) => (
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
                    {restaurantDetail.images &&
                        restaurantDetail.images.map((_, index) => (
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
                        <div
                            className="review-summary"
                            onClick={() =>
                                navigate("/reviews", {
                                    state: {
                                        restaurantId: restaurantDetail.id,
                                        restaurantName: restaurantDetail.name,
                                        rating: restaurantDetail.rating,
                                        reviewCount:
                                            restaurantDetail.reviewCount,
                                        reviews: restaurantDetail.reviews || [],
                                    },
                                })
                            }
                        >
                            <FaStar className="star-icon" />
                            <span>
                                {restaurantDetail.rating} (
                                {restaurantDetail.reviewCount} đánh giá)
                            </span>
                            <span className="see-all">Xem tất cả</span>
                        </div>
                    </div>

                    <button
                        className="write-review-btn"
                        onClick={() => setShowReviewForm(true)}
                    >
                        Viết đánh giá
                    </button>

                    {showReviewForm && (
                        <div
                            className="review-form-overlay"
                            onClick={() => setShowReviewForm(false)}
                        >
                            <div
                                className="review-form-modal"
                                onClick={(e) => e.stopPropagation()}
                                style={{ marginBottom: "80px" }}
                            >
                                <ReviewForm
                                    onSubmit={handleReviewSubmit}
                                    onClose={() => setShowReviewForm(false)}
                                />
                            </div>
                        </div>
                    )}

                    <ReviewList
                        reviews={(restaurantDetail.reviews || []).slice(0, 2)}
                    />
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

            {/* Order form modal */}
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
                                onClick={handleOrderButtonClick}
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
