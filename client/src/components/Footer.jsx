import { Box, Typography, Link, Divider } from "@mui/material";

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#121212",
                color: "white",
                py: 3,
                px: 2,
                textAlign: "center",
                minWidth: "100%"
            }}
        >

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "800px", mx: "auto" }}>
                {/* Left: Copyright */}
                <Typography variant="body2" color="gray">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </Typography>

                {/* Center: Made by this guy */}
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Made by{" "}
                    <Link
                        href="https://raydandev.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "#F18F01",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline", color: "white" },
                        }}
                    >
                        this guy
                    </Link>
                </Typography>
            </Box>

        </Box>
    );
};

export default Footer;