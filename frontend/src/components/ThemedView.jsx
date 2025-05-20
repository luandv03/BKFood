import "../styles/ThemedView.css";

/**
 * ThemedView component for web - tương ứng với ThemedView.tsx trong React Native
 * Đây là một container cơ bản với styling tương ứng với View trong React Native
 */
const ThemedView = ({ children, style = {}, className = "", ...props }) => {
    return (
        <div className={`themed-view ${className}`} style={style} {...props}>
            {children}
        </div>
    );
};

export default ThemedView;
