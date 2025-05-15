import {Box, CircularProgress} from "@mui/material";
import React from "react";

const LoadingPage = () => {
    return (
        <>
            <Box sx={{position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1}}>
                <CircularProgress size="4rem" sx={{color: "#F18F01"}}/>
            </Box>
        </>
    )
}
export default LoadingPage;