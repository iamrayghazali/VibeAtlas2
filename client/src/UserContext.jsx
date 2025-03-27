import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig.js"; // Import Firebase auth

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser); // Listen to user state changes
        return unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};