const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

// Function to fetch recommendations
async function getTravelRecommendations(userPreferences) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Example prompt
        const prompt = `
            Based on the user's preferences, suggest places they might enjoy.
            Respond **ONLY in JSON** format with an array of recommendations.
            
            **User Preferences:**
            ${JSON.stringify(userPreferences)}

            **Response Format:** 
            {
                "recommendations": [
                    {
                        "name": "Eiffel Tower",
                        "location": "Paris, France",
                        "description": "Iconic landmark with a great view.",
                        "category": "Sightseeing"
                    },
                    {
                        "name": "Shibuya Crossing",
                        "location": "Tokyo, Japan",
                        "description": "Famous pedestrian crossing in Tokyo.",
                        "category": "Urban Exploration"
                    }
                ]
            }
        `;

        // Get AI response
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse AI response as JSON
        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Error:", error);
        return { recommendations: [] };
    }
}

module.exports = { getTravelRecommendations };