import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import axios from "axios";
import {Button, Typography, Container, Box} from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Navbar from "../components/Navbar.jsx";
import bgImage from "../assets/window-bg.jpg";


function Home() {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [surveyIsFilled, setSurveyIsFilled] = useState(null);

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

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setCurrentCountryAbrv(selectedCountry);
    };

    return (
        <>
            <Navbar></Navbar>
            <Container sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center", minHeight: "calc(100vh - 55px)", minWidth: "100%"
            }}>
                <Box sx={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: "Oswald",
                            lineHeight: "0.9",
                            margin: "2rem",
                            fontWeight: "bold",
                            display: "inline-block",  // Prevents wrapping if there’s enough space
                            whiteSpace: "nowrap",     // Prevents line break
                            overflow: "hidden",       // Ensures that overflowing content is hidden (if necessary)
                        }}
                    >
                        What’s the move?
                    </Typography>
                    <Typography variant="subtitle1" sx={{fontFamily: "Lato", color: "darkgrey"}}>
                        From ‘what’s the move?’ to ‘we out’—AI makes it easy.
                    </Typography>
                    {
                        user ? (
                            <>
                                <Button variant="contained" onClick={() => navigate("/location")}>Go to
                                    Recommendations</Button>

                            </>
                        ) : (
                            <>
                                <Button variant="contained" sx={{
                                    textTransform: "none",
                                    marginTop: "2rem",
                                    backgroundColor: "black",
                                    color: "white",
                                    paddingLeft: "25px",
                                    paddingRight: "25px"
                                }} onClick={() => navigate("/register")}>Register</Button>
                                <Button variant="outlined" color={"black"}
                                        sx={{textTransform: "none", marginTop: "1rem"}}
                                        onClick={() => navigate("/login")}>Login</Button>
                            </>
                        )
                    }
                </Box>
            </Container>
            <Container sx={{minHeight: "calc(100vh - 55px)", fontFamily: "Lato"}}>
                <Box id="guide-section" sx={{}}>
                    <Typography component={"h4"}> Quick Guide</Typography>
                    <Timeline>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot/>
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineContent>
                                📝 Register - (1 min)
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot/>
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineContent>✍🏼 Fill out Survey - (1.5 min) </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot/>
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineContent> 📍Pick Location  - (30 seconds)</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot/>
                            </TimelineSeparator>
                            <TimelineContent>See Recommendations! 🚀</TimelineContent>
                        </TimelineItem>

                    </Timeline>
                </Box>
            </Container>
            <Container sx={{minHeight: "calc(100vh - 55px)", fontFamily: "Lato"}}>
                <Box id="about-section" sx={{

                }}>

                </Box>
            </Container>
            </>

    );
}

export default Home;