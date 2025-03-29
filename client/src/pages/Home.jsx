import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import axios from "axios";
import {Button, Typography} from "@mui/material";

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
            <Typography variant={"h2"}>What’s the move?</Typography>
            <Typography variant={"subtitle1"}>From ‘what’s the move?’ to ‘we out’—AI makes it easy.</Typography>
            {
                user ? (
                    <>
                        <Button variant="contained" onClick={() => navigate("/location")}>Go to Recommendations</Button>
                    </>
                ) : (
                    <>
                        <Button variant="contained" onClick={() => navigate("/register")}>Register</Button>
                        <Button variant="outlined" onClick={() => navigate("/login")}>Login</Button>
                    </>
                )
            }
        </div>
    );
}

export default Home;