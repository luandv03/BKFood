import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FoodRecommendation.css";

/**
 * FoodRecommendation component for web - tương ứng với FoodRecommendation.tsx trong React Native
 */
const FoodRecommendation = ({ onClose }) => {
    const navigate = useNavigate();
    const [animation] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dữ liệu mẫu cho món ăn được gợi ý
    const recommendedFoods = [
        {
            id: 1,
            name: "Cơm tấm",
            imageUrl:
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        },
        {
            id: 2,
            name: "Phở bò",
            imageUrl:
                "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        },
        {
            id: 3,
            name: "Bún chả",
            imageUrl:
                "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        },
    ];
    useEffect(() => {
        // Hẹn giờ tự động đóng sau 10 giây
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handlePrevFood = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? recommendedFoods.length - 1 : prev - 1
        );
    };

    const handleNextFood = () => {
        setCurrentIndex((prev) =>
            prev === recommendedFoods.length - 1 ? 0 : prev + 1
        );
    };

    const currentFood = recommendedFoods[currentIndex];

    return (
        <div className={`food-recommendation ${animation ? "animate-in" : ""}`}>
            <div className="recommendation-container">
                <div className="recommendation-header">
                    <h3>
                        Ăn gì hôm nay?{" "}
                        <span role="img" aria-label="chef">
                            👨‍🍳
                        </span>
                    </h3>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="food-carousel">
                    {/* <button
                        className="carousel-button prev"
                        onClick={handlePrevFood}
                    >
                        <FaChevronLeft />
                    </button> */}

                    <div className="food-images">
                        {recommendedFoods.map((food, index) => (
                            <div
                                key={food.id}
                                className={`food-image-item ${
                                    currentIndex === index ? "active" : ""
                                }`}
                                onClick={() => {
                                    navigate("/", { state: { activeTab: "Recommended" } });
                                    if (onClose) onClose();
                                }}
                            >
                                <img
                                    src={food.imageUrl}
                                    alt={food.name}
                                    className="food-img"
                                />
                            </div>
                        ))}
                    </div>

                    {/* <button
                        className="carousel-button next"
                        onClick={handleNextFood}
                    >
                        <FaChevronRight />
                    </button> */}
                </div>

                <div className="see-more-action">
                    <button
                        className="see-more-button"
                        onClick={() => {
                            navigate("/", { state: { activeTab: "Recommended" } });
                            if (onClose) onClose();
                        }}
                    >
                        Xem thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodRecommendation;
