import {Box, Container, Divider, Typography} from "@mui/material";
import CountUp from "./CountUp.jsx";
import RowOfCities from "./RowOfCities.jsx";
import React from "react";


const RowOfNumbers = () => {
    return (
        <>
            <Container>
                    <Box
                        id="info-section"
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "2rem",
                            textAlign: "center",
                            "@media (max-width: 1200px)": {
                                gridTemplateColumns: "repeat(2, 1fr)", // 2 columns on medium screens
                            },
                            "@media (max-width: 768px)": {
                                gridTemplateColumns: "1fr", // 1 column on small screens
                            },
                        }}
                    >
                        <Box>
                            <CountUp
                                from={0}
                                to={195}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text font-thin text-8xl"
                            />
                            <Divider sx={{ margin: "1rem", backgroundColor: "black" }} />
                            <Typography
                                variant={"h4"}
                                sx={{
                                    fontFamily: "Lato",
                                    fontWeight: "bold",
                                    margin: "1rem",
                                    fontSize: "1.5rem", // Adjusted font size for responsiveness
                                    "@media (max-width: 768px)": {
                                        fontSize: "1.2rem", // Smaller font on mobile
                                    },
                                }}
                            >
                                Countries
                            </Typography>
                        </Box>

                        <Box>
                            <CountUp
                                from={0}
                                to={10000}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text font-thin text-8xl"
                            />
                            <Divider sx={{ margin: "1rem", backgroundColor: "black" }} />
                            <Typography
                                variant={"h4"}
                                sx={{
                                    fontFamily: "Lato",
                                    fontWeight: "bold",
                                    margin: "1rem",
                                    fontSize: "1.5rem", // Adjusted font size for responsiveness
                                    "@media (max-width: 768px)": {
                                        fontSize: "1.2rem", // Smaller font on mobile
                                    },
                                }}
                            >
                                Cities
                            </Typography>
                        </Box>

                        <Box>
                            <CountUp
                                from={100}
                                to={1}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text font-thin text-8xl"
                            />
                            <Divider sx={{ margin: "1rem", backgroundColor: "black" }} />
                            <Typography
                                variant={"h4"}
                                sx={{
                                    fontFamily: "Lato",
                                    fontWeight: "bold",
                                    margin: "1rem",
                                    fontSize: "1.5rem", // Adjusted font size for responsiveness
                                    "@media (max-width: 768px)": {
                                        fontSize: "1.2rem", // Smaller font on mobile
                                    },
                                }}
                            >
                                Developer
                            </Typography>
                        </Box>
                    </Box>
            </Container>
        </>
    )
}

export default RowOfNumbers;