import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../context/AuthContext.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, CircularProgress, Typography, Paper, Button, Divider} from "@mui/material";
import {motion} from "framer-motion";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [eventRecommendations, setEventRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [error, setError] = useState(null);
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state.country && location.state.city !== "") {
            setCountry(location.state.country);
            setCity(location.state.city);
        }
    }, [location.state]); // Depend on location.state to trigger when it's available

    useEffect(() => {
        if (!user) { // Ensure no API call is made before user is authenticated
            setLoading(false);
        }
        // Ensure city and country are properly set before making the API call
        if (user && city && country) {
            getAIRecommendations().then(() => console.log("AI recommendations function ran."));
            getEventRecommendations(city).then(() => console.log("EVENT recommendations ran."));
        }
    }, [user, city, country]); // Depend on user, city, and country

    const createEventRecommendationStructure = (data) => {
        // Check if '_embedded' exists in the data object
        if ('_embedded' in data) {
            console.log("There are no recommendations for this location. (_embedded not found)");

            // Access the events array inside _embedded
            const events = data._embedded.events;

            // Set to store already processed event names to avoid duplicates
            const eventNamesSet = new Set();

            // Create an array to hold the formatted event data
            const formattedEvents = events.map(event => {
                // Skip event if name is already in the set (duplicate name)
                if (eventNamesSet.has(event.name)) {
                    return null; // Return null for duplicates
                }

                // Add event name to the set
                eventNamesSet.add(event.name);

                // Accessing the required data
                const eventData = {
                    name: event.name || "N/A", // Default to "N/A" if name is not available
                    url: event.url || "N/A", // Default to "N/A" if URL is not available
                    startDate: `${event.dates.start.localDate} ${event.dates.start.localTime.slice(0, 5)}`, // Combine date and time
                    price: event.priceRanges ? `${event.priceRanges[0].min}-${event.priceRanges[0].max} ${event.priceRanges[0].currency}` : "N/A" // Format price range
                };
                return eventData;
            }).filter(event => event !== null); // Filter out null values (duplicate events)

            console.log("formatted", formattedEvents);
            // Return the array of formatted events
            return formattedEvents;

        } else {
            console.log("there is NO _embedded");
            return null; // Return null if '_embedded' is not found
        }
    }

    const getEventRecommendations = async (city) => {
        try {
            axios.get(`http://127.0.0.1:7050/api/recommendations/events?location=${city}`)
                .then((response) => {
                    setEventRecommendations(createEventRecommendationStructure(response.data));
                    console.log("Worked events: ", response.data);
                })
                .catch((error) => {
                    console.error("Error fetching recommendations:", error);
                    setError("We could not fetch EVENT recommendations, please try again later.");
                });
        } catch (e) {
            console.log(e);
        }
    }

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

    function createGoogleMapsLink(latitude, longitude) {
        if (latitude && longitude) {
            return `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        return '#';
    }

    if (!user) return <Typography variant={"h3"} sx={{textAlign: "center"}}>Please log in to see
        recommendations.</Typography>;

    return (
        <Box sx={{width: '100%', padding: '2rem', backgroundColor: '#121212', minHeight: '100vh'}}>
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
                {loading ? (
                    <>
                        <Button variant={"contained"} onClick={() => navigate("/location")}>Change country</Button>
                        <Typography variant="h6">{country}, {city}</Typography>
                        <Typography variant="h4" sx={{fontWeight: 600, color: "#fff", marginBottom: "1.5rem"}}>
                            Your Personalized Recommendations
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
                            <CircularProgress size="4rem"/>
                        </Box>
                    </>
                ) : (
                    <>
                        <Button variant={"contained"} onClick={() => navigate("/location")}>Change country</Button>
                        <Typography variant="h6">{country}, {city}</Typography>
                        <Typography variant="h4" sx={{fontWeight: 600, color: "#fff", marginBottom: "1.5rem"}}>
                            Your Personalized Recommendations
                        </Typography>
                        <Divider sx={{borderColor: "rgba(255,255,255,0.2)", mb: 3}}/>

                        <Box sx={{width: "100%", paddingBottom: '1rem'}}>
                            {recommendations.length === 0 ? (
                                <Typography variant="h6" sx={{color: "#ccc", textAlign: 'center'}}>
                                    No recommendations found.
                                </Typography>
                            ) : (
                                <>
                                    <motion.ul initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}}>
                                        {recommendations.map((place) => (
                                            <motion.li
                                                key={place.id}
                                                whileHover={{scale: 1.03}}
                                                transition={{duration: 0.2}}
                                                style={{marginBottom: '1rem', listStyle: 'none'}}
                                            >
                                                <Paper
                                                    sx={{
                                                        padding: '1.5rem',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#2a2a2a',
                                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                                        marginBottom: "1rem",
                                                        color: '#fff'
                                                    }}
                                                    elevation={3}
                                                >
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
                                    /*---------- EVENTS -- ---------*/
                                    <motion.ul initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}}>
                                        { eventRecommendations && eventRecommendations.map((place, index) => (
                                            <motion.li
                                                key={index}
                                                whileHover={{scale: 1.03}}
                                                transition={{duration: 0.2}}
                                                style={{marginBottom: '1rem', listStyle: 'none'}}
                                            >
                                                <Paper
                                                    sx={{
                                                        padding: '1.5rem',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#2a2a2a',
                                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                                                        marginBottom: "1rem",
                                                        color: '#fff'
                                                    }}
                                                    elevation={3}
                                                >
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
                                                    { place.price != "N/A" ? (
                                                        <Typography variant="body2"
                                                                    sx={{color: '#aaa', marginBottom: '1rem'}}>
                                                            Price: {place.price}
                                                        </Typography>
                                                    ) : null}
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
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Recommendations;