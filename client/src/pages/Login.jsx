import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const { login, googleLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const user = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            if (login) {
                console.log(login);
                console.log("logged in");

            }
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    return (
        <div> { user ? ("logged in") :("not logged in")}
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <button onClick={googleLogin}>Sign in with Google</button>
        </div>
    );
}

export default Login;