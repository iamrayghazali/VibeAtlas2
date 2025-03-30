import { useState } from "react";
import { AppBar, Toolbar, IconButton, Button, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png"; // Make sure the path is correct

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
        <AppBar position="sticky" sx={{ background: "white", boxShadow: "none", color: "black", textTransform: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Logo */}
                <Box component="img" src={logo} alt="Logo" sx={{ height: 40, cursor: "pointer" }} onClick={() => navigate("/")} />

                {/* Desktop Menu */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    <Button color="text" onClick={() => navigate("/select-location")}>select Location</Button>
                    <Button color="text" onClick={() => navigate("/about")}>about</Button>
                </Box>

                {/* Auth Buttons */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    {user ? (
                        <Button color="text" onClick={handleSignOut}>Logout</Button>
                    ) : (
                        <>
                            <Button color="outlined" onClick={() => navigate("/register")}>Register</Button>
                            <Button color="text" onClick={() => navigate("/login")}>Login</Button>
                        </>
                    )}
                </Box>

                {/* Mobile Menu Button */}
                <IconButton edge="end" onClick={toggleDrawer(true)} sx={{ display: { md: "none" } }}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: 100 }} transition={{ type: "spring", stiffness: 100 }}>
                    <List>
                        <ListItem button onClick={() => navigate("/select-location")}>
                            <ListItemText primary="Select Location" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/about")}>
                            <ListItemText primary="About" />
                        </ListItem>
                        {user ? (
                            <ListItem button onClick={handleSignOut}>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        ) : (
                            <>
                                <ListItem button onClick={() => navigate("/register")}>
                                    <ListItemText primary="Register" />
                                </ListItem>
                                <ListItem button onClick={() => navigate("/login")}>
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