import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {useNavigate} from "react-router-dom";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <ProgressBar progress={(currentIndex + 1) / questions.length * 100} />

            {questions.length > 0 && (
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center p-5"
                >
                    <h2 className="text-2xl font-bold">{questions[currentIndex].question_text}</h2>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        {questions[currentIndex].options.map(option => (
                            <motion.div
                                key={option.id}
                                whileHover={{ scale: 1.05 }}
                                className={`p-4 rounded-lg cursor-pointer text-center transition-all ${
                                    selectedOption === option.id ? "bg-blue-500" : "bg-gray-700"
                                }`}
                                onClick={() => setSelectedOption(option.id)}
                            >
                                {option.option_text}
                            </motion.div>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className="mt-6 px-6 py-2 bg-blue-500 rounded-lg disabled:bg-gray-500"
                    >
                        Next
                    </button>
                </motion.div>
            )}
        </div>
    );
};

// Progress Bar Component
const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-700 h-2 rounded-md mt-4">
        <motion.div
            className="h-full bg-blue-500 rounded-md"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
        />
    </div>
);

export default Survey;