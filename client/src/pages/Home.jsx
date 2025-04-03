import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import axios from "axios";
import {Button, Typography, Container, Box, Grid, Divider, CircularProgress} from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import bgImage from "../assets/window-bg.jpg";
import {motion} from "framer-motion";
import CircularText from '../components/CircularText';
import '../index.css';
import RowOfCities from "../components/RowOfCities.jsx";
import RowOfNumbers from "../components/RowOfNumbers.jsx";
import Footer from "../components/Footer.jsx";
import Stepper, { Step } from '../components/Stepper.jsx';


function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setCurrentCountryAbrv(selectedCountry);
    };

    useEffect(() => {
        if (user && user.uid) {
            setLoading(false);
        }
    }, [user])

    return (
        <>
            { loading ?
                (
                    <>
                        <Box sx={{position: "absolute", top: "40%", left: "40%", maxHeight: "100vh" }}>
                            <CircularProgress size={"3rem"} color={"inherit"} />
                        </Box>
                    </>
                )
                : (
                <>

            <Navbar>

            </Navbar>
            <Container sx={{
                fontFamily: "Lato",
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
                                fontSize: {xs: "2rem", md: "3rem", lg: "4rem", xl: "5rem"},
                                fontFamily: "Lato",
                                lineHeight: "0.9",
                                margin: "1rem",
                                fontWeight: "600",
                                display: "inline-block",  // Prevents wrapping if there’s enough space
                                whiteSpace: "nowrap",     // Prevents line break
                                overflow: "hidden",       // Ensures that overflowing content is hidden (if necessary)
                            }}
                        >
                            What’s the move?
                        </Typography>
                    </motion.div>
                    <Typography variant="subtitle1" sx={{fontFamily: "Lato", color: "#505050"}}>
                        AI makes it easy to find vibes - that matches yours
                    </Typography>
                    {
                        user ? (
                            <>
                                <Button variant="contained" sx={{
                                    backgroundColor: "#F18F01",
                                    color: "black",
                                    marginTop: "8rem",
                                    textDecoration: "none"
                                }} onClick={() => navigate("/location")}>Select Location</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="contained" sx={{
                                    textTransform: "none",
                                    marginTop: "2rem",
                                    backgroundColor: "#F18F01",
                                    color: "black",
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
                    "@media (min-width: 768px)": {
                        gridTemplateColumns: "repeat(2, 1fr)",  // Use two columns for medium and larger screens
                    },
                }}>
                    <CircularText
                        text="VIBE*ATLAS*VIBE*ATLAS*"
                        onHover="speedUp"
                        spinDuration={20}
                        className="custom-class mt-10 md:mt-30 text-carrot"
                    />
                    <Box sx={{display: "grid", gridTemplateRows: "repeat(2, 1fr)", gap: "16px", marginTop: "3rem"}}>
                        <Typography sx={{color: "white", fontFamily: "Lato", textAlign: "center"}} variant={"h6"}>
                            Traveling? Looking for something fun to do? Get <span className={"text-carrot"}>AI-powered personalised</span> suggestions
                            for places
                            to visit: from buzzing city
                            nights to hidden paradise escapes, we serve up instant recommendations that match <span
                            className={"text-carrot"}> your energy</span>.
                        </Typography>
                        <Box sx={{
                            display: "grid",
                            alignItems: "center",
                            gridTemplateColumns: "1fr",
                            justifyItems: "center",
                            "@media (min-width: 768px)": {
                                gridTemplateColumns: "repeat(2, 1fr)",  // Use two columns for medium and larger screens
                            },
                        }}>
                            <Button variant="contained" sx={{
                                backgroundColor: "#F18F01",
                                color: "black",
                                textDecoration: "none",
                                fontWeight: "bold",
                                textTransform: "none",
                            }} onClick={() => navigate("/location")}>Select Location</Button>
                            <Button variant="outlined" sx={{
                                textTransform: "none",
                                borderColor: "white",
                                color: "white",
                                textDecoration: "none"
                            }} onClick={() => navigate("/about")}>Learn More</Button>
                        </Box>
                        <Typography sx={{color: "white", fontFamily: "Lato", textAlign: "center"}} variant={"h6"}>
                            It’s free, <span className={"text-carrot"}>effortless</span>, and actually understands your
                            style. Whether you’re feeling city lights, beach waves, or something off the grid, we’ve got
                            you. Skip the guesswork, find your vibe, and let VibeAtlas do the planning. 🔥
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <Container sx={{minHeight: "calc(100vh - 55px)", fontFamily: "Lato", backgroundColor: "white", minWidth: "100%"}}>
                <RowOfNumbers/>
                <RowOfCities/>
            </Container>
            <Container sx={{minHeight: "calc(100vh - 55px)", fontFamily: "Lato", backgroundColor: "black", minWidth: "100%"}}>
                <Box id="guide-section" sx={{paddingTop: "6rem",  paddingBottom: "6rem", fontFamily: "Lato"}}>
                    <Typography variant={"h4"} sx={{ textAlign: "center",  fontFamily: "Lato", color: "#F18F01", marginBottom: "1rem"}}>Quick Guide</Typography>
                    <Typography variant={"body1"} sx={{ textAlign: "center",  fontFamily: "Lato", color: "#a3a3a3", }}>Follow the steps, and get your recommendations!</Typography>

                    <Stepper
                        initialStep={1}
                        backButtonText="Previous"
                        nextButtonText="Next"
                    >
                        <Step className={"text-carrot"}>
                            <h2 className={"font-bold"}>Step 1 </h2>
                            <Divider sx={{margin: "1rem"}}/>
                            <h5 className={"font-bold"}>Register or Login through Google on the login page.</h5>
                            <p className={"text-gray-500"}>To go to the register page you can click <a className={"text-blue-500 underline"} onClick={() => navigate("/register")}>here.</a></p>
                        </Step>
                        <Step className={"text-carrot"}>
                            <h2  className={"font-bold"}>Step 2</h2>
                            <Divider sx={{margin: "1rem"}}/>
                            <section>You will be directed to the /survey page if you have not filled it out yet (if you have you can disregard this step). <section className={"font-bold"}>Fill out quick survey - I promise it takes 1.5 minutes max.</section>
                            </section>

                            <p className={"text-gray-500 text-center mt-4"}>Note that currently can only be filled out once.</p>
                        </Step>
                        <Step className={"text-carrot"}>
                            <h2  className={"font-bold"}>Step 3</h2>
                            <Divider sx={{margin: "1rem"}}/>
                            <ul>
                                <li>- Select a country from the world map, or the dropdown</li>
                                <li>- Select a city on the dropdown</li>
                            </ul>
                            <h5 className={"font-bold"}></h5>
                        </Step>
                        <Step>
                            <h2  className={"font-bold"}>Final Step</h2>
                            <Divider sx={{margin: "1rem"}}/>
                            <h5 className={"font-bold"}>You made it!</h5>
                        </Step>
                    </Stepper>

                </Box>
            </Container>
            <Footer />
                </>
            )}
        </>
    );
}

export default Home;