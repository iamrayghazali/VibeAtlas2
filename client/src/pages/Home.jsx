import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import axios from "axios";

function Home() {
    const navigate = useNavigate();
    const user = useAuth();
    const [surveyIsFilled, setSurveyIsFilled] = useState(null);

    useEffect(() => {
        if (user && user.uid) {
            axios.get(`/api/user/survey/${user.uid}`)
                .then(res => {
                    setSurveyIsFilled(res.data.filledOut);
                })
                .catch(e => {
                    console.error("Error fetching user responses to the survey:", e);
                });
        }
    }, [user]);

    // Redirect if survey is not filled out
    useEffect(() => {
        if (surveyIsFilled === false) {
            navigate("/survey");
        }
    }, [surveyIsFilled, navigate]);

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