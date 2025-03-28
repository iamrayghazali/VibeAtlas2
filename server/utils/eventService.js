const axios = require("axios");
require('dotenv').config();

const apiKey = process.env.TICKETMASTER_API_KEY;

if (!apiKey) {
    console.error("No API key found in environment variables");
}

async function getEventRecommendations() {
    try {
        axios.get(`https://app.ticketmaster.com/discovery/v2/events?geopoint=?apikey=${apiKey}`)
            .then((response) => {
                console.log("response.data", response.data);
                return response.data;
            })
            .catch((error) => {
                console.error("Error fetching event recommendations:", error);
            });
    } catch (e) {
        console.log(e);
        return { recommendations: [] };
    }
}

module.exports = { getEventRecommendations };
