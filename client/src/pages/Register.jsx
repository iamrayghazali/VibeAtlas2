import React, {useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {Card, Button, TextField, Typography, Box, Divider, CircularProgress} from "@mui/material";
import isEmail from "validator/es/lib/isEmail.js";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import CircularText from "../components/CircularText.jsx";
import bgImage from "../assets/auth-bg.jpg";
import LoadingPage from "./LoadingPage.jsx";

function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [isValidEmail, setIsValidEmail] = useState(true);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.uid) {
            saveUserToDatabase(email, name).then(() => console.log("saveUserToDatabase ran in useffect"));
            setLoading(false)
        }
    }, [user])

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            console.log('registering w firebase', email, name, password);
            await register(email, password);
            //TODO navigate to survey if it has not been filled
            navigate("/");
        } catch (error) {
            console.error("Registration failed:", error.message);
            console.log("Maybe already have an account")
        }
    };

    const saveUserToDatabase = async (email, name) => {
        if (user.uid) {
            const uid = user.uid;
            console.log("submitting user to db: ", user.uid);
            try {
                axios.post("http://127.0.0.1:7050/api/user/new", { uid, email, name })
                    .then((res) => {
                        console.log(res);
                        console.log("saved user");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (e) {
                console.error("Error saving user", e);
            }
        } else {
            console.log("saved data tod bd failed: user.uid- ", user.uid)
        }
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsValidEmail(isEmail(inputEmail));
    };

    //TODO fix auth
    if (loading) {
        return <LoadingPage />;
    }

    return (
        <>
        <Navbar/>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center", minHeight: "calc(100vh - 55px)", minWidth: "100%",
            }}
        >
            <CircularText
                text="VIBE*ATLAS*VIBE*ATLAS*"
                onHover="speedUp"
                size="200"
                textColor="text-black"
                spinDuration={20}
                className="custom-class font-Lato text-2xl mb-10 text-black"
            />
            <Card
                sx={{
                    p: 5,
                    width: { xs: "90%", sm: "450px", md: "500px" },
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.3)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 600, color: "black", mb: 2 }}>
                    Create Account
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 100, color: "black"}}>
                    It only takes 20 seconds to register
                </Typography>

                <Divider sx={{ borderColor: "black", mb: 3 }} />

                <form onSubmit={handleRegister}>
                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={!isValidEmail}
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
                                color: "#F0EAD6", // color when floating
                            },
                        }}
                    />
                    <TextField
                        type="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
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
                                color: "#F0EAD6", // color when floating
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
                                color: "#F0EAD6", // color when floating
                            },
                        }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                color: "black",
                                flex: 1,
                                mr: 1,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                background: "#F18F01",
                                "&:hover": { background: "#F0EAD6" },
                                maxWidth: { xs: "40%", md: "50%" },
                                margin: "1rem"
                            }}
                            disabled={!isValidEmail || !email || !password}
                        >
                            Register
                        </Button>
                    </Box>
                </form>

                <Button
                    variant="text"
                    onClick={() => navigate("/login")}
                    sx={{
                        textTransform: "none",
                        position: "absolute",
                        bottom: 16,
                        right: 30,
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": { color: "#fff" },
                    }}
                >
                    I already have an account
                </Button>
            </Card>
        </Box>
        </>
    );
}

export default Register;