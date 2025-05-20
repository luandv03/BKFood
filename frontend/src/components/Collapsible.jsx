import React, { useState } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { useThemeColor } from "../hooks/useThemeColor";
import "../styles/Collapsible.css";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import IconSymbol from "./ui/IconSymbol";

/**
 * Collapsible component - displays a collapsible section with title and children
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display when expanded
 * @param {string} props.title - Title of the collapsible section
 */
function Collapsible({ children, title }) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useColorScheme() || "light";
    const iconColor = useThemeColor({}, "icon");

    return (
        <ThemedView>
            <div
                className="collapsible-heading"
                onClick={() => setIsOpen((value) => !value)}
            >
                <IconSymbol
                    name={isOpen ? "chevron-down" : "chevron-right"}
                    size={18}
                    weight="medium"
                    color={iconColor}
                    style={{
                        transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
                    }}
                />
                <ThemedText type="defaultSemiBold">{title}</ThemedText>
            </div>

            {isOpen && (
                <ThemedView className="collapsible-content">
                    {children}
                </ThemedView>
            )}
        </ThemedView>
    );
}

export default Collapsible;
