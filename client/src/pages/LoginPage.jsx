import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            // Sign in the user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken(); // Get the Firebase ID token

            // Send the token to the backend for verification
            const response = await axios.post('http://localhost:5000/api/auth/verifyToken', { idToken: token });

            if (response.data.success) {
                console.log('Authenticated successfully:', response.data);
                navigate('/home'); // Redirect to the homepage or dashboard
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };

    const handleGoogleLogin = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken(); // Get the Firebase ID token

            // Send the token to the backend for verification
            const response = await axios.post('http://localhost:5000/api/auth/verifyToken', { idToken: token });

            if (response.data.success) {
                console.log('Google login successful:', response.data);
                navigate('/home'); // Redirect to the homepage or dashboard
            }
        } catch (error) {
            console.error('Error during Google login:', error.message);
            setErrorMessage('Google login failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>

            <button onClick={handleGoogleLogin}>Login with Google</button>

            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>} {/* Display error message */}
        </div>
    );
};

export default LoginPage;