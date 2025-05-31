import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

function structureUserPreferences() {
    //TODO
}

async function getTravelRecommendations(userPreferences, city, country) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Validate and process user responses
        if (!userPreferences || userPreferences.length === 0) {
            console.warn("No user preferences provided");
            return { recommendations: [] };
        } else {
            structureUserPreferences()
        }

        // Transform user responses into a more structured format
        const processedPreferences = {
            activities: [],
            travelStyle: '',
            environment: ''
        };

        // Map survey responses to preference categories
        const activityMap = {
            1: 'Sightseeing',
            2: 'Outdoor Adventures',
            3: 'Beach and Water Sports',
            4: 'Historical and Cultural Tours',
            5: 'Food and Drink Experiences',
            6: 'Shopping'
        };

        const travelStyleMap = {
            7: 'Relaxing',
            8: 'Adventurous',
            9: 'Balanced',
            10: 'Luxury',
            11: 'Budget-Friendly'
        };

        const environmentMap = {
            12: 'Urban',
            13: 'Nature',
            14: 'Coastal',
            15: 'Countryside'
        };

        userPreferences.forEach(response => {
            switch(response.question_id) {
                case 1: // Activities
                    if (activityMap[response.option_id]) {
                        processedPreferences.activities.push(activityMap[response.option_id]);
                    }
                    break;
                case 2: // Travel Style
                    processedPreferences.travelStyle = travelStyleMap[response.option_id] || '';
                    break;
                case 3: // Environment
                    processedPreferences.environment = environmentMap[response.option_id] || '';
                    break;
            }
        });

        const prompt = `
            You are a travel recommendation assistant. 
            Provide EXACTLY 10 recommendations for a traveler visiting ${city}, COUNTRY CCA3: ${country}.
            If that number is too much respond with less, but make sure they are real places!
            
            OUTPUT REQUIREMENTS:
            - Respond ONLY in VALID JSON format
            - Strictly follow this EXACT JSON structure:
            {
                "recommendations": [
                    {
                        "id": "unique_string_id",
                        "name": "Exact Location Name",
                        "location": "Precise City and Country",
                        "description": "Short, engaging description (max 3 sentences)",
                        "category": "Should be one of the following: sightseeing, adventures, beach, historical, food, shopping",
                        "price": "use $ signs as to tell the price of the place, $ is cheap $$$$ is expensive", 
                        "coordinates": {
                            "latitude": valid coordinates.latitude,
                            "longitude": valid coordinates.longitude, 
                        },
                    }
                ]
            }

            User Preferences: ${JSON.stringify(userPreferences)}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Try multiple parsing strategies
        try {
            return JSON.parse(responseText);
        } catch (firstParseError) {
            try {
                const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1]);
                }
            } catch (secondParseError) {}

            try {
                const jsonExtractMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonExtractMatch) {
                    return JSON.parse(jsonExtractMatch[0]);
                }
            } catch (thirdParseError) {}

            // If all parsing fails, log the full response and return empty recommendations
            console.error("Failed to parse AI response:", responseText);
            return { recommendations: [] };
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        return { recommendations: [] };
    }
}

export { getTravelRecommendations };