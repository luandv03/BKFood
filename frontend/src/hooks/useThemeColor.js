import { Colors } from "../constants/Colors";
import { useColorScheme } from "./useColorScheme";

/**
 * Hook to get theme colors based on color scheme (light/dark)
 * @param {Object} props - Optional props with light/dark values
 * @param {string} colorName - Key for the color in the Colors constant
 * @returns {string} - The proper color for the current theme
 */
export function useThemeColor(props, colorName) {
    const theme = useColorScheme() || "light";
    const colorFromProps = props?.[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}
