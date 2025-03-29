import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import {Box, LinearProgress, Typography} from "@mui/material";

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
            //getAIRecommendations().then(() => console.log("AI recommendations function ran."));
            getEventRecommendations().then(() => console.log("Event recommendations function ran."));
        }

    }, [user, city, country]); // Depend on user, city, and country

    const getAIRecommendations =  async () => {
        setLoading(true);
        axios.get(`http://localhost:7050/api/recommendations/${user.uid}/${city}/${country}`)
            .then((response) => {
                setRecommendations(response.data.recommendations);
                console.log(response.data.recommendations);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
                setLoading(false);
                setError("We could not fetch recommendations, please try again later.");
            } );
    }

    const getEventRecommendations = async () => {
        setLoading(true);
        axios.get("api/recommendations/events").then((response) => {
            console.log(response.data);
            return response.data;
        })

    }

    function createGoogleMapsLink(latitude, longitude) {
        if (latitude && longitude) {
            return `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        return '#';
    }

    if (!user) return <p>Please log in to see recommendations.</p>;

    return (
        <div>
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
            { user ? ("logged in") :("not logged in")}
            {
                error ? (
                    <>
                        <Typography variant={"h2"}>{error}</Typography>
                    </>
                ) : (
                    <>
                        { loading ? (
                                <>
                                    <Typography variant={"h2"}>Loading...</Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant={"h2"}>Your Personalized Recommendations</Typography>
                                    <ul>
                                        { recommendations.map((place) => (
                                            <>
                                                <Typography variant={"h2"}>For you</Typography>
                                                    <Box key={place.id}>
                                                        <Typography variant={"h2"}>{place.name}</Typography>
                                                        <Typography variant={"subtitle1"}>{place.location}</Typography>
                                                        <Typography variant={"subtitle1"}>{place.description}</Typography>
                                                        <Typography variant={"subtitle1"}>Category: {place.category}</Typography>
                                                        <Typography variant={"subtitle1"}>Price: {place.price_local} (~{place.price_usd})</Typography>
                                                        {place.coordinates && (
                                                            <a
                                                                href={createGoogleMapsLink(place.coordinates.latitude, place.coordinates.longitude)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View on Google Maps
                                                            </a>
                                                        )}
                                                    </Box>
                                            </>
                                        ))}
                                    </ul>
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    );
};

export default Recommendations;