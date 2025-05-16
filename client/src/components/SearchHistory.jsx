import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {Box, Button, Divider, Paper, Stack, styled, Typography} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import AnimatedList from './AnimatedList'

const SearchHistory = () => {
    const [userId, setUserId] = useState(null);
    const [userHistory, setUserHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {user} = useAuth();

    const scrollRef = useRef(null);
    const animationRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const directionRef = useRef(1);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || scrollContainer.scrollWidth <= scrollContainer.clientWidth) return;

        const scroll = () => {
            if (!isHovered) {
                scrollContainer.scrollLeft += directionRef.current * 0.5;

                const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                const currentScroll = Math.round(scrollContainer.scrollLeft);

                if (currentScroll <= 0 || currentScroll >= Math.round(maxScrollLeft)) {
                    directionRef.current *= -1;
                }
            }
            animationRef.current = requestAnimationFrame(scroll);
        };

        animationRef.current = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationRef.current);
    }, [isHovered, userHistory]);

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
                    setUserHistory(formatUserHistory(response.data.searchHistory));
                } catch (error) {
                    console.error("Error fetching user history:", error);
                }
            };

            getUserHistory();
        }
    }, [userId]);

    const formatUserHistory = (userHistory) => {
        return userHistory.map(item => ({
            city: item.city,
            country: item.country
        }));
    };

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
        <Box ref={scrollRef}
                onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
             sx={{
                 overflowX: "auto",
                 whiteSpace: "nowrap",
                 scrollbarWidth: "none",
                 '&::-webkit-scrollbar': { display: 'none' },
                 maxWidth: '100%',
                 width: '100%',
             }}
            >
            {userHistory ? (
                <>
                    <Stack  direction="row" sx={{ overflowX: "visible"}} spacing={{xs: 1, sm: 2, md: 4}} divider={<Divider variant={"middle"} orientation="vertical" sx={{backgroundColor: "white"}} flexItem/>}>
                    {userHistory.map((history, index) => (
                        <Box key={index} sx={{cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",  minWidth: 'max-content'}} onClick={() => {
                            navigate("/recommendations", {state: {country: history.country, city: history.city}})
                        }}>
                            <Typography variant="h6" sx={{fontWeight: "200", color: "white"}}
                                        >{history.city}</Typography>
                            <Typography variant="body1" sx={{fontWeight: "600", color: "grey"}}
                                        component="p">{history.country}</Typography>
                        </Box>
                    ))}
                    </Stack>
                </>
            ) : null
            }

        </Box>
    );
};

export default SearchHistory;