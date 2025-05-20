import React from "react";
import "../styles/ExternalLink.css";

/**
 * ExternalLink component for opening links in new browser tab
 * @param {Object} props
 * @param {string} props.href - URL to open
 * @param {React.ReactNode} props.children - Link content/text
 * @param {Object} props.style - Additional styles
 * @param {string} props.className - Additional CSS classes
 */
function ExternalLink({ href, children, style, className, ...rest }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`external-link ${className || ""}`}
            style={style}
            {...rest}
        >
            {children}
        </a>
    );
}

export default ExternalLink;
