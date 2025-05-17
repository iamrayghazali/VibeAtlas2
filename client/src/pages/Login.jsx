import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, TextField, Typography, Box, Divider } from "@mui/material";
import isEmail from "validator/es/lib/isEmail.js";
import Navbar from "../components/Navbar.jsx";
import bgImage from "../assets/auth-bg.jpg";
import CircularText from "../components/CircularText.jsx";
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
    const { login, googleLogin, currentUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isValidEmail, setIsValidEmail] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate("/recommendations/");
        } else {
            console.log("Not logged in");
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsValidEmail(isEmail(inputEmail));
    };

    useEffect(() => {
        if (user && user.uid) {
            navigate("/location");
        }
    }, [user]);

    return (
        <>
        <Navbar/>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center", minHeight: "calc(100vh - 55px)", minWidth: "100%",
            }}
        >
            <CircularText
                text="VIBE*ATLAS*VIBE*ATLAS*"
                onHover="speedUp"
                size="300"
                textColor="text-black"
                spinDuration={20}
                className="custom-class font-Lato text-2xl mb-10 text-black"
            />
            <Card
                sx={{
                    padding: 5,
                    width: { xs: "90%", sm: "450px", md: "500px" },
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                    backdropFilter: "blur(5px)",
                    borderRadius: "20px",
                    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.3)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 600, color: "black", mb: 2 }}>
                    Login
                </Typography>

                <Divider sx={{ borderColor: "black", mb: 3}} />

                <form onSubmit={handleLogin}>
                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={!isValidEmail}
                        helperText={!isValidEmail ? "Invalid email" : ""}
                        onChange={handleEmailChange}
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "black" },
                                "&:hover fieldset": { borderColor: "#fff" },
                                "&.Mui-focused fieldset": { borderColor: "#fff" },
                            },
                            input: { color: "black" },
                            "& label": {
                                color: "#F0EAD6",
                            },
                            "& label.Mui-focused": {
                                fontWeight: "bold",
                                color: "#F0EAD6",
                            },
                        }}
                    />

                    <TextField
                        type="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "black" },
                                "&:hover fieldset": { borderColor: "#fff" },
                                "&.Mui-focused fieldset": { borderColor: "#fff" },
                            },
                            input: { color: "black" },
                            "& label": {
                                color: "#F0EAD6",
                            },
                            "& label.Mui-focused": {
                                fontWeight: "bold",
                                color: "#F0EAD6",
                            },
                        }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                flex: 1,
                                mr: 1,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                background: "#F0EAD6",
                                "&:hover": { background: "#F18F01" },
                            }}
                            disabled={!isValidEmail || !email || !password}
                        >
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                color: "black",
                                flex: 1,
                                mr: 1,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                background: "#F0EAD6",
                                fontWeight: "bold",
                                "&:hover": { background: "#F18F01" },
                            }}
                            onClick={googleLogin}
                        >
                            <GoogleIcon sx={{margin: "10px"}} /> Google
                        </Button>
                    </Box>
                </form>

                <Button
                    variant="text"
                    onClick={() => navigate("/register")}
                    sx={{
                        textTransform: "none",
                        position: "absolute",
                        bottom: 5,
                        right: 20,
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": { color: "black" },
                    }}
                >
                    Sign up
                </Button>
            </Card>
        </Box>
        </>

    );
}

export default Login;