import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, TextField, Typography, Box, Divider } from "@mui/material";
import isEmail from "validator/es/lib/isEmail.js";

function Login() {
    const { login, googleLogin, currentUser } = useAuth();  // currentUser should be coming from AuthContext
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

    //TODO fix two login pages
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
                    padding: 5,
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
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#fff", mb: 2 }}>
                    Login
                </Typography>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 3 }} />

                <form onSubmit={handleLogin}>
                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={!isValidEmail}
                        helperText={!isValidEmail ? "Invalid email format" : ""}
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
                            }}
                            disabled={!isValidEmail || !email || !password}
                        >
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                flex: 1,
                                mr: 1,
                                fontSize: "1.1rem",
                                textTransform: "none",
                                background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                                "&:hover": { background: "linear-gradient(135deg, #fda085, #f6d365)" },
                            }}
                            onClick={googleLogin}
                        >
                            Login with google
                        </Button>
                    </Box>
                </form>

                <Button
                    variant="text"
                    onClick={() => navigate("/register")}
                    sx={{
                        textTransform: "none",
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": { color: "#fff" },
                    }}
                >
                    Sign up
                </Button>
            </Card>
        </Box>
    );
}

export default Login;