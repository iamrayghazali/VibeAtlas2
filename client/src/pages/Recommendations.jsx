import { useEffect, useState } from 'react';
import axios from 'axios';
import {useUser} from "../UserContext.jsx";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const { user } = useUser();

    if (!user) {
        return <p>Please log in to see recommendations.</p>;
    }

    const userId = user.uid; // Access the user ID

    useEffect(() => {
        const userId = 1;  // Replace with actual user ID, maybe stored in global state

        axios.get(`http://localhost:7050/recommendations/${userId}`)
            .then((response) => {
                setRecommendations(response.data.recommendations);
            })
            .catch((error) => {
                console.error('Error fetching recommendations:', error);
            });
    }, []);

    return (
        <div>
            <h1>Your Personalized Recommendations</h1>
            <ul>
                {recommendations.map((place, index) => (
                    <li key={index}>
                        <h2>{place.name}</h2>
                        <p>{place.location}</p>
                        <p>{place.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;