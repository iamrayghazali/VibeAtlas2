import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { Button, Typography, TextField } from "@mui/material";

function Home() {
    const navigate = useNavigate();
    const user = useAuth();
    const [surveyIsFilled, setSurveyIsFilled] = useState(null);
    const [cityNames, setCityNames] = useState([]); // State for storing city names
    const [currentCountryAbrv, setCurrentCountryAbrv] = useState(""); // Store current selected country abbreviation

    useEffect(() => {
        // Fetch survey data on user login
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

    // Fetch city names whenever the country abbreviation changes
    useEffect(() => {
        if (currentCountryAbrv) {
            console.log("Fetching city names for:", currentCountryAbrv);

            // Call your backend API to fetch city names
            axios.get(`/api/survey/${currentCountryAbrv}/cities`)
                .then(response => {
                    console.log("API Response:", response);
                    if (response.data && response.data.names) {
                        setCityNames(response.data.names); // Assuming 'names' contains the city names
                    } else {
                        console.error("City names not found");
                        setCityNames([]); // Reset to empty if no cities found
                    }
                })
                .catch(error => {
                    console.error("Error fetching city names:", error);
                    setCityNames([]); // Reset on error
                });
        }
    }, [currentCountryAbrv]); // Dependency array to fetch cities on country change

    // Update selected country abbreviation when the user selects a country
    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setCurrentCountryAbrv(selectedCountry); // Update selected country abbreviation
    };

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