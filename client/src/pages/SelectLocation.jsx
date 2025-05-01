import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {Tooltip} from "react-tooltip";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import {Autocomplete, Box, Button, CircularProgress, Divider, TextField, Typography} from "@mui/material";
import map from "../assets/map-data.json";
import axios from "axios";
import * as iso3166 from "iso-3166-1";
import Navbar from "../components/Navbar.jsx";

function SelectLocation() {
    const navigate = useNavigate();
    const [currentCountryAbrv, setCurrentCountryAbrv] = useState("");
    const [currentCountryName, setCurrentCountryName] = useState("");
    const [currentCity, setCurrentCity] = useState("");
    const [currentHighlight, setCurrentHighlight] = useState("");
    const {user} = useAuth();
    const [cityNames, setCityNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const cityRef = useRef(null);
    const [user_id, setUser_id] = useState(null);

    const countryNames = map.objects.world.geometries.map(geometry => geometry.properties.name);
    const countryIds = map.objects.world.geometries.map(geometry => geometry.id);

    useEffect(() => {
        if (currentCountryAbrv) {
            getCityNames();
        }
    }, [currentCountryAbrv]);

    useEffect(() => {
        let fallbackTimeout;

        if (user && user.uid) {
            setLoading(false); // user is ready
            if (!user_id) {
                setLoading(true);
                fetchUserId().then(fetchedId => {
                    if (fetchedId) {
                        setUser_id(fetchedId);
                        checkIfSurveyIsFilled();
                    }
                });
            } else {
                checkIfSurveyIsFilled();
            }
        } else {
            setLoading(true);
            // Set a timeout to fallback if user is not set within 5 sec
            fallbackTimeout = setTimeout(() => {
                if (!user || !user.uid) {
                    console.log("User not logged in after timeout. Redirecting...");
                    navigate("/login"); // or show a message
                }
            }, 2000);
        }

        // Clear timeout if component unmounts or user logs in
        return () => clearTimeout(fallbackTimeout);
    }, [user, user_id]);

    //Scroll if country is selected
    useEffect(() => {
        if (cityRef.current) {
            cityRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [currentCountryAbrv]);

    // is user has not filled out the survey, direct them to /survey
    async function checkIfSurveyIsFilled() {
        try {
            const userId = await fetchUserId();
            await axios.get(`/api/user/survey/${userId}`)
                .then(res => {
                    if (res.data.filledOut) {
                        console.log(res.data.filledOut, "survey filled out by user");
                        setLoading(false);
                    } else {
                        navigate("/survey");
                    }
                })
                .catch(err => console.log(err));
        } catch (e) {
            console.error("Error fetching user:", e);
        }
    }

    //TODO check if this works
    async function saveDataToHistory() {
        if (user_id) {
            try {
                await axios.post(`api/history/${user_id}/searches`, {
                    country: currentCountryName,
                    city: currentCity,
                }).then(() => console.log("Saved to db: ", currentCountryName, currentCity));
                navigate("/recommendations", {
                    state: {
                        country: currentCountryName,
                        city: currentCity
                    }
                })
            } catch (e) {
                console.error(e);
            }
        } else {
            console.log("Error saving survey answers, userId state is not true");
        }
    }

    const fetchUserId = async () => {
        if (user && user.uid) {
            try {
                const response = await axios.get(`http://127.0.0.1:7050/api/user/user-id/${user.uid}`);
                if (response.status === 404) {
                    console.log("user not found when fetching from db.", response);
                    setUser_id(null);
                }
                setUser_id(response.data.id);
                return response.data.id;
            } catch (error) {
                console.error('Error fetching user id:', error);
            }
        } else {
            console.log("Log in to save history")
        }
    };

    async function getCityNames() {
        if (currentCountryAbrv) {
            console.log("Fetching data for:", currentCountryAbrv);
            setLoadingCities(true);
            try {
                const response = await axios.get(`/api/survey/${currentCountryAbrv}/cities`);
                if (response.data && response.data.cities && Array.isArray(response.data.cities)) {
                    setCityNames(response.data.cities);
                } else {
                    console.error("Unexpected data format:", response);
                    setCityNames([]);
                }
            } catch (error) {
                console.error("Error fetching city names:", error);
                setCityNames([]);
            } finally {
                setLoadingCities(false);
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

    function findCountryIdByName(countryName) {
        const country = map.objects.world.geometries.find(geometry => geometry.properties.name === countryName);
        return country.id;
    }

    return (
        <>
            {loading ? (
                <Box sx={{position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1}}>
                    <CircularProgress size="4rem" sx={{color: "#F18F01"}}/>
                </Box>
            ) : (
                <div>
                    <Navbar></Navbar>
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        <Typography variant={"h2"} sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontFamily: "Lato",
                            color: "#F18F01",
                            marginTop: {xs: "1rem", md: "3rem"},
                            fontSize: {xs: "2rem", md: "4rem"},
                            padding: "1rem"
                        }}>Where are you vibin' today?</Typography>
                        <Typography variant={"body1"} sx={{
                            textAlign: "center",
                            fontWeight: "thin",
                            fontFamily: "Lato",
                            color: "black",
                            fontSize: {xs: "0.8rem", md: "1.5rem"},
                            marginBottom: "3rem"
                        }}>Select a country from the map or the dropdown.</Typography>

                        <Autocomplete
                            disablePortal
                            options={countryNames}
                            sx={{
                                width: 300, padding: "1rem", borderColor: "#F18F01",
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: "black",
                                    },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#F18F01", // Color of the label when focused
                                },
                            }}
                            value={currentCountryName}
                            onChange={(event, newValue) => {
                                console.log("setting setCurrentCountryName to " + newValue);
                                setCurrentCountryName(newValue);
                                const countryCode = convertToTwoLetterCode(findCountryIdByName(newValue));
                                setCurrentCountryAbrv(countryCode);
                                console.log("setting setCurrentCountryAbrv to " + countryCode);

                            }}
                            renderInput={(params) => <TextField {...params}
                                                                label={currentCountryName ? "Selected country" : "Select a Country"}
                                                                variant="outlined"/>}
                        />
                    </Box>
                    <Tooltip id="my-tooltip"/>
                    <ComposableMap data-tip="">
                        <Geographies geography="/src/assets/map-data.json">
                            {({geographies}) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            const {name} = geo.properties;
                                            setCurrentHighlight(`${name}`);
                                        }}
                                        onMouseLeave={() => {
                                            setCurrentHighlight("");
                                        }}
                                        onClick={() => {
                                            const countryName = geo.properties.name;
                                            const countryCode = convertToTwoLetterCode(geo.id);
                                            setCurrentCountryName(countryName);
                                            setCurrentCountryAbrv(countryCode);
                                        }}
                                        data-tooltip-content={geo.properties.name}
                                        data-tooltip-id="my-tooltip"
                                        className="hover:fill-brown transition-transform duration-200 ease-in-out"
                                    />
                                ))
                            }
                        </Geographies>
                    </ComposableMap>

                    {currentCountryAbrv ? (
                        <>
                            <Box ref={cityRef} sx={{
                                minHeight: "80vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>

                                <Divider sx={{width: "80%"}}></Divider>
                                <Typography variant={"h5"} sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontFamily: "Lato",
                                    color: "#F18F01",
                                    marginBottom: "2rem",
                                    margin: {xs: "", md: "3rem"}
                                }}>Nice! Now select the city.</Typography>
                                {loadingCities ? ( // Show loading indicator while fetching cities
                                    <CircularProgress size="4rem" sx={{color: "#F18F01"}}/>
                                ) : (
                                    <>
                                        <Autocomplete
                                            disablePortal
                                            options={cityNames}
                                            sx={{
                                                width: 300, padding: "1rem", borderColor: "#F18F01",
                                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                    {
                                                        borderColor: "black",
                                                    },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "#F18F01", // Color of the label when focused
                                                },
                                            }}
                                            value={currentCity}
                                            onChange={(event, newValue) => setCurrentCity(newValue)}
                                            renderInput={(params) => <TextField {...params} label="City"
                                                                                variant="outlined"/>}
                                            getOptionLabel={(option) => option} // Ensure this is using a unique property of the city
                                            renderOption={(props, option, state) => (
                                                <li {...props} key={option + state.index}>{option}</li>  // Ensure the key is unique
                                            )}
                                        />
                                        <Button sx={{textTransform: "none", color: "grey", fontStyle: "italic"}}
                                                href="mailto:support@example.com?subject=I%20can't%20see%20a%20city"
                                                target="_blank">
                                            Can't see a city?
                                        </Button>
                                    </>
                                )}
                                {currentCity ? (
                                    <>
                                        <Button sx={{
                                            textTransform: "none",
                                            backgroundColor: "#F18F01",
                                            color: "black",
                                            marginTop: "2rem"
                                        }} variant={"contained"} onClick={() => saveDataToHistory()}>
                                            Generate Recommendations and Events
                                        </Button>
                                    </>
                                ) : null}
                            </Box>

                        </>
                    ) : null}
                </div>
            )}
        </>

    );
}

export default SelectLocation;