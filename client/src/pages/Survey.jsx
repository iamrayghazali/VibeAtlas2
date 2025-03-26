import { useState } from "react";

function Survey() {
    const [preferences, setPreferences] = useState({
        destinationType: "",
        climate: "",
        activities: "",
    });

    const handleChange = (e) => {
        setPreferences({
            ...preferences,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send this preferences data to your server (Express + MySQL)
        console.log(preferences);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>What's your ideal destination?</h3>
            <input
                type="text"
                name="destinationType"
                value={preferences.destinationType}
                onChange={handleChange}
                placeholder="e.g., beach, mountain"
            />
            <h3>Preferred Climate</h3>
            <input
                type="text"
                name="climate"
                value={preferences.climate}
                onChange={handleChange}
                placeholder="e.g., tropical, temperate"
            />
            <h3>Favorite Activities</h3>
            <input
                type="text"
                name="activities"
                value={preferences.activities}
                onChange={handleChange}
                placeholder="e.g., hiking, museums"
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default Survey;