import React from "react";
import { Link } from "react-router-dom";

function ErrorElement() {
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Oops! Something went wrong.</h2>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">Go back to Home</Link>
        </div>
    );
}

export default ErrorElement;