import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {Box, Button, Typography} from "@mui/material";
import axios from "axios";
import {map} from "framer-motion/m";
import {useNavigate} from "react-router-dom";

const SearchHistory = () => {
    const [userId, setUserId] = useState(null);
    const [userHistory, setUserHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
            if (user && user.uid) {
                fetchUserId();
            }
    }, [user]);

    useEffect(() => {
        if (userId) {
            const getUserHistory = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:7050/api/history/${userId}/searches`);
                    console.log(response.data.searchHistory);
                    setUserHistory(response.data.searchHistory);
                } catch (error) {
                    console.error("Error fetching user history:", error);
                }
            };

            getUserHistory();
        }
    }, [userId]);

    const fetchUserId = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:7050/api/user/user-id/${user.uid}`);
            setUserId(response.data.id);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user id:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box>
            <Typography variant="h6"  sx={{fontWeight: "600", fontColor: "black"}}  component="p">History</Typography>

            { userHistory ? (<>
                {userHistory.map((history, index) => (
                            <Box key={index} sx={{cursor: "pointer"}} onClick={() => {
                                navigate("/recommendations", { state: { country: history.country, city: history.city } })
                            }}>
                                <Typography variant="body2"  sx={{fontWeight: "600", fontColor: "black"}}  component="p">{history.country}</Typography>
                                <Typography variant="body1" sx={{fontWeight: "100", fontColor: "grey"}} component="p">{history.city}</Typography>
                            </Box>
                    ))}
            </>) : null
            }
        </Box>
    );
};

export default SearchHistory;