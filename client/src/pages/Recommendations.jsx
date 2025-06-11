import React, {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../context/AuthContext.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {
    Box,
    Typography,

    FormControlLabel, Switch, Chip, Paper, Skeleton, Divider, Button, CircularProgress
} from "@mui/material";
import SearchHistory from "../components/SearchHistory.jsx";
import Navbar from "../components/Navbar.jsx";
import SimpleCountryMap from "../components/SimpleCountryMap.jsx";
import map from "../assets/map-data.json";
import { motion } from "framer-motion";


const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [eventRecommendations, setEventRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState("AI");
    const location = useLocation();
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [error, setError] = useState(null);
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (
            location.state &&
            location.state.country &&
            location.state.city !== ""
        ) {
            setCountry(location.state.country);
            setCity(location.state.city);
        } else {
            navigate("/location");
        }
    }, [location.state]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
        }
        if (user && city && country) {
            console.log("Searching for: ", country, city);

            // Fetch recommendations when user, city, and country are available
            getAIRecommendations().then(() => {
                console.log("Ai recommendations ran.")
            })
            getEventRecommendations(city).then(() => {
                console.log("Event recommendations ran.")
            })
        }
    }, [user, city, country]);

    const createEventRecommendationStructure = (data) => {
        if ('_embedded' in data) {
            const events = data._embedded.events;
            const eventNamesSet = new Set();
            const formattedEvents = events.map(event => {
                if (eventNamesSet.has(event.name)) {
                    return [];
                }
                eventNamesSet.add(event.name);
                const eventData = {
                    name: event.name || "N/A",
                    url: event.url || "N/A",
                    startDate: `${event.dates.start.localDate} ${event.dates.start.localTime.slice(0, 5)}`,
                    price: event.priceRanges ? `${event.priceRanges[0].min}-${event.priceRanges[0].max} ${event.priceRanges[0].currency}` : "N/A"
                };
                return eventData;
            }).filter(event => event !== null);
            return formattedEvents;
        } else {
            return [];
        }
    };

    const getEventRecommendations = async (city) => {
        try {
            axios.get("http://127.0.0.1:7050/api/recommendations/events?location=${city}")
                .then((response) => {
                    setEventRecommendations(createEventRecommendationStructure(response.data));
                })
                .catch((error) => {
                    console.error("Error fetching recommendations:", error);
                    setError("We could not fetch EVENT recommendations, please try again later.");
                });
        } catch (e) {
            console.log(e);
        }
    };

    const getAIRecommendations = async () => {
        setLoading(true);
        axios
            .get(`http://localhost:7050/api/recommendations/${user.uid}/${city}/${country}`)
            .then((response) => {
                setRecommendations(response.data.recommendations);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
                setLoading(false);
                setError("We could not fetch recommendations, please try again later.");
            });
    };

    const createGoogleMapsLink = (latitude, longitude) => {
        if (latitude && longitude) {
            return `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        return '#';
    };

    return (
        <>
            <Navbar></Navbar>
            <Box sx={{
                width: "100%",
                minHeight: "20vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "black",
                fontFamily: "Lato"
            }} >
                <Typography variant={"h5"} align={"left"} sx={{color: "white", marginLeft: "3rem", marginTop: "3rem", marginBottom: "2rem", fontFamily: "Lato"}}>Search History</Typography>
                <SearchHistory></SearchHistory>
            </Box>
            <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", backgroundColor: "black", alignItems: "center", color: "#F18F01", padding: "2rem"}}>
                <Divider></Divider>
                <Typography variant={"h4"} align={"left"} sx={{fontWeight: "bold"}}>{country}, {city}</Typography>

            </Box>
            <Box sx={{
                width: '100%',
                padding: '2rem',
                backgroundColor: 'black',
                minHeight: '100vh',
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "16px",
                justifyItems: "center",
                "@media (min-width: 1024px)": {
                    gridTemplateColumns: "1fr 2fr",
                    gridTemplateRows: "1fr",
                }
            }}>
                {
                    country ? (
                         <SimpleCountryMap countryName={country} ></SimpleCountryMap>
                    ) :  <Typography variant={"h5"} align={"center"} sx={{color: "white", fontFamily: "Lato"}}>Map unavailable</Typography>
                }
                <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
       {/*             <Box sx={{}}>
                        TODO finish buttons
                        <Switch onClick={() => selectedTab ? "AI" : "Event"}  />
                    </Box>*/}
                    {loading ? (
                        <Box sx={{display: "flex", }}>
                            <CircularProgress size="5rem" sx={{color: "#F18F01"}}/>
                        </Box>
                    ) : (
                        <>
                            {selectedTab === "AI" && (
                                <Box sx={{width: "100%", paddingBottom: '1rem'}}>
                                    {recommendations.length === 0 ? (
                                        <Typography variant="h6" sx={{color: "#ccc", textAlign: 'center'}}>
                                            No recommendations found.
                                        </Typography>
                                    ) : (
                                        <motion.ul style={{listStyleType: 'none'}} initial={{opacity: 0}}
                                                   animate={{opacity: 1}} transition={{duration: 1}}>
                                            {recommendations.map((place) => (
                                                <motion.li key={place.id} whileHover={{scale: 1.03}}
                                                           transition={{duration: 0.2}}>
                                                    <Paper sx={{
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#F18F01',
                                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                                        marginBottom: "1rem",
                                                        color: 'black'
                                                    }} elevation={3}>

                                                        <Box sx={{display: "flex", flexDirection: "row", padding: "1rem"}}>
                                                            <Chip label={place.price} sx={{backgroundColor: "white", color: "black"}} color="secondary"/>
                                                            <Divider orientation="vertical" sx={{backgroundColor: "black", width: "2px", maxHeight: "60px", margin: "0.5rem"}} flexItem ></Divider>
                                                            <Chip variant={"outlined"} sx={{backgroundColor: "black", color: "white"}} label={place.category}/>
                                                        </Box>
                          {/*                              <Typography variant="body1"
                                                                    sx={{color: '#aaa', marginBottom: '0.5rem'}}>
                                                            {place.location}
                                                        </Typography>*/}
                                                        <Typography variant="h5"
                                                                    sx={{fontWeight: 500, marginBottom: '0.5rem'}}>
                                                            {place.name}
                                                        </Typography>
                                                        <Typography variant="body2"
                                                                    sx={{color: 'black', marginBottom: '2rem'}}>
                                                            {place.description}
                                                        </Typography>
                                                        {place.coordinates && (
                                                            <Button
                                                                variant="outlined"
                                                                sx={{
                                                                    border: "none",
                                                                    color: 'black',
                                                                    backgroundColor: 'white',
                                                                    '&:hover': {
                                                                        backgroundColor: 'black',
                                                                        color: 'white'
                                                                    }
                                                                }}
                                                                href={createGoogleMapsLink(place.coordinates.latitude, place.coordinates.longitude)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View on Google Maps
                                                            </Button>
                                                        )}
                                                    </Paper>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </Box>
                            )}

                            {selectedTab === "Event" && (
                                <Box sx={{width: "100%", paddingBottom: '1rem'}}>
                                    {eventRecommendations.length === 0 ? (
                                        <Typography variant="h6" sx={{color: "#ccc", textAlign: 'center'}}>
                                            No event at this location 😔
                                        </Typography>
                                    ) : (
                                        <motion.ul style={{listStyleType: 'none'}} initial={{opacity: 0}}
                                                   animate={{opacity: 1}} transition={{duration: 1}}>
                                            {eventRecommendations.map((place, index) => (
                                                <motion.li key={index} whileHover={{scale: 1.03}}
                                                           transition={{duration: 0.2}}>
                                                    <Paper sx={{
                                                        padding: '1.5rem',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#2a2a2a',
                                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                                        marginBottom: "1rem",
                                                        color: '#fff'
                                                    }} elevation={3}>
                                                        <Typography variant="body1"
                                                                    sx={{color: '#aaa', marginBottom: '0.5rem'}}>
                                                            {city}
                                                        </Typography>
                                                        <Typography variant="h5"
                                                                    sx={{fontWeight: 500, marginBottom: '0.5rem'}}>
                                                            {place.name}
                                                        </Typography>
                                                        <Divider sx={{borderColor: "rgba(255,255,255,0.2)", mb: 3}}/>
                                                        <Typography variant="body2"
                                                                    sx={{color: '#ccc', marginBottom: '0.5rem'}}>
                                                            {place.startDate}
                                                        </Typography>
                                                        {place.price !== "N/A" && (
                                                            <Typography variant="body2"
                                                                        sx={{color: '#aaa', marginBottom: '1rem'}}>
                                                                Price: {place.price}
                                                            </Typography>
                                                        )}
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                color: '#2196f3',
                                                                borderColor: '#2196f3',
                                                                '&:hover': {backgroundColor: '#2196f3', color: '#fff'}
                                                            }}
                                                            href={place.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Get tickets
                                                        </Button>
                                                    </Paper>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
            </Box>
            {/*
                <Paper sx={{
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
                    backgroundColor: '#1d1d1d',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '800px',
                    margin: '0 auto'
                }} elevation={4}>
                    <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
                        <Button
                            onClick={() => setSelectedTab("AI")}
                            AI Recommendations
                        </Button>
                        <Button
                            onClick={() => setSelectedTab("Event")}
                            Event Recommendations
                        </Button>
                    </Box>
                    {loading ? (
                        <Skeleton variant="rounded" width="100%" height={300}/>
                    ) : (
                        <>
                            {selectedTab === "AI" && (
                                <Box sx={{width: "100%", paddingBottom: '1rem'}}>
                                    {recommendations.length === 0 ? (
                                        <Typography variant="h6" sx={{color: "#ccc", textAlign: 'center'}}>
                                            No recommendations found.
                                        </Typography>
                                    ) : (
                                        <motion.ul style={{listStyleType: 'none'}} initial={{opacity: 0}}
                                                   animate={{opacity: 1}} transition={{duration: 1}}>
                                            {recommendations.map((place) => (
                                                <motion.li key={place.id} whileHover={{scale: 1.03}}
                                                           transition={{duration: 0.2}}>
                                                    <Paper sx={{
                                                        padding: '1.5rem',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#2a2a2a',
                                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                                        marginBottom: "1rem",
                                                        color: '#fff'
                                                    }} elevation={3}>
                                                        <Chip label="Historical" color="primary" size="small"/>
                                                        <Typography variant="body1"
                                                                    sx={{color: '#aaa', marginBottom: '0.5rem'}}>
                                                            {place.location}
                                                        </Typography>
                                                        <Typography variant="h5"
                                                                    sx={{fontWeight: 500, marginBottom: '0.5rem'}}>
                                                            {place.name}
                                                        </Typography>
                                                        <Divider sx={{borderColor: "rgba(255,255,255,0.2)", mb: 3}}/>
                                                        <Typography variant="body2"
                                                                    sx={{color: '#ccc', marginBottom: '0.5rem'}}>
                                                            {place.description}
                                                        </Typography>
                                                        <Typography variant="body2"
                                                                    sx={{color: '#aaa', marginBottom: '0.5rem'}}>
                                                            Category: {place.category}
                                                        </Typography>
                                                        <Typography variant="body2"
                                                                    sx={{color: '#aaa', marginBottom: '1rem'}}>
                                                            Price: {place.price}
                                                        </Typography>
                                                        {place.coordinates && (
                                                            <Button
                                                                variant="outlined"
                                                                sx={{
                                                                    color: '#2196f3',
                                                                    borderColor: '#2196f3',
                                                                    '&:hover': {
                                                                        backgroundColor: '#2196f3',
                                                                        color: '#fff'
                                                                    }
                                                                }}
                                                                href={createGoogleMapsLink(place.coordinates.latitude, place.coordinates.longitude)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View on Google Maps
                                                            </Button>
                                                        )}
                                                    </Paper>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </Box>
                            )}

                            {selectedTab === "Event" && (
                                <Box sx={{width: "100%", paddingBottom: '1rem'}}>
                                    {eventRecommendations.length === 0 ? (
                                        <Typography variant="h6" sx={{color: "#ccc", textAlign: 'center'}}>
                                            No event at this location 😔
                                        </Typography>
                                    ) : (
                                        <motion.ul style={{listStyleType: 'none'}} initial={{opacity: 0}}
                                                   animate={{opacity: 1}} transition={{duration: 1}}>
                                            {eventRecommendations.map((place, index) => (
                                                <motion.li key={index} whileHover={{scale: 1.03}}
                                                           transition={{duration: 0.2}}>
                                                    <Paper sx={{
                                                        padding: '1.5rem',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#2a2a2a',
                                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                                        marginBottom: "1rem",
                                                        color: '#fff'
                                                    }} elevation={3}>
                                                        <Typography variant="body1"
                                                                    sx={{color: '#aaa', marginBottom: '0.5rem'}}>
                                                            {city}
                                                        </Typography>
                                                        <Typography variant="h5"
                                                                    sx={{fontWeight: 500, marginBottom: '0.5rem'}}>
                                                            {place.name}
                                                        </Typography>
                                                        <Divider sx={{borderColor: "rgba(255,255,255,0.2)", mb: 3}}/>
                                                        <Typography variant="body2"
                                                                    sx={{color: '#ccc', marginBottom: '0.5rem'}}>
                                                            {place.startDate}
                                                        </Typography>
                                                        {place.price !== "N/A" && (
                                                            <Typography variant="body2"
                                                                        sx={{color: '#aaa', marginBottom: '1rem'}}>
                                                                Price: {place.price}
                                                            </Typography>
                                                        )}
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                color: '#2196f3',
                                                                borderColor: '#2196f3',
                                                                '&:hover': {backgroundColor: '#2196f3', color: '#fff'}
                                                            }}
                                                            href={place.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Get tickets
                                                        </Button>
                                                    </Paper>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </Box>
                            )}
                        </>
                    )}
                </Paper>
            </Box>*/}
            </Box>
        </>
    );
};

export default Recommendations;