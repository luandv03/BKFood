import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                minHeight: "80vh",
            }}
        >
            <h1>Oops!</h1>
            <h2>This page does not exist.</h2>
            <Link
                to="/"
                style={{
                    marginTop: "15px",
                    padding: "15px",
                    color: "#FF6B00",
                    textDecoration: "none",
                    fontWeight: "600",
                }}
            >
                Go to home screen!
            </Link>
        </div>
    );
};

export default NotFoundPage;
