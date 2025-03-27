import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Survey = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);  // Assume you're fetching user data from context or props

    useEffect(() => {
        // Fetch the survey questions and options from the backend
        const fetchSurveyData = async () => {
            try {
                const response = await axios.get('/api/survey/questions');
                setQuestions(response.data);  // Assume response is an array of questions with options
                setLoading(false);
            } catch (error) {
                console.error('Error fetching survey data:', error);
                setLoading(false);
            }
        };

        fetchSurveyData();
    }, []);

    const handleAnswerSelection = (questionId, selectedOptionIds) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.filter((answer) => answer.question_id !== questionId);
            updatedAnswers.push({ question_id: questionId, option_ids: selectedOptionIds });
            return updatedAnswers;
        });
    };

    const handleCheckboxChange = (questionId, optionId) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.map((answer) => {
                if (answer.question_id === questionId) {
                    // Add or remove the option_id from the selected options
                    const selectedOptionIds = answer.option_ids.includes(optionId)
                        ? answer.option_ids.filter(id => id !== optionId)
                        : [...answer.option_ids, optionId];
                    return { ...answer, option_ids: selectedOptionIds };
                }
                return answer;
            });
            return updatedAnswers;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to submit the survey!');
            return;
        }

        const userData = {
            userId: user.id,  // Ensure you have the user's ID (e.g., from Firebase or session)
            responses: answers,
        };

        try {
            await axios.post('http://localhost:5000/api/survey/responses', userData);  // POST to backend API
            alert('Survey Submitted!');
        } catch (err) {
            console.error(err);
            alert('Error submitting survey');
        }
    };

    if (loading) {
        return <div>Loading survey...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            {questions.map((question) => (
                <div key={question.id}>
                    <h3>{question.question_text}</h3>
                    <div>
                        {question.options.map((option) => (
                            <label key={option.id}>
                                <input
                                    type="checkbox"
                                    checked={answers.find(answer => answer.question_id === question.id)?.option_ids.includes(option.id)}
                                    onChange={() => handleCheckboxChange(question.id, option.id)}
                                />
                                {option.option_text}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Survey;