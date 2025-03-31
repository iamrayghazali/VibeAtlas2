import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import axios from "axios";
import {Button, Typography, Container, Box, Grid, Divider} from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Navbar from "../components/Navbar.jsx";
import bgImage from "../assets/window-bg.jpg";
import {motion} from "framer-motion";
import CircularText from '../components/CircularText';
import '../index.css';
import logo from "../assets/logo.png";
import ShinyText from "../components/ShinyText.jsx";
import CountUp from '../components/CountUp.jsx'
import TiltedCard from "../components/TiteledCard.jsx";
import RowOfCities from "../components/RowOfCities.jsx";
import RowOfNumbers from "../components/RowOfNumbers.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";


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
                backgroundPosition: "center", minHeight: "calc(100vh - 55px)", minWidth: "100%",
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
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeOut"}}
                    >
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
                    </motion.div>
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
            <Container sx={{
                minHeight: "calc(100vh - 55px)",
                fontFamily: "Lato",
                backgroundColor: "black",
                minWidth: "100%",
                margin: "0",
                borderTop: "1rem",
                borderColor: "white"
            }}>
                <Box id="info-section" sx={{
                    padding: "3rem",
                    display: "grid",
                    gridTemplateColumns: "1fr",  // Default to single column for mobile
                    gap: "16px",
                    justifyItems: "center",
                    // Tailwind classes to manage layout responsiveness
                    "@media (min-width: 768px)": {
                        gridTemplateColumns: "repeat(2, 1fr)",  // Use two columns for medium and larger screens
                    }
                }}>
                    <CircularText
                        text="VIBE*ATLAS*VIBE*ATLAS*"
                        onHover="speedUp"
                        spinDuration={20}
                        className="custom-class"
                    />
                    <ScrollReveal
                        baseOpacity={0}
                        enableBlur={true}
                        baseRotation={4}
                        blurStrength={100}
                    >
                        When does a man die? When he is hit by a bullet? No! When he suffers a disease?
                        No! When he ate a soup made out of a poisonous mushroom?
                        No! A man dies when he is forgotten!
                    </ScrollReveal>
                </Box>
            </Container>
            <Container sx={{minHeight: "calc(100vh - 55px)", fontFamily: "Lato"}}>
                <RowOfNumbers/>
                <RowOfCities/>
            </Container>
            <Container sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black"
            }}>
                <Box>

                    <Box component="img" src={logo} alt="Logo" sx={{height: 250, cursor: "pointer"}}
                         onClick={() => navigate("/")}/>

                </Box>
                <ShinyText text="Select Location" disabled={false} speed={3}/>
                <Box sx={{backgroundColor: "black"}}>


                </Box>

            </Container>
            <Container sx={{minHeight: "calc(100vh - 55px)", fontFamily: "Lato"}}>
                <Box id="guide-section" sx={{}}>
                    <Typography component={"h4"} sx={{}}>Quick Guide</Typography>
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
                            <TimelineContent> 📍Pick Location - (30 seconds)</TimelineContent>
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
        </>

    );
}

export default Home;