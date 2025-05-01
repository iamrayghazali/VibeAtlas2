import {useState, useEffect} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Container,
    LinearProgress,
    Typography,
    Card,
    Checkbox,
    FormControlLabel,
    Button
} from "@mui/material";
import {useAuth} from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const Survey = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userId, setUserId] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState(new Set()); // Track multiple selections
    const {user} = useAuth();

    // Get questions and responses
    useEffect(() => {
        axios.get("http://localhost:7050/api/survey/questions")
            .then(response => setQuestions(response.data.questions))
            .catch(error => console.error("Error fetching questions:", error));
    }, []);

    useEffect(() => {
        if (user && user.uid) {
            fetchUserId();
        }
    }, [user]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleOptionChange = (optionId) => {
        setAnswers((prevAnswers) => {
            const questionId = questions[currentIndex]?.id;
            if (!questionId) return prevAnswers;

            // Filter out only the selected question's previous answers
            const newAnswers = prevAnswers.filter(a => !(a.question_id === questionId && a.option_id === optionId));

            if (prevAnswers.some(a => a.question_id === questionId && a.option_id === optionId)) {
                // If the option was already selected, remove it (deselect)
                return newAnswers;
            } else {
                // Otherwise, add the new option
                return [...newAnswers, {question_id: questionId, option_id: optionId}];
            }
        });

        setSelectedOptions((prevSelectedOptions) => {
            const newSelectedOptions = new Set(prevSelectedOptions);
            if (newSelectedOptions.has(optionId)) {
                newSelectedOptions.delete(optionId); // Deselect if already selected
            } else {
                newSelectedOptions.add(optionId); // Select if not selected
            }
            return newSelectedOptions;
        });
    };
    const handleSubmit = () => {
        console.log("Submitting answers:", answers);
        axios.post(`http://localhost:7050/api/survey/${userId}`, {answers})
            .then(response => console.log("Survey answers saved:", response.data))
            .then(() => navigate("/location"))
            .catch(error => console.error("Error saving survey answers:", error));
    };

    const fetchUserId = async () => {
        console.log("fetching user: ", user.uid);
        try {
            const response = await axios.get(`http://127.0.0.1:7050/api/user/user-id/${user.uid}`);
            setUserId(response.data.id);
        } catch (error) {
            console.error('Error fetching user id:', error);
        }
    };

    //TODO: route user if survey has been filled out
    //TODO: update layout and css

    return (
        <>
            <Navbar></Navbar>
            <Container sx={{
                minWidth: "100%",
                margin: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "black",
                fontFamily: "Lato"
            }}>
                <Card
                    sx={{
                        maxWidth: "90%",
                        padding: "2rem",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "#F0EAD6",
                        borderRadius: "12px",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                    }}
                >
                    <LinearProgress
                        variant="determinate"
                        value={(currentIndex) / questions.length * 100}
                        sx={{
                            minWidth: "100%",
                            height: "8px",
                            marginBottom: "2rem",
                            borderRadius: "12px",
                            backgroundColor: "#ccc", // background of the track
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#F18F01', // color of the filled bar
                            },
                        }}
                    />

                    {questions.length > 0 && (
                        <motion.div
                            key={currentIndex}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                        >
                            <Typography variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            marginBottom: "4rem",
                                            fontSize: "1.25rem",
                                            textAlign: "center",
                                            fontFamily: "Lato",
                                            color: "black"
                                        }}>
                                {questions[currentIndex].question_text}
                            </Typography>

                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                {questions[currentIndex].options.map((option) => (
                                    <Box
                                        key={option.id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "0.5rem",
                                            backgroundColor: selectedOptions.has(option.id) ? "#b06a02" : "#333",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s ease",
                                            "&:hover": {
                                                backgroundColor: "#b06a02",
                                            },
                                        }}
                                        onClick={() => handleOptionChange(option.id)}
                                    >
                                        <Checkbox
                                            checked={selectedOptions.has(option.id)}
                                            onChange={() => handleOptionChange(option.id)}
                                            value={option.id}
                                            icon={<Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    border: '2px solid #b06a02',
                                                    borderRadius: '4px',
                                                }}
                                            />}
                                            checkedIcon={<Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: '#b06a02',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontSize: 16,
                                                }}
                                            >
                                                ✓
                                            </Box>}
                                        />
                                        <Typography sx={{
                                            color: "#fff",
                                            fontWeight: "500",
                                            fontSize: "1rem",
                                            fontFamily: "Lato"
                                        }}>
                                            {option.option_text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "2rem"
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={currentIndex === questions.length - 1 ? handleSubmit : handleNext}
                                    disabled={!questions[currentIndex]?.options.some(option => selectedOptions.has(option.id))
                                    } // Disable the button if no option is selected
                                    sx={{
                                        padding: "10px 20px",
                                        backgroundColor: "#F18F01",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "#b06a02",
                                        },
                                        borderRadius: "10px",
                                        fontWeight: "bold",
                                        minWidth: "150px",
                                        height: "50px",
                                    }}
                                >
                                    {currentIndex === questions.length - 1 ? "Select travel destination" : "Next"}
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </Card>
            </Container>
        </>
    );
};

export default Survey;