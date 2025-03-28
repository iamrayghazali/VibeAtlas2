import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

function Home() {
    const navigate = useNavigate();
    const user = useAuth();
    return (
        <div>
            <h1>Where are you vibin' today?</h1>
            <p>Discover the world, explore new places, and get personalized recommendations based on your preferences.</p>
            {
                user ? (
                    <>
                        <button onClick={() => navigate("/location")}>Go to Recommendations</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/register")}>Register</button>
                        <button onClick={() => navigate("/login")}>Login</button>
                    </>
                )
            }
        </div>
    );
}

export default Home;