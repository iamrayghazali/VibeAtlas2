import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, TextField, Typography, Box, Divider } from "@mui/material";
import isEmail from "validator/es/lib/isEmail.js";
import axios from "axios";

function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [isValidEmail, setIsValidEmail] = useState(true);
    const { user } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            await saveUserToDatabase(email, password, name);
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
        }
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsValidEmail(isEmail(inputEmail));
    };

    //TODO fix auth

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #1F1C2C 0%, #928DAB 100%)",
            }}
        >
            <Card
                sx={{
                    p: 5,
                    width: { xs: "90%", sm: "450px", md: "500px" },
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.3)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#fff", mb: 2 }}>
                    Create Account
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 100, color: "#fff"}}>
                    It only takes 20 seconds to register
                </Typography>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 3 }} />

                <form onSubmit={handleRegister}>
                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={!isValidEmail}
                        onChange={handleEmailChange}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                                "&:hover fieldset": { borderColor: "#fff" },
                                "&.Mui-focused fieldset": { borderColor: "#fff" },
                            },
                            input: { color: "#fff" },
                            label: { color: "rgba(255,255,255,0.7)" },
                            width: { xs: "90%", md: "60%" },
                        }}
                    />
                    <TextField
                        type="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                                "&:hover fieldset": { borderColor: "#fff" },
                                "&.Mui-focused fieldset": { borderColor: "#fff" },
                            },
                            input: { color: "#fff" },
                            label: { color: "rgba(255,255,255,0.7)" },
                            width: { xs: "90%", md: "60%" },
                        }}
                    />

                    <TextField
                        type="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            mb: 4,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                                "&:hover fieldset": { borderColor: "#fff" },
                                "&.Mui-focused fieldset": { borderColor: "#fff" },
                            },
                            input: { color: "#fff" },
                            label: { color: "rgba(255,255,255,0.7)" },
                            width: { xs: "90%", md: "60%" },

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
                                background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                                "&:hover": { background: "linear-gradient(135deg, #fda085, #f6d365)" },
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
    );
}

export default Register;