import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const Survey = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(new Set()); // Track multiple selections

    useEffect(() => {
        axios.get("http://localhost:7050/api/survey/questions")
            .then(response => setQuestions(response.data.questions))
            .catch(error => console.error("Error fetching questions:", error));
    }, []);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigate("/recommendations/");
        }
    };

    const handleOptionChange = (optionId) => {
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

    return (
        <Container sx={{ width: "100%", padding: "0px", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card
                sx={{
                    width: "70%",
                    padding: "2rem",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
                    sx={{ minWidth: "100%", height: "12px", marginBottom: "1rem", borderRadius: "12px" }}
                />

                {questions.length > 0 && (
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "1rem", fontSize: "1.25rem" }}>
                            {questions[currentIndex].question_text}
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {questions[currentIndex].options.map((option) => (
                                <Box
                                    key={option.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0.5rem",
                                        backgroundColor: selectedOptions.has(option.id) ? "#2196f3" : "#333",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "#1976d2",
                                        },
                                    }}
                                    onClick={() => handleOptionChange(option.id)}
                                >
                                    <Checkbox
                                        checked={selectedOptions.has(option.id)}
                                        onChange={() => handleOptionChange(option.id)}
                                        value={option.id}
                                        sx={{
                                            color: selectedOptions.has(option.id) ? "#fff" : "#aaa",
                                        }}
                                    />
                                    <Typography sx={{ color: "#fff", fontWeight: "500", fontSize: "1rem" }}>
                                        {option.option_text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={selectedOptions.size === 0} // Disable the button if no option is selected
                                sx={{
                                    padding: "10px 20px",
                                    backgroundColor: "#2196f3",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#1976d2",
                                    },
                                    borderRadius: "10px",
                                    fontWeight: "bold",
                                    minWidth: "150px",
                                    height: "50px",
                                }}
                            >
                                {currentIndex === questions.length - 1 ? "Get Recommendations" : "Next"}
                            </Button>
                        </Box>
                    </motion.div>
                )}
            </Card>
        </Container>
    );
};

export default Survey;