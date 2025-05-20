import "../styles/ThemedText.css";

/**
 * ThemedText component for web - tương ứng với ThemedText.tsx trong React Native
 */
const ThemedText = ({
    children,
    type = "body",
    style = {},
    className = "",
    ...props
}) => {
    // Định nghĩa các style cho các loại text
    const getTextClassName = () => {
        switch (type) {
            case "title":
                return "themed-text-title";
            case "subtitle":
                return "themed-text-subtitle";
            case "heading":
                return "themed-text-heading";
            case "link":
                return "themed-text-link";
            case "caption":
                return "themed-text-caption";
            default:
                return "themed-text-body";
        }
    };

    return (
        <span
            className={`themed-text ${getTextClassName()} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </span>
    );
};

export default ThemedText;
