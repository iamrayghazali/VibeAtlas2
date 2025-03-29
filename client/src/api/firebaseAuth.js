import axios from "axios";

export const verifyUser = async (idToken) => {
    try {
        const response = await axios.post("http://localhost:7050/verifyToken", { idToken });
        console.log(response.data);  // Should contain user info or a success message
    } catch (error) {
        console.error("Error verifying token:", error);
    }
};