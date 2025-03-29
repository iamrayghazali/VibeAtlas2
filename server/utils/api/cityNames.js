const axios = require("axios");
require('dotenv').config();

const apiKey = process.env.RAPIDAPI_KEY;

if (!apiKey) {
    console.error("No API key found in environment variables");
}

async function getCityNames(country) {
    const options = {
        method: 'GET',
        url: `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}/places?limit=50`,
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);  // Log to check the data
        return response.data.data;  // Ensure you return the 'data' from response to extract city names
    } catch (error) {
        if (error.response) {
            // Server responded with a status code other than 2xx
            console.error("API Response Error:", error.response.data);
            console.error("Status Code:", error.response.status);
        } else if (error.request) {
            // Request was made, but no response was received
            console.error("No response received:", error.request);
        } else {
            // Something went wrong setting up the request
            console.error("Request Setup Error:", error.message);
        }
    }
}


module.exports = { getCityNames };