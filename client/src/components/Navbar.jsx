import {useAuth} from "../context/AuthContext.jsx";


const Navbar = () => {

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <>
            <a href="/" onClick={handleLogout()}>Logout</a>
        </>
    )
}

export default Navbar;