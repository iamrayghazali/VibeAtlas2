import {Box, Container, Divider, Typography} from "@mui/material";
import CountUp from "./CountUp.jsx";
import RowOfCities from "./RowOfCities.jsx";
import React from "react";
import { motion } from "framer-motion";


const RowOfNumbers = () => {
    return (
        <>
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
        >
            <Container sx={{borderBottom: "1px solid white", marginBottom: "1rem"}}>
                    <Box
                        id="info-section"
                        sx={{
                            fontFamily: "Lato",
                            paddingTop: "6rem",
                            paddingBottom: "6rem",
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
                                className="count-up-text font-thin text-6xl text-carrot"
                            />
                            <Divider sx={{ margin: "1rem", backgroundColor: "white" }} />


                            <Typography
                                variant={"h4"}
                                sx={{
                                    color: "white",

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
                                addPlus={true}
                                from={0}
                                to={10000}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text font-thin text-6xl text-carrot"
                            />
                            <Divider sx={{ margin: "1rem", backgroundColor: "white" }} />
                            <Typography
                                variant={"h4"}
                                sx={{
                                    color: "white",

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
                                className="count-up-text font-thin text-6xl text-carrot"
                            />
                            <Divider sx={{ margin: "1rem", backgroundColor: "white" }} />
                            <Typography
                                variant={"h4"}
                                sx={{
                                    color: "white",
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
        </motion.div>

        </>
    )
}

export default RowOfNumbers;