import { useEffect, useState } from "react";
import {
    FaClock,
    FaFilter,
    FaMoneyBillWave,
    FaRuler,
    FaStar,
    FaTimes,
    FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FoodRecommendation from "../components/FoodRecommendation";
import "./HomePage.css";

// Sample restaurant data
const restaurants = [
    {
        id: "1",
        name: "Phở Hà Nội",
        rating: 4.8,
        address: "123 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        distance: "0.2",
        openingHours: "7 AM - 9 PM",
        price: "30,000 - 65,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80",
        isBusy: true,
    },
    {
        id: "2",
        name: "Bún Chả Hương Liên",
        rating: 4.5,
        address: "24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội",
        distance: "0.5",
        openingHours: "10 AM - 8 PM",
        price: "45,000 - 80,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        isBusy: false,
    },
    {
        id: "3",
        name: "Cơm Tấm Sài Gòn",
        rating: 4.3,
        address: "56 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội",
        distance: "0.4",
        openingHours: "6 AM - 10 PM",
        price: "35,000 - 60,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        isBusy: true,
    },
    {
        id: "4",
        name: "Bánh Mì Pate",
        rating: 4.7,
        address: "35 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội",
        distance: "0.3",
        openingHours: "6 AM - 7 PM",
        price: "25,000 - 40,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1600688640154-9619e002df30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
        isBusy: false,
    },
    {
        id: "5",
        name: "Bún Đậu Mắm Tôm",
        rating: 4.4,
        address: "78 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        distance: "0.6",
        openingHours: "10 AM - 9 PM",
        price: "50,000 - 95,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
        isBusy: true,
    },
];

// Filter option types
const filterOptions = {
    ALL: "Tất cả",
    NEAREST: "Gần nhất",
    HIGHEST_RATED: "Yêu thích nhất",
};

const HomePage = ({ showSuggestion }) => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState(filterOptions.ALL);
    const [showRecommendation, setShowRecommendation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);

    // States for filter options
    const [radiusFilter, setRadiusFilter] = useState("< 1km");
    const [priceFilter, setPriceFilter] = useState("30.000đ - 50.000đ");
    const [ratingFilter, setRatingFilter] = useState("5 sao");

    // States to toggle dropdown visibility
    const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showRatingDropdown, setShowRatingDropdown] = useState(false);

    // Filter options data
    const radiusOptions = ["< 1km", "< 2km", "< 5km", "Không giới hạn"];
    const priceOptions = [
        "< 30.000đ",
        "30.000đ - 50.000đ",
        "50.000đ - 100.000đ",
        "> 100.000đ",
    ];
    const ratingOptions = ["5 sao", "4+ sao", "3+ sao", "Tất cả"];

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
            // Show recommendation after a short delay
            setTimeout(() => setShowRecommendation(true), 500);
        }, 1500);

        // Add scroll listener
        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    // Hàm để đóng tất cả dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterPopup) {
                // Kiểm tra có click vào dropdown hay không
                const isClickOnDropdown =
                    event.target.closest(".dropdown-menu") ||
                    event.target.closest(".filter-option");

                if (!isClickOnDropdown) {
                    setShowRadiusDropdown(false);
                    setShowPriceDropdown(false);
                    setShowRatingDropdown(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilterPopup]);

    // Filter restaurants based on active filter
    const getFilteredRestaurants = () => {
        let filtered = [...restaurants];

        // Apply search filter if query exists
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(
                (restaurant) =>
                    restaurant.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    restaurant.address
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply distance/radius filter
        if (radiusFilter !== "Không giới hạn") {
            const maxDistance = parseFloat(
                radiusFilter.replace("< ", "").replace("km", "")
            );
            filtered = filtered.filter(
                (restaurant) => parseFloat(restaurant.distance) <= maxDistance
            );
        }

        // Apply price filter
        if (priceFilter === "< 30.000đ") {
            filtered = filtered.filter((restaurant) => {
                const minPrice = parseFloat(
                    restaurant.price
                        .split(" - ")[0]
                        .replace(",", "")
                        .replace(".", "")
                );
                return minPrice < 30000;
            });
        } else if (priceFilter === "30.000đ - 50.000đ") {
            filtered = filtered.filter((restaurant) => {
                const prices = restaurant.price.split(" - ");
                const minPrice = parseFloat(
                    prices[0].replace(",", "").replace(".", "")
                );
                const maxPrice = parseFloat(
                    prices[1].replace("₫", "").replace(",", "").replace(".", "")
                );
                return minPrice >= 30000 && maxPrice <= 50000;
            });
        } else if (priceFilter === "50.000đ - 100.000đ") {
            filtered = filtered.filter((restaurant) => {
                const prices = restaurant.price.split(" - ");
                const minPrice = parseFloat(
                    prices[0].replace(",", "").replace(".", "")
                );
                const maxPrice = parseFloat(
                    prices[1].replace("₫", "").replace(",", "").replace(".", "")
                );
                return minPrice >= 50000 && maxPrice <= 100000;
            });
        } else if (priceFilter === "> 100.000đ") {
            filtered = filtered.filter((restaurant) => {
                const maxPrice = parseFloat(
                    restaurant.price
                        .split(" - ")[1]
                        .replace("₫", "")
                        .replace(",", "")
                        .replace(".", "")
                );
                return maxPrice > 100000;
            });
        }

        // Apply rating filter
        if (ratingFilter === "5 sao") {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating === 5.0
            );
        } else if (ratingFilter === "4+ sao") {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating >= 4.0
            );
        } else if (ratingFilter === "3+ sao") {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating >= 3.0
            );
        }

        // Apply additional filters
        switch (activeFilter) {
            case filterOptions.NEAREST:
                filtered.sort(
                    (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
                );
                break;
            case filterOptions.HIGHEST_RATED:
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting can be based on some relevance score or just keep original order
                break;
        }

        return filtered;
    };

    const handleRestaurantPress = (restaurant) => {
        console.log(`Selected restaurant: ${restaurant.name}`);
        // Navigate to the restaurant detail screen
        navigate("/explore");
    };

    const handleRecommendationClose = () => {
        setShowRecommendation(false);

        const alreadyShown = JSON.parse(
            sessionStorage.getItem("foodSuggestionShown")
        );

        if (alreadyShown) {
            sessionStorage.setItem("foodSuggestionShown", false);
        }
    };

    const toggleFilterPopup = () => {
        setShowFilterPopup((prevState) => !prevState);
        // Reset dropdown visibilities when opening/closing popup
        setShowRadiusDropdown(false);
        setShowPriceDropdown(false);
        setShowRatingDropdown(false);
    };

    // Handlers for filter selections
    const handleRadiusSelect = (radius) => {
        setRadiusFilter(radius);
        setShowRadiusDropdown(false);
    };

    const handlePriceSelect = (price) => {
        setPriceFilter(price);
        setShowPriceDropdown(false);
    };

    const handleRatingSelect = (rating) => {
        setRatingFilter(rating);
        setShowRatingDropdown(false);
    };

    // Toggle dropdown visibility
    const toggleRadiusDropdown = () => {
        setShowRadiusDropdown(!showRadiusDropdown);
        setShowPriceDropdown(false);
        setShowRatingDropdown(false);
    };

    const togglePriceDropdown = () => {
        setShowPriceDropdown(!showPriceDropdown);
        setShowRadiusDropdown(false);
        setShowRatingDropdown(false);
    };

    const toggleRatingDropdown = () => {
        setShowRatingDropdown(!showRatingDropdown);
        setShowRadiusDropdown(false);
        setShowPriceDropdown(false);
    };

    const applyFilters = () => {
        // Đóng popup filter sau khi áp dụng
        toggleFilterPopup();
    };

    return (
        <div className="homepage">
            {/* Sticky header */}{" "}
            <header className={`home-header ${isScrolled ? "scrolled" : ""}`}>
                <h1 className="home-title">BK Food</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Phở..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="search-button"
                        onClick={toggleFilterPopup}
                    >
                        <span className="search-icon">
                            <FaFilter />
                            {/* <FaSearch /> */}
                        </span>
                    </button>
                </div>
            </header>
            {/* Filter Popup */}
            {showFilterPopup && (
                <div
                    className="filter-popup-overlay"
                    onClick={toggleFilterPopup}
                >
                    <div
                        className="filter-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="filter-popup-header">
                            <h3>Bộ lọc</h3>
                            <button
                                className="filter-close-button"
                                onClick={toggleFilterPopup}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="filter-section">
                            <h4>Bán kính</h4>
                            <div
                                className="filter-option"
                                onClick={toggleRadiusDropdown}
                            >
                                <span>{radiusFilter}</span>
                                <span className="arrow-icon">▼</span>
                            </div>
                            {showRadiusDropdown && (
                                <div className="dropdown-menu">
                                    {radiusOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={`dropdown-item ${
                                                radiusFilter === option
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRadiusSelect(option)
                                            }
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-section">
                            <h4>Giá cả</h4>
                            <div
                                className="filter-option"
                                onClick={togglePriceDropdown}
                            >
                                <span>{priceFilter}</span>
                                <span className="arrow-icon">▼</span>
                            </div>
                            {showPriceDropdown && (
                                <div className="dropdown-menu">
                                    {priceOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={`dropdown-item ${
                                                priceFilter === option
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handlePriceSelect(option)
                                            }
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-section">
                            <h4>Đánh giá</h4>
                            <div
                                className="filter-option"
                                onClick={toggleRatingDropdown}
                            >
                                <span>{ratingFilter}</span>
                                <span className="arrow-icon">▼</span>
                            </div>
                            {showRatingDropdown && (
                                <div className="dropdown-menu">
                                    {ratingOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={`dropdown-item ${
                                                ratingFilter === option
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRatingSelect(option)
                                            }
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            className="filter-apply-button"
                            onClick={applyFilters}
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
            {/* Main content */}
            <main className="home-content">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                        <p>Đang tải danh sách nhà hàng...</p>
                    </div>
                ) : (
                    <>
                        {" "}
                        {/* Filter options */}
                        <div className="filter-options">
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.ALL
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.ALL)
                                }
                            >
                                {filterOptions.ALL}
                            </button>
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.NEAREST
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.NEAREST)
                                }
                            >
                                {filterOptions.NEAREST}
                            </button>
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.HIGHEST_RATED
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.HIGHEST_RATED)
                                }
                            >
                                {filterOptions.HIGHEST_RATED}
                            </button>
                        </div>
                        {/* Food recommendation popup */}
                        {JSON.parse(
                            sessionStorage.getItem("foodSuggestionShown")
                        ) &&
                            showRecommendation && (
                                <FoodRecommendation
                                    onClose={handleRecommendationClose}
                                />
                            )}
                        {/* Restaurant list */}
                        <div className="home-restaurant-list">
                            {restaurants.map((restaurant) => (
                                <div
                                    key={restaurant.id}
                                    className="home-restaurant-card"
                                    onClick={() =>
                                        handleRestaurantPress(restaurant)
                                    }
                                >
                                    <div className="home-restaurant-image-container">
                                        {" "}
                                        <img
                                            src={restaurant.imageUrl}
                                            className="home-restaurant-image"
                                            alt={restaurant.name}
                                        />
                                        {restaurant.isBusy && (
                                            <div className="busy-badge">
                                                <FaUsers />
                                                <span>Đông</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="home-restaurant-info">
                                        <div className="home-restaurant-header">
                                            <h3 className="home-restaurant-name">
                                                {restaurant.name}
                                            </h3>
                                        </div>
                                        <div className="rating-container">
                                            <span className="rating-text">
                                                {restaurant.rating}
                                            </span>
                                            <FaStar className="star-icon" />
                                        </div>

                                        <p className="home-restaurant-address">
                                            {restaurant.address}
                                        </p>

                                        <div className="home-restaurant-details">
                                            <div className="detail-item">
                                                <FaClock className="detail-icon" />
                                                <span className="detail-text">
                                                    {restaurant.openingHours}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <FaRuler className="detail-icon" />
                                                <span className="detail-text">
                                                    {restaurant.distance} km
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <FaMoneyBillWave className="detail-icon" />
                                                <span className="detail-text">
                                                    {restaurant.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
