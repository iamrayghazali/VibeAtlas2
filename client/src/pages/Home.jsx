import React from "react";
import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to VibeAtlas</h1>
            <p>Discover the world, explore new places, and get personalized recommendations based on your preferences.</p>
            <button onClick={() => navigate("/register")}>Register</button>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    );
}

export default Home;