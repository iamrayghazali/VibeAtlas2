import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";

function ErrorElement() {
    const navigate = useNavigate();

    return (
        <Box style={{ textAlign: "center", padding: "20px" }}>
            <Typography variant={"h2"}>Oops! Something went wrong.</Typography>
            <Typography variant={"subtitle1"}>The page you're looking for doesn't exist.</Typography>
            <Button variant="contained" onClick={() => navigate("/")}>Go to Home</Button>
        </Box>
    );
}

export default ErrorElement;