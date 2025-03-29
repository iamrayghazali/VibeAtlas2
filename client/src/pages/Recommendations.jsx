import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("Yemen");
    const [country, setCountry] = useState("Sana'a");
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoading(false);
        }
        // to make sure no API call is made before user is authenticated
        if (user) {
            getAIRecommendations().then(() => console.log("AI recommendations function ran."));
        }

    }, [user, city, country]); // Depend on user, city, and country

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

    if (!user) return <Typography variant={"h3"} sx={{textAlign: "center"}}>Please log in to see recommendations.</Typography>;

    return (
        <Box sx={{ width: '100%', padding: '2rem', backgroundColor: '#121212', minHeight: '100vh' }}>
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
                        <Typography variant="h4" sx={{ fontWeight: 600, color: "#fff", marginBottom: "1.5rem" }}>
                            Your Personalized Recommendations
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <CircularProgress size="4rem" />
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: "#fff", marginBottom: "1.5rem" }}>
                            Your Personalized Recommendations
                        </Typography>

                        <Box sx={{ width: "100%", paddingBottom: '1rem' }}>
                            {recommendations.length === 0 ? (
                                <Typography variant="h6" sx={{ color: "#ccc", textAlign: 'center' }}>
                                    No recommendations found.
                                </Typography>
                            ) : (
                                <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                                    {recommendations.map((place) => (
                                        <motion.li
                                            key={place.id}
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ marginBottom: '1rem', listStyle: 'none' }}
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
                                                <Typography variant="body1" sx={{ color: '#aaa', marginBottom: '0.5rem' }}>
                                                    {place.location}
                                                </Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                                                    {place.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#ccc', marginBottom: '0.5rem' }}>
                                                    {place.description}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#aaa', marginBottom: '0.5rem' }}>
                                                    Category: {place.category}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#aaa', marginBottom: '1rem' }}>
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
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Recommendations;