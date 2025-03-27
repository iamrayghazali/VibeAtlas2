import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("Yemen");
    const [country, setCountry] = useState("Sana'a");
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return; // to make sure no API call is made before user is authenticated
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
    }, [user, city, country]); // Depend on user, city, and country

    function createGoogleMapsLink(latitude, longitude) {
        if (latitude && longitude) {
            return `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
        return '#';
    }
    if (!user) return <p>Please log in to see recommendations.</p>;

    return (
        <div>
            {
                error ? (
                    <>
                        <h2>{error}</h2>
                    </>
                ) : (
                    <>
                        { loading ? (
                                <>
                                    <p>Loading...</p>
                                </>
                            ) : (
                                <>
                                    <h2>Your Personalized Recommendations</h2>
                                    <ul>
                                        { recommendations.map((place) => (
                                            <li key={place.id}>
                                                <h2>{place.name}</h2>
                                                <p>{place.location}</p>
                                                <p>{place.description}</p>
                                                <p>Category: {place.category}</p>
                                                <p>Price: {place.price_local} (~{place.price_usd})</p>
                                                {place.coordinates && (
                                                    <a
                                                        href={createGoogleMapsLink(place.coordinates.latitude, place.coordinates.longitude)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View on Google Maps
                                                    </a>
                                                )}
                                            </li>
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