import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { app } from "../firebaseConfig.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const register = (email, password) => { return createUserWithEmailAndPassword(auth, email, password);};
    const login = (email, password) => { return signInWithEmailAndPassword(auth, email, password);};
    const googleLogin = () => { return signInWithRedirect(auth, provider);};
    const logout = () => { return signOut(auth); };

    const value = {
        user,
        register,
        login,
        googleLogin,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};