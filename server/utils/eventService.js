const axios = require("axios");
require('dotenv').config();

const apiKey = process.env.TICKETMASTER_API_KEY;
const openCageApiKey = process.env.OPENCAGE_API_KEY;

if (!apiKey) {
    console.error("No API key found in environment variables");
}

async function getEventRecommendations(location) {
    try {
        const geopoint = await getCoordinates(location);

        if (!geopoint) {
            throw new Error('Error fetching coordinates');
        }
        console.log("Geopoint:", geopoint);

        const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json`, {
            params: {
                geoPoint: geopoint,  // Change from geopoint to geoPoint (capital P)
                radius: 50,          // Add a search radius
                unit: "km",          // Specify the unit
                locale: "*",         // Search all marketplaces/countries
                size: 50,            // Get up to 50 results
                apikey: apiKey,
            }
        });

        if (!response.data) {
            return false;
        }
        console.log("Events:", response.data);
        return response.data;  // Return the event data
    } catch (error) {
        console.error("Error fetching event recommendations:", error);
        return null;
    }
}

// Function to get coordinates from a location name (country or city)
async function getCoordinates(location) {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: location,
                key: openCageApiKey,
            },
        });

        // Check if a valid result is returned
        if (response.data.results.length > 0) {
            const coordinates = response.data.results[0].geometry;
            console.log(`${coordinates.lat},${coordinates.lng}`)
            return `${coordinates.lat},${coordinates.lng}`; // Returns "latitude,longitude"
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}

module.exports = { getEventRecommendations };
