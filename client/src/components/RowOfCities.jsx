import React from "react";
import {Box, Typography} from "@mui/material";
import TiltedCard from "./TiteledCard.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import amsterdam from "../assets/locations/amsterdam.jpg";
import ibiza from "../assets/locations/ibiza.jpg";
import rio from "../assets/locations/rio.jpg";
import rome from "../assets/locations/rome.jpg";

const data = [
    { city: "Amsterdam", country: "Netherlands", img: amsterdam },
    { city: "Ibiza", country: "Spain", img: ibiza },
    { city: "Rio De Janeiro", country: "Brazil", img: rio },
    { city: "Rome", country: "Italy", img: rome }
];

const RowOfCities = (user) => {
    const navigate = useNavigate(); // Declare navigate function

    return (
        <Box sx={{ textAlign: "center", paddingBottom: "10rem", paddingTop: "6rem" }}>
            {/* Title with smooth whoosh effect */}
            <motion.div
                className="title-container"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
                sx={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    marginBottom: "2rem",
                    color: "#333"
                }}
            >
                <Typography variant="h3" sx={{color: "", fontFamily: "Lato"}}>
                    Explore Popular Destinations
                </Typography>
            </motion.div>

            {/* Cards Grid */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",       // 1 column on extra small screens
                    sm: "repeat(2, 1fr)",  // 2 columns on small screens
                    lg: "repeat(4, 1fr)",  // 4 columns on large screens
                },
                gap: "16px",
                marginTop: "4rem",
                justifyItems: "center", // Ensure items are centered
                alignItems: "center",
            }}>
                {data.map((item, index) => (
                    <Box key={index} sx={{cursor: "pointer"}} onClick={() => {
                        user.user ? navigate("/recommendations", {
                            state: {
                                country: item.country,
                                city: item.city
                            }
                        }) : navigate("/login")
                    }}>
                        <TiltedCard
                            key={index}
                            imageSrc={item.img}
                            altText={item.city}
                            captionText={"Select Location"}
                            containerHeight="250px"  // Adjusted to allow bigger cards on mobile
                            containerWidth="250px"  // Adjusted to allow bigger cards on mobile
                            imageHeight="250px"  // Adjusted for consistent sizes
                            imageWidth="250px"  // Adjusted for consistent sizes
                            rotateAmplitude={12}
                            scaleOnHover={1.2}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                                <p className="tilted-card-demo-text">
                                    {item.city}
                                </p>
                            }
                        />
                    </Box>
                ))}
                </Box>
        </Box>
    );
};

export default RowOfCities;