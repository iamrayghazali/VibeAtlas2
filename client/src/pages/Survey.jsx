import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Box, Container, LinearProgress, Typography, Card, CardContent, Radio, FormControlLabel } from "@mui/material";

const Survey = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:7050/api/survey/questions")
            .then(response => setQuestions(response.data.questions))
            .catch(error => console.error("Error fetching questions:", error));
    }, []);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
        } else {
            navigate("/recommendations/");
        }
    };

    return (
        <Container sx={{ width: "100%", margin: "0px", padding: "0px" }}>
            <LinearProgress variant="determinate" value={(currentIndex + 1) / questions.length * 100} sx={{ minWidth: "100%", height: "12px" }} />
            {questions.length > 0 && (
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center p-5"
                >
                    <Typography variant={"h5"} sx={{ margin: "2rem", fontWeight: "bold", fontSize: "1.5rem" }}>
                        {questions[currentIndex].question_text}
                    </Typography>

                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                        gap={2}
                        sx={{ marginBottom: "2rem" }}
                    >
                        {questions[currentIndex].options.map((option) => (
                            <Card
                                key={option.id}
                                sx={{
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    cursor: "pointer",
                                    position: "relative",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                                    },
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    backgroundColor: selectedOption === option.id ? "#e3f2fd" : "#fff",
                                    border: selectedOption === option.id ? "2px solid #2196f3" : "2px solid transparent",
                                }}
                                onClick={() => setSelectedOption(option.id)}
                            >
                                <FormControlLabel
                                    control={
                                        <Radio
                                            checked={selectedOption === option.id}
                                            onChange={() => setSelectedOption(option.id)}
                                            value={option.id}
                                            name="radio-buttons"
                                            sx={{
                                                position: "absolute",
                                                top: 10,
                                                right: 10,
                                                color: selectedOption === option.id ? "#2196f3" : "gray",
                                            }}
                                        />
                                    }
                                    label=""
                                    sx={{ position: "absolute", top: 10, right: 10 }}
                                />
                                <Typography variant="body1" sx={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
                                    {option.option_text}
                                </Typography>
                            </Card>
                        ))}
                    </Box>

                    <button
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className="mt-6 px-6 py-2 bg-blue-500 rounded-lg disabled:bg-gray-500 text-white font-bold"
                    >
                        Next
                    </button>
                </motion.div>
            )}
        </Container>
    );
};

export default Survey;