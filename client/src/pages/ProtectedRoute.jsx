import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        // Redirect to login if the user is not authenticated
        return <Navigate to="/login" />;
    }

    return children; // Render the protected content if the user is logged in
}

export default ProtectedRoute;