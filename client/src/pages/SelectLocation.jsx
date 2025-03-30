import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Tooltip } from "react-tooltip";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {Autocomplete, Button, CircularProgress, TextField, Typography} from "@mui/material";
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
    const [loading, setLoading] = useState(false); // For loading state

    const countryNames = map.objects.world.geometries.map(geometry => geometry.properties.name);

    // Fetch city names from the backend
    async function getCityNames() {
        if (currentCountryAbrv) {
            console.log("Fetching data for:", currentCountryAbrv);
            setLoading(true); // Set loading to true before making the request
            try {
                const response = await axios.get(`/api/survey/${currentCountryAbrv}/cities`);
                console.log("API Response:", response);

                if (response.data && response.data.cities && Array.isArray(response.data.cities)) {
                    console.log("City names:", response.data.cities);
                    setCityNames(response.data.cities);
                } else {
                    console.error("Unexpected data format:", response);
                    setCityNames([]);
                }
            } catch (error) {
                console.error("Error fetching city names:", error);
                setCityNames([]);
            } finally {
                setLoading(false); // Set loading to false once data is fetched or an error occurs
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
                value={currentCountryName} // Ensure this is the current country name
                onChange={(event, newValue) => {
                    const countryCode = convertToTwoLetterCode(newValue);  // Convert to country code
                    setCurrentCountryName(newValue); // Update country name
                    setCurrentCountryAbrv(countryCode); // Update country abbreviation
                }}
                renderInput={(params) => <TextField {...params} label={currentCountryName || "Select a Country"} variant="outlined" />}
            />

            {currentCountryAbrv ? ( // Ensure there are city names before rendering the city select
                <>
                    <Typography variant={"h5"}>Nice! Now select the city.</Typography>
                    {loading ? ( // Show loading indicator while fetching cities
                        <CircularProgress size="4rem" />
                    ) : (
                        <Autocomplete
                            disablePortal
                            options={cityNames}
                            sx={{ width: 300 }}
                            value={currentCity}
                            onChange={(event, newValue) => setCurrentCity(newValue)}
                            renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
                            getOptionLabel={(option) => option} // Ensure this is using a unique property of the city
                            renderOption={(props, option, state) => (
                                <li {...props} key={option + state.index}>{option}</li>  // Ensure the key is unique
                            )}
                        />
                    )}
                { currentCity ? (
                    <>
                        <Button variant={"contained"} onClick={() => {
                            navigate("/recommendations", { state: { country: currentCountryName, city: currentCity } })
                        }}>Check recommendations and events</Button>
                        <Button href="mailto:support@example.com?subject=I%20can't%20see%20a%20city" target="_blank">
                            Can't see a city?
                        </Button>
                    </>
                    ) : (
                        <>

                    </>
                    )}
                </>
            ) : null}
        </div>
    );
}

export default Home;