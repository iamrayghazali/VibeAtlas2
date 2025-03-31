import React from "react";
import { Box } from "@mui/material";
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

const RowOfCities = () => {
    const navigate = useNavigate(); // Declare navigate function

    return (
        <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            {/* Title with smooth whoosh effect */}
            <motion.div
                className="title-container"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
                sx={{
                    fontSize: "140px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    marginBottom: "2rem",
                    color: "#333"
                }}
            >
                Explore Popular Destinations
            </motion.div>

            {/* Cards Grid */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Adjusted for more space
                gap: "16px",
                marginTop: "4rem",
                justifyItems: "center", // Ensure items are centered
            }}>
                {data.map((item, index) => (
                    <Box key={index} sx={{cursor: "pointer"}} onClick={() => navigate("/recommendations", { state: { country: item.country, city: item.city } })}>
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