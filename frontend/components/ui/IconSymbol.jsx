import {
    FaArrowRight,
    FaBell,
    FaCheckCircle,
    FaClock,
    FaCog,
    FaCompass,
    FaCreditCard,
    FaEllipsisH,
    FaExclamationCircle,
    FaHeart,
    FaHome,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhone,
    FaSearch,
    FaShoppingBag,
    FaStar,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import "../styles/IconSymbol.css";

/**
 * IconSymbol component for web - tương ứng với IconSymbol.tsx trong React Native
 * Component này chuyển đổi từ SF Symbols sang Font Awesome Icons
 */
const IconSymbol = ({
    name,
    size = 24,
    color = "currentColor",
    style = {},
    className = "",
    ...props
}) => {
    // Map từ tên SF Symbols sang Font Awesome icons
    const iconMap = {
        "house.fill": FaHome,
        safari: FaCompass,
        "bag.fill": FaShoppingBag,
        "person.fill": FaUser,
        ellipsis: FaEllipsisH,
        star: FaStar,
        "star.fill": FaStar,
        clock: FaClock,
        "mappin.and.ellipse": FaMapMarkerAlt,
        creditcard: FaCreditCard,
        heart: FaHeart,
        bell: FaBell,
        gear: FaCog,
        "info.circle": FaInfoCircle,
        "checkmark.circle": FaCheckCircle,
        "exclamationmark.circle": FaExclamationCircle,
        "arrowtriangle.right.fill": FaArrowRight,
        magnifyingglass: FaSearch,
        phone: FaPhone,
        "person.3.fill": FaUsers,
    };

    const IconComponent = iconMap[name] || FaInfoCircle; // Mặc định là Info icon

    return (
        <IconComponent
            size={size}
            color={color}
            style={style}
            className={`icon-symbol ${className}`}
            {...props}
        />
    );
};

export default IconSymbol;
