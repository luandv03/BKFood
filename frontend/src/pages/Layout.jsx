import {
    FaCompass,
    FaEllipsisH,
    FaHome,
    FaShoppingBag,
    FaUser,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="App">
            <div className="main-content">
                <Outlet />
            </div>

            <nav className="main-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                    end
                >
                    <FaHome className="nav-icon" />
                    <span>Trang chủ</span>
                </NavLink>

                <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    <FaCompass className="nav-icon" />
                    <span>Khám phá</span>
                </NavLink>

                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    <FaShoppingBag className="nav-icon" />
                    <span>Đơn hàng</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    <FaUser className="nav-icon" />
                    <span>Cá nhân</span>
                </NavLink>

                <NavLink
                    to="/more"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    <FaEllipsisH className="nav-icon" />
                    <span>Thêm</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Layout;
