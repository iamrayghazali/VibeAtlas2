import { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography, Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png"; // Make sure the path is correct
import ShinyText from './ShinyText';

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const handleSignOut = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    return (
        <AppBar position="sticky" sx={{ background: "white", boxShadow: "none", color: "black", fontFamily: "Lato" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Logo */}
                <Box component="img" src={logo} alt="Logo" sx={{ height: 50, cursor: "pointer" }} onClick={() => navigate("/")} />

                {/* Desktop Menu */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    <Button variant={"contained"}  sx={{backgroundColor: "black", color: "white"}}  color="text" onClick={() => navigate("/location")}>Select location</Button>

                    <Button  sx={{textTransform: "none"}}  color="text" onClick={() => navigate("/about")}>About</Button>
                    <Button
                        sx={{ textTransform: "none" }}
                        color="text"
                        onClick={() => document.getElementById("guide-section").scrollIntoView({ behavior: "smooth" })}
                    >
                        Guide
                    </Button>
                </Box>

                {/* Auth Buttons */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    {user ? (
                        <Button  sx={{textTransform: "none"}}  color="text" onClick={handleSignOut}>Logout</Button>
                    ) : (
                        <>
                            <Button  sx={{textTransform: "none"}}  variant={"outlined"} color={"black"} onClick={() => navigate("/register")}>Register</Button>
                            <Button  sx={{textTransform: "none"}} variant={"text"} color={"black"} onClick={() => navigate("/login")}>Login</Button>
                        </>
                    )}
                </Box>

                <Typography variant="h6" sx={{ textTransform: "none", fontFamily: "Lato", fontWeight: "600", display: { xs: "block", md: "none" }}}>Vibe Atlas</Typography>
                {/* Mobile Menu Button */}
                <IconButton edge="end" onClick={toggleDrawer(true)} sx={{ display: { md: "none" } }}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <motion.div initial={{ x: 50 }} animate={{ x: 0 }} exit={{ x: 50 }} transition={{ type: "spring", stiffness: 100 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 , padding: "10px", fontWeight: "bold", marginTop: "15px"}}>Menu</Typography>
                    <Divider />
                    <Divider />
                    <Divider />
                    <List>
                        <ListItem button onClick={() => navigate("/select-location")}>
                            <ListItemText primary="Select Location" />
                        </ListItem>
                        <Divider />

                        <ListItem button onClick={() => navigate("/about")}>
                            <ListItemText primary="About" />
                        </ListItem>
                        <Divider />

                        {user ? (
                            <ListItem button onClick={handleSignOut}>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        ) : (
                            <>
                                <ListItem button onClick={() => navigate("/register")}>
                                    <ListItemText primary="Register" />
                                </ListItem>
                                <Divider />
                                <ListItem  button onClick={() => navigate("/login")}>
                                    <ListItemText primary="Login" />
                                </ListItem>
                            </>
                        )}
                    </List>
                </motion.div>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;