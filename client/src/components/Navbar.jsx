import {Button} from "@mui/material";
import {getAuth, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";


const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSignOut = async () => {
        const auth = getAuth(); // Get Firebase Authentication instance
        try {
            await signOut(auth); // Sign out the user
            navigate("/login"); // Redirect to login page
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

        return (
            <>
                { user ? (
                    <Button variant={"contained"} onClick={handleSignOut}>Logout</Button>
                ) : null}
            </>
        )
    }

export default Navbar;