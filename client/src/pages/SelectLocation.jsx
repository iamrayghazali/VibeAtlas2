import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Tooltip } from "react-tooltip";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {Autocomplete, TextField, Typography} from "@mui/material";
import map from "../assets/map-data.json";
import axios from "axios";
import * as iso3166 from "iso-3166-1";

function Home() {
    const navigate = useNavigate();
    const [currentCountryAbrv, setCurrentCountryAbrv] = useState("");
    const [currentCountryName, setCurrentCountryName] = useState("");
    const [currentCity, setCurrentCity] = useState("");
    const [currentHighlight, setCurrentHighlight] = useState("");
    const user = useAuth();
    const [cityNames, setCityNames] = useState([]); // Initialize cityNames to an empty array

    const countryNames = map.objects.world.geometries.map(geometry => geometry.properties.name);

    // Fetch city names from the backend
    async function getCityNames() {
        if (currentCountryAbrv) {
            console.log("Fetching data for:", currentCountryAbrv);
            try {
                const response = await axios.get(`api/survey/${currentCountryAbrv}/cities`);
                // Check the structure of the response
                console.log("API Response:", response);

                // Access the city names from the nested 'data' object
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    console.log("City names:", response.data.data);
                    setCityNames(response.data.data); // Update the city names from the nested 'data' key
                } else {
                    console.error("Unexpected data format:", response);
                    setCityNames([]); // Reset to empty if the format is wrong
                }
            } catch (error) {
                console.error("Error fetching city names:", error);
                setCityNames([]); // Reset to empty on error
            }
        } else {
            console.log("Country not selected");
        }
    }

    // Convert 3-letter country code to 2-letter country code
    function convertToTwoLetterCode(threeLetterCode) {
        const country = iso3166.whereAlpha3(threeLetterCode);
        return country ? country.alpha2 : null; // Returns the 2-letter country code
    }

    // Trigger city fetch when currentCountryAbrv is updated
    useEffect(() => {
        if (currentCountryAbrv) {
            getCityNames();
        }
    }, [currentCountryAbrv]);

    return (
        <div>
            <Typography variant={"h2"}>Where are you vibin' today?</Typography>

            <Tooltip id="my-tooltip" />
            <ComposableMap data-tip="">
                <Geographies geography="/src/assets/map-data.json">
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onMouseEnter={() => {
                                    const { name } = geo.properties;
                                    setCurrentHighlight(`${name}`);
                                }}
                                onMouseLeave={() => {
                                    setCurrentHighlight("");
                                }}
                                onClick={() => {
                                    const countryName = geo.properties.name;
                                    const countryCode = convertToTwoLetterCode(geo.id);
                                    setCurrentCountryName(countryName);
                                    setCurrentCountryAbrv(countryCode); // Update country abbreviation
                                }}
                                data-tooltip-content={geo.properties.name}
                                data-tooltip-id="my-tooltip"
                                className="hover:fill-brown transition-transform duration-200 ease-in-out"
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>

            <Autocomplete
                disablePortal
                options={countryNames}
                sx={{ width: 300 }}
                value={currentCountryName} // Set the selected country based on currentCountryName
                onChange={(event, newValue) => {
                    const countryCode = convertToTwoLetterCode(newValue); // Convert to country code
                    setCurrentCountryName(newValue); // Update country name
                    setCurrentCountryAbrv(countryCode); // Update country abbreviation
                }}
                renderInput={(params) => <TextField {...params} label={currentCountryName || "Select a Country"} variant="outlined" />}
            />

            {currentCountryAbrv ? ( // Ensure there are city names before rendering the city select
                <>
                    <Typography variant={"h5"}>Nice! Now select the city.</Typography>
                    <Autocomplete
                        disablePortal
                        options={cityNames}
                        sx={{ width: 300 }}
                        value={currentCity} // Bind current city to the state
                        onChange={(event, newValue) => setCurrentCity(newValue)} // Set selected city
                        renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
                    />
                </>
            ) : null}
        </div>
    );
}

export default Home;