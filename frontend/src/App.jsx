import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

// Pages
import ExplorePage from "./pages/ExplorePage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import MorePage from "./pages/MorePage";
import NotFoundPage from "./pages/NotFoundPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import GamePage from "./pages/GamePage";
import ReviewsPage from "./pages/ReviewsPage";

function App() {
    useEffect(() => {
        const alreadyShown = JSON.parse(
            sessionStorage.getItem("foodSuggestionShown")
        );

        if (!alreadyShown) {
            sessionStorage.setItem("foodSuggestionShown", true);
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="explore" element={<ExplorePage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="more" element={<MorePage />} />
                    <Route
                        path="order-confirmation"
                        element={<OrderConfirmationPage />}
                    />
                    <Route path="game" element={<GamePage />} />
                    <Route path="reviews" element={<ReviewsPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
