import { useEffect, useState } from "react";

/**
 * Hook to detect color scheme preference (light or dark mode)
 */
export function useColorScheme() {
    const [colorScheme, setColorScheme] = useState(() => {
        // Check for saved preference in localStorage
        const savedPreference = localStorage.getItem("color-scheme");
        if (savedPreference) {
            return savedPreference;
        }

        // Check system preference
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            return "dark";
        }

        return "light";
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e) => {
            const newColorScheme = e.matches ? "dark" : "light";
            setColorScheme(newColorScheme);
        };

        // Listen for changes
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return colorScheme;
}

// Function to manually set color scheme - can be used with toggle buttons
export function setColorScheme(scheme) {
    localStorage.setItem("color-scheme", scheme);
    document.documentElement.setAttribute("data-theme", scheme);
}
