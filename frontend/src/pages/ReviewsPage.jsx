import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaStar } from "react-icons/fa";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import "./ReviewsPage.css";

const ReviewsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        restaurantName,
        rating,
        reviewCount,
        reviews: initialReviews,
    } = location.state || {
        restaurantName: "Bún Chả 52 Tạ Hiện",
        rating: 4.95,
        reviewCount: 22,
        reviews: [],
    };

    const [activeTab, setActiveTab] = useState("recent");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState(initialReviews || []);

    const handleBack = () => {
        // Pass the updated reviews back to the previous page
        navigate(-1, {
            state: {
                updatedReviews: reviews,
            },
        });
    };

    const handleWriteReview = () => {
        setShowReviewForm(true);
    };

    const handleReviewSubmit = (newReview) => {
        const reviewToAdd = {
            id: reviews.length + 1,
            userName: "Người dùng",
            userAvatar: "https://via.placeholder.com/40",
            date: new Date().toLocaleDateString("vi-VN"),
            ...newReview,
        };

        const updatedReviews = [reviewToAdd, ...reviews];
        setReviews(updatedReviews);
        setShowReviewForm(false);

        // Show success notification
        alert("Đánh giá của bạn đã được gửi thành công!");
    };

    // Filter reviews based on active tab
    const filteredReviews = () => {
        if (activeTab === "recent") {
            // Sort by date, newest first
            return [...reviews].sort((a, b) => {
                const dateA = new Date(a.date.split("/").reverse().join("-"));
                const dateB = new Date(b.date.split("/").reverse().join("-"));
                return dateB - dateA;
            });
        } else {
            // Sort by rating, highest first
            return [...reviews].sort((a, b) => b.rating - a.rating);
        }
    };

    return (
        <div className="reviews-page">
            <header className="reviews-header">
                <button className="back-button" onClick={handleBack}>
                    <FaChevronLeft />
                </button>
                <h1>{restaurantName}</h1>
            </header>

            <div className="rating-summary">
                <div className="rating-stars">
                    <span className="rating-value">{rating}</span>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className="star"
                                color={
                                    i < Math.floor(rating)
                                        ? "#FF8C00"
                                        : "#e4e5e9"
                                }
                            />
                        ))}
                    </div>
                </div>
                <span className="review-count">{reviewCount} reviews</span>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab-button ${
                        activeTab === "recent" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("recent")}
                >
                    Lọc theo ngày
                </button>
                <button
                    className={`tab-button ${
                        activeTab === "rated" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("rated")}
                >
                    Lọc theo đánh giá
                </button>
            </div>

            <div className="write-review-container">
                <button
                    className="write-review-button"
                    onClick={handleWriteReview}
                >
                    Viết đánh giá
                </button>
            </div>

            {showReviewForm && (
                <div
                    className="review-form-overlay"
                    onClick={() => setShowReviewForm(false)}
                >
                    <div
                        className="review-form-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ReviewForm
                            onSubmit={handleReviewSubmit}
                            onClose={() => setShowReviewForm(false)}
                        />
                    </div>
                </div>
            )}

            {reviews && reviews.length > 0 ? (
                <ReviewList reviews={filteredReviews()} />
            ) : (
                <div className="no-reviews">
                    <p>Không có đánh giá nào</p>
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
