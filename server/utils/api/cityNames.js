const axios = require("axios");
require("dotenv").config();

const geoUsername = process.env.GEONAMES_USERNAME;

if (!geoUsername) {
    console.error("❌ No Geonames username found in environment variables");
}

async function getCityNames(country) {
    const url = `http://api.geonames.org/searchJSON?country=${country}&featureClass=P&maxRows=1000&username=${geoUsername}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.geonames) {
            return response.data.geonames.map(city => city.name);
        } else {
            console.error("Unexpected API response:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching city names:", error.message);
        return [];
    }
}

module.exports = { getCityNames };